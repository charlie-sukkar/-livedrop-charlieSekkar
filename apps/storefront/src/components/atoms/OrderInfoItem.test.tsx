import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { OrderInfoItem } from './OrderInfoItem';

describe('OrderInfoItem', () => {
  it('renders label and value', () => {
    render(<OrderInfoItem label="Order ID" value="ORD-123" />);
    expect(screen.getByText('Order ID')).toBeInTheDocument();
    expect(screen.getByText('ORD-123')).toBeInTheDocument();
  });

  it('handles different value types', () => {
    render(<OrderInfoItem label="Quantity" value={5} />);
    expect(screen.getByText('5')).toBeInTheDocument();
  });

  it('renders React nodes', () => {
    const value = <span data-testid="badge">Completed</span>;
    render(<OrderInfoItem label="Status" value={value} />);
    expect(screen.getByTestId('badge')).toBeInTheDocument();
  });

  it('applies custom className', () => {
    render(<OrderInfoItem label="Total" value="$100" className="mt-4" />);
    const container = screen.getByText('Total').closest('div');
    expect(container).toHaveClass('mt-4');
  });

  it('has correct styling', () => {
    render(<OrderInfoItem label="Label" value="Value" />);
    
    const label = screen.getByText('Label');
    const value = screen.getByText('Value');
    
    expect(label).toHaveClass('text-gray-500', 'min-w-[120px]');
    expect(value).toHaveClass('text-gray-900', 'flex-1');
  });
});