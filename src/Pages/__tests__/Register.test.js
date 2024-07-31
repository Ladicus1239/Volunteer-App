import React from 'react';
import { render, fireEvent, screen, act, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import '@testing-library/jest-dom';
import Signup from '../Register';
import { AuthProvider } from '../../context/AuthContext';
import { collection, addDoc, getFirestore } from 'firebase/firestore';
import { encryptData } from '../../encrypt';
import db from '../../firebase';


const renderWithRouterAndAuth = (ui, { route = '/' } = {}) => {
    window.history.pushState({}, 'Test page', route);
    return render(ui, { wrapper: ({ children }) => <BrowserRouter><AuthProvider>{children}</AuthProvider></BrowserRouter> });
};


jest.mock('../../context/AuthContext', () => {
    const originalModule = jest.requireActual('../../context/AuthContext');
    return {
        ...originalModule,
        useAuth: jest.fn(),
    };
});

jest.mock('firebase/firestore', () => {
    const actualFirestore = jest.requireActual('firebase/firestore');
    return {
        ...actualFirestore,
        collection: jest.fn(),
        addDoc: jest.fn(),
        getFirestore: jest.fn(),
    };
});

jest.mock('../../encrypt', () => ({
    encryptData: jest.fn(),
}));

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

    test('handles registration with matching passwords', async () => {
        mockSignup.mockImplementation(() => Promise.resolve());
        addDoc.mockImplementation(() => Promise.resolve({ id: '123' }));
        encryptData.mockImplementation((data) => data);

        await act(async () => {
            renderWithRouterAndAuth(<Signup />);
        });

        fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'test@example.com' } });
        fireEvent.change(screen.getByLabelText('Password'), { target: { value: 'password123' } });
        fireEvent.change(screen.getByLabelText('Confirm Password'), { target: { value: 'password123' } });
        fireEvent.click(screen.getByText('Sign Up'));

        await waitFor(() => {
            expect(screen.getByText(/Loading/i)).toBeInTheDocument();
        });

        expect(mockSignup).toHaveBeenCalledWith('test@example.com', 'password123');
        expect(addDoc).toHaveBeenCalledWith(expect.anything(), {
            email: 'test@example.com',
            password: encryptData('password123'),
        });
    });

    test('handles registration with non-matching passwords', async () => {
        await act(async () => {
            renderWithRouterAndAuth(<Signup />);
        });

        fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'test@example.com' } });
        fireEvent.change(screen.getByLabelText('Password'), { target: { value: 'password123' } });
        fireEvent.change(screen.getByLabelText('Confirm Password'), { target: { value: 'password456' } });
        fireEvent.click(screen.getByText('Sign Up'));

        expect(screen.getByText(/Passwords do not match/i)).toBeInTheDocument();
        expect(mockSignup).not.toHaveBeenCalled();
    });

    test('handles registration failure', async () => {
        mockSignup.mockImplementation(() => Promise.reject(new Error('Failed to create an account')));

        await act(async () => {
            renderWithRouterAndAuth(<Signup />);
        });

        fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'test@example.com' } });
        fireEvent.change(screen.getByLabelText('Password'), { target: { value: 'password123' } });
        fireEvent.change(screen.getByLabelText('Confirm Password'), { target: { value: 'password123' } });
        fireEvent.click(screen.getByText('Sign Up'));

        await act(async () => {});

        expect(screen.getByText(/Failed to create an account/i)).toBeInTheDocument();
        expect(mockSignup).toHaveBeenCalled();
    });

    test('handles Firestore error', async () => {
        mockSignup.mockImplementation(() => Promise.resolve());
        addDoc.mockImplementation(() => Promise.reject(new Error('Firestore error')));

        await act(async () => {
            renderWithRouterAndAuth(<Signup />);
        });

        fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'test@example.com' } });
        fireEvent.change(screen.getByLabelText('Password'), { target: { value: 'password123' } });
        fireEvent.change(screen.getByLabelText('Confirm Password'), { target: { value: 'password123' } });
        fireEvent.click(screen.getByText('Sign Up'));

        expect(screen.getByText(/Loading/i)).toBeInTheDocument();
        await act(async () => {});

        expect(mockSignup).toHaveBeenCalledWith('test@example.com', 'password123');
        expect(addDoc).toHaveBeenCalled();
        expect(screen.queryByText(/Loading/i)).not.toBeInTheDocument();
    });

    test('navigates to login page when "Already have an account?" is clicked', async () => {
        await act(async () => {
            renderWithRouterAndAuth(<Signup />);
        });

        fireEvent.click(screen.getByText((content, element) =>
            element.tagName.toLowerCase() === 'a' && content.startsWith('Already have an account?')
        ));

        expect(window.location.pathname).toBe('/login');
    });
});
