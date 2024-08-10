import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import VolunteerHistory from '../volunteerhistory';
import { BrowserRouter } from 'react-router-dom';
import { collection, getDocs } from 'firebase/firestore';
import db from '../../firebase';

jest.mock('../../Components/Navigation', () => () => <nav role="navigation">Mocked Navigation</nav>);

jest.mock('firebase/firestore', () => {
  const originalModule = jest.requireActual('firebase/firestore');
  return {
    ...originalModule,
    collection: jest.fn(),
    getDocs: jest.fn(),
  };
});

const renderWithRouter = (ui, { route = '/' } = {}) => {
  window.history.pushState({}, 'Test page', route);
  return render(ui, { wrapper: ({ children }) => <BrowserRouter>{children}</BrowserRouter> });
};

beforeEach(() => {
  localStorage.clear();
  jest.clearAllMocks();
});

const mockVolunteerHistoryData = [
  {
    id: '1',
    name: 'John Doe',
    ename: 'Event 1',
    description: 'Description 1',
    location: 'Location 1',
    skills: ['Skill 1', 'Skill 2'],
    urgency: 'Low',
    date: '2024-01-01',
    attendance: 'Absent',
  },
  {
    id: '2',
    name: 'Jane Smith',
    ename: 'Event 2',
    description: 'Description 2',
    location: 'Location 2',
    skills: ['Skill 3'],
    urgency: 'High',
    date: '2024-02-01',
    attendance: 'Present',
  },
];

test('renders VolunteerHistory page correctly', async () => {
  getDocs.mockImplementation(() =>
    Promise.resolve({
      docs: mockVolunteerHistoryData.map(doc => ({ id: doc.id, data: () => doc })),
    })
  );

  await act(async () => {
    renderWithRouter(<VolunteerHistory />);
  });

  await waitFor(() => {
    expect(screen.getByText('Volunteer History')).toBeInTheDocument();

    // Use a more flexible matcher
    expect(screen.getByText(/John Doe/i)).toBeInTheDocument();
    expect(screen.getByText('Event 1')).toBeInTheDocument();
    expect(screen.getByText('Jane Smith')).toBeInTheDocument();
    expect(screen.getByText('Event 2')).toBeInTheDocument();
  });
});


test('handles select all checkbox correctly', async () => {
  getDocs.mockImplementation(() =>
    Promise.resolve({
      docs: mockVolunteerHistoryData.map(doc => ({ id: doc.id, data: () => doc })),
    })
  );

  await act(async () => {
    renderWithRouter(<VolunteerHistory />);
  });

  await waitFor(() => {
    expect(screen.getByText('Volunteer History')).toBeInTheDocument();
  });

  const selectAllCheckbox = screen.getAllByRole('checkbox')[0];
  fireEvent.click(selectAllCheckbox);

  const checkboxes = screen.getAllByRole('checkbox');
  checkboxes.forEach((checkbox) => {
    expect(checkbox).toBeChecked();
  });

  fireEvent.click(selectAllCheckbox);

  checkboxes.forEach((checkbox) => {
    expect(checkbox).not.toBeChecked();
  });
});

test('handles individual checkbox correctly', async () => {
  getDocs.mockImplementation(() =>
    Promise.resolve({
      docs: mockVolunteerHistoryData.map(doc => ({ id: doc.id, data: () => doc })),
    })
  );

  await act(async () => {
    renderWithRouter(<VolunteerHistory />);
  });

  await waitFor(() => {
    expect(screen.getByText('Volunteer History')).toBeInTheDocument();
  });

  const individualCheckbox = screen.getByTestId('checkbox-1');
  fireEvent.click(individualCheckbox);
  expect(individualCheckbox).toBeChecked();

  fireEvent.click(individualCheckbox);
  expect(individualCheckbox).not.toBeChecked();
});

test('handles no volunteer history data', async () => {
  getDocs.mockImplementation(() =>
    Promise.resolve({
      docs: [],
    })
  );

  await act(async () => {
    renderWithRouter(<VolunteerHistory />);
  });

  await waitFor(() => {
    expect(screen.getByText('Volunteer History')).toBeInTheDocument();
    expect(screen.getByText('No volunteer history found.')).toBeInTheDocument();
  });
});

test('handles error fetching volunteer history', async () => {
  getDocs.mockImplementation(() => {
    throw new Error('Error fetching volunteer history');
  });

  await act(async () => {
    renderWithRouter(<VolunteerHistory />);
  });

  await waitFor(() => {
    expect(screen.getByText('Volunteer History')).toBeInTheDocument();
  });
});

test('handles no event data for matched volunteer', async () => {
  getDocs.mockImplementation((ref) => {
    if (ref._path.segments.includes('VolunteerHistory')) {
      return Promise.resolve({
        docs: [],
      });
    }
    if (ref._path.segments.includes('Matched')) {
      return Promise.resolve({
        docs: [{ id: '1', data: () => ({ volunteer: 'John Doe', event: 'Event 3' }) }],
      });
    }
    if (ref._path.segments.includes('EventDetails')) {
      return Promise.resolve({
        docs: [],
      });
    }
  });

  await act(async () => {
    renderWithRouter(<VolunteerHistory />);
  });

  await waitFor(() => {
    expect(screen.getByText('Volunteer History')).toBeInTheDocument();
    expect(screen.getByText('No volunteer history found.')).toBeInTheDocument();
  });
});

test('handles existing volunteer history record', async () => {
  getDocs.mockImplementation((ref) => {
    if (ref._path.segments.includes('VolunteerHistory')) {
      return Promise.resolve({
        docs: mockVolunteerHistoryData.map(doc => ({ id: doc.id, data: () => doc })),
      });
    }
    if (ref._path.segments.includes('Matched')) {
      return Promise.resolve({
        docs: [{ id: '1', data: () => ({ volunteer: 'John Doe', event: 'Event 1' }) }],
      });
    }
    if (ref._path.segments.includes('EventDetails')) {
      return Promise.resolve({
        docs: [{ id: '1', data: () => ({ eventName: 'Event 1', eventDescription: 'Description 1', state: 'State 1', requiredSkills: ['Skill 1', 'Skill 2'], urgency: 'Low', eventDate: '2024-01-01' }) }],
      });
    }
  });

  await act(async () => {
    renderWithRouter(<VolunteerHistory />);
  });

  await waitFor(() => {
    expect(screen.getByText('Volunteer History')).toBeInTheDocument();

    // Use a more flexible matcher
    expect(screen.getByText(/John Doe/i)).toBeInTheDocument();
    expect(screen.getByText('Event 1')).toBeInTheDocument();
  });
});

test('handles undefined fields in new volunteer history data', async () => {
  getDocs.mockImplementation((ref) => {
    if (ref._path.segments.includes('VolunteerHistory')) {
      return Promise.resolve({
        docs: [],
      });
    }
    if (ref._path.segments.includes('Matched')) {
      return Promise.resolve({
        docs: [{ id: '1', data: () => ({ volunteer: 'John Doe', event: 'Event 4' }) }],
      });
    }
    if (ref._path.segments.includes('EventDetails')) {
      return Promise.resolve({
        docs: [{ id: '1', data: () => ({ eventName: 'Event 4', eventDescription: undefined, state: undefined, requiredSkills: undefined, urgency: 'Low', eventDate: undefined }) }],
      });
    }
  });

  await act(async () => {
    renderWithRouter(<VolunteerHistory />);
  });

  await waitFor(() => {
    expect(screen.getByText('Volunteer History')).toBeInTheDocument();
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('Event 4')).toBeInTheDocument();
  });
});
