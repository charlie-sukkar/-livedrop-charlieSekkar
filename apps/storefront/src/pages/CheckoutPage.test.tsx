import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { CheckoutPage } from './checkout'
import { BrowserRouter } from 'react-router-dom'

// Mock dependencies
const mockUseCartStore = vi.fn()
const mockNavigate = vi.fn()
const mockPlaceOrder = vi.fn()

vi.mock('../lib/store', () => ({
  useCartStore: () => mockUseCartStore()
}))

vi.mock('../lib/api', () => ({
  placeOrder: (orderItems: any) => mockPlaceOrder(orderItems)
}))

vi.mock('react-router-dom', async () => ({
  ...(await vi.importActual('react-router-dom')),
  useNavigate: () => mockNavigate,
}))

vi.mock('../components/templates/CheckoutLayout', () => ({
  CheckoutLayout: ({ children }: { children: React.ReactNode }) => <div>{children}</div>
}))

const MockRouter = ({ children }: { children: React.ReactNode }) => (
  <BrowserRouter>{children}</BrowserRouter>
)

describe('CheckoutPage', () => {
  const mockCartItems = [
    {
      productId: '1',
      title: 'Wireless Headphones',
      price: 199.99,
      quantity: 1,
      image: '/headphones.jpg',
      stockQty: 10
    },
    {
      productId: '2',
      title: 'Phone Case',
      price: 29.99,
      quantity: 2,
      image: '/case.jpg',
      stockQty: 50
    }
  ]

  beforeEach(() => {
    vi.clearAllMocks()
    mockUseCartStore.mockReturnValue({
      items: mockCartItems,
      getTotalPrice: () => 259.97,
      clearCart: vi.fn(),
    })
    mockPlaceOrder.mockResolvedValue({ orderId: 'ORD-123' })
  })

  it('renders checkout page with order summary', () => {
    render(
      <MockRouter>
        <CheckoutPage />
      </MockRouter>
    )

    expect(screen.getByText('Checkout')).toBeInTheDocument()
    expect(screen.getByText('Wireless Headphones')).toBeInTheDocument()
    expect(screen.getByText('Phone Case')).toBeInTheDocument()
  })

  it('calculates and displays correct totals', () => {
    render(
      <MockRouter>
        <CheckoutPage />
      </MockRouter>
    )

    // Use getAllByText and check the last one (Total)
    const totalElements = screen.getAllByText('$259.97')
    expect(totalElements[totalElements.length - 1]).toBeInTheDocument()
    expect(screen.getByText('Free')).toBeInTheDocument()
  })

  it('navigates back to cart when back button is clicked', async () => {
    const user = userEvent.setup()
    render(
      <MockRouter>
        <CheckoutPage />
      </MockRouter>
    )

    await user.click(screen.getByText('← Back to Cart'))
    expect(mockNavigate).toHaveBeenCalledWith('/cart')
  })

  it('places order and navigates to confirmation', async () => {
    const user = userEvent.setup()
    const mockClearCart = vi.fn()
    
    mockUseCartStore.mockReturnValue({
      items: mockCartItems,
      getTotalPrice: () => 259.97,
      clearCart: mockClearCart,
    })

    render(
      <MockRouter>
        <CheckoutPage />
      </MockRouter>
    )

    await user.click(screen.getByText('Place Order'))

    await waitFor(() => {
      expect(mockPlaceOrder).toHaveBeenCalledWith([
        { productId: '1', quantity: 1 },
        { productId: '2', quantity: 2 }
      ])
    })

    await waitFor(() => {
      expect(mockClearCart).toHaveBeenCalled()
      expect(mockNavigate).toHaveBeenCalledWith('/order/ORD-123')
    })
  })

  it('disables place order button when cart is empty', () => {
    mockUseCartStore.mockReturnValue({
      items: [],
      getTotalPrice: () => 0,
      clearCart: vi.fn(),
    })

    render(
      <MockRouter>
        <CheckoutPage />
      </MockRouter>
    )

    expect(screen.getByText('Place Order')).toBeDisabled()
  })

  it('handles order placement error', async () => {
    const user = userEvent.setup()
    const alertSpy = vi.spyOn(window, 'alert').mockImplementation(() => {})
    
    mockPlaceOrder.mockRejectedValue(new Error('API Error'))

    render(
      <MockRouter>
        <CheckoutPage />
      </MockRouter>
    )

    await user.click(screen.getByText('Place Order'))

    await waitFor(() => {
      expect(alertSpy).toHaveBeenCalledWith('Failed to place order. Please try again.')
    })

    alertSpy.mockRestore()
  })
})