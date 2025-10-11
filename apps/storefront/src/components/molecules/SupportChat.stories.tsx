import type { Meta, StoryObj } from '@storybook/react';
import { SupportChat } from './SupportChat';

const meta: Meta<typeof SupportChat> = {
  title: 'Components/SupportChat',
  component: SupportChat,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof SupportChat>;

export const Default: Story = {
  args: {},
};

export const WithInitialInteraction: Story = {
  args: {},
  parameters: {
    docs: {
      description: {
        story: 'Shows the chat interface with the initial welcome message ready for user interaction.',
      },
    },
  },
};