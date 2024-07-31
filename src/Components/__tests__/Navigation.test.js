import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import { BrowserRouter as Router } from 'react-router-dom';
import Navigation from '../Navigation';
import { useAuth } from '../../context/AuthContext';
import moment from 'moment';


jest.mock('../../context/AuthContext', () => {
  return {
    useAuth: jest.fn(),
  };
});


const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

describe('Navigation Component', () => {
  let mockLogout;

  beforeEach(() => {
    mockLogout = jest.fn();
    useAuth.mockReturnValue({ logout: mockLogout });

    
    Storage.prototype.getItem = jest.fn((key) => {
      if (key === 'event reminder dates') {
        return JSON.stringify([{ eventDate: moment().add(1, 'days').format('YYYY-MM-DD') }]);
      }
      return null;
    });
    Storage.prototype.setItem = jest.fn(() => null);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('renders navigation links correctly', () => {
    render(
      <Router>
        <Navigation />
      </Router>
    );

    expect(screen.getByText(/VolunteerOrg/i)).toBeInTheDocument();
    expect(screen.getByText(/Login/i)).toBeInTheDocument();
    expect(screen.getByText(/Register/i)).toBeInTheDocument();
    expect(screen.getByText(/Profile/i)).toBeInTheDocument();
    expect(screen.getByText(/Notifications/i)).toBeInTheDocument();
    expect(screen.getByText(/Events/i)).toBeInTheDocument();
    expect(screen.getByText(/Logout/i)).toBeInTheDocument();
  });

  test('handles logout correctly', async () => {
    render(
      <Router>
        <Navigation />
      </Router>
    );

    fireEvent.click(screen.getByText(/Logout/i));

    await act(async () => {
      expect(mockLogout).toHaveBeenCalled();
    });

    expect(mockNavigate).toHaveBeenCalledWith('/home');
  });

  test('handles logout error correctly', async () => {
    mockLogout.mockRejectedValueOnce(new Error('Logout failed'));
    render(
      <Router>
        <Navigation />
      </Router>
    );

    fireEvent.click(screen.getByText(/Logout/i));

    await act(async () => {
      expect(mockLogout).toHaveBeenCalled();
    });

    expect(screen.getByText(/Failed to log out/i)).toBeInTheDocument();
  });

  test('checkEventsAndRemind function works correctly', () => {
    render(
      <Router>
        <Navigation />
      </Router>
    );

    expect(localStorage.setItem).toHaveBeenCalledWith(
      'event reminder dates',
      JSON.stringify([])
    );

    const savedMessages = localStorage.getItem('messages');
    const messages = savedMessages ? JSON.parse(savedMessages) : [];
    const systemMessage = { sender: 'System', message: 'An event is coming up tomorrow!' };
    const newMessages = [...messages, systemMessage];

    expect(localStorage.setItem).toHaveBeenCalledWith(
      'messages',
      JSON.stringify(newMessages)
    );
  });

  test('remindEventMsg function adds system message to localStorage', () => {
    render(
      <Router>
        <Navigation />
      </Router>
    );

    const savedMessages = localStorage.getItem('messages');
    const messages = savedMessages ? JSON.parse(savedMessages) : [];
    const systemMessage = { sender: 'System', message: 'An event is coming up tomorrow!' };
    const newMessages = [...messages, systemMessage];

    expect(localStorage.setItem).toHaveBeenCalledWith(
      'messages',
      JSON.stringify(newMessages)
    );
  });

  test('useEffect calls checkEventsAndRemind on mount', () => {
    render(
      <Router>
        <Navigation />
      </Router>
    );

    expect(localStorage.getItem).toHaveBeenCalledWith('event reminder dates');
    expect(localStorage.setItem).toHaveBeenCalled();
  });
});
