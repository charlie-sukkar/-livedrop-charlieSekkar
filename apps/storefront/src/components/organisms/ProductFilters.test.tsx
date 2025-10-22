import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ProductFilters } from './ProductFilters'

// Mock the child components
vi.mock('../atoms/Select', () => ({
  Select: ({ label, value, onChange, options, className }: any) => (
    <select 
      value={value} 
      onChange={onChange}
      className={className}
      aria-label={label}
    >
      {options.map((option: any) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  )
}))

vi.mock('../atoms/Tag', () => ({
  Tag: ({ label, isActive, onClick, removable, onRemove }: any) => (
    <button 
      onClick={onClick}
      data-active={isActive}
      data-testid={removable ? `selected-tag-${label}` : `available-tag-${label}`}
      data-removable={removable}
    >
      {label}
      {removable && (
        <button 
          onClick={(e) => {
            e.stopPropagation()
            onRemove()
          }}
          aria-label={`Remove ${label}`}
          data-testid={`remove-${label}`}
        >
          ×
        </button>
      )}
    </button>
  )
}))

describe('ProductFilters', () => {
  const defaultProps = {
    onSortChange: vi.fn(),
    onTagFilter: vi.fn(),
    availableTags: ['electronics', 'clothing', 'books'],
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders all available tags and sort dropdown', () => {
    render(<ProductFilters {...defaultProps} />)

    expect(screen.getByTestId('available-tag-electronics')).toBeInTheDocument()
    expect(screen.getByTestId('available-tag-clothing')).toBeInTheDocument()
    expect(screen.getByTestId('available-tag-books')).toBeInTheDocument()
    expect(screen.getByRole('combobox')).toBeInTheDocument()
  })

  it('shows "All" tag when no tags are selected', () => {
    render(<ProductFilters {...defaultProps} />)

    expect(screen.getByTestId('available-tag-All')).toBeInTheDocument()
  })

  it('calls onTagFilter when tag is clicked', async () => {
    const user = userEvent.setup()
    render(<ProductFilters {...defaultProps} />)

    // Click the electronics tag from available tags
    await user.click(screen.getByTestId('available-tag-electronics'))
    
    expect(defaultProps.onTagFilter).toHaveBeenCalledWith(['electronics'])
  })

  it('calls onSortChange when sort option is selected', async () => {
    const user = userEvent.setup()
    render(<ProductFilters {...defaultProps} />)

    const select = screen.getByRole('combobox')
    await user.selectOptions(select, 'price')
    
    expect(defaultProps.onSortChange).toHaveBeenCalledWith('price')
  })

  it('removes tag using remove button', async () => {
    const user = userEvent.setup()
    render(<ProductFilters {...defaultProps} />)

    // Select a tag first by clicking available tag
    await user.click(screen.getByTestId('available-tag-electronics'))
    
    // Now find and click the remove button from selected tags
    const removeButton = screen.getByTestId('remove-electronics')
    await user.click(removeButton)
    
    expect(defaultProps.onTagFilter).toHaveBeenCalledWith([])
  })

  it('shows removable tags when tags are selected', async () => {
    const user = userEvent.setup()
    render(<ProductFilters {...defaultProps} />)

    // Select a tag
    await user.click(screen.getByTestId('available-tag-electronics'))
    
    // Should have selected tag with remove button
    expect(screen.getByTestId('selected-tag-electronics')).toBeInTheDocument()
    expect(screen.getByTestId('remove-electronics')).toBeInTheDocument()
  })

  it('uses initialSort prop', () => {
    render(<ProductFilters {...defaultProps} initialSort="price-desc" />)

    const select = screen.getByRole('combobox') as HTMLSelectElement
    expect(select.value).toBe('price-desc')
  })

  it('handles multiple tag selection', async () => {
    const user = userEvent.setup()
    render(<ProductFilters {...defaultProps} />)

    // Click multiple tags from available tags
    await user.click(screen.getByTestId('available-tag-electronics'))
    await user.click(screen.getByTestId('available-tag-clothing'))
    
    expect(defaultProps.onTagFilter).toHaveBeenCalledWith(['electronics', 'clothing'])
  })

  it('toggles tag selection when clicking available tag', async () => {
    const user = userEvent.setup()
    render(<ProductFilters {...defaultProps} />)

    // First click selects from available tags
    await user.click(screen.getByTestId('available-tag-electronics'))
    expect(defaultProps.onTagFilter).toHaveBeenCalledWith(['electronics'])

    // Clear mocks and click again to deselect - click the same available tag
    vi.clearAllMocks()
    await user.click(screen.getByTestId('available-tag-electronics'))
    expect(defaultProps.onTagFilter).toHaveBeenCalledWith([])
  })

  it('shows loading skeleton when tagsLoading is true', () => {
    render(<ProductFilters {...defaultProps} tagsLoading={true} />)

    // Check for loading skeleton elements - they are generic div elements
    // We can check that actual tags are not visible
    expect(screen.queryByTestId('available-tag-electronics')).not.toBeInTheDocument()
    expect(screen.queryByTestId('available-tag-clothing')).not.toBeInTheDocument()
    expect(screen.queryByTestId('available-tag-books')).not.toBeInTheDocument()
  })

  it('shows actual tags when tagsLoading is false', () => {
    render(<ProductFilters {...defaultProps} tagsLoading={false} />)

    // Should show actual tags
    expect(screen.getByTestId('available-tag-electronics')).toBeInTheDocument()
    expect(screen.getByTestId('available-tag-clothing')).toBeInTheDocument()
    expect(screen.getByTestId('available-tag-books')).toBeInTheDocument()
  })

  it('hides "All" tag when tags are selected', async () => {
    const user = userEvent.setup()
    render(<ProductFilters {...defaultProps} />)

    // "All" tag should be visible initially
    expect(screen.getByTestId('available-tag-All')).toBeInTheDocument()

    // Select a tag
    await user.click(screen.getByTestId('available-tag-electronics'))

    // "All" tag should be hidden when tags are selected
    expect(screen.queryByTestId('available-tag-All')).not.toBeInTheDocument()
  })

  it('clears all tags when clicking available tag after selection', async () => {
    const user = userEvent.setup()
    render(<ProductFilters {...defaultProps} />)

    // Select some tags first
    await user.click(screen.getByTestId('available-tag-electronics'))
    await user.click(screen.getByTestId('available-tag-clothing'))

    // Clear mocks to track the deselect behavior
    vi.clearAllMocks()

    // Click one of the selected tags again to deselect it
    await user.click(screen.getByTestId('available-tag-electronics'))

    // Should call with remaining tags
    expect(defaultProps.onTagFilter).toHaveBeenCalledWith(['clothing'])
  })

  it('has correct sort options', () => {
    render(<ProductFilters {...defaultProps} />)

    const select = screen.getByRole('combobox')
    expect(select).toHaveTextContent('Name')
    expect(select).toHaveTextContent('Price: Low to High')
    expect(select).toHaveTextContent('Price: High to Low')
  })

  it('handles empty availableTags array', () => {
    const props = {
      ...defaultProps,
      availableTags: []
    }
    render(<ProductFilters {...props} />)

    // Should not crash with empty tags
    expect(screen.getByRole('combobox')).toBeInTheDocument()
  })

  it('shows both available and selected tags when tags are selected', async () => {
    const user = userEvent.setup()
    render(<ProductFilters {...defaultProps} />)

    // Select a tag
    await user.click(screen.getByTestId('available-tag-electronics'))
    
    // Should have both available tag and selected tag
    expect(screen.getByTestId('available-tag-electronics')).toBeInTheDocument()
    expect(screen.getByTestId('selected-tag-electronics')).toBeInTheDocument()
  })
})