import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import VolunteerMatching, { matchExists, saveMatches } from '../VolunteerMatching';
import renderWithRouterAndAuth from '../../test-router';
import { getFirestore, collection, getDocs, setDoc, doc, query, where, deleteDoc } from 'firebase/firestore';

jest.mock('firebase/app', () => ({
  initializeApp: jest.fn(() => ({})),
}));

jest.mock('firebase/firestore', () => ({
  getFirestore: jest.fn(() => ({
    collection: jest.fn(),
    getDocs: jest.fn(),
    query: jest.fn(),
    where: jest.fn(),
    setDoc: jest.fn(),
    doc: jest.fn(),
    deleteDoc: jest.fn(),
  })),
  collection: jest.fn(),
  getDocs: jest.fn(),
  query: jest.fn(),
  where: jest.fn(),
  setDoc: jest.fn(),
  doc: jest.fn(),
  deleteDoc: jest.fn(),
}));

jest.mock('firebase/auth', () => ({
  getAuth: jest.fn(() => ({
    onAuthStateChanged: jest.fn((callback) => {
      callback({ uid: '123', email: 'test@example.com' });
      return jest.fn();
    }),
  })),
  createUserWithEmailAndPassword: jest.fn(),
  signInWithEmailAndPassword: jest.fn(),
  signOut: jest.fn(),
}));

describe('VolunteerMatching Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render without crashing', async () => {
    renderWithRouterAndAuth(<VolunteerMatching />);
    await waitFor(() => {
      expect(screen.getByText('Volunteer Matching')).toBeInTheDocument();
    });
  });

  it('should fetch volunteer matching data on load', async () => {
    const mockVolunteers = [
      { id: '1', fullName: 'John Doe', skills: ['Skill1'], getCity: 'City1', availability: ['Monday'], getPref: 'Morning' }
    ];
    const mockEvents = [
      { id: '1', eventName: 'Test Event', requiredSkills: ['Skill1'], city: 'City1' }
    ];
    const mockMatches = [
      { id: '1', volunteer: 'John Doe', event: 'Test Event' }
    ];

    getDocs
      .mockResolvedValueOnce({ docs: mockVolunteers.map(v => ({ id: v.id, data: () => v })) }) 
      .mockResolvedValueOnce({ docs: mockEvents.map(e => ({ id: e.id, data: () => e })) }) 
      .mockResolvedValueOnce({ docs: mockMatches.map(m => ({ id: m.id, data: () => m })) }); 

    renderWithRouterAndAuth(<VolunteerMatching />);

    await waitFor(() => {
      const volunteerNames = screen.getAllByText('John Doe');
      const eventNames = screen.getAllByText('Test Event');
      expect(volunteerNames).toHaveLength(2); 
      expect(eventNames).toHaveLength(1);
    });
  });

  it('should handle no matching data', async () => {
    getDocs
      .mockResolvedValueOnce({ docs: [] }) 
      .mockResolvedValueOnce({ docs: [] }) 
      .mockResolvedValueOnce({ docs: [] }); 

    renderWithRouterAndAuth(<VolunteerMatching />);

    await waitFor(() => {
      expect(screen.getByText('No matches found')).toBeInTheDocument();
    });
  });

  it('should display error message on fetch failure', async () => {
    getDocs.mockRejectedValueOnce(new Error('Failed to fetch'));

    renderWithRouterAndAuth(<VolunteerMatching />);

    await waitFor(() => {
      expect(screen.getByText('Error fetching data')).toBeInTheDocument();
    });
  });

  it('should handle no volunteers', async () => {
    const mockEvents = [
      { id: '1', eventName: 'Test Event', requiredSkills: ['Skill1'], city: 'City1' }
    ];
    const mockMatches = [];

    getDocs
      .mockResolvedValueOnce({ docs: [] }) 
      .mockResolvedValueOnce({ docs: mockEvents.map(e => ({ id: e.id, data: () => e })) }) 
      .mockResolvedValueOnce({ docs: mockMatches.map(m => ({ id: m.id, data: () => m })) }); 

    renderWithRouterAndAuth(<VolunteerMatching />);

    await waitFor(() => {
      expect(screen.getByText('No matches found')).toBeInTheDocument();
    });
  });

  it('should handle no events', async () => {
    const mockVolunteers = [
      { id: '1', fullName: 'John Doe', skills: ['Skill1'], getCity: 'City1', availability: ['Monday'], getPref: 'Morning' }
    ];
    const mockMatches = [];

    getDocs
      .mockResolvedValueOnce({ docs: mockVolunteers.map(v => ({ id: v.id, data: () => v })) }) 
      .mockResolvedValueOnce({ docs: [] }) 
      .mockResolvedValueOnce({ docs: mockMatches.map(m => ({ id: m.id, data: () => m })) }); 

    renderWithRouterAndAuth(<VolunteerMatching />);

    await waitFor(() => {
      expect(screen.getByText('No matches found')).toBeInTheDocument();
    });
  });

  it('should call matchExists and saveMatches correctly', async () => {
    const mockVolunteers = [
      { id: '1', fullName: 'John Doe', skills: ['Skill1'], getCity: 'City1', availability: ['Monday'], getPref: 'Morning' }
    ];
    const mockEvents = [
      { id: '1', eventName: 'Test Event', requiredSkills: ['Skill1'], city: 'City1' }
    ];
    const mockMatches = [];

    getDocs
      .mockResolvedValueOnce({ docs: mockVolunteers.map(v => ({ id: v.id, data: () => v })) }) 
      .mockResolvedValueOnce({ docs: mockEvents.map(e => ({ id: e.id, data: () => e })) }) 
      .mockResolvedValueOnce({ docs: mockMatches.map(m => ({ id: m.id, data: () => m })) }); 

    const mockSetDoc = jest.fn();
    const mockDeleteDoc = jest.fn();
    const mockMatchExists = jest.fn().mockResolvedValue(false);

    setDoc.mockImplementation(mockSetDoc);
    deleteDoc.mockImplementation(mockDeleteDoc);

   
    jest.spyOn(require('../VolunteerMatching'), 'matchExists').mockImplementation(mockMatchExists);

    renderWithRouterAndAuth(<VolunteerMatching />);

    await waitFor(() => {
      const volunteerNames = screen.getAllByText('John Doe');
      expect(volunteerNames).toHaveLength(2); 
    });

    
    await new Promise(resolve => setTimeout(resolve, 100));

    console.log('mockMatchExists calls:', mockMatchExists.mock.calls);
    console.log('mockSetDoc calls:', mockSetDoc.mock.calls);
    console.log('mockDeleteDoc calls:', mockDeleteDoc.mock.calls);

    expect(mockMatchExists).toHaveBeenCalled();
    expect(mockSetDoc).toHaveBeenCalled();
    expect(mockDeleteDoc).not.toHaveBeenCalled();
  });
});
