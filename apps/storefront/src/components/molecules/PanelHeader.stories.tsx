import type { Meta, StoryObj } from '@storybook/react';
import { PanelHeader } from './PanelHeader';
import { Icon } from '../atoms/Icon';

const meta: Meta<typeof PanelHeader> = {
  title: 'Atoms/PanelHeader',
  component: PanelHeader,
  parameters: {
    layout: 'fullscreen',
  },
};

export default meta;
type Story = StoryObj<typeof PanelHeader>;

export const CartVariant: Story = {
  args: {
    title: 'Shopping Cart',
    onClose: () => console.log('Close cart panel'),
    variant: 'cart',
  },
};

export const SupportVariant: Story = {
  args: {
    title: 'Support Assistant',
    onClose: () => console.log('Close support panel'),
    variant: 'support',
    icon: (
      <Icon
        className="h-6 w-6 text-white"
        d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
      />
    ),
  },
};