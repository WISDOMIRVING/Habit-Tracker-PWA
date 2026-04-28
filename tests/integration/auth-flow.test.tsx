import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import SignupPage from '../../src/app/signup/page';
import LoginPage from '../../src/app/login/page';
import { useRouter } from 'next/navigation';
import React from 'react';

vi.mock('next/navigation', () => ({
  useRouter: vi.fn(),
}));

describe('auth flow', () => {
  const mockPush = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    (useRouter as any).mockReturnValue({ push: mockPush });
    window.localStorage.clear();
  });

  it('submits the signup form and creates a session', async () => {
    render(<SignupPage />);
    
    fireEvent.change(screen.getByTestId('auth-signup-email'), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByTestId('auth-signup-password'), { target: { value: 'password123' } });
    fireEvent.click(screen.getByTestId('auth-signup-submit'));

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith('/dashboard');
      const session = JSON.parse(window.localStorage.getItem('habit-tracker-session') || 'null');
      expect(session.email).toBe('test@example.com');
    });
  });

  it('shows an error for duplicate signup email', async () => {
    window.localStorage.setItem('habit-tracker-users', JSON.stringify([{
      id: '1', email: 'test@example.com', password: '123', createdAt: new Date().toISOString()
    }]));

    render(<SignupPage />);
    
    fireEvent.change(screen.getByTestId('auth-signup-email'), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByTestId('auth-signup-password'), { target: { value: 'password123' } });
    fireEvent.click(screen.getByTestId('auth-signup-submit'));

    expect(await screen.findByText('User already exists')).toBeDefined();
  });

  it('submits the login form and stores the active session', async () => {
    window.localStorage.setItem('habit-tracker-users', JSON.stringify([{
      id: '1', email: 'test@example.com', password: 'password123', createdAt: new Date().toISOString()
    }]));

    render(<LoginPage />);
    
    fireEvent.change(screen.getByTestId('auth-login-email'), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByTestId('auth-login-password'), { target: { value: 'password123' } });
    fireEvent.click(screen.getByTestId('auth-login-submit'));

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith('/dashboard');
      const session = JSON.parse(window.localStorage.getItem('habit-tracker-session') || 'null');
      expect(session.userId).toBe('1');
    });
  });

  it('shows an error for invalid login credentials', async () => {
    render(<LoginPage />);
    
    fireEvent.change(screen.getByTestId('auth-login-email'), { target: { value: 'wrong@example.com' } });
    fireEvent.change(screen.getByTestId('auth-login-password'), { target: { value: 'wrong' } });
    fireEvent.click(screen.getByTestId('auth-login-submit'));

    expect(await screen.findByText('Invalid email or password')).toBeDefined();
  });
});
