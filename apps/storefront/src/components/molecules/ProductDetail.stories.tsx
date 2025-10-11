import type { Meta, StoryObj } from '@storybook/react';
import { ProductDetail } from './ProductDetail';

const meta: Meta<typeof ProductDetail> = {
  title: 'Components/ProductDetail',
  component: ProductDetail,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof ProductDetail>;

const sampleProduct = {
  id: '1',
  title: 'Wireless Bluetooth Headphones',
  description: 'Premium wireless headphones with active noise cancellation',
  price: 299.99,
  stockQty: 15,
  image: '/headphones.jpg',
  tags: ['electronics', 'audio', 'wireless', 'premium'],
};

export const InStock: Story = {
  args: {
    product: sampleProduct,
  },
};

export const OutOfStock: Story = {
  args: {
    product: { ...sampleProduct, stockQty: 0 },
  },
};

export const LowStock: Story = {
  args: {
    product: { ...sampleProduct, stockQty: 2 },
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