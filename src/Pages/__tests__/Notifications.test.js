import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import Notification from '../Notifications'; 
import { BrowserRouter } from 'react-router-dom';


jest.mock('../../Components/Navigation', () => () => <nav role="navigation">Mocked Navigation</nav>);
jest.mock('../../Components/Message', () => () => <div role="message">Mocked Message</div>);

const renderWithRouter = (ui, { route = '/' } = {}) => {
    window.history.pushState({}, 'Test page', route);
    return render(ui, { wrapper: ({ children }) => <BrowserRouter>{children}</BrowserRouter> });
};

test('renders Notification page correctly', () => {
    renderWithRouter(<Notification />);
    

    expect(screen.getByRole('navigation')).toBeInTheDocument();
    
  
    expect(screen.getByText('Notification Page')).toBeInTheDocument();
    

    expect(screen.getByText('Messenger')).toBeInTheDocument();
    

    expect(screen.getByRole('message')).toBeInTheDocument();
});
