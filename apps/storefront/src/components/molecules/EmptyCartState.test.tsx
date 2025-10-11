import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { EmptyCartState } from './EmptyCartState';

// Mock dependencies
vi.mock('../atoms/Button', () => ({
  Button: vi.fn(({ children, onClick, ...props }) => (
    <button onClick={onClick} {...props}>{children}</button>
  )),
}));

vi.mock('../atoms/Icon', () => ({
  Icon: vi.fn((props) => <svg {...props} />),
}));

describe('EmptyCartState', () => {
  it('displays default title and message', () => {
    render(<EmptyCartState />);
    
    expect(screen.getByText('Your cart is empty')).toBeInTheDocument();
    expect(screen.getByText('Start adding some products!')).toBeInTheDocument();
  });

  it('displays custom title and message', () => {
    render(
      <EmptyCartState 
        title="No items found" 
        message="Try searching for something else" 
      />
    );
    
    expect(screen.getByText('No items found')).toBeInTheDocument();
    expect(screen.getByText('Try searching for something else')).toBeInTheDocument();
  });

  it('shows button when showButton is true and onButtonClick provided', async () => {
    const onButtonClick = vi.fn();
    const user = userEvent.setup();
    
    render(
      <EmptyCartState 
        showButton={true}
        onButtonClick={onButtonClick}
        buttonText="Shop Now"
      />
    );
    
    const button = screen.getByText('Shop Now');
    expect(button).toBeInTheDocument();
    
    await user.click(button);
    expect(onButtonClick).toHaveBeenCalledOnce();
  });

  it('hides button when showButton is false', () => {
    render(<EmptyCartState showButton={false} onButtonClick={() => {}} />);
    
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });

  it('hides button when onButtonClick is not provided', () => {
    render(<EmptyCartState showButton={true} />);
    
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });

  it('applies custom className', () => {
    render(<EmptyCartState className="custom-class" />);
    
    const container = screen.getByText('Your cart is empty').closest('div');
    expect(container).toHaveClass('custom-class');
  });

  it('has proper accessibility attributes', () => {
    render(<EmptyCartState />);
    
    const container = screen.getByText('Your cart is empty').closest('div');
    expect(container).toHaveAttribute('role', 'status');
    expect(container).toHaveAttribute('aria-label', 'Your cart is empty');
  });
});