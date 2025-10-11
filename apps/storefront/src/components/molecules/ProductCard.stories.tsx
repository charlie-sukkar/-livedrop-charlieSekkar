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

const sampleProduct = {
  id: '1',
  title: 'Wireless Bluetooth Headphones',
  description: 'High-quality wireless headphones with noise cancellation and 30-hour battery life.',
  price: 99.99,
  stockQty: 15,
  image: '/headphones.jpg',
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
      tags: ['electronics', 'audio', 'wireless', 'new', 'bestseller', 'sale'] 
    },
  },
};