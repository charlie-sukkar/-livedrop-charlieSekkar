import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { OrderStatusBadge } from './OrderStatusBadge';

describe('OrderStatusBadge', () => {
  it('renders all statuses with correct labels', () => {
    const statuses = ['Placed', 'Packed', 'Shipped', 'Delivered', 'NotFound'] as const;
    
    statuses.forEach(status => {
      render(<OrderStatusBadge status={status} />);
      expect(screen.getByText(statusConfig[status].label)).toBeInTheDocument();
    });
  });

  it('applies correct colors for each status', () => {
    const testCases = [
      { status: 'Placed' as const, expectedColor: 'bg-blue-100' },
      { status: 'Packed' as const, expectedColor: 'bg-purple-100' },
      { status: 'Shipped' as const, expectedColor: 'bg-yellow-100' },
      { status: 'Delivered' as const, expectedColor: 'bg-green-100' },
      { status: 'NotFound' as const, expectedColor: 'bg-red-100' },
    ];

    testCases.forEach(({ status, expectedColor }) => {
      render(<OrderStatusBadge status={status} />);
      const badge = screen.getByText(statusConfig[status].label);
      expect(badge).toHaveClass(expectedColor);
    });
  });

  it('has proper accessibility attributes', () => {
    render(<OrderStatusBadge status="Delivered" />);
    
    const badge = screen.getByText('Delivered');
    expect(badge).toHaveAttribute('role', 'status');
    expect(badge).toHaveAttribute('aria-label', 'Order status: Delivered');
  });

  it('applies custom className', () => {
    render(<OrderStatusBadge status="Placed" className="custom-class" />);
    
    const badge = screen.getByText('Order Placed');
    expect(badge).toHaveClass('custom-class');
  });

  it('has consistent styling for all badges', () => {
    render(<OrderStatusBadge status="Shipped" />);
    
    const badge = screen.getByText('Shipped');
    expect(badge).toHaveClass(
      'inline-flex',
      'items-center',
      'px-3',
      'py-1',
      'rounded-full',
      'border-2',
      'font-medium',
      'text-sm'
    );
  });
});

// Helper for status config access in tests
const statusConfig = {
  Placed: { color: 'bg-blue-100 text-blue-800 border-blue-200', label: 'Order Placed' },
  Packed: { color: 'bg-purple-100 text-purple-800 border-purple-200', label: 'Packed' },
  Shipped: { color: 'bg-yellow-100 text-yellow-800 border-yellow-200', label: 'Shipped' },
  Delivered: { color: 'bg-green-100 text-green-800 border-green-200', label: 'Delivered' },
  NotFound: { color: 'bg-red-100 text-red-800 border-red-200', label: 'Not Found' },
};