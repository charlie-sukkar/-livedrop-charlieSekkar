import type { Meta, StoryObj } from '@storybook/react';
import { Input } from './Input';

const meta: Meta<typeof Input> = {
  title: 'Components/Input',
  component: Input,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    label: {
      control: 'text',
      description: 'Input label',
    },
    error: {
      control: 'text',
      description: 'Error message',
    },
    disabled: {
      control: 'boolean',
      description: 'Disabled state',
    },
    placeholder: {
      control: 'text',
      description: 'Placeholder text',
    },
    type: {
      control: 'select',
      options: ['text', 'email', 'password', 'number', 'tel', 'url'],
      description: 'Input type',
    },
  },
};

export default meta;
type Story = StoryObj<typeof Input>;

export const Default: Story = {
  args: {
    placeholder: 'Enter text...',
  },
};

export const WithLabel: Story = {
  args: {
    label: 'Email address',
    placeholder: 'you@example.com',
    type: 'email',
  },
  name: 'With Label',
};

export const WithError: Story = {
  args: {
    label: 'Email address',
    placeholder: 'you@example.com',
    error: 'Please enter a valid email address',
    defaultValue: 'invalid-email',
  },
  name: 'With Error',
};

export const Disabled: Story = {
  args: {
    label: 'Disabled input',
    placeholder: 'Cannot edit this...',
    disabled: true,
    defaultValue: 'Disabled value',
  },
  name: 'Disabled',
};

export const Password: Story = {
  args: {
    label: 'Password',
    type: 'password',
    placeholder: 'Enter your password',
  },
  name: 'Password Type',
};

export const Number: Story = {
  args: {
    label: 'Age',
    type: 'number',
    placeholder: 'Enter your age',
    min: 0,
    max: 120,
  },
  name: 'Number Type',
};

export const WithCustomClassName: Story = {
  args: {
    label: 'Custom Styled',
    className: 'border-2 border-purple-500 focus:ring-purple-500',
    placeholder: 'Custom styling...',
  },
  name: 'With Custom ClassName',
};