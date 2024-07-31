jest.mock('../Media/volunteer.png', () => 'test-file-stub');
jest.mock('../Media/ErrorFace.png', () => 'test-file-stub'); 

import React from 'react';
import { render, screen, act } from '@testing-library/react';
import App from '../App';
import { AuthProvider } from '../context/AuthContext';

const renderWithRouterAndAuth = (ui, { route = '/' } = {}) => {
  window.history.pushState({}, 'Test page', route);

  return render(
    <AuthProvider>
      {ui}
    </AuthProvider>
  );
};

describe('App', () => {
  test('renders Home page on default route', async () => {
    await act(async () => {
      renderWithRouterAndAuth(<App />, { route: '/' });
    });
    screen.debug(); 
    expect(screen.getByText(/Home Page/i)).toBeInTheDocument();
  });

  test('renders Login page on /login route', async () => {
    await act(async () => {
      renderWithRouterAndAuth(<App />, { route: '/login' });
    });
    screen.debug(); 
    expect(screen.getByText(/Login Page/i)).toBeInTheDocument();
  });

  test('renders Register page on /register route', async () => {
    await act(async () => {
      renderWithRouterAndAuth(<App />, { route: '/register' });
    });
    screen.debug(); 
    expect(screen.getByText(/Registration Page/i)).toBeInTheDocument();
  });

  test('renders Notification page on /notification route', async () => {
    await act(async () => {
      renderWithRouterAndAuth(<App />, { route: '/notification' });
    });
    screen.debug(); 
    expect(screen.getByText(/Notification Page/i)).toBeInTheDocument();
  });

  test('renders Profile page on /profile route', async () => {
    await act(async () => {
      renderWithRouterAndAuth(<App />, { route: '/profile' });
    });
    screen.debug(); 
    expect(screen.getByText(/Profile/i)).toBeInTheDocument();
  });

  test('renders ProfileManage page on /profile/profilemanagement route', async () => {
    await act(async () => {
      renderWithRouterAndAuth(<App />, { route: '/profile/profilemanagement' });
    });
    screen.debug(); 
    expect(screen.getByText(/Profile Management/i)).toBeInTheDocument();
  });

  test('renders Event page on /events route', async () => {
    await act(async () => {
      renderWithRouterAndAuth(<App />, { route: '/events' });
    });
    screen.debug(); 
    expect(screen.getByText(/Events/i)).toBeInTheDocument();
  });

  test('renders EventManage page on /events/eventmanagement route', async () => {
    await act(async () => {
      renderWithRouterAndAuth(<App />, { route: '/events/eventmanagement' });
    });
    screen.debug(); 
    expect(screen.getByText(/Create Event/i)).toBeInTheDocument();
  });

  test('renders VolunteerHistory page on /events/volunteerhistory route', async () => {
    await act(async () => {
      renderWithRouterAndAuth(<App />, { route: '/events/volunteerhistory' });
    });
    screen.debug(); 
    expect(screen.getByText(/Volunteer History/i)).toBeInTheDocument();
  });

  test('renders VolunteerMatching page on /events/volunteermatching route', async () => {
    await act(async () => {
      renderWithRouterAndAuth(<App />, { route: '/events/volunteermatching' });
    });
    screen.debug(); 
    expect(screen.getByText(/Volunteer Matching/i)).toBeInTheDocument();
  });

  test('renders Error page on invalid route', async () => {
    await act(async () => {
      renderWithRouterAndAuth(<App />, { route: '/invalid-route' });
    });
    screen.debug(); 
    expect(screen.getByText(/Error 404: Page Not found/i)).toBeInTheDocument();
  });
});
