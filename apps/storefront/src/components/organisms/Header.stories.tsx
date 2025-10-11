import type { Meta, StoryObj } from '@storybook/react';
import { Header } from './Header';

const meta: Meta<typeof Header> = {
  title: 'Organisms/Header',
  component: Header,
  parameters: {
    layout: 'fullscreen',
  },
};

export default meta;
type Story = StoryObj<typeof Header>;

export const Default: Story = {
  args: {
    label: 'My Awesome Store',
    src: '/logo.png',
    ShowCartButton: true,
  },
};

export const WithLongStoreName: Story = {
  args: {
    label: 'Premium Electronics & Gadgets Store',
    src: '/logo.png',
    ShowCartButton: true,
  },
};

export const Minimal: Story = {
  args: {
    label: 'Store',
    src: '/logo.png',
    ShowCartButton: false,
  },
};