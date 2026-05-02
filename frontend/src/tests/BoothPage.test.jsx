import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import BoothPage from '../pages/BoothPage';

// Mock Leaflet as it doesn't play well with JSDOM easily without setup
vi.mock('react-leaflet', () => ({
  MapContainer: ({ children }) => <div data-testid="map">{children}</div>,
  TileLayer: () => null,
  Marker: ({ children }) => <div data-testid="marker">{children}</div>,
  Popup: ({ children }) => <div>{children}</div>,
  useMap: () => ({ setView: vi.fn() }),
}));

describe('BoothPage', () => {
  it('renders search input and map', () => {
    render(<BoothPage />);
    expect(screen.getByPlaceholderText(/Search by area/i)).toBeInTheDocument();
    expect(screen.getByTestId('map')).toBeInTheDocument();
  });

  it('shows loading state during search', async () => {
    render(<BoothPage />);
    const input = screen.getByPlaceholderText(/Search by area/i);
    fireEvent.change(input, { target: { value: 'Vasant' } });
    fireEvent.submit(input);
    
    expect(screen.getByText(/Updating Map Data/i)).toBeInTheDocument();
    
    await waitFor(() => {
      expect(screen.queryByText(/Updating Map Data/i)).not.toBeInTheDocument();
    }, { timeout: 2000 });
  });

  it('renders booth list items', () => {
    render(<BoothPage />);
    expect(screen.getByText(/Public School Sector 4/i)).toBeInTheDocument();
    expect(screen.getByText(/0.8 km/i)).toBeInTheDocument();
  });

  it('has Google branding for score', () => {
    render(<BoothPage />);
    expect(screen.getByText(/Cloud Map Services/i)).toBeInTheDocument();
    expect(screen.getByText(/G/i)).toBeInTheDocument();
  });
});
