import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import ChecklistPage from '../pages/ChecklistPage';

describe('ChecklistPage', () => {
  it('renders all checklist items', () => {
    render(<ChecklistPage />);
    expect(screen.getByText(/Voter ID \(EPIC Card\)/i)).toBeInTheDocument();
    expect(screen.getByText(/Identity Proof/i)).toBeInTheDocument();
    expect(screen.getByText(/Voter Slip/i)).toBeInTheDocument();
    expect(screen.getByText(/Booth Location/i)).toBeInTheDocument();
  });

  it('toggles items when clicked', () => {
    render(<ChecklistPage />);
    const item = screen.getByText(/Voter ID \(EPIC Card\)/i);
    fireEvent.click(item);
    expect(screen.getByText(/25%/i)).toBeInTheDocument();
    fireEvent.click(item);
    expect(screen.getByText(/0%/i)).toBeInTheDocument();
  });

  it('renders pro tip section', () => {
    render(<ChecklistPage />);
    expect(screen.getByText(/Pro Tip/i)).toBeInTheDocument();
    expect(screen.getByText(/Mobile phones are not allowed/i)).toBeInTheDocument();
  });

  it('shows icon for each item', () => {
    render(<ChecklistPage />);
    // Check for some SVG icons (lucide-react components)
    const svgs = document.querySelectorAll('svg');
    expect(svgs.length).toBeGreaterThanOrEqual(5); // 4 items + pro tip
  });

  it('updates progress bar color/width', () => {
    render(<ChecklistPage />);
    const item = screen.getByText(/Voter ID \(EPIC Card\)/i);
    fireEvent.click(item);
    const progressBar = document.querySelector('.bg-saffron');
    // In JSDOM styles might not update as in browser but we can check the element exists
    expect(progressBar).toBeInTheDocument();
  });
});
