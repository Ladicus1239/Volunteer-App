// src/Pages/__tests__/Notifications.test.js
import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import Notification from '../Notifications'; // Corrected import path
import { BrowserRouter } from 'react-router-dom';

// Mock the subcomponents
jest.mock('../../Components/Navigation', () => () => <nav role="navigation">Mocked Navigation</nav>);
jest.mock('../../Components/Message', () => () => <div role="message">Mocked Message</div>);

const renderWithRouter = (ui, { route = '/' } = {}) => {
    window.history.pushState({}, 'Test page', route);
    return render(ui, { wrapper: ({ children }) => <BrowserRouter>{children}</BrowserRouter> });
};

test('renders Notification page correctly', () => {
    renderWithRouter(<Notification />);
    
    // Check if Navigation component is rendered
    expect(screen.getByRole('navigation')).toBeInTheDocument();
    
    // Check if the page title is rendered
    expect(screen.getByText('Notification Page')).toBeInTheDocument();
    
    // Check if the messenger header is rendered
    expect(screen.getByText('Messenger')).toBeInTheDocument();
    
    // Check if the Message component is rendered
    expect(screen.getByRole('message')).toBeInTheDocument();
});
