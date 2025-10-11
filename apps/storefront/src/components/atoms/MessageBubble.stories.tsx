import type { Meta, StoryObj } from '@storybook/react';
import { MessageBubble } from './MessageBubble';

const meta: Meta<typeof MessageBubble> = {
  title: 'Components/MessageBubble',
  component: MessageBubble,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    isUser: {
      control: 'boolean',
      description: 'Whether the message is from the user',
    },
    message: {
      control: 'text',
      description: 'The message content',
    },
    timestamp: {
      control: 'text',
      description: 'Timestamp for the message',
    },
    citation: {
      control: 'text',
      description: 'Citation or source reference',
    },
  },
};

export default meta;
type Story = StoryObj<typeof MessageBubble>;

export const UserMessage: Story = {
  args: {
    message: 'Hello, I need help with my account.',
    isUser: true,
    timestamp: '2:30 PM',
  },
  name: 'User Message',
};

export const SupportMessage: Story = {
  args: {
    message: 'Hello! I\'d be happy to help you with your account issues. Could you please tell me more about what you\'re experiencing?',
    isUser: false,
    timestamp: '2:31 PM',
  },
  name: 'Support Message',
};

export const UserMessageWithCitation: Story = {
  args: {
    message: 'I read in your documentation that I should reset my password, but it\'s not working.',
    isUser: true,
    timestamp: '2:32 PM',
    citation: 'Doc v2.1',
  },
  name: 'User Message with Citation',
};

export const SupportMessageWithCitation: Story = {
  args: {
    message: 'According to our troubleshooting guide, you might need to clear your browser cache before resetting the password. Let me guide you through the process.',
    isUser: false,
    timestamp: '2:33 PM',
    citation: 'Troubleshooting Guide',
  },
  name: 'Support Message with Citation',
};

export const LongMessage: Story = {
  args: {
    message: 'This is a longer message that should wrap properly and demonstrate how the component handles multi-line content. The bubble should expand to accommodate the text while maintaining proper padding and readability.',
    isUser: false,
    timestamp: '2:34 PM',
  },
  name: 'Long Message',
};

export const MinimalUserMessage: Story = {
  args: {
    message: 'OK',
    isUser: true,
  },
  name: 'Minimal User Message',
};

export const MinimalSupportMessage: Story = {
  args: {
    message: 'Got it',
    isUser: false,
  },
  name: 'Minimal Support Message',
};

export const MessageWithOnlyCitation: Story = {
  args: {
    message: 'This information comes from our knowledge base.',
    isUser: false,
    citation: 'KB Article #123',
  },
  name: 'Message with Only Citation',
};

export const MessageWithOnlyTimestamp: Story = {
  args: {
    message: 'Message sent just now.',
    isUser: true,
    timestamp: 'Just now',
  },
  name: 'Message with Only Timestamp',
};