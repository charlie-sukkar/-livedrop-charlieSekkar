import type { Meta, StoryObj } from '@storybook/react';
import { Icon } from './Icon';

const meta: Meta<typeof Icon> = {
  title: 'Components/Icon',
  component: Icon,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    className: {
      control: 'text',
      description: 'Additional CSS classes',
    },
    d: {
      control: 'text',
      description: 'SVG path data',
    },
  },
};

export default meta;
type Story = StoryObj<typeof Icon>;

// Common SVG paths
const iconPaths = {
  home: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6',
  user: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z',
  settings: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z',
  search: 'M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z',
};

export const Default: Story = {
  args: {
    d: iconPaths.home,
  },
};

export const UserIcon: Story = {
  args: {
    d: iconPaths.user,
    className: 'text-blue-500',
  },
  name: 'User Icon',
};

export const SettingsIcon: Story = {
  args: {
    d: iconPaths.settings,
    className: 'text-gray-600',
  },
  name: 'Settings Icon',
};

export const SearchIcon: Story = {
  args: {
    d: iconPaths.search,
    className: 'text-green-500',
  },
  name: 'Search Icon',
};

export const LargeIcon: Story = {
  args: {
    d: iconPaths.home,
    className: 'w-12 h-12 text-red-500',
  },
  name: 'Large Icon',
};

export const CustomPath: Story = {
  args: {
    d: 'M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5',
    className: 'text-purple-500',
  },
  name: 'Custom Path Icon',
};