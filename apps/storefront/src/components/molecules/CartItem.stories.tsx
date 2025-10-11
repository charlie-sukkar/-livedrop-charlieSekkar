import type { Meta, StoryObj } from '@storybook/react';
import { CartItem } from './CartItem';

const meta: Meta<typeof CartItem> = {
  title: 'Components/CartItem',
  component: CartItem,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof CartItem>;

const defaultItem = {
  productId: '1',
  title: 'Wireless Headphones',
  price: 99.99,
  quantity: 1,
  stockQty: 10,
  image: '/headphones.jpg',
};

export const Default: Story = {
  args: {
    item: defaultItem,
    onUpdateQuantity: () => console.log('Update quantity'),
    onRemove: () => console.log('Remove item'),
  },
};

export const MultipleQuantity: Story = {
  args: {
    item: { ...defaultItem, quantity: 3 },
    onUpdateQuantity: () => console.log('Update quantity'),
    onRemove: () => console.log('Remove item'),
  },
};

export const LowStock: Story = {
  args: {
    item: { ...defaultItem, quantity: 9, stockQty: 10 },
    onUpdateQuantity: () => console.log('Update quantity'),
    onRemove: () => console.log('Remove item'),
  },
};

export const MaxStock: Story = {
  args: {
    item: { ...defaultItem, quantity: 10, stockQty: 10 },
    onUpdateQuantity: () => console.log('Update quantity'),
    onRemove: () => console.log('Remove item'),
  },
};