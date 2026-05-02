import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import JourneyPage from '../pages/JourneyPage';
import api from '../services/api';

vi.mock('../services/api');

describe('JourneyPage', () => {
  it('renders the journey title and progress', () => {
    render(<JourneyPage />);
    expect(screen.getByText(/Your Election Journey/i)).toBeInTheDocument();
    expect(screen.getByText(/Readiness Score/i)).toBeInTheDocument();
  });

  it('toggles step completion when clicked', () => {
    render(<JourneyPage />);
    const step = screen.getByText(/Register to Vote/i);
    fireEvent.click(step);
    
    // Score should update from 0% to 25%
    expect(screen.getByText(/25%/i)).toBeInTheDocument();
  });

  it('handles calendar sync simulation', async () => {
    api.post.mockResolvedValue({ data: { success: true } });
    render(<JourneyPage />);
    
    const syncButtons = screen.getAllByText(/SYNC GOOGLE CALENDAR/i);
    fireEvent.click(syncButtons[0]);
    
    expect(screen.getByText(/SYNCING/i || /SYNC GOOGLE CALENDAR/i)).toBeInTheDocument();
    
    await waitFor(() => {
      expect(screen.getByText(/CALENDAR SYNCED/i)).toBeInTheDocument();
    });
  });

  it('displays the correct number of steps', () => {
    render(<JourneyPage />);
    const stepItems = screen.getAllByRole('button', { name: /Mark/i || /SYNC/i });
    // We have 4 steps, each with a toggle button and potentially a sync button
    expect(stepItems.length).toBeGreaterThanOrEqual(4);
  });
});
