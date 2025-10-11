import type { Meta, StoryObj } from '@storybook/react';
import { Select } from './Select';

const meta: Meta<typeof Select> = {
  title: 'Components/Select',
  component: Select,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Select>;

const defaultOptions = [
  { value: 'us', label: 'United States' },
  { value: 'ca', label: 'Canada' },
  { value: 'uk', label: 'United Kingdom' },
];

export const Default: Story = {
  args: {
    options: defaultOptions,
  },
};

export const WithLabel: Story = {
  args: {
    label: 'Country',
    options: defaultOptions,
  },
};

export const Disabled: Story = {
  args: {
    label: 'Country',
    options: defaultOptions,
    disabled: true,
  },
};

export const WithDefaultValue: Story = {
  args: {
    label: 'Country',
    options: defaultOptions,
    defaultValue: 'ca',
  },
};

export const Required: Story = {
  args: {
    label: 'Country',
    options: defaultOptions,
    required: true,
  },
};