import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import Signup from '../Pages/Signup';
import { AuthProvider } from '../context/AuthContext';
import { BrowserRouter as Router } from 'react-router-dom';


jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => jest.fn(),
}));


jest.mock('../context/AuthContext', () => ({
  ...jest.requireActual('../context/AuthContext'),
  useAuth: () => ({
    login: jest.fn().mockImplementation(() => Promise.resolve()),
  }),
}));

describe('Signup Component', () => {
  test('renders the login form', () => {
    render(
      <Router>
        <AuthProvider>
          <Signup />
        </AuthProvider>
      </Router>
    );

    expect(screen.getByLabelText(/Email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Password/i)).toBeInTheDocument();
    expect(screen.getByText(/Log in/i)).toBeInTheDocument();
  });

  test('allows the user to log in', async () => {
    render(
      <Router>
        <AuthProvider>
          <Signup />
        </AuthProvider>
      </Router>
    );

    const emailInput = screen.getByLabelText(/Email/i);
    const passwordInput = screen.getByLabelText(/Password/i);
    const loginButton = screen.getByText(/Log in/i);

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'Password123!' } });

    fireEvent.click(loginButton);

    await waitFor(() => {
      expect(screen.queryByText(/Failed to login/i)).not.toBeInTheDocument();
    });
  });

  test('displays an error when login fails', async () => {
    jest.mock('../context/AuthContext', () => ({
      ...jest.requireActual('../context/AuthContext'),
      useAuth: () => ({
        login: jest.fn().mockImplementation(() => Promise.reject(new Error('Failed to login'))),
      }),
    }));

    render(
      <Router>
        <AuthProvider>
          <Signup />
        </AuthProvider>
      </Router>
    );

    const emailInput = screen.getByLabelText(/Email/i);
    const passwordInput = screen.getByLabelText(/Password/i);
    const loginButton = screen.getByText(/Log in/i);

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'Password123!' } });

    fireEvent.click(loginButton);

    await waitFor(() => {
      expect(screen.getByText(/Failed to login/i)).toBeInTheDocument();
    });
  });
});
