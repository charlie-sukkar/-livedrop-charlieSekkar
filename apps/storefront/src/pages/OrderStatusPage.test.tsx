import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { OrderStatusPage } from './orderStatus' // Fixed import path
import { BrowserRouter } from 'react-router-dom'

// Mock dependencies
const mockGetOrderStatus = vi.fn()
const mockSeedOrder = vi.fn()
const mockNavigate = vi.fn()

vi.mock('../lib/api', () => ({
  getOrderStatus: (id: string) => mockGetOrderStatus(id),
  seedOrder: (id: string, status: string, carrier?: string, eta?: string) => mockSeedOrder(id, status, carrier, eta)
}))

vi.mock('react-router-dom', async () => ({
  ...(await vi.importActual('react-router-dom')),
  useNavigate: () => mockNavigate,
  useParams: () => ({ id: 'ORD-123' }),
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

const MockRouter = ({ children }: { children: React.ReactNode }) => (
  <BrowserRouter>
    {children}
  </BrowserRouter>
)

describe('OrderStatusPage', () => {
  const mockOrder = {
    status: 'Processing',
    createdAt: 1700000000000,
    carrier: 'UPS',
    eta: '2024-01-15'
  }

  beforeEach(() => {
    vi.clearAllMocks()
    mockGetOrderStatus.mockResolvedValue(mockOrder)
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

    await waitFor(() => {
      expect(screen.getByText('Back to Home')).toBeInTheDocument()
    })

    await user.click(screen.getByText('Back to Home'))
    expect(mockNavigate).toHaveBeenCalledWith('/')
  })

  it('shows error state when order not found', async () => {
    mockGetOrderStatus.mockRejectedValue(new Error('Not found'))

    render(
      <MockRouter>
        <OrderStatusPage />
      </MockRouter>
    )

    await waitFor(() => {
      expect(screen.getByText('Order Not Found')).toBeInTheDocument()
      expect(screen.getByText('Failed to fetch order status')).toBeInTheDocument()
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

  it('shows demo controls and updates status', async () => {
    const user = userEvent.setup()
    const updatedOrder = { ...mockOrder, status: 'Shipped' }
    mockGetOrderStatus.mockResolvedValueOnce(mockOrder).mockResolvedValueOnce(updatedOrder)

    render(
      <MockRouter>
        <OrderStatusPage />
      </MockRouter>
    )

    await waitFor(() => {
      expect(screen.getByText('Demo Controls')).toBeInTheDocument()
      expect(screen.getByText('Mark as Shipped')).toBeInTheDocument()
    })

    await user.click(screen.getByText('Mark as Shipped'))

    await waitFor(() => {
      expect(mockSeedOrder).toHaveBeenCalledWith('ORD-123', 'Shipped', 'UPS', 'Tomorrow')
    })
  })
})