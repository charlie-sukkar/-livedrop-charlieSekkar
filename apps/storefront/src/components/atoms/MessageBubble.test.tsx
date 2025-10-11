import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { MessageBubble } from './MessageBubble';

describe('MessageBubble Component', () => {
  const testMessage = 'Hello, this is a test message';

  it('renders message content', () => {
    render(<MessageBubble message={testMessage} />);
    expect(screen.getByText(testMessage)).toBeInTheDocument();
  });

  it('user message has blue background', () => {
    render(<MessageBubble message={testMessage} isUser={true} />);
    const bubble = screen.getByRole('text');
    expect(bubble).toHaveClass('bg-blue-600');
  });

  it('support message has gray background', () => {
    render(<MessageBubble message={testMessage} isUser={false} />);
    const bubble = screen.getByRole('text');
    expect(bubble).toHaveClass('bg-gray-200');
  });

  it('shows timestamp when provided', () => {
    const timestamp = '2:30 PM';
    render(<MessageBubble message={testMessage} timestamp={timestamp} />);
    expect(screen.getByText(timestamp)).toBeInTheDocument();
  });

  it('shows citation when provided', () => {
    const citation = 'Documentation';
    render(<MessageBubble message={testMessage} citation={citation} />);
    expect(screen.getByText(citation)).toBeInTheDocument();
  });

  it('has accessible label', () => {
    render(<MessageBubble message={testMessage} isUser={true} />);
    const bubble = screen.getByRole('text');
    expect(bubble).toHaveAttribute('aria-label', `You said: ${testMessage}`);
  });

  it('message text wraps properly', () => {
    render(<MessageBubble message={testMessage} />);
    const messageElement = screen.getByText(testMessage);
    expect(messageElement).toHaveClass('whitespace-pre-wrap');
  });
});