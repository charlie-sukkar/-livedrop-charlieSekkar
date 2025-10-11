import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import '@testing-library/jest-dom';
import { Button } from './Button';



describe('Button', () => {
  it('renders with default props', () => {
    render(<Button>Click me</Button>);
    
    const button = screen.getByRole('button', { name: 'Click me' });
    
    expect(button).toBeInTheDocument();
    expect(button).toHaveClass('bg-blue-600'); // primary variant
    expect(button).toHaveClass('h-10 px-4 py-2'); // md size
  });

  it('renders with different variants', () => {
    const { rerender } = render(<Button variant="primary">Primary</Button>);
    expect(screen.getByRole('button')).toHaveClass('bg-blue-600');

    rerender(<Button variant="secondary">Secondary</Button>);
    expect(screen.getByRole('button')).toHaveClass('bg-gray-200');

    rerender(<Button variant="outline">Outline</Button>);
    expect(screen.getByRole('button')).toHaveClass('border border-gray-300');

    rerender(<Button variant="ghost">Ghost</Button>);
    expect(screen.getByRole('button')).toHaveClass('bg-transparent');
  });

  it('renders with different sizes', () => {
    const { rerender } = render(<Button size="sm">Small</Button>);
    expect(screen.getByRole('button')).toHaveClass('h-8 px-3 text-xs');

    rerender(<Button size="md">Medium</Button>);
    expect(screen.getByRole('button')).toHaveClass('h-10 px-4 py-2');

    rerender(<Button size="lg">Large</Button>);
    expect(screen.getByRole('button')).toHaveClass('h-12 px-6 text-lg');

    rerender(<Button size="icon">Icon</Button>);
    expect(screen.getByRole('button')).toHaveClass('h-10 w-10');
  });

  it('handles click events', () => {
    const handleClick = vi.fn();
    render(<Button onClick={handleClick}>Clickable</Button>);
    
    const button = screen.getByRole('button');
    fireEvent.click(button);
    
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('applies custom className', () => {
    render(<Button className="custom-class">Custom</Button>);
    
    const button = screen.getByRole('button');
    expect(button).toHaveClass('custom-class');
    expect(button).toHaveClass('bg-blue-600'); // still has base classes
  });

  it('forwards ref correctly', () => {
    const ref = vi.fn();
    render(<Button ref={ref}>Ref</Button>);
    
    expect(ref).toHaveBeenCalledWith(screen.getByRole('button'));
  });

  it('applies disabled state', () => {
    const handleClick = vi.fn();
    render(<Button disabled onClick={handleClick}>Disabled</Button>);
    
    const button = screen.getByRole('button');
    expect(button).toBeDisabled();
    expect(button).toHaveClass('disabled:opacity-50');
    expect(button).toHaveClass('disabled:pointer-events-none');
    
    fireEvent.click(button);
    expect(handleClick).not.toHaveBeenCalled();
  });

  it('passes through other button attributes', () => {
    render(
      <Button type="submit" aria-label="Submit form" data-testid="test-button">
        Submit
      </Button>
    );
    
    const button = screen.getByRole('button');
    expect(button).toHaveAttribute('type', 'submit');
    expect(button).toHaveAttribute('aria-label', 'Submit form');
    expect(button).toHaveAttribute('data-testid', 'test-button');
  });

  it('has correct display name', () => {
    expect(Button.displayName).toBe('Button');
  });
});