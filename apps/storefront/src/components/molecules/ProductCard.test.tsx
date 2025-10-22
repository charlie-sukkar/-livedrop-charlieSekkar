import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ProductCard } from './ProductCard';
import type { Product } from '../../lib/api';

// Create a proper mock function
const mockAddItem = vi.fn();

// Mock dependencies with proper implementation
vi.mock('../../lib/store', () => ({
  useCartStore: vi.fn((selector) => {
    if (selector) {
      return selector({ addItem: mockAddItem });
    }
    return { addItem: mockAddItem };
  }),
}));

vi.mock('react-router-dom', () => ({
  Link: ({ children, to }: { children: React.ReactNode; to: string }) => (
    <a href={to}>{children}</a>
  ),
}));

vi.mock('../atoms/Button', () => ({
  Button: ({ children, onClick, 'aria-label': ariaLabel, disabled }: any) => (
    <button onClick={onClick} aria-label={ariaLabel} disabled={disabled}>
      {children}
    </button>
  ),
}));

vi.mock('../atoms/PriceDisplay', () => ({
  PriceDisplay: ({ amount }: { amount: number }) => <div>${amount}</div>,
}));

vi.mock('../atoms/StockIndicator', () => ({
  StockIndicator: ({ stockQty }: { stockQty: number }) => <div>Stock: {stockQty}</div>,
}));

vi.mock('../atoms/Tag', () => ({
  Tag: ({ label }: { label: string }) => <span>{label}</span>,
}));

describe('ProductCard', () => {
  const mockProduct: Product = {
    _id: '1',
    name: 'Test Product',
    description: 'Test description',
    price: 29.99,
    stock: 10,
    imageUrl: '/test.jpg',
    tags: ['electronics', 'new'],
    category: 'test-category'
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('displays product information', () => {
    render(<ProductCard product={mockProduct} />);
    
    expect(screen.getByText('Test Product')).toBeInTheDocument();
    expect(screen.getByText('Test description')).toBeInTheDocument();
    expect(screen.getByText('$29.99')).toBeInTheDocument();
  });

  it('shows loading skeleton when loading', () => {
    render(<ProductCard product={mockProduct} loading={true} />);
    
    const skeleton = document.querySelector('.animate-pulse');
    expect(skeleton).toBeInTheDocument();
  });

  it('shows product tags', () => {
    render(<ProductCard product={mockProduct} />);
    
    expect(screen.getByText('electronics')).toBeInTheDocument();
    expect(screen.getByText('new')).toBeInTheDocument();
  });

  it('shows stock indicator', () => {
    render(<ProductCard product={mockProduct} />);
    
    expect(screen.getByText('Stock: 10')).toBeInTheDocument();
  });

  it('shows add to cart button', () => {
    render(<ProductCard product={mockProduct} />);
    
    expect(screen.getByText('Add to Cart')).toBeInTheDocument();
  });

  it('calls addItem when add to cart button is clicked', () => {
    render(<ProductCard product={mockProduct} />);
    
    const addButton = screen.getByText('Add to Cart');
    fireEvent.click(addButton);

    expect(mockAddItem).toHaveBeenCalledWith({
      productId: '1',
      title: 'Test Product',
      price: 29.99,
      image: '/test.jpg',
      stockQty: 10,
    });
  });

  it('disables add to cart button when product is out of stock', () => {
    const outOfStockProduct: Product = {
      ...mockProduct,
      stock: 0
    };

    render(<ProductCard product={outOfStockProduct} />);
    
    const addButton = screen.getByText('Add to Cart');
    expect(addButton).toBeDisabled();
  });

  it('renders product image with correct alt text', () => {
    render(<ProductCard product={mockProduct} />);
    
    const image = screen.getByAltText('Test Product');
    expect(image).toHaveAttribute('src', '/test.jpg');
  });

  it('renders product links with correct URLs', () => {
    render(<ProductCard product={mockProduct} />);
    
    const links = screen.getAllByRole('link');
    expect(links[0]).toHaveAttribute('href', '/p/1');
    expect(links[1]).toHaveAttribute('href', '/p/1');
  });

  it('shows correct aria-label for add to cart button', () => {
    render(<ProductCard product={mockProduct} />);
    
    const addButton = screen.getByLabelText('Add Test Product to cart');
    expect(addButton).toBeInTheDocument();
  });
});