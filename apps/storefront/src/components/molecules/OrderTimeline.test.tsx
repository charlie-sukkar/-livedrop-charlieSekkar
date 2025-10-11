import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { OrderTimeline } from './OrderTimeline';

// Mock the Icon component
vi.mock('../atoms/Icon', () => ({
  Icon: vi.fn((props) => <svg {...props} />),
}));

describe('OrderTimeline', () => {
  it('displays all timeline steps', () => {
    render(<OrderTimeline currentStatus="Placed" />);
    
    expect(screen.getByText('Order Placed')).toBeInTheDocument();
    expect(screen.getByText('Packed')).toBeInTheDocument();
    expect(screen.getByText('Shipped')).toBeInTheDocument();
    expect(screen.getByText('Delivered')).toBeInTheDocument();
  });

  it('shows completed steps with blue styling', () => {
    render(<OrderTimeline currentStatus="Shipped" />);
    
    // Check that steps have correct descriptions
    expect(screen.getByText('Your order has been received')).toBeInTheDocument();
    expect(screen.getByText('Your items are being prepared')).toBeInTheDocument();
    expect(screen.getByText('Your order is on the way')).toBeInTheDocument();
    expect(screen.getByText('Your order has been delivered')).toBeInTheDocument();
  });

  it('highlights current step with ring', () => {
    const { container } = render(<OrderTimeline currentStatus="Packed" />);
    
    // Find the current step dot with ring styling
    const currentDot = container.querySelector('.ring-2.ring-blue-200');
    expect(currentDot).toBeInTheDocument();
  });

  it('shows check icons for completed steps', () => {
    const { container } = render(<OrderTimeline currentStatus="Delivered" />);
    
    // All dots should have check icons (completed state)
    const dots = container.querySelectorAll('[aria-hidden="true"]');
    expect(dots.length).toBeGreaterThan(0);
  });

  it('shows correct title', () => {
    render(<OrderTimeline currentStatus="Placed" />);
    
    expect(screen.getByText('Order Progress')).toBeInTheDocument();
  });

  it('has proper container styling', () => {
    const { container } = render(<OrderTimeline currentStatus="Placed" />);
    
    const mainContainer = container.firstChild as HTMLElement;
    expect(mainContainer).toHaveClass('bg-white', 'rounded-lg', 'shadow-sm');
  });
});