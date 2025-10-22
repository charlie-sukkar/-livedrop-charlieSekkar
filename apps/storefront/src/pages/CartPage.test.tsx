
import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { CatalogPage } from './catalog';

// Mock the API with proper response structure
vi.mock('../lib/api', () => ({
  listProducts: vi.fn()
}));

import { listProducts } from '../lib/api';

// Simple, safe mocks that match your actual component output
vi.mock('../components/templates/CatalogLayout', () => ({
  CatalogLayout: ({ children, filters, search }: any) => (
    <div data-testid="catalog-layout">
      <div data-testid="search-section">{search}</div>
      <div data-testid="filters-section">{filters}</div>
      <div data-testid="content-section">{children}</div>
    </div>
  )
}));

vi.mock('../components/organisms/ProductGrid', () => ({
  ProductGrid: ({ products, loading }: any) => (
    <div data-testid="product-grid">
      {loading ? 'Loading products...' : `Showing ${products ? products.length : 0} products`}
    </div>
  )
}));

vi.mock('../components/molecules/SearchBox', () => ({
  SearchBox: ({ value, onChange, placeholder }: any) => (
    <input
      data-testid="search-box"
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
    />
  )
}));

vi.mock('../components/organisms/ProductFilters', () => ({
  ProductFilters: ({ availableTags, tagsLoading }: any) => (
    <div data-testid="product-filters">
      <div data-testid="tags-info">
        {tagsLoading ? 'Loading tags...' : `Tags loaded: ${availableTags ? availableTags.length : 0}`}
      </div>
    </div>
  )
}));

const mockListProducts = vi.mocked(listProducts);

describe('CatalogPage', () => {
  const mockProduct = {
    _id: '1',
    name: 'Test Product',
    description: 'Test Description',
    price: 100,
    category: 'test',
    tags: ['electronics', 'audio'],
    imageUrl: '/test.jpg',
    stock: 10
  };

  const createMockResponse = (items: any[] = [mockProduct]) => ({
    items: items || [],
    pagination: {
      page: 1,
      limit: 20,
      total: items ? items.length : 0,
      pages: 1
    }
  });

  beforeEach(() => {
    vi.clearAllMocks();
    mockListProducts.mockResolvedValue(createMockResponse());
  });

  it('renders without crashing', async () => {
    render(<CatalogPage />);

    await waitFor(() => {
      expect(screen.getByTestId('catalog-layout')).toBeInTheDocument();
    });
  });

  it('loads products and tags', async () => {
    const tagsResponse = createMockResponse([
      mockProduct,
      { ...mockProduct, _id: '2', tags: ['home', 'kitchen'] }
    ]);
    
    mockListProducts
      .mockResolvedValueOnce(tagsResponse) // First call for tags
      .mockResolvedValueOnce(createMockResponse()); // Second call for products

    render(<CatalogPage />);

    // Should load tags
    await waitFor(() => {
      expect(mockListProducts).toHaveBeenCalledWith({
        page: 1,
        limit: 1000
      });
    });

    // Should load products
    await waitFor(() => {
      expect(mockListProducts).toHaveBeenCalledWith({
        search: undefined,
        tags: undefined,
        sort: 'name',
        page: 1,
        limit: 20
      });
    });
  });

  it('shows products after loading', async () => {
    render(<CatalogPage />);

    await waitFor(() => {
      expect(screen.getByText('Showing 1 products')).toBeInTheDocument();
    });
  });
});