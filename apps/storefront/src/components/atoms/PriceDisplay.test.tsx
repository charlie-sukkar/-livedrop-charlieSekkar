import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { PriceDisplay } from './PriceDisplay';

// Mock the formatCurrency function
vi.mock('../../lib/format', () => ({
  formatCurrency: vi.fn((amount) => `$${amount.toFixed(2)}`)
}));

describe('PriceDisplay', () => {
  it('displays formatted price', () => {
    render(<PriceDisplay amount={29.99} />);
    expect(screen.getByText('$29.99')).toBeInTheDocument();
  });

  it('shows label when provided', () => {
    render(<PriceDisplay amount={50} label="Total:" />);
    expect(screen.getByText('Total:')).toBeInTheDocument();
    expect(screen.getByText('$50.00')).toBeInTheDocument();
  });

  it('hides label when not provided', () => {
    render(<PriceDisplay amount={25} />);
    expect(screen.queryByText('Total:')).not.toBeInTheDocument();
  });

  it('applies custom className', () => {
    render(<PriceDisplay amount={100} className="mt-4" />);
    const container = screen.getByText('$100.00').closest('div');
    expect(container).toHaveClass('mt-4');
  });

  it('has proper accessibility attributes', () => {
    render(<PriceDisplay amount={75.5} />);
    const price = screen.getByText('$75.50');
    expect(price).toHaveAttribute('aria-live', 'polite');
    expect(price).toHaveAttribute('aria-atomic', 'true');
  });

  it('handles different amounts correctly', () => {
    const amounts = [0, 10, 99.99, 1000];
    
    amounts.forEach(amount => {
      render(<PriceDisplay amount={amount} />);
      expect(screen.getByText(`$${amount.toFixed(2)}`)).toBeInTheDocument();
    });
  });
});