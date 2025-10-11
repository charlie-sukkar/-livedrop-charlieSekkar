import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { CartFooter } from './CartFooter';

// Mock child components
vi.mock('../atoms/PriceDisplay', () => ({
  PriceDisplay: vi.fn(({ amount, label }) => (
    <div>{label} ${amount}</div>
  )),
}));

vi.mock('../atoms/Button', () => ({
  Button: vi.fn(({ children, onClick, ...props }) => (
    <button onClick={onClick} {...props}>{children}</button>
  )),
}));

describe('CartFooter', () => {
  it('displays total price', () => {
    render(<CartFooter totalPrice={99.99} />);
    expect(screen.getByText('Total: $99.99')).toBeInTheDocument();
  });

  it('shows checkout button when onCheckout provided', async () => {
    const onCheckout = vi.fn();
    const user = userEvent.setup();
    
    render(<CartFooter totalPrice={50} onCheckout={onCheckout} />);
    
    await user.click(screen.getByText('Checkout'));
    expect(onCheckout).toHaveBeenCalledOnce();
  });

  it('shows clear cart button when onClearCart provided', async () => {
    const onClearCart = vi.fn();
    const user = userEvent.setup();
    
    render(<CartFooter totalPrice={50} onClearCart={onClearCart} />);
    
    await user.click(screen.getByText('Clear Cart'));
    expect(onClearCart).toHaveBeenCalledOnce();
  });

  it('shows view cart button when onViewCart provided', async () => {
    const onViewCart = vi.fn();
    const user = userEvent.setup();
    
    render(<CartFooter totalPrice={50} onViewCart={onViewCart} />);
    
    await user.click(screen.getByText('View Cart'));
    expect(onViewCart).toHaveBeenCalledOnce();
  });

  it('hides clear cart when showClearCart is false', () => {
    render(<CartFooter totalPrice={50} onClearCart={() => {}} showClearCart={false} />);
    expect(screen.queryByText('Clear Cart')).not.toBeInTheDocument();
  });

  it('hides view cart when showViewCart is false', () => {
    render(<CartFooter totalPrice={50} onViewCart={() => {}} showViewCart={false} />);
    expect(screen.queryByText('View Cart')).not.toBeInTheDocument();
  });

  it('uses drawer layout by default', () => {
    render(<CartFooter totalPrice={50} onCheckout={() => {}} />);
    expect(screen.getByText('Checkout')).toHaveClass('w-full');
  });

  it('uses page layout when variant is page', () => {
    render(<CartFooter totalPrice={50} onCheckout={() => {}} variant="page" />);
    expect(screen.getByText('Checkout')).toHaveClass('flex-1');
  });
});