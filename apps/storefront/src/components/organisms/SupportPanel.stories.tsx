import type { Meta, StoryObj } from '@storybook/react';
import { SupportPanel } from './SupportPanel';

const meta: Meta<typeof SupportPanel> = {
  title: 'Organisms/SupportPanel',
  component: SupportPanel,
  parameters: {
    layout: 'fullscreen',
  },
};

export default meta;
type Story = StoryObj<typeof SupportPanel>;

export const Default: Story = {
  args: {
    isOpen: true,
    onClose: () => console.log('Close support panel'),
  },
};

export const Closed: Story = {
  args: {
    isOpen: false,
    onClose: () => console.log('Close support panel'),
  },
};

export const WithKeyboardNavigation: Story = {
  args: {
    isOpen: true,
    onClose: () => console.log('Close support panel'),
  },
  parameters: {
    a11y: {
      config: {
        rules: [
          {
            id: 'aria-modal-true',
            enabled: false,
          },
        ],
      },
    },
  },
};