import React from 'react';
import { render, screen, waitFor, act, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import Profile from '../Profile';
import { BrowserRouter } from 'react-router-dom';
import { getDocs, getDoc, updateDoc } from 'firebase/firestore';
import { useAuth } from '../../context/AuthContext';
import { uploadBytes, getDownloadURL, ref } from 'firebase/storage';

jest.mock('firebase/firestore', () => {
  const originalModule = jest.requireActual('firebase/firestore');
  return {
    ...originalModule,
    collection: jest.fn(),
    getDocs: jest.fn(),
    getDoc: jest.fn(),
    query: jest.fn(),
    where: jest.fn(),
    updateDoc: jest.fn(),
  };
});

jest.mock('firebase/storage', () => {
  const originalModule = jest.requireActual('firebase/storage');
  return {
    ...originalModule,
    ref: jest.fn(),
    uploadBytes: jest.fn(),
    getDownloadURL: jest.fn(),
  };
});

jest.mock('../../context/AuthContext', () => ({
  useAuth: jest.fn(),
}));

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
  skills: ['Skill 1', 'Skill 2'],
  getPref: 'Morning',
  selectedDates: ['2024-01-01', '2024-02-01'],
};

const mockUser = {
  email: 'john.doe@example.com',
  uid: '123',
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

  console.log(document.body.innerHTML); // Add this to debug the HTML structure

  await waitFor(() => {
    const profileHeader = screen.getByText(/john doe's profile/i); // Use a regular expression for case-insensitive matching
    expect(profileHeader).toBeInTheDocument();
  });

  await waitFor(() => {
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

  console.log(document.body.innerHTML); // Add this to debug the HTML structure

  await waitFor(() => {
    const profileHeader = screen.getByText((content, element) => {
      console.log(`Checking element: ${element.outerHTML}`); // Add this to see which elements are checked
      return element.tagName.toLowerCase() === 'h1' && content.includes("John Doe's Profile");
    });
    expect(profileHeader).toBeInTheDocument();
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

  console.log(document.body.innerHTML); // Add this to debug the HTML structure

  await waitFor(() => {
    expect(screen.getByText("John Doe's Profile")).toBeInTheDocument();
  });
});

test('opens modal when "Change Image" button is clicked', async () => {
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

  fireEvent.click(screen.getByText('Change Image'));

  expect(screen.getByText('Select a new image')).toBeInTheDocument();
});

test('modal contains file input, change, and cancel buttons', async () => {
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

  fireEvent.click(screen.getByText('Change Image'));

  await waitFor(() => {
    expect(screen.getByText('Select a new image')).toBeInTheDocument();
    expect(screen.getByLabelText('Select a new image')).toBeInTheDocument();
    expect(screen.getByText('Change')).toBeInTheDocument();
    expect(screen.getByText('Cancel')).toBeInTheDocument();
  });
});

test('changes image when "Change" button is clicked', async () => {
  const mockFile = new File(['dummy content'], 'example.png', { type: 'image/png' });
  useAuth.mockReturnValue({ currentUser: mockUser });
  getDocs.mockResolvedValue({
    empty: false,
    forEach: (callback) => callback({ id: '1', data: () => mockProfileData }),
  });
  getDoc.mockResolvedValue({
    exists: () => true,
    data: () => mockProfileData,
  });
  ref.mockReturnValue({});
  uploadBytes.mockResolvedValue();
  getDownloadURL.mockResolvedValue('http://example.com/new-image.jpg');
  updateDoc.mockResolvedValue();

  await act(async () => {
    renderWithRouter(<Profile />);
  });

  fireEvent.click(screen.getByText('Change Image'));
  fireEvent.change(screen.getByLabelText('Select a new image'), { target: { files: [mockFile] } });
  fireEvent.click(screen.getByText('Change'));

  await waitFor(() => {
    expect(uploadBytes).toHaveBeenCalled();
    expect(getDownloadURL).toHaveBeenCalled();
    expect(updateDoc).toHaveBeenCalled();
  });

  expect(screen.getByRole('img')).toHaveAttribute('src', 'http://example.com/new-image.jpg');
});

test('closes modal when "Cancel" button is clicked', async () => {
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

  fireEvent.click(screen.getByText('Change Image'));
  fireEvent.click(screen.getByText('Cancel'));

  expect(screen.queryByText('Select a new image')).not.toBeInTheDocument();
});

test('shows error modal when user is not signed in', async () => {
  useAuth.mockReturnValue({ currentUser: null });

  await act(async () => {
    renderWithRouter(<Profile />);
  });

  fireEvent.click(screen.getByText('Change Image'));

  await waitFor(() => {
    expect(screen.getByText('You must be signed in to change the image.')).toBeInTheDocument();
  });
});
