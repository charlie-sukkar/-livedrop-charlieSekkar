import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { ShippingInfo } from './ShippingInfo';

// Mock the OrderInfoItem component
vi.mock('../atoms/OrderInfoItem', () => ({
  OrderInfoItem: ({ label, value }: { label: string; value: string }) => (
    <div data-testid="order-info-item">
      {label}: {value}
    </div>
  ),
}));

describe('ShippingInfo', () => {
  it('displays carrier and eta when provided', () => {
    render(<ShippingInfo carrier="UPS" eta="2024-01-15" status="Shipped" />);
    
    expect(screen.getByText('Shipping Information')).toBeInTheDocument();
    expect(screen.getByText('Carrier: UPS')).toBeInTheDocument();
    expect(screen.getByText('Estimated Delivery: 2024-01-15')).toBeInTheDocument();
  });

  it('shows only carrier when no eta', () => {
    render(<ShippingInfo carrier="FedEx" status="Shipped" />);
    
    expect(screen.getByText('Carrier: FedEx')).toBeInTheDocument();
    expect(screen.queryByText('Estimated Delivery:')).not.toBeInTheDocument();
  });

  it('shows only eta when no carrier', () => {
    render(<ShippingInfo eta="2024-01-20" status="Shipped" />);
    
    expect(screen.getByText('Estimated Delivery: 2024-01-20')).toBeInTheDocument();
    expect(screen.queryByText('Carrier:')).not.toBeInTheDocument();
  });

  it('shows message when no carrier or eta for shipped order', () => {
    render(<ShippingInfo status="Shipped" />);
    
    expect(screen.getByText('Shipping details will be updated soon.')).toBeInTheDocument();
  });

  it('shows delivered message for delivered status', () => {
    render(<ShippingInfo status="Delivered" />);
    
    expect(screen.getByText('This order has been delivered. Shipping info is now closed.')).toBeInTheDocument();
  });

  it('has proper container styling', () => {
    const { container } = render(<ShippingInfo status="Shipped" />);
    
    const mainContainer = container.firstChild as HTMLElement;
    expect(mainContainer).toHaveClass('bg-white', 'rounded-lg', 'shadow-sm');
  });
});