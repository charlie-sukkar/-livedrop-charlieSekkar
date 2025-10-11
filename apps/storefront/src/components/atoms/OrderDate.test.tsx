import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { OrderDate } from './OrderDate';

describe('OrderDate Component', () => {
  // Mock the current date for consistent testing
  const mockDate = new Date('2024-01-15T12:30:45Z');
  
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(mockDate);
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  // Helper function to get expected formatted date
  const getExpectedDate = (timestamp: number, showTime = false): string => {
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      ...(showTime ? { hour: '2-digit', minute: '2-digit' } : {}),
    };
    return new Date(timestamp).toLocaleDateString('en-US', options);
  };

  it('renders date without time by default', () => {
    const timestamp = new Date('2024-01-10T14:30:00Z').getTime();
    const expectedText = getExpectedDate(timestamp);
    
    render(<OrderDate timestamp={timestamp} />);
    
    const dateElement = screen.getByText(expectedText);
    expect(dateElement).toBeInTheDocument();
  });

  it('renders date with time when showTime is true', () => {
    const timestamp = new Date('2024-01-10T14:30:00Z').getTime();
    const expectedText = getExpectedDate(timestamp, true);
    
    render(<OrderDate timestamp={timestamp} showTime={true} />);
    
    const dateElement = screen.getByText(expectedText);
    expect(dateElement).toBeInTheDocument();
  });

  it('applies custom className', () => {
    const timestamp = new Date('2024-01-10T14:30:00Z').getTime();
    const expectedText = getExpectedDate(timestamp);
    const customClass = 'custom-date-class';
    
    render(<OrderDate timestamp={timestamp} className={customClass} />);
    
    const dateElement = screen.getByText(expectedText);
    expect(dateElement).toHaveClass(customClass);
  });

  it('handles future dates correctly', () => {
    const futureTimestamp = new Date('2024-12-25T00:00:00Z').getTime();
    const expectedText = getExpectedDate(futureTimestamp);
    
    render(<OrderDate timestamp={futureTimestamp} />);
    
    const dateElement = screen.getByText(expectedText);
    expect(dateElement).toBeInTheDocument();
  });

  it('handles past dates correctly', () => {
    const pastTimestamp = new Date('2020-03-15T10:00:00Z').getTime();
    const expectedText = getExpectedDate(pastTimestamp);
    
    render(<OrderDate timestamp={pastTimestamp} />);
    
    const dateElement = screen.getByText(expectedText);
    expect(dateElement).toBeInTheDocument();
  });

  it('uses en-US locale for formatting', () => {
    const timestamp = new Date('2024-01-10T14:30:00Z').getTime();
    const expectedText = getExpectedDate(timestamp);
    
    render(<OrderDate timestamp={timestamp} />);
    
    const dateElement = screen.getByText(expectedText);
    expect(dateElement).toBeInTheDocument();
    
    // Verify it's US format (Month Day, Year)
    expect(dateElement.textContent).toMatch(/January 10, 2024/);
  });

  it('includes time when showTime is true', () => {
    const timestamp = new Date('2024-01-10T14:30:00Z').getTime();
    render(<OrderDate timestamp={timestamp} showTime={true} />);
    
    const dateElement = screen.getByText(/, 2024/); // Basic check for date part
    const textContent = dateElement.textContent;
    
    // Check that it contains time indicators (AM/PM or :)
    expect(textContent).toMatch(/(AM|PM|:)/);
  });

  it('includes time for midnight when showTime is true', () => {
    const timestamp = new Date('2024-01-10T00:00:00Z').getTime();
    render(<OrderDate timestamp={timestamp} showTime={true} />);
    
    const dateElement = screen.getByText(/, 2024/); // Basic check for date part
    const textContent = dateElement.textContent;
    
    // Check that it contains time indicators
    expect(textContent).toMatch(/(AM|PM|:)/);
  });

  it('handles different months correctly', () => {
    const decemberTimestamp = new Date('2024-12-25T14:30:00Z').getTime();
    const expectedText = getExpectedDate(decemberTimestamp);
    
    render(<OrderDate timestamp={decemberTimestamp} />);
    
    const dateElement = screen.getByText(expectedText);
    expect(dateElement).toBeInTheDocument();
  });

  it('renders as span element', () => {
    const timestamp = new Date('2024-01-10T14:30:00Z').getTime();
    const expectedText = getExpectedDate(timestamp);
    
    const { container } = render(<OrderDate timestamp={timestamp} />);
    
    const spanElement = container.querySelector('span');
    expect(spanElement).toBeInTheDocument();
    expect(spanElement?.textContent).toBe(expectedText);
  });

  it('matches snapshot with date only', () => {
    const timestamp = new Date('2024-01-10T14:30:00Z').getTime();
    const { container } = render(<OrderDate timestamp={timestamp} />);
    expect(container.firstChild).toMatchSnapshot();
  });

  it('matches snapshot with date and time', () => {
    const timestamp = new Date('2024-01-10T14:30:00Z').getTime();
    const { container } = render(<OrderDate timestamp={timestamp} showTime={true} />);
    expect(container.firstChild).toMatchSnapshot();
  });

  it('matches snapshot with custom className', () => {
    const timestamp = new Date('2024-01-10T14:30:00Z').getTime();
    const { container } = render(
      <OrderDate timestamp={timestamp} className="text-lg font-bold" />
    );
    expect(container.firstChild).toMatchSnapshot();
  });

  // Edge cases
  it('handles very old dates', () => {
    const oldTimestamp = new Date('1995-05-15T10:00:00Z').getTime();
    const expectedText = getExpectedDate(oldTimestamp);
    
    render(<OrderDate timestamp={oldTimestamp} />);
    
    const dateElement = screen.getByText(expectedText);
    expect(dateElement).toBeInTheDocument();
  });

  it('handles leap year dates', () => {
    const leapYearTimestamp = new Date('2024-02-29T14:30:00Z').getTime();
    const expectedText = getExpectedDate(leapYearTimestamp);
    
    render(<OrderDate timestamp={leapYearTimestamp} />);
    
    const dateElement = screen.getByText(expectedText);
    expect(dateElement).toBeInTheDocument();
  });

  it('shows different output for showTime true vs false', () => {
    const timestamp = new Date('2024-01-10T14:30:00Z').getTime();
    
    const { container: container1 } = render(<OrderDate timestamp={timestamp} />);
    const { container: container2 } = render(<OrderDate timestamp={timestamp} showTime={true} />);
    
    const textWithoutTime = container1.textContent;
    const textWithTime = container2.textContent;
    
    expect(textWithTime).not.toBe(textWithoutTime);
    expect(textWithTime?.length).toBeGreaterThan(textWithoutTime?.length || 0);
  });
});