import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { CartPage } from './cart'
import { BrowserRouter } from 'react-router-dom'

// Mock store and components
const mockUseCartStore = vi.fn()
const mockNavigate = vi.fn()

vi.mock('../lib/store', () => ({
  useCartStore: () => mockUseCartStore()
}))

vi.mock('react-router-dom', async () => ({
  ...(await vi.importActual('react-router-dom')),
  useNavigate: () => mockNavigate,
}))

vi.mock('../components/templates/CartLayout', () => ({
  CartLayout: ({ children }: { children: React.ReactNode }) => <div>{children}</div>
}))

vi.mock('../components/molecules/CartItem', () => ({
  CartItem: ({ item }: { item: any }) => <div data-testid="cart-item">{item.title}</div>
}))

vi.mock('../components/molecules/CartFooter', () => ({
  CartFooter: () => <div data-testid="cart-footer">Cart Footer</div>
}))

vi.mock('../components/molecules/EmptyCartState', () => ({
  EmptyCartState: ({ onButtonClick }: { onButtonClick: () => void }) => (
    <button onClick={onButtonClick} data-testid="empty-cart">Empty Cart</button>
  )
}))

const MockRouter = ({ children }: { children: React.ReactNode }) => (
  <BrowserRouter>{children}</BrowserRouter>
)

describe('CartPage', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders empty state when cart is empty', () => {
    mockUseCartStore.mockReturnValue({
      items: [],
      getTotalPrice: () => 0,
    })

    render(
      <MockRouter>
        <CartPage />
      </MockRouter>
    )

    expect(screen.getByTestId('empty-cart')).toBeInTheDocument()
  })

  it('renders cart items when cart has items', () => {
    mockUseCartStore.mockReturnValue({
      items: [
        {
          productId: '1',
          title: 'Test Product',
          price: 29.99,
          quantity: 2,
          image: 'test.jpg',
          stockQty: 10
        }
      ],
      updateQuantity: vi.fn(),
      removeItem: vi.fn(),
      clearCart: vi.fn(),
      getTotalPrice: () => 59.98,
    })

    render(
      <MockRouter>
        <CartPage />
      </MockRouter>
    )

    expect(screen.getByText('Shopping Cart')).toBeInTheDocument()
    expect(screen.getByTestId('cart-item')).toBeInTheDocument()
    expect(screen.getByTestId('cart-footer')).toBeInTheDocument()
  })

  it('navigates to home when continue shopping is clicked', async () => {
    const user = userEvent.setup()
    mockUseCartStore.mockReturnValue({
      items: [
        {
          productId: '1',
          title: 'Test Product',
          price: 29.99,
          quantity: 1,
          image: 'test.jpg',
          stockQty: 10
        }
      ],
      updateQuantity: vi.fn(),
      removeItem: vi.fn(),
      clearCart: vi.fn(),
      getTotalPrice: () => 29.99,
    })

    render(
      <MockRouter>
        <CartPage />
      </MockRouter>
    )

    await user.click(screen.getByText('← Continue Shopping'))
    expect(mockNavigate).toHaveBeenCalledWith('/')
  })

  it('shows correct item count', () => {
    mockUseCartStore.mockReturnValue({
      items: [
        {
          productId: '1',
          title: 'Test Product',
          price: 29.99,
          quantity: 2,
          image: 'test.jpg',
          stockQty: 10
        }
      ],
      updateQuantity: vi.fn(),
      removeItem: vi.fn(),
      clearCart: vi.fn(),
      getTotalPrice: () => 59.98,
    })

    render(
      <MockRouter>
        <CartPage />
      </MockRouter>
    )

    expect(screen.getByText('1 item in your cart')).toBeInTheDocument()
  })

  it('handles multiple items count correctly', () => {
    mockUseCartStore.mockReturnValue({
      items: [
        {
          productId: '1',
          title: 'Product 1',
          price: 29.99,
          quantity: 1,
          image: 'test1.jpg',
          stockQty: 10
        },
        {
          productId: '2',
          title: 'Product 2',
          price: 39.99,
          quantity: 1,
          image: 'test2.jpg',
          stockQty: 5
        }
      ],
      updateQuantity: vi.fn(),
      removeItem: vi.fn(),
      clearCart: vi.fn(),
      getTotalPrice: () => 69.98,
    })

    render(
      <MockRouter>
        <CartPage />
      </MockRouter>
    )

    expect(screen.getByText('2 items in your cart')).toBeInTheDocument()
  })
})