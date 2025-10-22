import type { Meta, StoryObj } from '@storybook/react';
import { ProductDetail } from './ProductDetail';

const meta: Meta<typeof ProductDetail> = {
  title: 'Components/ProductDetail',
  component: ProductDetail,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof ProductDetail>;

// FIXED: Match the actual Product interface
const sampleProduct = {
  _id: '1', // changed from 'id'
  name: 'Wireless Bluetooth Headphones', // changed from 'title'
  description: 'Premium wireless headphones with active noise cancellation',
  price: 299.99,
  stock: 15, // changed from 'stockQty'
  imageUrl: '/headphones.jpg', // changed from 'image'
  category: 'electronics', // added required field
  tags: ['electronics', 'audio', 'wireless', 'premium'],
};

export const InStock: Story = {
  args: {
    product: sampleProduct,
  },
};

export const OutOfStock: Story = {
  args: {
    product: { ...sampleProduct, stock: 0 }, // changed from 'stockQty'
  },
};

export const LowStock: Story = {
  args: {
    product: { ...sampleProduct, stock: 2 }, // changed from 'stockQty'
  },
};

export const ManyTags: Story = {
  args: {
    product: { 
      ...sampleProduct, 
      tags: ['electronics', 'audio', 'wireless', 'new', 'bestseller', 'limited'] 
    },
  },
};

export const HighPrice: Story = {
  args: {
    product: { ...sampleProduct, price: 999.99 },
  },
};
