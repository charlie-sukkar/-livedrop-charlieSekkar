import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { PanelHeader } from './PanelHeader';
import { Icon } from '../atoms/Icon';

describe('PanelHeader', () => {
  const mockOnClose = vi.fn();

  it('renders with default cart variant', () => {
    render(<PanelHeader title="Shopping Cart" onClose={mockOnClose} />);
    expect(screen.getByText('Shopping Cart')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /close cart panel/i })).toBeInTheDocument();
  });

  it('renders with support variant and icon', () => {
    render(
      <PanelHeader
        title="Support Assistant"
        onClose={mockOnClose}
        variant="support"
        icon={<Icon className="h-6 w-6 text-white" d="M8 8h8v8H8z" />}
      />
    );
    expect(screen.getByText('Support Assistant')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /close support panel/i })).toBeInTheDocument();
  });

  it('calls onClose when close button is clicked', async () => {
    const user = userEvent.setup();
    render(<PanelHeader title="Cart" onClose={mockOnClose} />);
    await user.click(screen.getByRole('button', { name: /close cart panel/i }));
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });
});