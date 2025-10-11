import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { Input } from './Input';

describe('Input Component', () => {
  it('renders without crashing', () => {
    render(<Input />);
    const input = screen.getByRole('textbox');
    expect(input).toBeInTheDocument();
  });

  it('renders with label when provided', () => {
    const labelText = 'Test Label';
    render(<Input label={labelText} />);
    
    const label = screen.getByText(labelText);
    expect(label).toBeInTheDocument();
    expect(label).toHaveClass('block', 'text-sm', 'font-medium', 'text-gray-700', 'mb-1');
    // Note: The label doesn't have htmlFor attribute in the current component implementation
  });

  it('renders error message when provided', () => {
    const errorMessage = 'This field is required';
    render(<Input error={errorMessage} />);
    
    const error = screen.getByRole('alert');
    expect(error).toBeInTheDocument();
    expect(error).toHaveTextContent(errorMessage);
    expect(error).toHaveClass('text-red-600');
  });

  it('applies disabled styles when disabled', () => {
    render(<Input disabled />);
    
    const input = screen.getByRole('textbox');
    expect(input).toBeDisabled();
    expect(input).toHaveClass('disabled:bg-gray-50', 'disabled:text-gray-500');
  });

  it('forwards ref correctly', () => {
    const ref = vi.fn();
    render(<Input ref={ref} />);
    
    expect(ref).toHaveBeenCalled();
    expect(ref.mock.calls[0][0]).toBeInstanceOf(HTMLInputElement);
  });

  it('applies custom className', () => {
    const customClass = 'custom-class';
    render(<Input className={customClass} />);
    
    const input = screen.getByRole('textbox');
    expect(input).toHaveClass(customClass);
  });

  it('handles all input HTML attributes', () => {
    const props = {
      placeholder: 'Enter text...',
      type: 'email' as const,
      required: true,
      maxLength: 50,
    };
    
    render(<Input {...props} />);
    
    const input = screen.getByRole('textbox');
    expect(input).toHaveAttribute('placeholder', props.placeholder);
    expect(input).toHaveAttribute('type', props.type);
    expect(input).toBeRequired();
    expect(input).toHaveAttribute('maxLength', props.maxLength.toString());
  });

  it('applies error styles when error is present', () => {
    render(<Input error="Error message" />);
    
    const input = screen.getByRole('textbox');
    expect(input).toHaveClass('border-red-500', 'focus:ring-red-500', 'focus:border-red-500');
  });

  it('does not render label when not provided', () => {
    render(<Input />);
    
    const label = screen.queryByText(/Test Label/);
    expect(label).not.toBeInTheDocument();
  });

  it('does not render error when not provided', () => {
    render(<Input />);
    
    const error = screen.queryByRole('alert');
    expect(error).not.toBeInTheDocument();
  });

  it('handles user input', async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();
    
    render(<Input onChange={handleChange} />);
    
    const input = screen.getByRole('textbox');
    const testValue = 'Hello World';
    
    await user.type(input, testValue);
    
    expect(handleChange).toHaveBeenCalledTimes(testValue.length);
    expect(input).toHaveValue(testValue);
  });

  it('forwards all input props correctly', () => {
    const testId = 'test-input';
    render(<Input data-testid={testId} aria-label="test input" />);
    
    const input = screen.getByTestId(testId);
    expect(input).toHaveAttribute('aria-label', 'test input');
  });

  it('uses provided id on input element', () => {
    const inputId = 'test-input-id';
    render(<Input id={inputId} />);
    
    const input = screen.getByRole('textbox');
    expect(input).toHaveAttribute('id', inputId);
  });

  it('label does not automatically associate with input (current component behavior)', () => {
    const labelText = 'Test Label';
    const inputId = 'test-input-id';
    render(<Input id={inputId} label={labelText} />);
    
    const label = screen.getByText(labelText);
    const input = screen.getByRole('textbox');
    
    // Current component behavior: label doesn't have htmlFor attribute
    expect(label).not.toHaveAttribute('for');
    // But input still gets the id
    expect(input).toHaveAttribute('id', inputId);
  });

  it('matches snapshot with default props', () => {
    const { container } = render(<Input />);
    expect(container.firstChild).toMatchSnapshot();
  });

  it('matches snapshot with label and error', () => {
    const { container } = render(
      <Input label="Test Label" error="Test Error" />
    );
    expect(container.firstChild).toMatchSnapshot();
  });

  it('matches snapshot when disabled', () => {
    const { container } = render(<Input disabled />);
    expect(container.firstChild).toMatchSnapshot();
  });
});