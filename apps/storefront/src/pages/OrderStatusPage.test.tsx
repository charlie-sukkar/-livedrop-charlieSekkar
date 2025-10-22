import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { OrderStatusPage } from './orderStatus'
import { BrowserRouter } from 'react-router-dom'

// Mock dependencies
const mockGetOrderStatus = vi.fn()
const mockNavigate = vi.fn()

vi.mock('../lib/api', () => ({
  getOrderStatus: (id: string) => mockGetOrderStatus(id),
}))

// Mock useParams
const mockUseParams = vi.fn()
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return {
    ...actual,
    useNavigate: () => mockNavigate,
    useParams: () => mockUseParams(),
  }
})

// Mock SSE client to prevent connection attempts during tests
vi.mock('../lib/sse-client', () => ({
  OrderSSEClient: vi.fn().mockImplementation(() => ({
    connect: vi.fn(),
    disconnect: vi.fn(),
  })),
}))

// Mock child components
vi.mock('../components/templates/OrderStatusLayout', () => ({
  OrderStatusLayout: ({ header, timeline, shippingInfo, orderDetails }: any) => (
    <div>
      <div data-testid="header">{header}</div>
      <div data-testid="timeline">{timeline}</div>
      <div data-testid="shipping-info">{shippingInfo}</div>
      <div data-testid="order-details">{orderDetails}</div>
    </div>
  )
}))

vi.mock('../components/molecules/SupportButton', () => ({
  SupportButton: () => <div data-testid="support-button">Support</div>
}))

vi.mock('../components/molecules/OrderHeader', () => ({
  OrderHeader: () => <div>Order Header</div>
}))

vi.mock('../components/molecules/OrderTimeline', () => ({
  OrderTimeline: () => <div>Order Timeline</div>
}))

vi.mock('../components/molecules/ShippingInfo', () => ({
  ShippingInfo: () => <div>Shipping Info</div>
}))

vi.mock('../components/organisms/OrderDetails', () => ({
  OrderDetails: () => <div>Order Details</div>
}))

vi.mock('../components/atoms/Button', () => ({
  Button: ({ children, onClick, variant, size, className }: any) => (
    <button 
      onClick={onClick} 
      className={`${variant} ${size} ${className}`}
      data-testid="button"
    >
      {children}
    </button>
  )
}))

vi.mock('../components/atoms/Icon', () => ({
  Icon: ({ className, d }: any) => (
    <svg className={className} data-testid="icon">
      <path d={d} />
    </svg>
  )
}))

const MockRouter = ({ children }: { children: React.ReactNode }) => (
  <BrowserRouter>
    {children}
  </BrowserRouter>
)

describe('OrderStatusPage', () => {
  const mockOrder = {
    _id: 'ORD-123',
    status: 'PROCESSING',
    createdAt: '2024-01-01T00:00:00.000Z',
    carrier: 'UPS',
    estimatedDelivery: '2024-01-15',
    items: [
      {
        productId: '1',
        name: 'Test Product',
        price: 29.99,
        quantity: 2
      }
    ],
    total: 59.98
  }

  beforeEach(() => {
    vi.clearAllMocks()
    mockGetOrderStatus.mockResolvedValue(mockOrder)
    // Default mock for useParams
    mockUseParams.mockReturnValue({ id: 'ORD-123' })
  })

  it('renders loading state initially', () => {
    render(
      <MockRouter>
        <OrderStatusPage />
      </MockRouter>
    )

    expect(screen.getByText('Loading order status...')).toBeInTheDocument()
  })

  it('loads and displays order data', async () => {
    render(
      <MockRouter>
        <OrderStatusPage />
      </MockRouter>
    )

    await waitFor(() => {
      expect(mockGetOrderStatus).toHaveBeenCalledWith('ORD-123')
    })

    await waitFor(() => {
      expect(screen.getByTestId('header')).toBeInTheDocument()
      expect(screen.getByTestId('timeline')).toBeInTheDocument()
      expect(screen.getByTestId('shipping-info')).toBeInTheDocument()
      expect(screen.getByTestId('order-details')).toBeInTheDocument()
    })
  })

  it('navigates to home when back button is clicked', async () => {
    const user = userEvent.setup()
    render(
      <MockRouter>
        <OrderStatusPage />
      </MockRouter>
    )

    // Wait for the order to load
    await waitFor(() => {
      expect(screen.getByText('Back to Home')).toBeInTheDocument()
    })

    // Find and click the back button
    const backButtons = screen.getAllByText('Back to Home')
    await user.click(backButtons[0]) // Click the first back button

    expect(mockNavigate).toHaveBeenCalledWith('/')
  })

  it('shows error state when order not found', async () => {
    mockGetOrderStatus.mockRejectedValue(new Error('Order not found'))

    render(
      <MockRouter>
        <OrderStatusPage />
      </MockRouter>
    )

    await waitFor(() => {
      expect(screen.getByText('Order Not Found')).toBeInTheDocument()
      expect(screen.getByText('Order not found')).toBeInTheDocument()
    })
  })

  it('shows error state when no order ID provided', async () => {
    // Mock useParams to return no ID
    mockUseParams.mockReturnValue({ id: undefined })

    render(
      <MockRouter>
        <OrderStatusPage />
      </MockRouter>
    )

    await waitFor(() => {
      expect(screen.getByText('Order Not Found')).toBeInTheDocument()
      expect(screen.getByText('Order ID is required')).toBeInTheDocument()
    })
  })

  it('renders support button', async () => {
    render(
      <MockRouter>
        <OrderStatusPage />
      </MockRouter>
    )

    await waitFor(() => {
      expect(screen.getByTestId('support-button')).toBeInTheDocument()
    })
  })

  it('shows fallback error message with order ID when no specific error', async () => {
    // Mock useParams to return an ID but getOrderStatus to return no order (null)
    mockUseParams.mockReturnValue({ id: 'ORD-123' })
    mockGetOrderStatus.mockResolvedValue(null) // Simulate no order data returned

    render(
      <MockRouter>
        <OrderStatusPage />
      </MockRouter>
    )

    await waitFor(() => {
      expect(screen.getByText('Order Not Found')).toBeInTheDocument()
      // This should show the fallback message with order ID
      expect(screen.getByText(/ORD-123/)).toBeInTheDocument()
    })
  })

  it('handles different order statuses correctly', async () => {
    const deliveredOrder = {
      ...mockOrder,
      status: 'DELIVERED'
    }
    mockGetOrderStatus.mockResolvedValue(deliveredOrder)

    render(
      <MockRouter>
        <OrderStatusPage />
      </MockRouter>
    )

    await waitFor(() => {
      expect(screen.getByTestId('header')).toBeInTheDocument()
      expect(screen.getByTestId('timeline')).toBeInTheDocument()
    })
  })

  it('displays multiple back to home buttons', async () => {
    render(
      <MockRouter>
        <OrderStatusPage />
      </MockRouter>
    )

    await waitFor(() => {
      const backButtons = screen.getAllByText('Back to Home')
      expect(backButtons.length).toBeGreaterThan(0)
    })
  })

  it('shows order ID in fallback error when both error and order are null', async () => {
    // This tests the fallback case in the component
    mockUseParams.mockReturnValue({ id: 'ORD-123' })
    mockGetOrderStatus.mockResolvedValue(null) // No order data

    render(
      <MockRouter>
        <OrderStatusPage />
      </MockRouter>
    )

    await waitFor(() => {
      expect(screen.getByText('Order Not Found')).toBeInTheDocument()
      // The fallback message should show the order ID
      const errorMessage = screen.getByText((content, element) => {
        return element?.tagName === 'P' && content.includes('ORD-123')
      })
      expect(errorMessage).toBeInTheDocument()
    })
  })
})