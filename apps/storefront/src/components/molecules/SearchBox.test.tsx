import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { SearchBox } from './SearchBox';

// Mock dependencies
vi.mock('../atoms/Input', () => ({
  Input: ({ value, onChange, placeholder }: { value: string; onChange: (e: any) => void; placeholder?: string }) => (
    <input 
      value={value} 
      onChange={onChange} 
      placeholder={placeholder} 
      aria-label="Search products"
    />
  ),
}));

vi.mock('../atoms/Icon', () => ({
  Icon: () => <svg data-testid="search-icon" />,
}));

describe('SearchBox', () => {
  it('displays search input with value', () => {
    render(<SearchBox value="test" onChange={() => {}} />);
    
    const input = screen.getByLabelText('Search products') as HTMLInputElement;
    expect(input.value).toBe('test');
  });

  it('calls onChange when typing', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    
    render(<SearchBox value="" onChange={onChange} />);
    
    const input = screen.getByLabelText('Search products');
    await user.type(input, 'hello');
    
    expect(onChange).toHaveBeenCalledTimes(5);
  });

  it('shows custom placeholder', () => {
    render(<SearchBox value="" onChange={() => {}} placeholder="Custom search..." />);
    
    const input = screen.getByPlaceholderText('Custom search...');
    expect(input).toBeInTheDocument();
  });

  it('renders the search icon', () => {
    render(<SearchBox value="" onChange={() => {}} />);
    
    expect(screen.getByTestId('search-icon')).toBeInTheDocument();
  });
});
