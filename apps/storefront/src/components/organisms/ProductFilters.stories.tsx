import type { Meta, StoryObj } from '@storybook/react'
import { ProductFilters } from './ProductFilters'

const meta: Meta<typeof ProductFilters> = {
  title: 'Organisms/ProductFilters',
  component: ProductFilters,
}

export default meta
type Story = StoryObj<typeof ProductFilters>

export const Default: Story = {
  args: {
    onSortChange: (sort) => console.log('Sort changed:', sort),
    onTagFilter: (tags) => console.log('Tags filtered:', tags),
    availableTags: ['electronics', 'clothing', 'books', 'home', 'sports'],
  },
}

export const WithInitialSort: Story = {
  args: {
    ...Default.args,
    initialSort: 'price', // FIXED: Changed from 'price-asc' to match your Product type
  },
}

export const FewTags: Story = {
  args: {
    ...Default.args,
    availableTags: ['sale', 'new'],
  },
}

export const ManyTags: Story = {
  args: {
    ...Default.args,
    availableTags: [
      'electronics',
      'clothing', 
      'books',
      'home',
      'sports',
      'beauty',
      'toys',
      'garden',
      'kitchen'
    ],
  },
}
