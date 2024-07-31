import React from 'react';
import { render } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';

// Mock the useAuth hook
jest.mock('./context/AuthContext', () => {
  const originalModule = jest.requireActual('./context/AuthContext');
  return {
    ...originalModule,
    useAuth: jest.fn(),
  };
});

const renderWithRouterAndAuth = (ui, { route = '/', currentUser } = {}) => {
  window.history.pushState({}, 'Test page', route);

  // Mock current user
  useAuth.mockReturnValue({
    currentUser: currentUser || { email: 'testuser@example.com' },
  });

  return render(ui, {
    wrapper: ({ children }) => (
      <AuthProvider>
        <BrowserRouter>{children}</BrowserRouter>
      </AuthProvider>
    ),
  });
};

export default renderWithRouterAndAuth;
