import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { LoginPage } from './UserLogin';
import { loginCustomer } from '../lib/api';
import { useUser } from '../contexts/UserContext';
import type { Customer } from '../lib/api';

// Mock dependencies
vi.mock('../lib/api');
vi.mock('../contexts/UserContext');

const mockLogin = vi.fn();
const mockedLoginCustomer = vi.mocked(loginCustomer);

describe('LoginPage', () => {
  const mockCustomer: Customer = {
    _id: '1',
    name: 'Test User',
    email: 'test@example.com',
    createdAt: '2023-01-01T00:00:00.000Z'
  };

  beforeEach(() => {
    // Mock the user context
    (useUser as any).mockReturnValue({
      customer: null,
      login: mockLogin,
      logout: vi.fn(),
      isLoading: false
    });
    vi.clearAllMocks();
  });

  it('renders login form with essential elements', () => {
    render(<LoginPage />);
    
    expect(screen.getByText('🛍️ FreshFit')).toBeInTheDocument();
    expect(screen.getByText('Welcome Back')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('you@example.com')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /try demo account/i })).toBeInTheDocument();
  });

  it('handles successful email login', async () => {
    mockedLoginCustomer.mockResolvedValue(mockCustomer);

    render(<LoginPage />);
    
    const emailInput = screen.getByPlaceholderText('you@example.com');
    fireEvent.change(emailInput, {
      target: { value: 'test@example.com' }
    });
    fireEvent.click(screen.getByRole('button', { name: /sign in/i }));

    await waitFor(() => {
      expect(mockedLoginCustomer).toHaveBeenCalledWith('test@example.com');
      expect(mockLogin).toHaveBeenCalledWith(mockCustomer);
    });
  });

  it('handles successful demo login', async () => {
    mockedLoginCustomer.mockResolvedValue(mockCustomer);

    render(<LoginPage />);
    
    fireEvent.click(screen.getByRole('button', { name: /try demo account/i }));

    await waitFor(() => {
      expect(mockedLoginCustomer).toHaveBeenCalledWith('demo@example.com');
      expect(mockLogin).toHaveBeenCalledWith(mockCustomer);
    });
  });

  it('handles login errors', async () => {
    const errorMessage = 'Login failed. Please check your email address.';
    mockedLoginCustomer.mockRejectedValue(new Error(errorMessage));

    render(<LoginPage />);
    
    const emailInput = screen.getByPlaceholderText('you@example.com');
    fireEvent.change(emailInput, {
      target: { value: 'test@example.com' }
    });
    fireEvent.click(screen.getByRole('button', { name: /sign in/i }));

    await waitFor(() => {
      expect(screen.getByText(errorMessage)).toBeInTheDocument();
    });
  });

  it('validates required email field', () => {
    render(<LoginPage />);
    
    const submitButton = screen.getByRole('button', { name: /sign in/i });
    expect(submitButton).toBeDisabled();

    const emailInput = screen.getByPlaceholderText('you@example.com');
    fireEvent.change(emailInput, {
      target: { value: 'test@example.com' }
    });
    
    expect(submitButton).not.toBeDisabled();
  });

  it('shows loading states during login attempts', async () => {
    mockedLoginCustomer.mockResolvedValue(mockCustomer);

    render(<LoginPage />);
    
    const emailInput = screen.getByPlaceholderText('you@example.com');
    fireEvent.change(emailInput, {
      target: { value: 'test@example.com' }
    });
    fireEvent.click(screen.getByRole('button', { name: /sign in/i }));

    expect(screen.getByText('Signing In...')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /signing in/i })).toBeDisabled();

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument();
    });
  });
});