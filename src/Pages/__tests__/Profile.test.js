import React from 'react';
import { render, screen, waitFor, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import Profile from '../Profile';
import { BrowserRouter } from 'react-router-dom';
import { collection, getDocs, getDoc, query, where } from 'firebase/firestore';
import { useAuth } from '../../context/AuthContext';
import db from '../../firebase';

jest.mock('firebase/firestore', () => {
  const originalModule = jest.requireActual('firebase/firestore');
  return {
    ...originalModule,
    collection: jest.fn(),
    getDocs: jest.fn(),
    getDoc: jest.fn(),
    query: jest.fn(),
    where: jest.fn(),
  };
});

jest.mock('../../context/AuthContext', () => {
  return {
    useAuth: jest.fn(),
  };
});

jest.mock('../../Components/Navigation', () => () => <nav role="navigation">Mocked Navigation</nav>);

const renderWithRouter = (ui, { route = '/' } = {}) => {
  window.history.pushState({}, 'Test page', route);
  return render(ui, { wrapper: ({ children }) => <BrowserRouter>{children}</BrowserRouter> });
};

beforeEach(() => {
  localStorage.clear();
  jest.clearAllMocks();
});

const mockProfileData = {
  fullName: 'John Doe',
  getAdd: '123 Main St',
  getAdd2: 'Apt 4',
  getCity: 'Anytown',
  selectedState: 'CA',
  getZip: '12345',
  selectedSkill: ['Skill 1', 'Skill 2'],
  getPref: 'Morning',
  selectedDates: ['2024-01-01', '2024-02-01'],
};

const mockUser = {
  email: 'john.doe@example.com',
};

test('renders Profile page correctly', async () => {
  useAuth.mockReturnValue({ currentUser: mockUser });
  getDocs.mockResolvedValue({
    empty: false,
    forEach: (callback) => callback({ id: '1', data: () => mockUser }),
  });
  getDoc.mockResolvedValue({
    exists: () => true,
    data: () => mockProfileData,
  });

  await act(async () => {
    renderWithRouter(<Profile />);
  });

  await waitFor(() => {
    expect(screen.getByText("John Doe's Profile")).toBeInTheDocument();
    expect(screen.getByText('Resides in: 123 Main St, Anytown, CA, 12345')).toBeInTheDocument();
    expect(screen.getByText('Skills:')).toBeInTheDocument();
    expect(screen.getByText('Skill 1, Skill 2')).toBeInTheDocument();
    expect(screen.getByText('Preferences:')).toBeInTheDocument();
    expect(screen.getByText('Morning')).toBeInTheDocument();
    expect(screen.getByText('Dates available:')).toBeInTheDocument();
    expect(screen.getByText('2024-01-01, 2024-02-01')).toBeInTheDocument();
  });
});

test('handles no matching profile data', async () => {
  useAuth.mockReturnValue({ currentUser: mockUser });
  getDocs.mockResolvedValue({
    empty: true,
    forEach: jest.fn(),
  });

  await act(async () => {
    renderWithRouter(<Profile />);
  });

  await waitFor(() => {
    expect(screen.getByText("John Doe's Profile")).toBeInTheDocument();
    expect(screen.getByText('Resides in: , , ,')).toBeInTheDocument();
    expect(screen.getByText('Skills:')).toBeInTheDocument();
    expect(screen.getByText('No skills listed')).toBeInTheDocument();
    expect(screen.getByText('Preferences:')).toBeInTheDocument();
    expect(screen.getByText('No preferences listed')).toBeInTheDocument();
    expect(screen.getByText('Dates available:')).toBeInTheDocument();
    expect(screen.getByText('No dates available')).toBeInTheDocument();
  });
});

test('handles fetching profile data error', async () => {
  useAuth.mockReturnValue({ currentUser: mockUser });
  getDocs.mockImplementation(() => {
    throw new Error('Error fetching profile data');
  });

  await act(async () => {
    renderWithRouter(<Profile />);
  });

  await waitFor(() => {
    expect(screen.getByText("John Doe's Profile")).toBeInTheDocument();
  });
});
