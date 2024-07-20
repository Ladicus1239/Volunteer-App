// src/Pages/__tests__/register.test.js
import React from 'react';
import { render, fireEvent, screen, act } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import '@testing-library/jest-dom';
import Signup from '../Register';
import { AuthProvider } from '../../context/AuthContext';

// Utility to render components with Router and AuthProvider
const renderWithRouterAndAuth = (ui, { route = '/' } = {}) => {
    window.history.pushState({}, 'Test page', route);
    return render(ui, { wrapper: ({ children }) => <BrowserRouter><AuthProvider>{children}</AuthProvider></BrowserRouter> });
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

describe('Signup Page Tests', () => {
    let mockSignup;

    beforeEach(() => {
        mockSignup = jest.fn();
        useAuth.mockReturnValue({ signup: mockSignup });
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    test('renders register form', async () => {
        await act(async () => {
            renderWithRouterAndAuth(<Signup />);
        });

        expect(screen.getByLabelText('Email')).toBeInTheDocument();
        expect(screen.getByLabelText('Password')).toBeInTheDocument();
        expect(screen.getByLabelText('Confirm Password')).toBeInTheDocument();
    });

    test('handles registration', async () => {
        mockSignup.mockImplementation(() => Promise.resolve());

        await act(async () => {
            renderWithRouterAndAuth(<Signup />);
        });

        fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'test@example.com' } });
        fireEvent.change(screen.getByLabelText('Password'), { target: { value: 'password123' } });
        fireEvent.change(screen.getByLabelText('Confirm Password'), { target: { value: 'password123' } });
        fireEvent.click(screen.getByText('Sign Up'));

        expect(screen.getByText(/Loading/i)).toBeInTheDocument();
        await act(async () => {});

        // Check if mockSignup was called with correct arguments
        expect(mockSignup).toHaveBeenCalledWith('test@example.com', 'password123');
    });
});
