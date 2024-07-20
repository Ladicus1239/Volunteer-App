// src/Pages/__tests__/Login.test.js
import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import '@testing-library/jest-dom';
import Login from '../Login';
import { AuthProvider } from '../../context/AuthContext';

const renderWithRouter = (ui, { route = '/' } = {}) => {
    window.history.pushState({}, 'Test page', route);
    return render(ui, { wrapper: ({ children }) => <BrowserRouter>{children}</BrowserRouter> });
};

test('renders login page', async () => {
    await act(async () => {
        renderWithRouter(
            <AuthProvider>
                <Login />
            </AuthProvider>
        );
    });

    const titleElement = screen.getByText(/Login Page/i);
    expect(titleElement).toBeInTheDocument();
});

test('displays error message on failed login', async () => {
    await act(async () => {
        renderWithRouter(
            <AuthProvider>
                <Login />
            </AuthProvider>
        );
    });

    const emailInput = screen.getByLabelText(/Email/i);
    const passwordInput = screen.getByLabelText(/Password/i);
    const submitButton = screen.getByText(/Log in/i);

    fireEvent.change(emailInput, { target: { value: 'wrong@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'wrongpassword' } });
    
    await act(async () => {
        fireEvent.click(submitButton);
    });

    const errorMessage = screen.getByText(/Failed to login/i);
    expect(errorMessage).toBeInTheDocument();
});

test('successful login redirects to home', async () => {
    // Mock the login function to simulate a successful login
    const mockLogin = jest.fn(() => Promise.resolve());

    jest.mock('../../context/AuthContext', () => ({
        useAuth: () => ({
            login: mockLogin,
        }),
        AuthProvider: ({ children }) => <div>{children}</div>,
    }));

    await act(async () => {
        renderWithRouter(
            <AuthProvider>
                <Login />
            </AuthProvider>,
            { route: '/login' }
        );
    });

    const emailInput = screen.getByLabelText(/Email/i);
    const passwordInput = screen.getByLabelText(/Password/i);
    const submitButton = screen.getByText(/Log in/i);

    fireEvent.change(emailInput, { target: { value: 'user@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password' } });
    
    await act(async () => {
        fireEvent.click(submitButton);
    });

    // Check if mockLogin was called with correct arguments
    expect(mockLogin).toHaveBeenCalledWith('user@example.com', 'password');

    // Verify navigation to home page
    expect(window.location.pathname).toBe('/home');
});
