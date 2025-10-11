import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { CartButton } from './CartButton';

// Mock the store and dependencies
vi.mock('../../lib/store', () => ({
  useCartStore: vi.fn(),
}));

vi.mock('../atoms/Button', () => ({
  Button: vi.fn(({ children, ...props }) => (
    <button {...props}>{children}</button>
  )),
}));

vi.mock('../atoms/Icon', () => ({
  Icon: vi.fn((props) => <svg {...props} />),
}));

const { useCartStore } = await import('../../lib/store');

describe('CartButton', () => {
  const mockOpenCart = vi.fn();
  const mockGetTotalItems = vi.fn();

  beforeEach(() => {
    vi.mocked(useCartStore).mockReturnValue({
      openCart: mockOpenCart,
      getTotalItems: mockGetTotalItems,
    });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('opens cart when clicked', async () => {
    mockGetTotalItems.mockReturnValue(0);
    const user = userEvent.setup();
    
    render(<CartButton />);
    await user.click(screen.getByRole('button'));
    
    expect(mockOpenCart).toHaveBeenCalledOnce();
  });

  it('shows item count when cart has items', () => {
    mockGetTotalItems.mockReturnValue(3);
    
    render(<CartButton />);
    
    expect(screen.getByText('3')).toBeInTheDocument();
    expect(screen.getByLabelText('Open cart with 3 items')).toBeInTheDocument();
  });

  it('hides item count when cart is empty', () => {
    mockGetTotalItems.mockReturnValue(0);
    
    render(<CartButton />);
    
    expect(screen.queryByText('0')).not.toBeInTheDocument();
    expect(screen.getByLabelText('Open cart with 0 items')).toBeInTheDocument();
  });

  it('applies custom className', () => {
    mockGetTotalItems.mockReturnValue(0);
    
    render(<CartButton className="custom-class" />);
    
    expect(screen.getByRole('button')).toHaveClass('custom-class');
  });

  it('passes disabled prop to button', () => {
    mockGetTotalItems.mockReturnValue(0);
    
    render(<CartButton disabled={true} />);
    
    expect(screen.getByRole('button')).toBeDisabled();
  });
});