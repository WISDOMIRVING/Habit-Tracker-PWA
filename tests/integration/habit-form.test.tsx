import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import DashboardPage from '../../src/app/dashboard/page';
import { useRouter } from 'next/navigation';
import React from 'react';

vi.mock('next/navigation', () => ({
  useRouter: vi.fn(),
}));

describe('habit form', () => {
  const mockPush = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    (useRouter as any).mockReturnValue({ push: mockPush });
    window.localStorage.clear();
    window.localStorage.setItem('habit-tracker-session', JSON.stringify({ userId: 'u1', email: 'test@example.com' }));
  });

  it('shows a validation error when habit name is empty', async () => {
    render(<DashboardPage />);
    
    fireEvent.click(screen.getByTestId('create-habit-button'));
    fireEvent.click(screen.getByTestId('habit-save-button'));

    expect(await screen.findByText('Habit name is required')).toBeDefined();
  });

  it('creates a new habit and renders it in the list', async () => {
    render(<DashboardPage />);
    
    fireEvent.click(screen.getByTestId('create-habit-button'));
    fireEvent.change(screen.getByTestId('habit-name-input'), { target: { value: 'New Habit' } });
    fireEvent.click(screen.getByTestId('habit-save-button'));

    expect(await screen.findByTestId('habit-card-new-habit')).toBeDefined();
  });

  it('edits an existing habit and preserves immutable fields', async () => {
    const originalHabit = {
      id: 'h1', userId: 'u1', name: 'Old Name', description: '', frequency: 'daily', createdAt: '2024-01-01', completions: []
    };
    window.localStorage.setItem('habit-tracker-habits', JSON.stringify([originalHabit]));

    render(<DashboardPage />);
    
    fireEvent.click(screen.getByTestId('habit-edit-old-name'));
    fireEvent.change(screen.getByTestId('habit-name-input'), { target: { value: 'Updated Name' } });
    fireEvent.click(screen.getByTestId('habit-save-button'));

    expect(await screen.findByTestId('habit-card-updated-name')).toBeDefined();
    
    const habits = JSON.parse(window.localStorage.getItem('habit-tracker-habits') || '[]');
    expect(habits[0].id).toBe('h1');
    expect(habits[0].createdAt).toBe('2024-01-01');
  });

  it('deletes a habit only after explicit confirmation', async () => {
    window.localStorage.setItem('habit-tracker-habits', JSON.stringify([{
      id: 'h1', userId: 'u1', name: 'To Delete', description: '', frequency: 'daily', createdAt: '', completions: []
    }]));

    render(<DashboardPage />);
    
    fireEvent.click(screen.getByTestId('habit-delete-to-delete'));
    
    // Check if modal is visible
    expect(screen.getByText('Delete Habit?')).toBeDefined();
    
    fireEvent.click(screen.getByTestId('confirm-delete-button'));

    await waitFor(() => {
      expect(screen.queryByTestId('habit-card-to-delete')).toBeNull();
    });
  });

  it('toggles completion and updates the streak display', async () => {
    window.localStorage.setItem('habit-tracker-habits', JSON.stringify([{
      id: 'h1', userId: 'u1', name: 'Streak Habit', description: '', frequency: 'daily', createdAt: '', completions: []
    }]));

    render(<DashboardPage />);
    
    const streakElement = screen.getByTestId('habit-streak-streak-habit');
    expect(streakElement.textContent).toContain('0');

    fireEvent.click(screen.getByTestId('habit-complete-streak-habit'));

    await waitFor(() => {
      expect(streakElement.textContent).toContain('1');
    });
  });
});
