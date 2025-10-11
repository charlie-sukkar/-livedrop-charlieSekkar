import type { Meta, StoryObj } from '@storybook/react';
import { CartButton } from './CartButton';

const meta: Meta<typeof CartButton> = {
  title: 'Components/CartButton',
  component: CartButton,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof CartButton>;

export const Empty: Story = {
  args: {},
};

export const WithItems: Story = {
  args: {},
  parameters: {
    // This would require mocking the store in Storybook
    docs: {
      description: {
        story: 'Shows badge with item count when cart has items',
      },
    },
  },
};

export const Disabled: Story = {
  args: {
    disabled: true,
  },
};

export const CustomStyle: Story = {
  args: {
    className: 'border-2',
  },
};