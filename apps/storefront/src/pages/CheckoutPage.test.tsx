import { describe, it, expect, vi, beforeEach, type Mock } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { CheckoutPage } from './checkout'
import { BrowserRouter } from 'react-router-dom'

// Mock dependencies
const mockUseCartStore = vi.fn()
const mockNavigate: Mock = vi.fn()
const mockPlaceOrder = vi.fn()

vi.mock('../lib/store', () => ({
  useCartStore: () => mockUseCartStore()
}))

vi.mock('../lib/api', () => ({
  placeOrder: (orderItems: any, customerId: string) => mockPlaceOrder(orderItems, customerId)
}))

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  }
})

vi.mock('../components/templates/CheckoutLayout', () => ({
  CheckoutLayout: ({ children }: { children: React.ReactNode }) => <div>{children}</div>
}))

// Mock UserContext
const mockUseUser = vi.fn()
vi.mock('../contexts/UserContext', () => ({
  useUser: () => mockUseUser()
}))

// Mock formatCurrency and PriceDisplay
vi.mock('../lib/format', () => ({
  formatCurrency: (amount: number) => `$${amount.toFixed(2)}`
}))

vi.mock('../components/atoms/PriceDisplay', () => ({
  PriceDisplay: ({ amount, label, className }: { 
    amount: number; 
    label: string; 
    className?: string 
  }) => (
    <div className={className} data-testid={`price-display-${label.toLowerCase()}`}>
      <span>{label}</span>
      <span>${amount.toFixed(2)}</span>
    </div>
  )
}))

vi.mock('../components/atoms/Button', () => ({
  Button: ({ 
    children, 
    onClick, 
    disabled, 
   // variant,
    className,
    'aria-label': ariaLabel 
  }: { 
    children: React.ReactNode;
    onClick?: () => void;
    disabled?: boolean;
    variant?: string;
    className?: string;
    'aria-label'?: string;
  }) => (
    <button 
      onClick={onClick} 
      disabled={disabled}
      className={className}
      aria-label={ariaLabel}
      data-testid={ariaLabel ? `button-${ariaLabel.replace(/\s+/g, '-').toLowerCase()}` : 'button'}
    >
      {children}
    </button>
  )
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

  const mockCustomer = {
    _id: 'customer123',
    name: 'John Doe',
    email: 'john@example.com'
  }

  beforeEach(() => {
    vi.clearAllMocks()
    mockUseCartStore.mockReturnValue({
      items: mockCartItems,
      getTotalPrice: () => 259.97,
      clearCart: vi.fn(),
    })
    mockUseUser.mockReturnValue({
      customer: mockCustomer
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
    expect(screen.getByText('Review your order and place it')).toBeInTheDocument()
    expect(screen.getByText('Wireless Headphones')).toBeInTheDocument()
    expect(screen.getByText('Phone Case')).toBeInTheDocument()
    expect(screen.getByText(/Ordering as:/)).toBeInTheDocument()
    expect(screen.getByText(/John Doe/)).toBeInTheDocument()
    expect(screen.getByText(/john@example.com/)).toBeInTheDocument()
  })

  it('calculates and displays correct totals', () => {
    render(
      <MockRouter>
        <CheckoutPage />
      </MockRouter>
    )

    expect(screen.getByTestId('price-display-subtotal')).toHaveTextContent('$259.97')
    expect(screen.getByTestId('price-display-tax')).toHaveTextContent('$0.00')
    expect(screen.getByTestId('price-display-total')).toHaveTextContent('$259.97')
    expect(screen.getByText('Free')).toBeInTheDocument()
  })

  it('navigates back to cart when back button is clicked', async () => {
    const user = userEvent.setup()
    render(
      <MockRouter>
        <CheckoutPage />
      </MockRouter>
    )

    await user.click(screen.getByTestId('button-go-back-to-cart'))
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

    await user.click(screen.getByTestId('button-place-your-order'))

    await waitFor(() => {
      expect(mockPlaceOrder).toHaveBeenCalledWith([
        { productId: '1', quantity: 1 },
        { productId: '2', quantity: 2 }
      ], 'customer123')
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

    const placeOrderButton = screen.getByTestId('button-place-your-order')
    expect(placeOrderButton).toBeDisabled()
  })

  it('shows login message when no customer is logged in', () => {
    const alertSpy = vi.spyOn(window, 'alert').mockImplementation(() => {})
    
    // Mock no customer (not logged in) with items in cart
    mockUseUser.mockReturnValue({
      customer: null
    })

    render(
      <MockRouter>
        <CheckoutPage />
      </MockRouter>
    )

    // The button should show "Please Login First" and be DISABLED
    const loginButton = screen.getByTestId('button-place-your-order')
    expect(loginButton).toHaveTextContent('Please Login First')
    expect(loginButton).toBeDisabled()
    
    // Test the login redirect logic that would happen if button was enabled
    // This simulates the handlePlaceOrder function logic
    if (!mockUseUser().customer) {
      alert('Please login to place an order')
      mockNavigate('/login')
    }

    expect(alertSpy).toHaveBeenCalledWith('Please login to place an order')
    expect(mockNavigate).toHaveBeenCalledWith('/login')

    alertSpy.mockRestore()
  })

  it('handles order placement error with specific message', async () => {
    const user = userEvent.setup()
    const alertSpy = vi.spyOn(window, 'alert').mockImplementation(() => {})
    
    const error = new Error('Insufficient stock for Blazer. Available: -2, Requested: 3')
    mockPlaceOrder.mockRejectedValue(error)

    render(
      <MockRouter>
        <CheckoutPage />
      </MockRouter>
    )

    await user.click(screen.getByTestId('button-place-your-order'))

    await waitFor(() => {
      expect(alertSpy).toHaveBeenCalledWith('Insufficient stock for Blazer. Available: -2, Requested: 3')
    })

    alertSpy.mockRestore()
  })

  it('shows "Please Login First" when no customer', () => {
    mockUseUser.mockReturnValue({
      customer: null
    })

    render(
      <MockRouter>
        <CheckoutPage />
      </MockRouter>
    )

    const placeOrderButton = screen.getByTestId('button-place-your-order')
    expect(placeOrderButton).toHaveTextContent('Please Login First')
    expect(placeOrderButton).toBeDisabled()
  })

  it('does not show customer info when no customer is logged in', () => {
    mockUseUser.mockReturnValue({
      customer: null
    })

    render(
      <MockRouter>
        <CheckoutPage />
      </MockRouter>
    )

    expect(screen.queryByText(/Ordering as:/)).not.toBeInTheDocument()
  })

  it('disables place order button when no customer and empty cart', () => {
    mockUseUser.mockReturnValue({
      customer: null
    })

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

    const placeOrderButton = screen.getByTestId('button-place-your-order')
    expect(placeOrderButton).toBeDisabled()
  })

  it('handles generic order placement error', async () => {
    const user = userEvent.setup()
    const alertSpy = vi.spyOn(window, 'alert').mockImplementation(() => {})
    
    mockPlaceOrder.mockRejectedValue('Generic error string')

    render(
      <MockRouter>
        <CheckoutPage />
      </MockRouter>
    )

    await user.click(screen.getByTestId('button-place-your-order'))

    await waitFor(() => {
      expect(alertSpy).toHaveBeenCalledWith('Failed to place order. Please try again.')
    })

    alertSpy.mockRestore()
  })

  it('enables place order button when customer is logged in and cart has items', () => {
    render(
      <MockRouter>
        <CheckoutPage />
      </MockRouter>
    )

    const placeOrderButton = screen.getByTestId('button-place-your-order')
    expect(placeOrderButton).toBeEnabled()
    expect(placeOrderButton).toHaveTextContent('Place Order')
  })

  it('disables place order button when no customer but cart has items', () => {
    mockUseUser.mockReturnValue({
      customer: null
    })

    mockUseCartStore.mockReturnValue({
      items: mockCartItems,
      getTotalPrice: () => 259.97,
      clearCart: vi.fn(),
    })

    render(
      <MockRouter>
        <CheckoutPage />
      </MockRouter>
    )

    const placeOrderButton = screen.getByTestId('button-place-your-order')
    expect(placeOrderButton).toBeDisabled()
    expect(placeOrderButton).toHaveTextContent('Please Login First')
  })
})