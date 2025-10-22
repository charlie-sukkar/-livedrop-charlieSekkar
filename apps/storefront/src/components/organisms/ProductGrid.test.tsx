import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ProductGrid } from './ProductGrid'

// Mock the ProductCard component
vi.mock('../molecules/ProductCard', () => ({
  ProductCard: ({ product }: { product: any }) => (
    <div data-testid="product-card">{product.name}</div>
  )
}))

// Mock the Icon component
vi.mock('../atoms/Icon', () => ({
  Icon: ({ className, d }: { className?: string; d: string }) => (
    <svg className={className} data-testid="icon">
      <path d={d} />
    </svg>
  )
}))

describe('ProductGrid', () => {
  const mockProducts = [
    { 
      _id: '1',
      name: 'Product 1',
      price: 29.99, 
      imageUrl: '/img1.jpg',
      description: 'Test product 1',
      tags: ['electronics'],
      stock: 10,
      category: 'electronics',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    { 
      _id: '2',
      name: 'Product 2',
      price: 39.99, 
      imageUrl: '/img2.jpg',
      description: 'Test product 2',
      tags: ['clothing'],
      stock: 5,
      category: 'clothing',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ]

  it('renders loading skeleton when loading', () => {
    render(<ProductGrid products={[]} loading={true} />)

    expect(screen.getByLabelText('Loading products')).toBeInTheDocument()
    expect(screen.getAllByRole('listitem')).toHaveLength(8)
  })

  it('renders empty state when no products', () => {
    render(<ProductGrid products={[]} loading={false} />)

    expect(screen.getByText('No products found')).toBeInTheDocument()
    expect(screen.getByText(/Try adjusting your search/)).toBeInTheDocument()
    expect(screen.getByTestId('icon')).toBeInTheDocument()
  })

  it('renders product grid with products', () => {
    render(<ProductGrid products={mockProducts} loading={false} />)

    expect(screen.getByLabelText('Products grid')).toBeInTheDocument()
    expect(screen.getAllByTestId('product-card')).toHaveLength(2)
    expect(screen.getByText('Product 1')).toBeInTheDocument()
    expect(screen.getByText('Product 2')).toBeInTheDocument()
  })

  it('renders correct number of product cards', () => {
    const singleProduct = [{ 
      _id: '1',
      name: 'Single Product',
      price: 19.99, 
      imageUrl: '/img.jpg',
      description: 'Test product',
      tags: ['test'],
      stock: 1,
      category: 'test',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }]
    
    render(<ProductGrid products={singleProduct} loading={false} />)

    expect(screen.getAllByTestId('product-card')).toHaveLength(1)
  })

  it('shows product count and pagination info when provided', () => {
    const pagination = {
      page: 2,
      limit: 10,
      total: 25,
      pages: 3
    }
    
    render(
      <ProductGrid 
        products={mockProducts} 
        loading={false} 
        pagination={pagination}
      />
    )

    expect(screen.getByText(/Showing 2 of 25 products/)).toBeInTheDocument()
    
    // Use getAllByText for multiple elements with the same text
    const pageElements = screen.getAllByText(/Page 2 of 3/)
    expect(pageElements).toHaveLength(2) // Should be exactly 2 elements
    
    // Check that both locations contain the page info
    const productCountElement = screen.getByText((content, element) => {
      return element?.textContent === 'Showing 2 of 25 products (Page 2 of 3)'
    })
    expect(productCountElement).toBeInTheDocument()
    
    const paginationElement = screen.getByText((content, element) => {
      return element?.textContent === 'Page 2 of 3' && 
             element?.tagName.toLowerCase() === 'span'
    })
    expect(paginationElement).toBeInTheDocument()
  })

  it('renders pagination controls when pagination provided', () => {
    const pagination = {
      page: 2,
      limit: 10,
      total: 30,
      pages: 3
    }
    
    render(
      <ProductGrid 
        products={mockProducts} 
        loading={false} 
        pagination={pagination}
      />
    )

    expect(screen.getByText('Previous')).toBeInTheDocument()
    expect(screen.getByText('Next')).toBeInTheDocument()
    
    // Use a more specific query for the pagination span
    const paginationSpan = screen.getByText((content, element) => {
      return element?.textContent === 'Page 2 of 3' && 
             element?.className.includes('text-center')
    })
    expect(paginationSpan).toBeInTheDocument()
  })

  it('calls onPageChange when pagination buttons are clicked', async () => {
    const user = userEvent.setup()
    const mockOnPageChange = vi.fn()
    const pagination = {
      page: 2,
      limit: 10,
      total: 30,
      pages: 3
    }
    
    render(
      <ProductGrid 
        products={mockProducts} 
        loading={false} 
        pagination={pagination}
        onPageChange={mockOnPageChange}
      />
    )

    await user.click(screen.getByText('Previous'))
    expect(mockOnPageChange).toHaveBeenCalledWith(1)

    await user.click(screen.getByText('Next'))
    expect(mockOnPageChange).toHaveBeenCalledWith(3)
  })

  it('disables previous button on first page', () => {
    const pagination = {
      page: 1,
      limit: 10,
      total: 30,
      pages: 3
    }
    
    render(
      <ProductGrid 
        products={mockProducts} 
        loading={false} 
        pagination={pagination}
      />
    )

    expect(screen.getByText('Previous')).toBeDisabled()
    expect(screen.getByText('Next')).not.toBeDisabled()
  })

  it('disables next button on last page', () => {
    const pagination = {
      page: 3,
      limit: 10,
      total: 30,
      pages: 3
    }
    
    render(
      <ProductGrid 
        products={mockProducts} 
        loading={false} 
        pagination={pagination}
      />
    )

    expect(screen.getByText('Previous')).not.toBeDisabled()
    expect(screen.getByText('Next')).toBeDisabled()
  })

  it('does not show pagination when only one page exists', () => {
    const pagination = {
      page: 1,
      limit: 10,
      total: 8,
      pages: 1
    }
    
    render(
      <ProductGrid 
        products={mockProducts} 
        loading={false} 
        pagination={pagination}
      />
    )

    expect(screen.queryByText('Previous')).not.toBeInTheDocument()
    expect(screen.queryByText('Next')).not.toBeInTheDocument()
    
    // Should only show the product count without page info in parentheses
    expect(screen.getByText(/Showing 2 of 8 products/)).toBeInTheDocument()
    expect(screen.queryByText(/\(Page/)).not.toBeInTheDocument()
  })

  it('does not show product count when no pagination provided', () => {
    render(<ProductGrid products={mockProducts} loading={false} />)

    expect(screen.queryByText(/Showing/)).not.toBeInTheDocument()
    expect(screen.queryByText(/Page/)).not.toBeInTheDocument()
  })

  it('shows product count without page info when only one page', () => {
    const pagination = {
      page: 1,
      limit: 10,
      total: 5,
      pages: 1
    }
    
    render(
      <ProductGrid 
        products={mockProducts.slice(0, 1)} 
        loading={false} 
        pagination={pagination}
      />
    )

    // Should show product count but not page info in parentheses
    expect(screen.getByText(/Showing 1 of 5 products/)).toBeInTheDocument()
    expect(screen.queryByText(/\(Page/)).not.toBeInTheDocument()
  })
})