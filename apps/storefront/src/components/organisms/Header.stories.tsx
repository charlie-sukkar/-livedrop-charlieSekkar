import type { Meta, StoryObj } from '@storybook/react';
import { Header } from './Header';
import { BrowserRouter } from 'react-router-dom';

// Mock the useUser hook
jest.mock('../../contexts/UserContext', () => ({
  useUser: jest.fn()
}));



const meta: Meta<typeof Header> = {
  title: 'Organisms/Header',
  component: Header,
  parameters: {
    layout: 'fullscreen',
  },
  decorators: [
    (Story) => (
      <BrowserRouter>
        <Story />
      </BrowserRouter>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof Header>;

// Mock data
const mockCustomer = {
  _id: 'cust01',
  name: 'Sarah Khoury',
  email: 'demo@example.com',
  phone: '+961-70-123456',
  createdAt: '2024-08-10T14:30:00Z'
};

export const Default: Story = {
  args: {
    label: 'My Awesome Store',
    src: '/logo.png',
    ShowCartButton: true,
  },
  parameters: {
    // Mock the useUser hook to return no customer
    useUser: () => ({
      customer: null,
      login: () => {},
      logout: () => {},
      isLoading: false
    })
  },
};

export const LoggedIn: Story = {
  args: {
    label: 'My Awesome Store',
    src: '/logo.png',
    ShowCartButton: true,
  },
  parameters: {
    // Mock the useUser hook to return a logged-in customer
    useUser: () => ({
      customer: mockCustomer,
      login: () => {},
      logout: () => {},
      isLoading: false
    })
  },
};

export const LoggedInNoCart: Story = {
  args: {
    label: 'My Awesome Store',
    src: '/logo.png',
    ShowCartButton: false,
  },
  parameters: {
    useUser: () => ({
      customer: mockCustomer,
      login: () => {},
      logout: () => {},
      isLoading: false
    })
  },
};

export const WithLongStoreName: Story = {
  args: {
    label: 'Premium Electronics & Gadgets Store',
    src: '/logo.png',
    ShowCartButton: true,
  },
  parameters: {
    useUser: () => ({
      customer: null,
      login: () => {},
      logout: () => {},
      isLoading: false
    })
  },
};

export const Minimal: Story = {
  args: {
    label: 'Store',
    src: '/logo.png',
    ShowCartButton: false,
  },
  parameters: {
    useUser: () => ({
      customer: null,
      login: () => {},
      logout: () => {},
      isLoading: false
    })
  },
};