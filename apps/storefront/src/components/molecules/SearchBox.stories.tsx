import type { Meta, StoryObj } from '@storybook/react';
import { SearchBox } from './SearchBox';

const meta: Meta<typeof SearchBox> = {
  title: 'Components/SearchBox',
  component: SearchBox,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof SearchBox>;

export const Default: Story = {
  args: {
    value: '',
    onChange: (value) => console.log('Search:', value),
  },
};

export const WithValue: Story = {
  args: {
    value: 'wireless headphones',
    onChange: (value) => console.log('Search:', value),
  },
};

export const CustomPlaceholder: Story = {
  args: {
    value: '',
    onChange: (value) => console.log('Search:', value),
    placeholder: 'Find products...',
  },
};
