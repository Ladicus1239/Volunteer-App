import React from 'react';
import { fireEvent, screen, act } from '@testing-library/react';
import Signup from '../Register';
import renderWithRouterAndAuth from '../../test-router';

test('renders register form', async () => {
  await act(async () => {
    renderWithRouterAndAuth(<Signup />);
  });
  
  screen.debug(); // Inspect the DOM structure
  expect(screen.getByLabelText('Email')).toBeInTheDocument();
  expect(screen.getByLabelText('Password')).toBeInTheDocument();
  expect(screen.getByLabelText('Confirm Password')).toBeInTheDocument();
});

test('handles registration', async () => {
  await act(async () => {
    renderWithRouterAndAuth(<Signup />);
  });

  fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'test@example.com' } });
  fireEvent.change(screen.getByLabelText('Password'), { target: { value: 'password123' } });
  fireEvent.change(screen.getByLabelText('Confirm Password'), { target: { value: 'password123' } });
  fireEvent.click(screen.getByText('Sign Up'));

  expect(screen.getByText(/Loading/i)).toBeInTheDocument();
});
