import type { Meta, StoryObj } from '@storybook/react';
import { StockIndicator } from './StockIndicator';

const meta: Meta<typeof StockIndicator> = {
  title: 'Components/StockIndicator',
  component: StockIndicator,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof StockIndicator>;

export const InStock: Story = {
  args: {
    stockQty: 25,
  },
};

export const LowStock: Story = {
  args: {
    stockQty: 3,
  },
};

export const OutOfStock: Story = {
  args: {
    stockQty: 0,
  },
};

export const NoPulse: Story = {
  args: {
    stockQty: 5,
    showPulse: false,
  },
};

export const NoBackground: Story = {
  args: {
    stockQty: 15,
    showBackground: false,
  },
};

export const CustomStyle: Story = {
  args: {
    stockQty: 8,
    className: 'text-lg',
  },
};