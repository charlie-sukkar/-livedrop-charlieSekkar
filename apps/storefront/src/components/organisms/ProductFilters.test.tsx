import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ProductFilters } from './ProductFilters'

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

    expect(screen.getByText('electronics')).toBeInTheDocument()
    expect(screen.getByText('clothing')).toBeInTheDocument()
    expect(screen.getByText('books')).toBeInTheDocument()
    expect(screen.getByRole('combobox')).toBeInTheDocument()
  })

  it('shows "All" tag when no tags are selected', () => {
    render(<ProductFilters {...defaultProps} />)

    expect(screen.getByText('All')).toBeInTheDocument()
  })

  it('calls onTagFilter when tag is clicked', async () => {
    const user = userEvent.setup()
    render(<ProductFilters {...defaultProps} />)

    // Click the first electronics tag (available tags section)
    const electronicsTags = screen.getAllByText('electronics')
    await user.click(electronicsTags[0])
    
    expect(defaultProps.onTagFilter).toHaveBeenCalledWith(['electronics'])
  })

  it('calls onSortChange when sort option is selected', async () => {
    const user = userEvent.setup()
    render(<ProductFilters {...defaultProps} />)

    const select = screen.getByRole('combobox')
    await user.selectOptions(select, 'price-asc')
    
    expect(defaultProps.onSortChange).toHaveBeenCalledWith('price-asc')
  })

  it('removes tag using remove button', async () => {
    const user = userEvent.setup()
    render(<ProductFilters {...defaultProps} />)

    // Select a tag first by clicking available tag
    const electronicsTags = screen.getAllByText('electronics')
    await user.click(electronicsTags[0])
    
    // Now find and click the remove button
    const removeButton = screen.getByLabelText('Remove electronics')
    await user.click(removeButton)
    
    expect(defaultProps.onTagFilter).toHaveBeenCalledWith([])
  })

  it('shows removable tags when tags are selected', async () => {
    const user = userEvent.setup()
    render(<ProductFilters {...defaultProps} />)

    // Before selection
    const initialTags = screen.getAllByText('electronics')
    expect(initialTags).toHaveLength(1) // Only in available section

    // After selection
    await user.click(initialTags[0])
    
    // Should now have 2 electronics tags (available + selected)
    const afterSelectionTags = screen.getAllByText('electronics')
    expect(afterSelectionTags).toHaveLength(2)
  })

  it('uses initialSort prop', () => {
    render(<ProductFilters {...defaultProps} initialSort="price-desc" />)

    const select = screen.getByRole('combobox') as HTMLSelectElement
    expect(select.value).toBe('price-desc')
  })

  it('handles multiple tag selection', async () => {
    const user = userEvent.setup()
    render(<ProductFilters {...defaultProps} />)

    // Click multiple tags
    const electronicsTags = screen.getAllByText('electronics')
    await user.click(electronicsTags[0])
    
    const clothingTags = screen.getAllByText('clothing')
    await user.click(clothingTags[0])
    
    expect(defaultProps.onTagFilter).toHaveBeenCalledWith(['electronics', 'clothing'])
  })

  it('toggles tag selection when clicking available tag', async () => {
    const user = userEvent.setup()
    render(<ProductFilters {...defaultProps} />)

    // First click selects
    const electronicsTags = screen.getAllByText('electronics')
    await user.click(electronicsTags[0])
    expect(defaultProps.onTagFilter).toHaveBeenCalledWith(['electronics'])

    // Clear mocks and click again to deselect
    vi.clearAllMocks()
    await user.click(electronicsTags[0])
    expect(defaultProps.onTagFilter).toHaveBeenCalledWith([])
  })
})