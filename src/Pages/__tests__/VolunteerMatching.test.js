import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import VolunteerMatching from '../VolunteerMatching';
import { BrowserRouter } from 'react-router-dom';

jest.mock('../../Components/Navigation', () => () => <nav role="navigation">Mocked Navigation</nav>);

describe('VolunteerMatching', () => {
  beforeEach(() => {
   
    localStorage.clear();

 
    const events = [
      {
        id: 1,
        name: "Community Leadership Workshop",
        skillsRequired: ["Leadership"],
        date: "2024-07-29",
        location: "New York",
        type: "teaching",
      },
      {
        id: 2,
        name: "Creative Arts Program",
        skillsRequired: ["Creative"],
        date: "2024-07-29",
        location: "New York",
        type: "teaching",
      },
      {
        id: 3,
        name: "Team Building Exercise",
        skillsRequired: ["Teamwork"],
        date: "2024-07-29",
        location: "Los Angeles",
        type: "driving",
      },
    ];

    const volunteers = [
      {
        id: 1,
        name: "Alice",
        skills: ["Adaptability", "Communication"],
        availability: ["weekends"],
        location: "New York",
        preferences: ["teaching"],
      },
      {
        id: 2,
        name: "Bob",
        skills: ["Leadership", "Strong Work Ethic"],
        availability: ["weekdays", "weekends"],
        location: "Los Angeles",
        preferences: ["driving"],
      },
      {
        id: 3,
        name: "Charlie",
        skills: ["Creative", "Interpersonal Communication"],
        availability: ["weekdays"],
        location: "New York",
        preferences: ["first aid"],
      },
    ];

    localStorage.setItem('events', JSON.stringify(events));
    localStorage.setItem('volunteers', JSON.stringify(volunteers));
  });

  test('renders VolunteerMatching page correctly', () => {
    render(
      <BrowserRouter>
        <VolunteerMatching />
      </BrowserRouter>
    );


    expect(screen.getByText('Volunteer Matching')).toBeInTheDocument();

    expect(screen.getByRole('navigation')).toBeInTheDocument();

    expect(screen.getByText('All Volunteers')).toBeInTheDocument();
    expect(screen.getByText('Matched Volunteers')).toBeInTheDocument();

    expect(screen.getByText('Alice')).toBeInTheDocument();
    expect(screen.getByText('Bob')).toBeInTheDocument();
    expect(screen.getByText('Charlie')).toBeInTheDocument();
  });

  test('matches volunteers to events correctly', () => {
    render(
      <BrowserRouter>
        <VolunteerMatching />
      </BrowserRouter>
    );

    expect(screen.getByText('Alice')).toBeInTheDocument();
    expect(screen.getByText('Bob')).toBeInTheDocument();
    expect(screen.getByText('Charlie')).toBeInTheDocument();

    expect(screen.getByText('Community Leadership Workshop')).toBeInTheDocument();
    expect(screen.getByText('Creative Arts Program')).toBeInTheDocument();
    expect(screen.getByText('Team Building Exercise')).toBeInTheDocument();
  });
});
