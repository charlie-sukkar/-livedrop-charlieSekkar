import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { StockIndicator } from './StockIndicator';

describe('StockIndicator', () => {
  it('shows "Out of Stock" for zero quantity', () => {
    render(<StockIndicator stockQty={0} />);
    expect(screen.getByText('Out of Stock')).toBeInTheDocument();
    expect(screen.getByText('Out of Stock')).toHaveClass('text-red-600');
  });

  it('shows low stock warning for quantities under 10', () => {
    render(<StockIndicator stockQty={5} />);
    expect(screen.getByText('Only 5 left')).toBeInTheDocument();
    expect(screen.getByText('Only 5 left')).toHaveClass('text-orange-600');
  });

  it('shows "In Stock" for quantities 10 and above', () => {
    render(<StockIndicator stockQty={15} />);
    expect(screen.getByText('In Stock')).toBeInTheDocument();
    expect(screen.getByText('In Stock')).toHaveClass('text-green-600');
  });

  it('hides background when showBackground is false', () => {
    render(<StockIndicator stockQty={5} showBackground={false} />);
    const indicator = screen.getByText('Only 5 left');
    expect(indicator).not.toHaveClass('bg-orange-100');
  });

  it('hides pulse animation when showPulse is false', () => {
    const { container } = render(<StockIndicator stockQty={5} showPulse={false} />);
    const pulse = container.querySelector('.animate-ping');
    expect(pulse).not.toBeInTheDocument();
  });

  it('applies custom className', () => {
    render(<StockIndicator stockQty={10} className="mt-2" />);
    expect(screen.getByText('In Stock')).toHaveClass('mt-2');
  });

  it('has proper accessibility attributes', () => {
    render(<StockIndicator stockQty={5} />);
    const indicator = screen.getByText('Only 5 left');
    expect(indicator).toHaveAttribute('aria-live', 'polite');
    expect(indicator).toHaveAttribute('aria-atomic', 'true');
  });

  
});