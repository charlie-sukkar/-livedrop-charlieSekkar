import type { Meta, StoryObj } from '@storybook/react'
import { ProductGrid } from './ProductGrid'

const meta: Meta<typeof ProductGrid> = {
  title: 'Organisms/ProductGrid',
  component: ProductGrid,
}

export default meta
type Story = StoryObj<typeof ProductGrid>

const sampleProducts = [
  {
    id: '1',
    title: 'Wireless Headphones',
    price: 199.99,
    image: '/headphones.jpg',
    description: 'High-quality wireless headphones',
    tags: ['electronics', 'audio'],
    stockQty: 15
  },
  {
    id: '2', 
    title: 'Smartphone',
    price: 899.99,
    image: '/phone.jpg',
    description: 'Latest smartphone model',
    tags: ['electronics', 'mobile'],
    stockQty: 8
  },
  {
    id: '3',
    title: 'Laptop',
    price: 1299.99,
    image: '/laptop.jpg',
    description: 'Powerful laptop for work and play',
    tags: ['electronics', 'computers'],
    stockQty: 5
  },
  {
    id: '4',
    title: 'Smart Watch',
    price: 299.99,
    image: '/watch.jpg',
    description: 'Feature-rich smartwatch',
    tags: ['electronics', 'wearables'],
    stockQty: 20
  }
]

export const Default: Story = {
  args: {
    products: sampleProducts,
    loading: false,
  },
}

export const Loading: Story = {
  args: {
    products: [],
    loading: true,
  },
}

export const Empty: Story = {
  args: {
    products: [],
    loading: false,
  },
}

export const SingleProduct: Story = {
  args: {
    products: [sampleProducts[0]],
    loading: false,
  },
}

export const ManyProducts: Story = {
  args: {
    products: [...sampleProducts, ...sampleProducts], // 8 products
    loading: false,
  },
}