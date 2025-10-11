import type { Meta, StoryObj } from '@storybook/react'
import { OrderDetails } from './OrderDetails'

const meta: Meta<typeof OrderDetails> = {
  title: 'Organisms/OrderDetails',
  component: OrderDetails,
}

export default meta
type Story = StoryObj<typeof OrderDetails>

export const Default: Story = {
  args: {
    orderId: 'ORD-12345',
    status: 'processing',
    createdAt: 1700000000000,
  },
}

export const Shipped: Story = {
  args: {
    orderId: 'ORD-67890',
    status: 'shipped',
    createdAt: 1700086400000,
    carrier: 'UPS',
    eta: '2024-01-20',
  },
}

export const Delivered: Story = {
  args: {
    orderId: 'ORD-11111',
    status: 'delivered',
    createdAt: 1699913600000,
    carrier: 'FedEx',
  },
}

export const WithAllDetails: Story = {
  args: {
    orderId: 'ORD-99999',
    status: 'in_transit',
    createdAt: 1700172800000,
    carrier: 'DHL',
    eta: '2024-01-25',
  },
}