import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { SupportPanel } from './SupportPanel';

// Mock child components
vi.mock('../molecules/SupportChat', () => ({
  SupportChat: () => <div data-testid="support-chat">Support Chat</div>,
}));

describe('SupportPanel', () => {
  const mockOnClose = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('does not render when closed', () => {
    render(<SupportPanel isOpen={false} onClose={mockOnClose} />);
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('renders when open', () => {
    render(<SupportPanel isOpen={true} onClose={mockOnClose} />);
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByLabelText('Support assistant')).toBeInTheDocument();
    expect(screen.getByText('Support Assistant')).toBeInTheDocument();
  });

  it('calls onClose when close button is clicked', async () => {
    const user = userEvent.setup();
    render(<SupportPanel isOpen={true} onClose={mockOnClose} />);
    await user.click(screen.getByLabelText(/close support panel/i));
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it('calls onClose when Escape key is pressed', async () => {
    const user = userEvent.setup();
    render(<SupportPanel isOpen={true} onClose={mockOnClose} />);
    await user.keyboard('{Escape}');
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it('renders support chat component', () => {
    render(<SupportPanel isOpen={true} onClose={mockOnClose} />);
    expect(screen.getByTestId('support-chat')).toBeInTheDocument();
  });

  it('has proper accessibility attributes', () => {
    render(<SupportPanel isOpen={true} onClose={mockOnClose} />);
    const dialog = screen.getByRole('dialog');
    expect(dialog).toHaveAttribute('aria-modal', 'true');
    expect(dialog).toHaveAttribute('aria-label', 'Support assistant');
  });
});