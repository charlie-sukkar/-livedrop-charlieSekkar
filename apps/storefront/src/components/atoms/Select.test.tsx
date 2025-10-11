import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect } from 'vitest';
import { Select } from './Select';

describe('Select', () => {
  const options = [
    { value: 'opt1', label: 'Option 1' },
    { value: 'opt2', label: 'Option 2' },
    { value: 'opt3', label: 'Option 3' },
  ];

  it('renders all options', () => {
    render(<Select options={options} />);
    
    options.forEach(option => {
      expect(screen.getByText(option.label)).toBeInTheDocument();
    });
  });

  it('shows label when provided', () => {
    render(<Select label="Test Label" options={options} />);
    expect(screen.getByText('Test Label')).toBeInTheDocument();
  });

  it('hides label when not provided', () => {
    render(<Select options={options} />);
    expect(screen.queryByText('Test Label')).not.toBeInTheDocument();
  });

  it('forwards select props correctly', () => {
    render(<Select options={options} disabled data-testid="test-select" />);
    
    const select = screen.getByTestId('test-select');
    expect(select).toBeDisabled();
  });

  it('handles user selection', async () => {
    const user = userEvent.setup();
    render(<Select options={options} />);
    
    const select = screen.getByRole('combobox');
    await user.selectOptions(select, 'opt2');
    
    expect(select).toHaveValue('opt2');
  });

  it('has correct styling', () => {
    render(<Select options={options} />);
    
    const select = screen.getByRole('combobox');
    expect(select).toHaveClass('border', 'border-gray-300', 'rounded-md');
  });
});