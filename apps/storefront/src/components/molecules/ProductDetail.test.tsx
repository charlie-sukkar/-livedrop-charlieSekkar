import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { ProductDetail } from './ProductDetail';

// Mock dependencies
vi.mock('../../lib/store', () => ({
  useCartStore: () => ({
    addItem: vi.fn(),
  }),
}));

vi.mock('../atoms/Button', () => ({
  Button: ({ children, onClick, disabled }: { children: React.ReactNode; onClick?: () => void; disabled?: boolean }) => (
    <button onClick={onClick} disabled={disabled}>{children}</button>
  ),
}));

vi.mock('../atoms/PriceDisplay', () => ({
  PriceDisplay: ({ amount }: { amount: number }) => <div>${amount}</div>,
}));

vi.mock('../atoms/StockIndicator', () => ({
  StockIndicator: () => <div>Stock Indicator</div>,
}));

vi.mock('../atoms/Tag', () => ({
  Tag: ({ label }: { label: string }) => <span>{label}</span>,
}));

describe('ProductDetail', () => {
  const mockProduct = {
    id: '1',
    title: 'Test Product',
    description: 'Test description',
    price: 99.99,
    stockQty: 10,
    image: '/test.jpg',
    tags: ['electronics', 'premium'],
  };

  it('displays product title and price', () => {
    render(<ProductDetail product={mockProduct} />);
    
    expect(screen.getByText('Test Product')).toBeInTheDocument();
    expect(screen.getByText('$99.99')).toBeInTheDocument();
  });

  it('shows product tags', () => {
    render(<ProductDetail product={mockProduct} />);
    
    expect(screen.getByText('electronics')).toBeInTheDocument();
    expect(screen.getByText('premium')).toBeInTheDocument();
  });

  it('shows stock indicator', () => {
    render(<ProductDetail product={mockProduct} />);
    
    expect(screen.getByText('Stock Indicator')).toBeInTheDocument();
  });

  it('shows add to cart button when in stock', () => {
    render(<ProductDetail product={mockProduct} />);
    
    expect(screen.getByText('Add to Cart')).toBeInTheDocument();
    expect(screen.getByText('Add to Cart')).not.toBeDisabled();
  });

  it('shows disabled out of stock button when no stock', () => {
    const outOfStockProduct = { ...mockProduct, stockQty: 0 };
    render(<ProductDetail product={outOfStockProduct} />);
    
    expect(screen.getByText('Out of Stock')).toBeInTheDocument();
    expect(screen.getByText('Out of Stock')).toBeDisabled();
  });
});