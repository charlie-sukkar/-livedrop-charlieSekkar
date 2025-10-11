import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { SupportChat } from './SupportChat';

// Mock scrollIntoView
Object.defineProperty(HTMLElement.prototype, 'scrollIntoView', {
  value: vi.fn(),
  writable: true
});

// Mock dependencies
vi.mock('../../assistant/engine', () => ({
  processUserQuery: vi.fn(),
}));

vi.mock('../atoms/Button', () => ({
  Button: vi.fn(({ children, onClick, disabled, type, 'aria-label': ariaLabel }) => (
    <button onClick={onClick} disabled={disabled} type={type} aria-label={ariaLabel}>
      {children}
    </button>
  )),
}));

vi.mock('../atoms/Input', () => ({
  Input: vi.fn(({ value, onChange, placeholder, disabled, 'aria-label': ariaLabel }) => (
    <input 
      value={value} 
      onChange={onChange} 
      placeholder={placeholder} 
      disabled={disabled}
      aria-label={ariaLabel}
    />
  )),
}));

vi.mock('../atoms/MessageBubble', () => ({
  MessageBubble: vi.fn(({ message, isUser }) => (
    <div data-testid="message-bubble" data-is-user={isUser}>
      {message}
    </div>
  )),
}));

const mockProcessUserQuery = vi.mocked(await import('../../assistant/engine')).processUserQuery;

describe('SupportChat', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('displays initial welcome message', () => {
    render(<SupportChat />);
    
    expect(screen.getByText(/Hello! I'm your support assistant/)).toBeInTheDocument();
  });

  it('sends user message and receives response', async () => {
    const user = userEvent.setup();
    mockProcessUserQuery.mockResolvedValue({
      answer: 'Here is the answer to your question',
      citation: 'Help Article 1',
      confidence: 0.9
    });

    render(<SupportChat />);
    
    const input = screen.getByPlaceholderText('Type your question here...');
    const sendButton = screen.getByText('Send');
    
    await user.type(input, 'How do I track my order?');
    await user.click(sendButton);

    // Check user message appears immediately
    await waitFor(() => {
      const messageBubbles = screen.getAllByTestId('message-bubble');
      const userMessage = messageBubbles.find(bubble => 
        bubble.textContent?.includes('How do I track my order?')
      );
      expect(userMessage).toBeInTheDocument();
    });
    
    // Wait for bot response
    await waitFor(() => {
      expect(screen.getByText('Here is the answer to your question')).toBeInTheDocument();
    });
  });

  it('disables input and button while loading', async () => {
    const user = userEvent.setup();
    mockProcessUserQuery.mockImplementation(() => new Promise(resolve => setTimeout(resolve, 100)));

    render(<SupportChat />);
    
    const input = screen.getByPlaceholderText('Type your question here...');
    const sendButton = screen.getByText('Send');
    
    await user.type(input, 'Test question');
    await user.click(sendButton);

    expect(input).toBeDisabled();
    expect(sendButton).toBeDisabled();
  });

  it('handles empty input submission', async () => {
    const user = userEvent.setup();
    render(<SupportChat />);
    
    const sendButton = screen.getByText('Send');
    await user.click(sendButton);

    expect(mockProcessUserQuery).not.toHaveBeenCalled();
  });

  it('clears input after sending message', async () => {
    const user = userEvent.setup();
    mockProcessUserQuery.mockResolvedValue({
      answer: 'Response',
      citation: undefined,
      confidence: 0.8
    });

    render(<SupportChat />);
    
    const input = screen.getByPlaceholderText('Type your question here...') as HTMLInputElement;
    await user.type(input, 'Test question');
    await user.click(screen.getByText('Send'));

    expect(input.value).toBe('');
  });

  it('has proper accessibility attributes', () => {
    render(<SupportChat />);
    
    expect(screen.getByLabelText('Type your support question')).toBeInTheDocument();
    expect(screen.getByText('Send')).toBeInTheDocument();
  });
});