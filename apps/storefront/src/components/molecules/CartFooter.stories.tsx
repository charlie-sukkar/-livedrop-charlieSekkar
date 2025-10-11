import type { Meta, StoryObj } from '@storybook/react';
import { CartFooter } from './CartFooter';

const meta: Meta<typeof CartFooter> = {
  title: 'Components/CartFooter',
  component: CartFooter,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof CartFooter>;

export const Drawer: Story = {
  args: {
    totalPrice: 149.99,
    onClearCart: () => console.log('Clear cart'),
    onViewCart: () => console.log('View cart'),
    onCheckout: () => console.log('Checkout'),
    variant: 'drawer',
  },
};

export const Page: Story = {
  args: {
    totalPrice: 149.99,
    onClearCart: () => console.log('Clear cart'),
    onViewCart: () => console.log('View cart'),
    onCheckout: () => console.log('Checkout'),
    variant: 'page',
  },
};

export const CheckoutOnly: Story = {
  args: {
    totalPrice: 89.99,
    onCheckout: () => console.log('Checkout'),
    showClearCart: false,
    showViewCart: false,
  },
};

export const NoActions: Story = {
  args: {
    totalPrice: 45.50,
  },
};

export const WithClearCartOnly: Story = {
  args: {
    totalPrice: 75.25,
    onClearCart: () => console.log('Clear cart'),
    showViewCart: false,
  },
};