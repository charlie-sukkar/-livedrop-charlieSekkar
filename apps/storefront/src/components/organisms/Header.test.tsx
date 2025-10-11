import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Header } from './Header';
import { BrowserRouter } from 'react-router-dom';

const MockRouter = ({ children }: { children: React.ReactNode }) => (
  <BrowserRouter>{children}</BrowserRouter>
);

describe('Header', () => {
  const defaultProps = {
    label: 'My Store',
    src: '/logo.png',
  };

  it('renders header with logo and navigation', () => {
    render(
      <MockRouter>
        <Header {...defaultProps} />
      </MockRouter>
    );

    expect(screen.getByRole('banner')).toBeInTheDocument();
    expect(screen.getByText('My Store')).toBeInTheDocument();
  });

  it('renders support and cart buttons when ShowCartButton is true', () => {
    render(
      <MockRouter>
        <Header {...defaultProps} ShowCartButton={true} />
      </MockRouter>
    );

    expect(screen.getByLabelText('Open support assistant')).toBeInTheDocument();
    expect(screen.getByLabelText('Open cart with 0 items')).toBeInTheDocument();
  });

  it('does not render cart button when ShowCartButton is false', () => {
    render(
      <MockRouter>
        <Header {...defaultProps} ShowCartButton={false} />
      </MockRouter>
    );

    expect(screen.getByLabelText('Open support assistant')).toBeInTheDocument();
    expect(screen.queryByLabelText('Open cart with 0 items')).not.toBeInTheDocument();
  });
});