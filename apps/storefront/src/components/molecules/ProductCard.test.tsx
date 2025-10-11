import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { ProductCard } from './ProductCard';

// Mock dependencies with proper typing
vi.mock('../../lib/store', () => ({
  useCartStore: () => ({
    addItem: vi.fn(),
  }),
}));

vi.mock('react-router-dom', () => ({
  Link: ({ children, to }: { children: React.ReactNode; to: string }) => (
    <a href={to}>{children}</a>
  ),
}));

vi.mock('../atoms/Button', () => ({
  Button: ({ children, onClick, 'aria-label': ariaLabel }: { children: React.ReactNode; onClick?: () => void; 'aria-label'?: string }) => (
    <button onClick={onClick} aria-label={ariaLabel}>{children}</button>
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
  const mockProduct = {
    id: '1',
    title: 'Test Product',
    description: 'Test description',
    price: 29.99,
    stockQty: 10,
    image: '/test.jpg',
    tags: ['electronics', 'new'],
  };

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
});