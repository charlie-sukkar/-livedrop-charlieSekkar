import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import { CatalogPage } from './catalog'
import { BrowserRouter } from 'react-router-dom'

// Mock dependencies
const mockListProducts = vi.fn()
vi.mock('../lib/api', () => ({
  listProducts: () => mockListProducts(),
}))

vi.mock('../components/templates/CatalogLayout', () => ({
  CatalogLayout: ({ children, filters, search }: any) => (
    <div>
      <div data-testid="filters">{filters}</div>
      <div data-testid="search">{search}</div>
      <div data-testid="content">{children}</div>
    </div>
  )
}))

vi.mock('../components/organisms/ProductGrid', () => ({
  ProductGrid: ({ products, loading }: any) => (
    <div data-testid="product-grid">
      {loading ? 'Loading...' : `Products: ${products.length}`}
    </div>
  )
}))

vi.mock('../components/molecules/SearchBox', () => ({
  SearchBox: ({ value, onChange }: any) => (
    <input 
      data-testid="search-box" 
      value={value} 
      onChange={(e) => onChange(e.target.value)}
      placeholder="Search products..."
    />
  )
}))

vi.mock('../components/organisms/ProductFilters', () => ({
  ProductFilters: ({ onSortChange, onTagFilter, availableTags }: any) => (
    <div data-testid="product-filters">
      <button onClick={() => onSortChange('price-asc')}>Sort</button>
      <button onClick={() => onTagFilter(['electronics'])}>Filter</button>
      Tags: {availableTags.join(',')}
    </div>
  )
}))

const MockRouter = ({ children }: { children: React.ReactNode }) => (
  <BrowserRouter>{children}</BrowserRouter>
)

describe('CatalogPage', () => {
  const mockProducts = [
    {
      id: '1',
      title: 'Wireless Headphones',
      price: 199.99,
      image: '/headphones.jpg',
      description: 'Noise cancelling headphones',
      tags: ['electronics', 'audio'],
      stockQty: 10
    },
    {
      id: '2',
      title: 'Coffee Mug',
      price: 15.99,
      image: '/mug.jpg',
      description: 'Ceramic coffee mug',
      tags: ['home', 'kitchen'],
      stockQty: 50
    }
  ]

  beforeEach(() => {
    vi.clearAllMocks()
    mockListProducts.mockResolvedValue(mockProducts)
  })

  it('loads and displays products', async () => {
    render(
      <MockRouter>
        <CatalogPage />
      </MockRouter>
    )

    expect(screen.getByText('Loading...')).toBeInTheDocument()

    await waitFor(() => {
      expect(screen.getByText('Products: 2')).toBeInTheDocument()
    })

    expect(mockListProducts).toHaveBeenCalledTimes(1)
  })

  it('renders all child components', async () => {
    render(
      <MockRouter>
        <CatalogPage />
      </MockRouter>
    )

    await waitFor(() => {
      expect(screen.getByTestId('filters')).toBeInTheDocument()
      expect(screen.getByTestId('search')).toBeInTheDocument()
      expect(screen.getByTestId('product-grid')).toBeInTheDocument()
      expect(screen.getByTestId('search-box')).toBeInTheDocument()
      expect(screen.getByTestId('product-filters')).toBeInTheDocument()
    })
  })

  it('passes correct tags to filters', async () => {
    render(
      <MockRouter>
        <CatalogPage />
      </MockRouter>
    )

    await waitFor(() => {
      expect(screen.getByText('Tags: audio,electronics,home,kitchen')).toBeInTheDocument()
    })
  })

  it('handles API errors', async () => {
    console.error = vi.fn() // Suppress error logging
    mockListProducts.mockRejectedValue(new Error('API Error'))

    render(
      <MockRouter>
        <CatalogPage />
      </MockRouter>
    )

    await waitFor(() => {
      expect(screen.getByText('Products: 0')).toBeInTheDocument()
    })
  })
})
