import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor, act } from '@testing-library/react'
import { CatalogPage } from './catalog'
import { BrowserRouter } from 'react-router-dom'

// Mock dependencies
const mockListProducts = vi.fn()
vi.mock('../lib/api', () => ({
  listProducts: (params: any) => mockListProducts(params),
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
  ProductGrid: ({ products, loading, pagination }: any) => (
    <div data-testid="product-grid">
      {loading ? 'Loading products...' : `Products: ${products.length}`}
      {pagination && (
        <div data-testid="pagination">
          Page {pagination.page} of {pagination.pages}
        </div>
      )}
    </div>
  )
}))

vi.mock('../components/molecules/SearchBox', () => ({
  SearchBox: ({ value, onChange, placeholder }: any) => (
    <input 
      data-testid="search-box" 
      value={value} 
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
    />
  )
}))

vi.mock('../components/organisms/ProductFilters', () => ({
  ProductFilters: ({ onSortChange, onTagFilter, availableTags, tagsLoading }: any) => (
    <div data-testid="product-filters">
      <div data-testid="tags-loading-state">{tagsLoading ? 'Tags loading...' : 'Tags loaded'}</div>
      <div data-testid="available-tags">Tags: {availableTags.join(',')}</div>
      <button onClick={() => onSortChange('price')}>Sort by Price</button>
      <button onClick={() => onTagFilter(['electronics'])}>Filter Electronics</button>
    </div>
  )
}))

const MockRouter = ({ children }: { children: React.ReactNode }) => (
  <BrowserRouter>{children}</BrowserRouter>
)

describe('CatalogPage', () => {
  const mockProductsResponse = {
    items: [
      {
        _id: '1',
        name: 'Wireless Headphones',
        price: 199.99,
        imageUrl: '/headphones.jpg',
        description: 'Noise cancelling headphones',
        tags: ['electronics', 'audio'],
        stock: 10,
        category: 'electronics',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        _id: '2',
        name: 'Coffee Mug',
        price: 15.99,
        imageUrl: '/mug.jpg',
        description: 'Ceramic coffee mug',
        tags: ['home', 'kitchen'],
        stock: 50,
        category: 'home',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }
    ],
    pagination: {
      page: 1,
      limit: 20,
      total: 2,
      pages: 1
    }
  }

  const mockTagsResponse = {
    items: [
      {
        _id: '1',
        name: 'Wireless Headphones',
        price: 199.99,
        imageUrl: '/headphones.jpg',
        description: 'Noise cancelling headphones',
        tags: ['electronics', 'audio'],
        stock: 10,
        category: 'electronics',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        _id: '2',
        name: 'Coffee Mug',
        price: 15.99,
        imageUrl: '/mug.jpg',
        description: 'Ceramic coffee mug',
        tags: ['home', 'kitchen'],
        stock: 50,
        category: 'home',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }
    ],
    pagination: {
      page: 1,
      limit: 1000,
      total: 2,
      pages: 1
    }
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('loads and displays products', async () => {
    // Create delayed promises to test loading states
    let resolveProducts: (value: any) => void
    let resolveTags: (value: any) => void
    
    const productsPromise = new Promise(resolve => {
      resolveProducts = resolve
    })
    const tagsPromise = new Promise(resolve => {
      resolveTags = resolve
    })
    
    mockListProducts.mockImplementation((params) => {
      if (params?.limit === 1000) {
        return tagsPromise
      }
      return productsPromise
    })

    await act(async () => {
      render(
        <MockRouter>
          <CatalogPage />
        </MockRouter>
      )
    })

    // Check for loading state - should show loading for products
    expect(screen.getByText('Loading products...')).toBeInTheDocument()

    // Resolve the promises
    await act(async () => {
      resolveTags!(mockTagsResponse)
      resolveProducts!(mockProductsResponse)
    })

    await waitFor(() => {
      expect(screen.getByText('Products: 2')).toBeInTheDocument()
    })

    // Should call listProducts twice: once for tags, once for products
    expect(mockListProducts).toHaveBeenCalledTimes(2)
  })

  it('renders all child components', async () => {
    // Mock the calls to resolve immediately
    mockListProducts.mockResolvedValueOnce(mockTagsResponse)
    mockListProducts.mockResolvedValueOnce(mockProductsResponse)
    
    await act(async () => {
      render(
        <MockRouter>
          <CatalogPage />
        </MockRouter>
      )
    })

    await waitFor(() => {
      expect(screen.getByTestId('filters')).toBeInTheDocument()
      expect(screen.getByTestId('search')).toBeInTheDocument()
      expect(screen.getByTestId('product-grid')).toBeInTheDocument()
      expect(screen.getByTestId('search-box')).toBeInTheDocument()
      expect(screen.getByTestId('product-filters')).toBeInTheDocument()
    })
  })

  it('passes correct tags to filters', async () => {
    // Mock the calls to resolve immediately
    mockListProducts.mockResolvedValueOnce(mockTagsResponse)
    mockListProducts.mockResolvedValueOnce(mockProductsResponse)
    
    await act(async () => {
      render(
        <MockRouter>
          <CatalogPage />
        </MockRouter>
      )
    })

    await waitFor(() => {
      // Should extract unique tags from the mock data: audio,electronics,home,kitchen
      const availableTagsElement = screen.getByTestId('available-tags')
      expect(availableTagsElement).toHaveTextContent('Tags: audio,electronics,home,kitchen')
    })
  })

  it('handles API errors gracefully', async () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
    
    // Mock both calls to fail
    mockListProducts.mockRejectedValue(new Error('API Error'))

    await act(async () => {
      render(
        <MockRouter>
          <CatalogPage />
        </MockRouter>
      )
    })

    await waitFor(() => {
      expect(screen.getByText('Products: 0')).toBeInTheDocument()
    })

    // Should show empty tags when API fails - use a more flexible check
    const availableTagsElement = screen.getByTestId('available-tags')
    
    // Check that the element contains "Tags:" and has no actual tags
    expect(availableTagsElement).toHaveTextContent(/Tags:/)
    // Check that there are no actual tags (no commas indicating multiple tags)
    expect(availableTagsElement.textContent).not.toContain(',')
    
    consoleSpy.mockRestore()
  })

  it('shows tags loading state and then loaded state', async () => {
    // Create a delayed promise for tags to test loading state
    let resolveTags: (value: any) => void
    const tagsPromise = new Promise(resolve => {
      resolveTags = resolve
    })
    
    mockListProducts.mockImplementation((params) => {
      if (params?.limit === 1000) {
        return tagsPromise
      }
      return Promise.resolve(mockProductsResponse)
    })

    await act(async () => {
      render(
        <MockRouter>
          <CatalogPage />
        </MockRouter>
      )
    })

    // Initially shows tags loading
    expect(screen.getByTestId('tags-loading-state')).toHaveTextContent('Tags loading...')

    // Resolve the tags promise
    await act(async () => {
      resolveTags!(mockTagsResponse)
    })

    // After loading, shows tags loaded
    await waitFor(() => {
      expect(screen.getByTestId('tags-loading-state')).toHaveTextContent('Tags loaded')
    })
  })

  it('passes correct search placeholder', async () => {
    // Mock the calls to resolve immediately
    mockListProducts.mockResolvedValueOnce(mockTagsResponse)
    mockListProducts.mockResolvedValueOnce(mockProductsResponse)
    
    await act(async () => {
      render(
        <MockRouter>
          <CatalogPage />
        </MockRouter>
      )
    })

    await waitFor(() => {
      const searchBox = screen.getByTestId('search-box')
      expect(searchBox).toHaveAttribute('placeholder', 'Search products by name, tags, or description...')
    })
  })

  it('handles pagination data', async () => {
    // Mock the calls to resolve immediately
    mockListProducts.mockResolvedValueOnce(mockTagsResponse)
    mockListProducts.mockResolvedValueOnce(mockProductsResponse)
    
    await act(async () => {
      render(
        <MockRouter>
          <CatalogPage />
        </MockRouter>
      )
    })

    await waitFor(() => {
      expect(screen.getByTestId('pagination')).toBeInTheDocument()
      expect(screen.getByText('Page 1 of 1')).toBeInTheDocument()
    })
  })

  it('calls API with correct parameters for tags extraction', async () => {
    // Mock the calls to resolve immediately
    mockListProducts.mockResolvedValueOnce(mockTagsResponse)
    mockListProducts.mockResolvedValueOnce(mockProductsResponse)
    
    await act(async () => {
      render(
        <MockRouter>
          <CatalogPage />
        </MockRouter>
      )
    })

    await waitFor(() => {
      // Verify the tags extraction call
      expect(mockListProducts).toHaveBeenCalledWith({
        page: 1,
        limit: 1000
      })
    })
  })

  it('loads products successfully', async () => {
    // Mock the calls to resolve immediately
    mockListProducts.mockResolvedValueOnce(mockTagsResponse)
    mockListProducts.mockResolvedValueOnce(mockProductsResponse)
    
    await act(async () => {
      render(
        <MockRouter>
          <CatalogPage />
        </MockRouter>
      )
    })

    await waitFor(() => {
      expect(screen.getByText('Products: 2')).toBeInTheDocument()
    })
  })
})