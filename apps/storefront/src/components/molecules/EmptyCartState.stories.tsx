import type { Meta, StoryObj } from '@storybook/react';
import { EmptyCartState } from './EmptyCartState';

const meta: Meta<typeof EmptyCartState> = {
  title: 'Components/EmptyCartState',
  component: EmptyCartState,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof EmptyCartState>;

export const Default: Story = {
  args: {},
};

export const WithButton: Story = {
  args: {
    showButton: true,
    onButtonClick: () => console.log('Continue shopping'),
  },
};

export const CustomContent: Story = {
  args: {
    title: 'No items in wishlist',
    message: 'Add some products to your wishlist to see them here',
    showButton: true,
    buttonText: 'Browse Products',
    onButtonClick: () => console.log('Browse products'),
  },
};

export const WithoutButton: Story = {
  args: {
    showButton: false,
  },
};

export const CustomStyle: Story = {
  args: {
    className: 'bg-gray-50 rounded-lg',
  },
};