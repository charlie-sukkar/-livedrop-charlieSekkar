import type { Meta, StoryObj } from '@storybook/react';
import { ProductCard } from './ProductCard';
import { BrowserRouter } from 'react-router-dom';

const meta: Meta<typeof ProductCard> = {
  title: 'Components/ProductCard',
  component: ProductCard,
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <BrowserRouter>
        <Story />
      </BrowserRouter>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof ProductCard>;

// FIXED: Match the actual Product interface
const sampleProduct = {
  _id: '1',
  name: 'Wireless Bluetooth Headphones', // changed from 'title'
  description: 'High-quality wireless headphones with noise cancellation and 30-hour battery life.',
  price: 99.99,
  stock: 15, // changed from 'stockQty'
  imageUrl: '/headphones.jpg', // changed from 'image'
  category: 'electronics',
  tags: ['electronics', 'audio', 'wireless'],
};

export const Default: Story = {
  args: {
    product: sampleProduct,
  },
};

export const Loading: Story = {
  args: {
    product: sampleProduct,
    loading: true,
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
      tags: ['electronics', 'audio', 'wireless', 'new', 'bestseller', 'sale'] 
    },
  },
};
