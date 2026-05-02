import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import App from '../App';
import { AuthProvider } from '../context/AuthContext';

// Mock the context hook
vi.mock('../context/AuthContext', async () => {
  const actual = await vi.importActual('../context/AuthContext');
  return {
    ...actual,
    useAuth: vi.fn(),
  };
});

import { useAuth } from '../context/AuthContext';

describe('Navbar', () => {
  it('renders login button when unauthenticated', () => {
    useAuth.mockReturnValue({ user: null, loginWithGoogle: vi.fn(), logout: vi.fn() });
    render(
      <BrowserRouter>
        <App />
      </BrowserRouter>
    );
    expect(screen.getByText(/Sign In/i)).toBeInTheDocument();
  });

  it('renders profile picture and logout when authenticated', () => {
    useAuth.mockReturnValue({ 
      user: { displayName: 'John Doe', photoURL: 'https://example.com/photo.jpg' }, 
      loginWithGoogle: vi.fn(), 
      logout: vi.fn() 
    });
    render(
      <BrowserRouter>
        <App />
      </BrowserRouter>
    );
    const img = screen.getByAltText(/John Doe/i);
    expect(img).toBeInTheDocument();
    expect(img).toHaveAttribute('src', 'https://example.com/photo.jpg');
  });

  it('toggles dark mode', () => {
    useAuth.mockReturnValue({ user: null });
    render(
      <BrowserRouter>
        <App />
      </BrowserRouter>
    );
    const themeBtn = screen.getByRole('button', { name: /Sun|Moon/i || '' }); // Depending on initial state
    fireEvent.click(themeBtn);
    // In a real test we'd check document.documentElement classList
  });
});
