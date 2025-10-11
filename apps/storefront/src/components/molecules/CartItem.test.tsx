import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { CartItem } from './CartItem';

// Mock dependencies
vi.mock('../../lib/format', () => ({
  formatCurrency: vi.fn((amount) => `$${amount}`),
}));

vi.mock('../atoms/Button', () => ({
  Button: vi.fn(({ children, onClick, ...props }) => (
    <button onClick={onClick} {...props}>{children}</button>
  )),
}));

vi.mock('../atoms/Icon', () => ({
  Icon: vi.fn((props) => <svg {...props} />),
}));

describe('CartItem', () => {
  const mockItem = {
    productId: '1',
    title: 'Test Product',
    price: 29.99,
    quantity: 2,
    stockQty: 10,
    image: '/test.jpg',
  };

  const mockOnUpdateQuantity = vi.fn();
  const mockOnRemove = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('displays product information', () => {
    render(<CartItem item={mockItem} onUpdateQuantity={mockOnUpdateQuantity} onRemove={mockOnRemove} />);
    
    expect(screen.getByText('Test Product')).toBeInTheDocument();
    expect(screen.getByText('$29.99 each')).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument();
  });

  it('calls onUpdateQuantity when increasing quantity', async () => {
    const user = userEvent.setup();
    render(<CartItem item={mockItem} onUpdateQuantity={mockOnUpdateQuantity} onRemove={mockOnRemove} />);
    
    await user.click(screen.getByLabelText(/Increase quantity/));
    expect(mockOnUpdateQuantity).toHaveBeenCalledWith('1', 3);
  });

  it('calls onUpdateQuantity when decreasing quantity', async () => {
    const user = userEvent.setup();
    render(<CartItem item={mockItem} onUpdateQuantity={mockOnUpdateQuantity} onRemove={mockOnRemove} />);
    
    await user.click(screen.getByLabelText(/Decrease quantity/));
    expect(mockOnUpdateQuantity).toHaveBeenCalledWith('1', 1);
  });

  it('calls onRemove when remove button is clicked', async () => {
    const user = userEvent.setup();
    render(<CartItem item={mockItem} onUpdateQuantity={mockOnUpdateQuantity} onRemove={mockOnRemove} />);
    
    await user.click(screen.getByLabelText(/Remove.*from cart/));
    expect(mockOnRemove).toHaveBeenCalledWith('1');
  });

  it('disables increase button when quantity reaches stock', () => {
    const itemAtMaxStock = { ...mockItem, quantity: 10, stockQty: 10 };
    render(<CartItem item={itemAtMaxStock} onUpdateQuantity={mockOnUpdateQuantity} onRemove={mockOnRemove} />);
    
    expect(screen.getByLabelText(/Increase quantity/)).toBeDisabled();
  });

  it('has proper accessibility attributes', () => {
    render(<CartItem item={mockItem} onUpdateQuantity={mockOnUpdateQuantity} onRemove={mockOnRemove} />);
    
    const listItem = screen.getByRole('listitem');
    expect(listItem).toHaveAttribute('aria-label', 'Test Product, quantity: 2, price: $29.99');
    
    expect(screen.getByText('2')).toHaveAttribute('aria-live', 'polite');
  });
});