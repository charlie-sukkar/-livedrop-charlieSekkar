import type { Meta, StoryObj } from '@storybook/react';
import { Tag } from './Tag';

const meta: Meta<typeof Tag> = {
  title: 'Components/Tag',
  component: Tag,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Tag>;

export const Default: Story = {
  args: {
    label: 'JavaScript',
  },
};

export const Active: Story = {
  args: {
    label: 'React',
    isActive: true,
  },
};

export const Removable: Story = {
  args: {
    label: 'TypeScript',
    removable: true,
  },
};

export const Clickable: Story = {
  args: {
    label: 'Vue',
    onClick: () => console.log('Tag clicked'),
  },
};

export const ClickableAndRemovable: Story = {
  args: {
    label: 'Angular',
    isActive: true,
    removable: true,
    onClick: () => console.log('Tag clicked'),
    onRemove: () => console.log('Tag removed'),
  },
};

export const WithCustomClass: Story = {
  args: {
    label: 'Svelte',
    className: 'text-lg',
  },
};