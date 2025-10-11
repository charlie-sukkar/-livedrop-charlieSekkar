import type { Meta, StoryObj } from '@storybook/react';
import { OrderStatusBadge } from './OrderStatusBadge';

const meta: Meta<typeof OrderStatusBadge> = {
  title: 'Components/OrderStatusBadge',
  component: OrderStatusBadge,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof OrderStatusBadge>;

export const AllStatuses = () => (
  <div className="space-y-2">
    <OrderStatusBadge status="Placed" />
    <OrderStatusBadge status="Packed" />
    <OrderStatusBadge status="Shipped" />
    <OrderStatusBadge status="Delivered" />
    <OrderStatusBadge status="NotFound" />
  </div>
);

export const Placed: Story = { args: { status: 'Placed' } };
export const Packed: Story = { args: { status: 'Packed' } };
export const Shipped: Story = { args: { status: 'Shipped' } };
export const Delivered: Story = { args: { status: 'Delivered' } };
export const NotFound: Story = { args: { status: 'NotFound' } };

export const WithCustomClass: Story = {
  args: { 
    status: 'Shipped',
    className: 'text-lg' 
  },
};