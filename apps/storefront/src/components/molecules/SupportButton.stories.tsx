import type { Meta, StoryObj } from '@storybook/react';
import { SupportButton } from './SupportButton';

const meta: Meta<typeof SupportButton> = {
  title: 'Components/SupportButton',
  component: SupportButton,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof SupportButton>;

export const Default: Story = {
  args: {},
};

export const Disabled: Story = {
  args: {
    disabled: true,
  },
};

export const WithCustomClass: Story = {
  args: {
    className: 'border-2 border-blue-500',
  },
};