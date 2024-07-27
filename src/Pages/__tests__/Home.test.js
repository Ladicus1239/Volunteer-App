import React from 'react';
import { screen, act } from '@testing-library/react';
import Home from '../Home';
import renderWithRouterAndAuth from '../../test-router';
import { useAuth } from '../../context/AuthContext';


jest.mock('../../context/AuthContext', () => {
  const originalModule = jest.requireActual('../../context/AuthContext');
  return {
    ...originalModule,
    useAuth: jest.fn(),
  };
});

describe('Home Page', () => {
  beforeEach(() => {
    
    useAuth.mockReturnValue({
      currentUser: { email: 'testuser@example.com' },
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('renders Home Page', async () => {
    await act(async () => {
      renderWithRouterAndAuth(<Home />, { route: '/' });
    });

    
    const homePageText = screen.getByText(/Home Page/i);
    expect(homePageText).toBeInTheDocument();

   
    const welcomeMessage = screen.getByText(/Welcome testuser@example.com/i);
    expect(welcomeMessage).toBeInTheDocument();
  });
});
