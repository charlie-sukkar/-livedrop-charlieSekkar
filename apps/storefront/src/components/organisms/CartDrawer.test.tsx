import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { CartDrawer } from './CartDrawer';
import { BrowserRouter } from 'react-router-dom';

// Mock dependencies
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => ({
  ...(await vi.importActual('react-router-dom')),
  useNavigate: () => mockNavigate,
}));

// Mock store
vi.mock('../../../lib/store', () => ({
  useCartStore: () => ({
    items: [],
    updateQuantity: vi.fn(),
    removeItem: vi.fn(),
    getTotalPrice: () => 0,
    clearCart: vi.fn(),
  }),
}));

const MockRouter = ({ children }: { children: React.ReactNode }) => (
  <BrowserRouter>{children}</BrowserRouter>
);

describe('CartDrawer', () => {
  const mockOnClose = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders when open and shows empty state', () => {
    render(
      <MockRouter>
        <CartDrawer isOpen={true} onClose={mockOnClose} />
      </MockRouter>
    );

    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByText('Shopping Cart')).toBeInTheDocument();
    expect(screen.getByText(/your cart is empty/i)).toBeInTheDocument();
  });

  it('does not render when closed', () => {
    render(
      <MockRouter>
        <CartDrawer isOpen={false} onClose={mockOnClose} />
      </MockRouter>
    );

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('closes when close button is clicked', async () => {
    const user = userEvent.setup();
    render(
      <MockRouter>
        <CartDrawer isOpen={true} onClose={mockOnClose} />
      </MockRouter>
    );

    await user.click(screen.getByLabelText('Close cart panel'));
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it('closes when escape key is pressed', async () => {
    const user = userEvent.setup();
    render(
      <MockRouter>
        <CartDrawer isOpen={true} onClose={mockOnClose} />
      </MockRouter>
    );

    await user.keyboard('{Escape}');
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it('has proper accessibility attributes', () => {
    render(
      <MockRouter>
        <CartDrawer isOpen={true} onClose={mockOnClose} />
      </MockRouter>
    );

    const dialog = screen.getByRole('dialog');
    expect(dialog).toHaveAttribute('aria-modal', 'true');
    expect(dialog).toHaveAttribute('aria-label', 'Shopping cart');
  });
});