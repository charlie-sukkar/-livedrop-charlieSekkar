import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { OrderDetails } from './OrderDetails'

describe('OrderDetails', () => {
  const defaultProps = {
    orderId: 'ORD-12345',
    status: 'shipped',
    createdAt: 1700000000000,
  }

  it('renders all required order information', () => {
    render(<OrderDetails {...defaultProps} />)

    expect(screen.getByText('Order Details')).toBeInTheDocument()
    expect(screen.getByText('ORD-12345')).toBeInTheDocument()
    expect(screen.getByText('shipped')).toBeInTheDocument()
  })

  it('renders optional fields when provided', () => {
    const propsWithOptional = {
      ...defaultProps,
      carrier: 'FedEx',
      eta: '2024-01-15',
    }

    render(<OrderDetails {...propsWithOptional} />)

    expect(screen.getByText('FedEx')).toBeInTheDocument()
    expect(screen.getByText('2024-01-15')).toBeInTheDocument()
  })

  it('does not render optional fields when not provided', () => {
    render(<OrderDetails {...defaultProps} />)

    expect(screen.queryByText('Shipping Carrier')).not.toBeInTheDocument()
    expect(screen.queryByText('Estimated Delivery')).not.toBeInTheDocument()
  })

  it('renders help section', () => {
    render(<OrderDetails {...defaultProps} />)

    expect(screen.getByText(/Need help with your order?/)).toBeInTheDocument()
  })

  it('formats status with capitalization', () => {
    render(<OrderDetails {...defaultProps} status="processing" />)

    const statusElement = screen.getByText('processing')
    expect(statusElement).toHaveClass('capitalize')
  })

  it('renders order ID with code styling', () => {
    render(<OrderDetails {...defaultProps} />)

    const orderIdElement = screen.getByText('ORD-12345')
    expect(orderIdElement).toHaveClass('bg-gray-100')
    expect(orderIdElement.tagName).toBe('CODE')
  })
})