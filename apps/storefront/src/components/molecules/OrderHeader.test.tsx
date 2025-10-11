import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { OrderHeader } from './OrderHeader';

// Mock child components
vi.mock('../atoms/OrderStatusBadge', () => ({
  OrderStatusBadge: vi.fn(({ status }) => <div data-testid="status-badge">{status}</div>),
}));

vi.mock('../atoms/OrderDate', () => ({
  OrderDate: vi.fn(({ timestamp }) => <div data-testid="order-date">{timestamp}</div>),
}));

describe('OrderHeader', () => {
  it('displays order ID', () => {
    render(<OrderHeader orderId="ORD-123" status="Delivered" createdAt={123456789} />);
    
    expect(screen.getByText('Order #ORD-123')).toBeInTheDocument();
  });

  it('shows status badge with correct status', () => {
    render(<OrderHeader orderId="ORD-123" status="Shipped" createdAt={123456789} />);
    
    const statusBadge = screen.getByTestId('status-badge');
    expect(statusBadge).toHaveTextContent('Shipped');
  });

  it('shows order date with timestamp', () => {
    render(<OrderHeader orderId="ORD-123" status="Delivered" createdAt={123456789} />);
    
    const orderDate = screen.getByTestId('order-date');
    expect(orderDate).toHaveTextContent('123456789');
  });

  it('has correct layout classes', () => {
    const { container } = render(<OrderHeader orderId="ORD-123" status="Delivered" createdAt={123456789} />);
    
    const mainContainer = container.firstChild as HTMLElement;
    expect(mainContainer).toHaveClass('bg-white', 'rounded-lg', 'shadow-sm');
  });

  it('has responsive flex layout', () => {
    const { container } = render(<OrderHeader orderId="ORD-123" status="Delivered" createdAt={123456789} />);
    
    const flexContainer = container.querySelector('.flex');
    expect(flexContainer).toHaveClass('flex-col', 'lg:flex-row');
  });
});