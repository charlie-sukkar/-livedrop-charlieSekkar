import type { Meta, StoryObj } from '@storybook/react';
import { ShippingInfo } from './ShippingInfo';

const meta: Meta<typeof ShippingInfo> = {
  title: 'Components/ShippingInfo',
  component: ShippingInfo,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof ShippingInfo>;

export const WithCarrierAndETA: Story = {
  args: {
    carrier: 'UPS',
    eta: 'December 15, 2024',
    status: 'Shipped',
  },
};

export const CarrierOnly: Story = {
  args: {
    carrier: 'FedEx',
    status: 'Shipped',
  },
};

export const ETAOnly: Story = {
  args: {
    eta: 'December 20, 2024',
    status: 'Shipped',
  },
};

export const NoDetails: Story = {
  args: {
    status: 'Shipped',
  },
};

export const Delivered: Story = {
  args: {
    status: 'Delivered',
  },
};

export const PackedStatus: Story = {
  args: {
    status: 'Packed',
  },
};