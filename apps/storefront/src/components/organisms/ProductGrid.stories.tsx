import type { Meta, StoryObj } from '@storybook/react'
import { ProductGrid } from './ProductGrid'

const meta: Meta<typeof ProductGrid> = {
  title: 'Organisms/ProductGrid',
  component: ProductGrid,
}

export default meta
type Story = StoryObj<typeof ProductGrid>

// FIXED: Match the actual Product interface
const sampleProducts = [
  {
    _id: '1', // changed from 'id'
    name: 'Wireless Headphones', // changed from 'title'
    price: 199.99,
    imageUrl: '/headphones.jpg', // changed from 'image'
    description: 'High-quality wireless headphones',
    category: 'electronics', // added required field
    tags: ['electronics', 'audio'],
    stock: 15 // changed from 'stockQty'
  },
  {
    _id: '2', // changed from 'id'
    name: 'Smartphone', // changed from 'title'
    price: 899.99,
    imageUrl: '/phone.jpg', // changed from 'image'
    description: 'Latest smartphone model',
    category: 'electronics', // added required field
    tags: ['electronics', 'mobile'],
    stock: 8 // changed from 'stockQty'
  },
  {
    _id: '3', // changed from 'id'
    name: 'Laptop', // changed from 'title'
    price: 1299.99,
    imageUrl: '/laptop.jpg', // changed from 'image'
    description: 'Powerful laptop for work and play',
    category: 'electronics', // added required field
    tags: ['electronics', 'computers'],
    stock: 5 // changed from 'stockQty'
  },
  {
    _id: '4', // changed from 'id'
    name: 'Smart Watch', // changed from 'title'
    price: 299.99,
    imageUrl: '/watch.jpg', // changed from 'image'
    description: 'Feature-rich smartwatch',
    category: 'electronics', // added required field
    tags: ['electronics', 'wearables'],
    stock: 20 // changed from 'stockQty'
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
