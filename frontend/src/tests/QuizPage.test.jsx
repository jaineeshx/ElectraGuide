import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import QuizPage from '../pages/QuizPage';

describe('QuizPage', () => {
  it('renders start screen initially', () => {
    render(<QuizPage />);
    expect(screen.getByText(/Election Genius Quiz/i)).toBeInTheDocument();
    expect(screen.getByText(/Start Quiz/i)).toBeInTheDocument();
  });

  it('starts quiz when button is clicked', () => {
    render(<QuizPage />);
    fireEvent.click(screen.getByText(/Start Quiz/i));
    expect(screen.getByText(/Question 1 of/i)).toBeInTheDocument();
  });

  it('allows selecting an option and shows explanation', () => {
    render(<QuizPage />);
    fireEvent.click(screen.getByText(/Start Quiz/i));
    
    const options = screen.getAllByRole('button');
    fireEvent.click(options[0]); // Select first option
    
    expect(screen.getByText(/Did you know\?/i)).toBeInTheDocument();
    expect(screen.getByText(/Next Question/i)).toBeInTheDocument();
  });
});
