import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import VolunteerMatching from '../VolunteerMatching';
import { collection, getDocs } from 'firebase/firestore';
import db from '../../firebase';

// Mock Firebase functions
jest.mock('firebase/firestore', () => ({
  collection: jest.fn(),
  getDocs: jest.fn(),
  setDoc: jest.fn(),
  doc: jest.fn(),
  query: jest.fn(),
  where: jest.fn(),
  deleteDoc: jest.fn(),
}));

// Mock Navigation component
jest.mock('../../Components/Navigation', () => () => <nav>Mocked Navigation</nav>);

const mockVolunteers = [
  {
    id: '1',
    fullName: 'John Doe',
    skills: ['Cooking', 'First Aid'],
    availability: ['Weekends'],
    getCity: 'New York',
    getPref: 'Food Events',
  },
  {
    id: '2',
    fullName: 'Jane Smith',
    skills: ['Teaching', 'Organizing'],
    availability: ['Weekdays'],
    getCity: 'Los Angeles',
    getPref: 'Educational Events',
  },
];

const mockEvents = [
  {
    id: '1',
    eventName: 'Food Drive',
    requiredSkills: ['Cooking'],
    city: 'New York',
  },
  {
    id: '2',
    eventName: 'Math Workshop',
    requiredSkills: ['Teaching'],
    city: 'Los Angeles',
  },
];

const mockMatches = [
  {
    id: '1',
    volunteer: 'John Doe',
    event: 'Food Drive',
  },
  {
    id: '2',
    volunteer: 'Jane Smith',
    event: 'Math Workshop',
  },
];

beforeEach(() => {
  getDocs.mockImplementation((collectionRef) => {
    const collectionName = collectionRef._key.path.segments[0];
    console.log(`Fetching collection: ${collectionName}`);
    switch (collectionName) {
      case 'UserProfiles':
        return Promise.resolve({ docs: mockVolunteers.map((v) => ({ id: v.id, data: () => v })) });
      case 'EventDetails':
        return Promise.resolve({ docs: mockEvents.map((e) => ({ id: e.id, data: () => e })) });
      case 'Matched':
        return Promise.resolve({ docs: mockMatches.map((m) => ({ id: m.id, data: () => m })) });
      default:
        return Promise.resolve({ docs: [] });
    }
  });
});

test('renders VolunteerMatching page correctly', async () => {
  render(<VolunteerMatching />);

  expect(screen.getByText('Mocked Navigation')).toBeInTheDocument();
  expect(screen.getByText('Volunteer Matching')).toBeInTheDocument();

  await waitFor(() => {
    // Logging to ensure the expected data is being fetched and rendered
    console.log(screen.debug());

    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('Jane Smith')).toBeInTheDocument();
    expect(screen.getByText('Food Drive')).toBeInTheDocument();
    expect(screen.getByText('Math Workshop')).toBeInTheDocument();
  });

  expect(screen.getByText('Cooking, First Aid')).toBeInTheDocument();
  expect(screen.getByText('Teaching, Organizing')).toBeInTheDocument();
  expect(screen.getByText('Weekends')).toBeInTheDocument();
  expect(screen.getByText('Weekdays')).toBeInTheDocument();
  expect(screen.getByText('New York')).toBeInTheDocument();
  expect(screen.getByText('Los Angeles')).toBeInTheDocument();
  expect(screen.getByText('Food Events')).toBeInTheDocument();
  expect(screen.getByText('Educational Events')).toBeInTheDocument();
  expect(screen.getByText('John Doe')).toBeInTheDocument();
  expect(screen.getByText('Food Drive')).toBeInTheDocument();
  expect(screen.getByText('Jane Smith')).toBeInTheDocument();
  expect(screen.getByText('Math Workshop')).toBeInTheDocument();
});
