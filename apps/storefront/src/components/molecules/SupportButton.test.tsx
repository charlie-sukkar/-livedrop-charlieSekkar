import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { SupportButton } from './SupportButton';

// Create the mock function first
const mockOpenSupport = vi.fn();

// Mock the store - return the function directly
vi.mock('../../lib/store', () => ({
  useSupportStore: () => mockOpenSupport, // Return function directly, not object
}));

// Mock Button component - ensure onClick is called properly
vi.mock('../atoms/Button', () => ({
  Button: ({ children, onClick, disabled, className, 'aria-label': ariaLabel }: any) => (
    <button 
      onClick={() => onClick?.()} // Ensure onClick is called as function
      disabled={disabled}
      className={className}
      aria-label={ariaLabel}
    >
      {children}
    </button>
  ),
}));

// Mock Icon component  
vi.mock('../atoms/Icon', () => ({
  Icon: ({ className, d }: any) => (
    <svg className={className} data-testid="support-icon" data-d={d} />
  ),
}));

describe('SupportButton', () => {
  beforeEach(() => {
    mockOpenSupport.mockClear();
  });

  // Props Testing
  it('renders with default props', () => {
    render(<SupportButton />);
    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  it('applies custom className', () => {
    render(<SupportButton className="custom-class" />);
    const button = screen.getByRole('button');
    expect(button).toHaveClass('custom-class');
    expect(button).toHaveClass('relative');
  });

  it('respects disabled prop', () => {
    render(<SupportButton disabled={true} />);
    expect(screen.getByRole('button')).toBeDisabled();
  });

  // User Events Testing
  it('calls openSupport when clicked', async () => {
    const user = userEvent.setup();
    render(<SupportButton />);

    await user.click(screen.getByRole('button'));
    expect(mockOpenSupport).toHaveBeenCalledOnce();
  });

  it('does not call openSupport when disabled', async () => {
    const user = userEvent.setup();
    render(<SupportButton disabled={true} />);

    await user.click(screen.getByRole('button'));
    expect(mockOpenSupport).not.toHaveBeenCalled();
  });

  // Accessibility Testing
  it('has proper ARIA label', () => {
    render(<SupportButton />);
    expect(screen.getByLabelText('Open support assistant')).toBeInTheDocument();
  });

  // Component Integration
  it('renders icon with correct props', () => {
    render(<SupportButton />);
    const icon = screen.getByTestId('support-icon');
    expect(icon).toHaveClass('h-6 w-6');
    expect(icon).toHaveAttribute('data-d');
  });
});