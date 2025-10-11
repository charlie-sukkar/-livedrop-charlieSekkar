import type { Meta, StoryObj } from '@storybook/react';
import { OrderHeader } from './OrderHeader';

const meta: Meta<typeof OrderHeader> = {
  title: 'Components/OrderHeader',
  component: OrderHeader,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof OrderHeader>;

export const Delivered: Story = {
  args: {
    orderId: 'ORD-123456',
    status: 'Delivered',
    createdAt: Date.now() - 86400000, // 1 day ago
  },
};

export const Shipped: Story = {
  args: {
    orderId: 'ORD-789012',
    status: 'Shipped',
    createdAt: Date.now() - 172800000, // 2 days ago
  },
};

export const Processing: Story = {
  args: {
    orderId: 'ORD-345678',
    status: 'Placed',
    createdAt: Date.now() - 3600000, // 1 hour ago
  },
};

export const LongOrderId: Story = {
  args: {
    orderId: 'ORD-2024-001-123456789',
    status: 'Packed',
    createdAt: Date.now() - 432000000, // 5 days ago
  },
};