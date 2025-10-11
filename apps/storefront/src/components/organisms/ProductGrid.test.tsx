import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { ProductGrid } from './ProductGrid'

// Mock the ProductCard component
vi.mock('../molecules/ProductCard', () => ({
  ProductCard: ({ product }: { product: any }) => (
    <div data-testid="product-card">{product.title}</div>
  )
}))

describe('ProductGrid', () => {
  const mockProducts = [
    { 
      id: '1', 
      title: 'Product 1', 
      price: 29.99, 
      image: '/img1.jpg',
      description: 'Test product 1',
      tags: ['electronics'],
      stockQty: 10
    },
    { 
      id: '2', 
      title: 'Product 2', 
      price: 39.99, 
      image: '/img2.jpg',
      description: 'Test product 2',
      tags: ['clothing'],
      stockQty: 5
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
      id: '1', 
      title: 'Single Product', 
      price: 19.99, 
      image: '/img.jpg',
      description: 'Test product',
      tags: ['test'],
      stockQty: 1
    }]
    
    render(<ProductGrid products={singleProduct} loading={false} />)

    expect(screen.getAllByTestId('product-card')).toHaveLength(1)
  })
})