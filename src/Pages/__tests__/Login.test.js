import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import '@testing-library/jest-dom';
import Login from '../Login';
import { AuthProvider } from '../../context/AuthContext';

// Utility to render components with Router
const renderWithRouter = (ui, { route = '/' } = {}) => {
    window.history.pushState({}, 'Test page', route);
    return render(ui, { wrapper: ({ children }) => <BrowserRouter>{children}</BrowserRouter> });
};

// Mock the useAuth hook and AuthProvider
jest.mock('../../context/AuthContext', () => {
    const originalModule = jest.requireActual('../../context/AuthContext');
    return {
        ...originalModule,
        useAuth: jest.fn(),
    };
});

const { useAuth } = require('../../context/AuthContext');

describe('Login Page Tests', () => {
    let mockLogin;

    beforeEach(() => {
        mockLogin = jest.fn();
        useAuth.mockReturnValue({ login: mockLogin });
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    test('displays error message on failed login', async () => {
        mockLogin.mockImplementation(() => Promise.reject(new Error('Failed to login')));

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

        const errorMessage = await screen.findByText(/Failed to login/i);
        expect(errorMessage).toBeInTheDocument();
    });

    test('successful login redirects to home', async () => {
        mockLogin.mockImplementation(() => Promise.resolve());

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

    test('disables submit button when loading', async () => {
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

        fireEvent.change(emailInput, { target: { value: 'user@example.com' } });
        fireEvent.change(passwordInput, { target: { value: 'password' } });

        // Simulate form submission
        await act(async () => {
            fireEvent.click(submitButton);
        });

        // Submit button should be disabled during loading
        expect(submitButton).toBeDisabled();
    });

    test('renders all input fields and buttons', () => {
        renderWithRouter(
            <AuthProvider>
                <Login />
            </AuthProvider>
        );

        // Check for all input fields and buttons
        expect(screen.getByLabelText(/Email/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/Password/i)).toBeInTheDocument();
        expect(screen.getByText(/Log in/i)).toBeInTheDocument();
        expect(screen.getByText(/Need an account\? Sign up/i)).toBeInTheDocument();
    });
});
