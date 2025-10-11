import type { Meta, StoryObj } from '@storybook/react';
import { OrderInfoItem } from './OrderInfoItem';

const meta: Meta<typeof OrderInfoItem> = {
  title: 'Components/OrderInfoItem',
  component: OrderInfoItem,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
  argTypes: {
    label: {
      control: 'text',
      description: 'Label for the information item',
    },
    value: {
      control: 'text',
      description: 'Value content (can be string, number, or React node)',
    },
    className: {
      control: 'text',
      description: 'Additional CSS classes',
    },
  },
};

export default meta;
type Story = StoryObj<typeof OrderInfoItem>;

export const Default: Story = {
  args: {
    label: 'Order ID',
    value: 'ORD-123456',
  },
  name: 'Default',
};

export const WithLongValue: Story = {
  args: {
    label: 'Shipping Address',
    value: '123 Main Street, Suite 100, San Francisco, CA 94105, United States of America',
  },
  name: 'With Long Value',
};

export const WithNumberValue: Story = {
  args: {
    label: 'Quantity',
    value: 5,
  },
  name: 'With Number Value',
};

export const WithReactNodeValue: Story = {
  args: {
    label: 'Status',
    value: (
      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
        Completed
      </span>
    ),
  },
  name: 'With React Node Value',
};

export const WithCustomClassName: Story = {
  args: {
    label: 'Total Amount',
    value: '$149.99',
    className: 'border-b border-gray-200 pb-2',
  },
  name: 'With Custom ClassName',
};

export const MultipleItems: Story = {
  render: () => (
    <div className="space-y-4">
      <OrderInfoItem label="Order ID" value="ORD-123456" />
      <OrderInfoItem label="Customer" value="John Doe" />
      <OrderInfoItem label="Email" value="john.doe@example.com" />
      <OrderInfoItem label="Phone" value="+1 (555) 123-4567" />
      <OrderInfoItem 
        label="Status" 
        value={
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
            Processing
          </span>
        } 
      />
    </div>
  ),
  name: 'Multiple Items Example',
};

export const WithComplexReactNode: Story = {
  args: {
    label: 'Tracking Info',
    value: (
      <div className="flex items-center gap-2">
        <span>UPS: 1Z999AA10123456784</span>
        <button className="text-blue-600 hover:text-blue-800 text-xs underline">
          Track
        </button>
      </div>
    ),
  },
  name: 'With Complex React Node',
};

export const EmptyValue: Story = {
  args: {
    label: 'Notes',
    value: '—',
  },
  name: 'Empty Value',
};