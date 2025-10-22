
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { Header } from './Header';
import { UserContext } from '../../contexts/UserContext';

describe('Header', () => {
  it('renders basic elements without crashing', () => {
    const contextValue = {
      customer: null,
      logout: () => {},
      login: () => {},
      isLoading: false,
    };

    render(
      <BrowserRouter>
        <UserContext.Provider value={contextValue}>
          <Header label="Test Store" src="/test.png" />
        </UserContext.Provider>
      </BrowserRouter>
    );

    // Just test that it renders without crashing
    expect(screen.getByAltText('Store Logo')).toBeInTheDocument();
  });

  it('shows store name', () => {
    const contextValue = {
      customer: null,
      logout: () => {},
      login: () => {},
      isLoading: false,
    };

    render(
      <BrowserRouter>
        <UserContext.Provider value={contextValue}>
          <Header label="Test Store" src="/test.png" />
        </UserContext.Provider>
      </BrowserRouter>
    );

    expect(screen.getByText('Test Store')).toBeInTheDocument();
  });
});