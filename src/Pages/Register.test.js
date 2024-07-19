import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import Signup from '../Pages/Signup';
import { AuthProvider } from '../context/AuthContext';
import { BrowserRouter as Router } from 'react-router-dom';

// Mock useNavigate from react-router-dom
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => jest.fn(),
}));

// Mock useAuth from AuthContext
jest.mock('../context/AuthContext', () => ({
  ...jest.requireActual('../context/AuthContext'),
  useAuth: () => ({
    signup: jest.fn().mockImplementation(() => Promise.resolve()),
  }),
}));

describe('Signup Component', () => {
  test('renders the registration form', () => {
    render(
      <Router>
        <AuthProvider>
          <Signup />
        </AuthProvider>
      </Router>
    );

    expect(screen.getByLabelText(/Email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Password/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Confirm Password/i)).toBeInTheDocument();
    expect(screen.getByText(/Sign Up/i)).toBeInTheDocument();
  });

  test('allows the user to sign up', async () => {
    render(
      <Router>
        <AuthProvider>
          <Signup />
        </AuthProvider>
      </Router>
    );

    const emailInput = screen.getByLabelText(/Email/i);
    const passwordInput = screen.getByLabelText(/Password/i);
    const passwordConfirmInput = screen.getByLabelText(/Confirm Password/i);
    const signupButton = screen.getByText(/Sign Up/i);

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'Password123!' } });
    fireEvent.change(passwordConfirmInput, { target: { value: 'Password123!' } });

    fireEvent.click(signupButton);

    await waitFor(() => {
      expect(screen.queryByText(/Failed to create an account/i)).not.toBeInTheDocument();
    });
  });

  test('displays an error when passwords do not match', async () => {
    render(
      <Router>
        <AuthProvider>
          <Signup />
        </AuthProvider>
      </Router>
    );

    const emailInput = screen.getByLabelText(/Email/i);
    const passwordInput = screen.getByLabelText(/Password/i);
    const passwordConfirmInput = screen.getByLabelText(/Confirm Password/i);
    const signupButton = screen.getByText(/Sign Up/i);

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'Password123!' } });
    fireEvent.change(passwordConfirmInput, { target: { value: 'DifferentPassword123!' } });

    fireEvent.click(signupButton);

    await waitFor(() => {
      expect(screen.getByText(/Passwords do not match/i)).toBeInTheDocument();
    });
  });

  test('displays an error when signup fails', async () => {
    jest.mock('../context/AuthContext', () => ({
      ...jest.requireActual('../context/AuthContext'),
      useAuth: () => ({
        signup: jest.fn().mockImplementation(() => Promise.reject(new Error('Failed to create an account'))),
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
    const passwordConfirmInput = screen.getByLabelText(/Confirm Password/i);
    const signupButton = screen.getByText(/Sign Up/i);

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'Password123!' } });
    fireEvent.change(passwordConfirmInput, { target: { value: 'Password123!' } });

    fireEvent.click(signupButton);

    await waitFor(() => {
      expect(screen.getByText(/Failed to create an account/i)).toBeInTheDocument();
    });
  });
});
