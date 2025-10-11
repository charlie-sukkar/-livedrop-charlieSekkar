import type { Meta, StoryObj } from '@storybook/react';
import { OrderTimeline } from './OrderTimeline';

const meta: Meta<typeof OrderTimeline> = {
  title: 'Components/OrderTimeline',
  component: OrderTimeline,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof OrderTimeline>;

export const OrderPlaced: Story = {
  args: {
    currentStatus: 'Placed',
  },
};

export const Packed: Story = {
  args: {
    currentStatus: 'Packed',
  },
};

export const Shipped: Story = {
  args: {
    currentStatus: 'Shipped',
  },
};

export const Delivered: Story = {
  args: {
    currentStatus: 'Delivered',
  },
};