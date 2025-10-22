import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ProductDetail } from './ProductDetail';
import userEvent from '@testing-library/user-event';

// Create the mock function
const mockAddItem = vi.fn();

// Mock the store with the exact selector pattern used in the component
vi.mock('../../lib/store', () => ({
  useCartStore: vi.fn((selector) => {
    if (selector) {
      return selector({
        addItem: mockAddItem,
        items: [],
        isOpen: false,
        removeItem: vi.fn(),
        updateQuantity: vi.fn(),
        toggleCart: vi.fn(),
        openCart: vi.fn(),
        closeCart: vi.fn(),
        clearCart: vi.fn(),
        getTotalItems: vi.fn(),
        getTotalPrice: vi.fn(),
      });
    }
    return {
      addItem: mockAddItem,
      items: [],
      isOpen: false,
      removeItem: vi.fn(),
      updateQuantity: vi.fn(),
      toggleCart: vi.fn(),
      openCart: vi.fn(),
      closeCart: vi.fn(),
      clearCart: vi.fn(),
      getTotalItems: vi.fn(),
      getTotalPrice: vi.fn(),
    };
  }),
}));

// Mock other components
vi.mock('../atoms/Button', () => ({
  Button: ({ children, onClick, disabled, className, 'aria-label': ariaLabel }: { 
    children: React.ReactNode; 
    onClick?: () => void; 
    disabled?: boolean;
    className?: string;
    'aria-label'?: string;
  }) => (
    <button onClick={onClick} disabled={disabled} className={className} aria-label={ariaLabel}>
      {children}
    </button>
  ),
}));

vi.mock('../atoms/PriceDisplay', () => ({
  PriceDisplay: ({ amount, className }: { amount: number; className?: string }) => (
    <div className={className}>${amount.toFixed(2)}</div>
  ),
}));

vi.mock('../atoms/StockIndicator', () => ({
  StockIndicator: ({ stockQty }: { stockQty: number }) => <div>Stock: {stockQty}</div>,
}));

vi.mock('../atoms/Tag', () => ({
  Tag: ({ label }: { label: string }) => <span>{label}</span>,
}));

describe('ProductDetail', () => {
  const mockProduct = {
    _id: '1',
    name: 'Test Product',
    description: 'Test description',
    price: 99.99,
    stock: 10,
    imageUrl: '/test.jpg',
    tags: ['electronics', 'premium'],
    category: 'electronics',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
    mockAddItem.mockClear();
  });

  it('displays product name and price', () => {
    render(<ProductDetail product={mockProduct} />);
    
    expect(screen.getByText('Test Product')).toBeInTheDocument();
    expect(screen.getByText('$99.99')).toBeInTheDocument();
  });

  it('shows product tags', () => {
    render(<ProductDetail product={mockProduct} />);
    
    expect(screen.getByText('electronics')).toBeInTheDocument();
    expect(screen.getByText('premium')).toBeInTheDocument();
  });

  it('shows stock indicator with correct quantity', () => {
    render(<ProductDetail product={mockProduct} />);
    
    expect(screen.getByText('Stock: 10')).toBeInTheDocument();
  });

  it('shows add to cart button when in stock', () => {
    render(<ProductDetail product={mockProduct} />);
    
    expect(screen.getByText('Add to Cart')).toBeInTheDocument();
    expect(screen.getByText('Add to Cart')).not.toBeDisabled();
  });

  it('shows disabled out of stock button when no stock', () => {
    const outOfStockProduct = { 
      ...mockProduct, 
      stock: 0
    };
    render(<ProductDetail product={outOfStockProduct} />);
    
    expect(screen.getByText('Out of Stock')).toBeInTheDocument();
    expect(screen.getByText('Out of Stock')).toBeDisabled();
  });

  it('calls addItem with correct product data when add to cart is clicked', async () => {
    const user = userEvent.setup();
    render(<ProductDetail product={mockProduct} />);
    
    await user.click(screen.getByText('Add to Cart'));

    expect(mockAddItem).toHaveBeenCalledWith({
      productId: '1',
      title: 'Test Product',
      price: 99.99,
      image: '/test.jpg',
      stockQty: 10,
    });
  });

  it('has correct aria-label for add to cart button', () => {
    render(<ProductDetail product={mockProduct} />);
    
    const button = screen.getByLabelText('Add Test Product to cart');
    expect(button).toBeInTheDocument();
  });

  it('renders with correct accessibility attributes', () => {
    render(<ProductDetail product={mockProduct} />);
    
    const article = screen.getByRole('article');
    expect(article).toHaveAttribute('aria-labelledby', 'product-title-1');
    
    const heading = screen.getByRole('heading', { level: 1 });
    expect(heading).toHaveAttribute('id', 'product-title-1');
  });
});