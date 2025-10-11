import type { Meta, StoryObj } from '@storybook/react';
import { CartDrawer } from './CartDrawer';
import { BrowserRouter } from 'react-router-dom';

const meta: Meta<typeof CartDrawer> = {
  title: 'Organisms/CartDrawer',
  component: CartDrawer,
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <BrowserRouter>
        <div style={{ minHeight: '500px', position: 'relative' }}>
          <Story />
        </div>
      </BrowserRouter>
    ),
  ],
  parameters: {
    layout: 'fullscreen',
  },
};

export default meta;
type Story = StoryObj<typeof CartDrawer>;

const mockUseCartStore = (cartState: any) => () => cartState;

export const Closed: Story = {
  args: {
    isOpen: false,
    onClose: () => console.log('Close drawer'),
  },
  parameters: {
    docs: {
      description: {
        story: 'Drawer is closed and not visible.',
      },
    },
  },
};

export const OpenEmpty: Story = {
  args: {
    isOpen: true,
    onClose: () => console.log('Close drawer'),
  },
  decorators: [
    (Story) => {
      require('../../lib/store').useCartStore = mockUseCartStore({
        items: [],
        updateQuantity: () => {},
        removeItem: () => {},
        getTotalPrice: () => 0,
        clearCart: () => {},
      });
      return <Story />;
    },
  ],
  parameters: {
    docs: {
      description: {
        story: 'Drawer is open with empty cart state.',
      },
    },
  },
};

export const OpenWithItems: Story = {
  args: {
    isOpen: true,
    onClose: () => console.log('Close drawer'),
  },
  decorators: [
    (Story) => {
      require('../../lib/store').useCartStore = mockUseCartStore({
        items: [
          {
            productId: '1',
            title: 'Wireless Headphones',
            price: 199.99,
            quantity: 1,
            stockQty: 10,
            image: '/headphones.jpg',
          },
          {
            productId: '2',
            title: 'Phone Case',
            price: 29.99,
            quantity: 2,
            stockQty: 50,
            image: '/case.jpg',
          },
        ],
        updateQuantity: () => {},
        removeItem: () => {},
        getTotalPrice: () => 259.97,
        clearCart: () => {},
      });
      return <Story />;
    },
  ],
  parameters: {
    docs: {
      description: {
        story: 'Drawer is open with items in the cart.',
      },
    },
  },
};

export const MultipleItems: Story = {
  args: {
    isOpen: true,
    onClose: () => console.log('Close drawer'),
  },
  decorators: [
    (Story) => {
      const manyItems = {
        items: Array.from({ length: 8 }, (_, i) => ({
          productId: `${i + 1}`,
          title: `Product ${i + 1}`,
          price: 19.99 * (i + 1),
          quantity: 1,
          stockQty: 10,
          image: `/product-${i + 1}.jpg`,
        })),
        updateQuantity: () => {},
        removeItem: () => {},
        getTotalPrice: () => 799.84,
        clearCart: () => {},
      };

      require('../../lib/store').useCartStore = mockUseCartStore(manyItems);
      return <Story />;
    },
  ],
  parameters: {
    docs: {
      description: {
        story: 'Drawer with multiple cart items showing scroll behavior.',
      },
    },
  },
};