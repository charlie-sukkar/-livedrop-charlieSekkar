import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ProductPage } from './product'
import { BrowserRouter } from 'react-router-dom'

// Mock dependencies
const mockGetProduct = vi.fn()
const mockListProducts = vi.fn()
const mockGetRelatedProducts = vi.fn()
const mockNavigate = vi.fn()

vi.mock('../lib/api', () => ({
  getProduct: (id: string) => mockGetProduct(id),
  listProducts: () => mockListProducts(),
  getRelatedProducts: (products: any[], id: string, tags: string[], limit: number) => 
    mockGetRelatedProducts(products, id, tags, limit)
}))

// Create a mock for useParams that we can control
const mockUseParams = vi.fn()

vi.mock('react-router-dom', async () => ({
  ...(await vi.importActual('react-router-dom')),
  useNavigate: () => mockNavigate,
  useParams: () => mockUseParams(),
}))

// Mock child components
vi.mock('../components/templates/ProductLayout', () => ({
  ProductLayout: ({ children, relatedProducts }: any) => (
    <div>
      <div data-testid="main-content">{children}</div>
      <div data-testid="related-products">{relatedProducts}</div>
    </div>
  )
}))

vi.mock('../components/molecules/ProductDetail', () => ({
  ProductDetail: ({ product }: any) => <div>Product Detail: {product.title}</div>
}))

vi.mock('../components/organisms/ProductGrid', () => ({
  ProductGrid: ({ products }: any) => (
    <div data-testid="product-grid">Related: {products.length} products</div>
  )
}))

const MockRouter = ({ children }: { children: React.ReactNode }) => (
  <BrowserRouter>
    {children}
  </BrowserRouter>
)

describe('ProductPage', () => {
  const mockProduct = {
    id: 'prod-123',
    title: 'Test Product',
    price: 99.99,
    image: '/test.jpg',
    description: 'Test description',
    tags: ['electronics', 'tech'],
    stockQty: 10
  }

  const mockAllProducts = [
    mockProduct,
    {
      id: 'prod-456',
      title: 'Related Product',
      price: 49.99,
      image: '/related.jpg',
      description: 'Related item',
      tags: ['electronics'],
      stockQty: 5
    }
  ]

  beforeEach(() => {
    vi.clearAllMocks()
    // Default mock returns
    mockUseParams.mockReturnValue({ id: 'prod-123' })
    mockGetProduct.mockResolvedValue(mockProduct)
    mockListProducts.mockResolvedValue(mockAllProducts)
    mockGetRelatedProducts.mockReturnValue([mockAllProducts[1]])
  })

  it('renders loading state initially', () => {
    render(
      <MockRouter>
        <ProductPage />
      </MockRouter>
    )

    // Check for loading skeleton elements instead of text
    expect(screen.getByTestId('main-content')).toBeInTheDocument()
    expect(screen.getByTestId('related-products')).toBeInTheDocument()
  })

  it('loads and displays product data', async () => {
    render(
      <MockRouter>
        <ProductPage />
      </MockRouter>
    )

    await waitFor(() => {
      expect(mockGetProduct).toHaveBeenCalledWith('prod-123')
      expect(mockListProducts).toHaveBeenCalled()
    })

    await waitFor(() => {
      expect(screen.getByText('Product Detail: Test Product')).toBeInTheDocument()
      expect(screen.getByText('view cart')).toBeInTheDocument()
    })
  })

  it('shows related products when available', async () => {
    render(
      <MockRouter>
        <ProductPage />
      </MockRouter>
    )

    await waitFor(() => {
      expect(screen.getByTestId('related-products')).toBeInTheDocument()
      expect(screen.getByTestId('product-grid')).toBeInTheDocument()
    })
  })

  it('navigates to catalog when back button is clicked in error state', async () => {
    const user = userEvent.setup()
    mockGetProduct.mockResolvedValue(null)

    render(
      <MockRouter>
        <ProductPage />
      </MockRouter>
    )

    await waitFor(() => {
      // Use getAllByText since there are multiple elements with this text
      const productNotFoundElements = screen.getAllByText('Product not found')
      expect(productNotFoundElements.length).toBeGreaterThan(0)
    })

    await user.click(screen.getByText('Back to Catalog'))
    expect(mockNavigate).toHaveBeenCalledWith('/')
  })

  it('navigates to cart when view cart is clicked', async () => {
    const user = userEvent.setup()
    render(
      <MockRouter>
        <ProductPage />
      </MockRouter>
    )

    await waitFor(() => {
      expect(screen.getByText('view cart')).toBeInTheDocument()
    })

    await user.click(screen.getByText('view cart'))
    expect(mockNavigate).toHaveBeenCalledWith('/cart')
  })

  it('shows error state when product not found', async () => {
    mockGetProduct.mockResolvedValue(null)

    render(
      <MockRouter>
        <ProductPage />
      </MockRouter>
    )

    await waitFor(() => {
      // Check that "Product not found" appears at least once
      const productNotFoundElements = screen.getAllByText('Product not found')
      expect(productNotFoundElements.length).toBeGreaterThan(0)
    })
  })

  it('handles API errors', async () => {
    mockGetProduct.mockRejectedValue(new Error('API Error'))

    render(
      <MockRouter>
        <ProductPage />
      </MockRouter>
    )

    await waitFor(() => {
      expect(screen.getByText('Failed to load product')).toBeInTheDocument()
    })
  })

  it('shows custom error message when no product ID', async () => {
    mockUseParams.mockReturnValue({ id: undefined })

    render(
      <MockRouter>
        <ProductPage />
      </MockRouter>
    )

    await waitFor(() => {
      expect(screen.getByText('Product ID is required')).toBeInTheDocument()
    })
  })
})