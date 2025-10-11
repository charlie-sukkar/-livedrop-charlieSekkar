import type { Meta, StoryObj } from '@storybook/react';
import { PriceDisplay } from './PriceDisplay';

const meta: Meta<typeof PriceDisplay> = {
  title: 'Components/PriceDisplay',
  component: PriceDisplay,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof PriceDisplay>;

export const Basic: Story = {
  args: {
    amount: 29.99,
  },
};

export const WithLabel: Story = {
  args: {
    amount: 149.99,
    label: 'Total:',
  },
};

export const ZeroAmount: Story = {
  args: {
    amount: 0,
    label: 'Price:',
  },
};

export const LargeAmount: Story = {
  args: {
    amount: 9999.99,
    label: 'Grand Total:',
  },
};

export const WithCustomStyle: Story = {
  args: {
    amount: 75.5,
    label: 'Subtotal:',
    className: 'bg-gray-100 p-4 rounded',
  },
};