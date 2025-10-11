import type { Meta, StoryObj } from '@storybook/react';
import { OrderDate } from './OrderDate';

const meta: Meta<typeof OrderDate> = {
  title: 'Components/OrderDate',
  component: OrderDate,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    timestamp: {
      control: 'number',
      description: 'Unix timestamp in milliseconds',
    },
    showTime: {
      control: 'boolean',
      description: 'Whether to show time along with date',
    },
    className: {
      control: 'text',
      description: 'Additional CSS classes',
    },
  },
};

export default meta;
type Story = StoryObj<typeof OrderDate>;

// Common timestamps for consistent stories
const sampleTimestamps = {
  recent: Date.now() - 86400000, // 1 day ago
  lastWeek: Date.now() - 604800000, // 1 week ago
  lastMonth: Date.now() - 2592000000, // 30 days ago
  future: Date.now() + 86400000, // 1 day in future
};

export const DateOnly: Story = {
  args: {
    timestamp: sampleTimestamps.recent,
    showTime: false,
  },
  name: 'Date Only',
};

export const WithTime: Story = {
  args: {
    timestamp: sampleTimestamps.recent,
    showTime: true,
  },
  name: 'With Time',
};

export const LastWeek: Story = {
  args: {
    timestamp: sampleTimestamps.lastWeek,
    showTime: false,
  },
  name: 'Last Week',
};

export const LastWeekWithTime: Story = {
  args: {
    timestamp: sampleTimestamps.lastWeek,
    showTime: true,
  },
  name: 'Last Week with Time',
};

export const LastMonth: Story = {
  args: {
    timestamp: sampleTimestamps.lastMonth,
    showTime: false,
  },
  name: 'Last Month',
};

export const FutureDate: Story = {
  args: {
    timestamp: sampleTimestamps.future,
    showTime: true,
  },
  name: 'Future Date',
};

export const WithCustomClassName: Story = {
  args: {
    timestamp: sampleTimestamps.recent,
    showTime: true,
    className: 'text-blue-600 font-semibold',
  },
  name: 'With Custom ClassName',
};

export const DifferentLocales: Story = {
  args: {
    timestamp: sampleTimestamps.recent,
    showTime: true,
  },
  name: 'Different Locales (US Format)',
  parameters: {
    docs: {
      description: {
        story: 'The component uses en-US locale by default for consistent formatting across the application.',
      },
    },
  },
};