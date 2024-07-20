import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import renderWithRouter from '../test-utils/renderWithRouter';
import EventManage from '../EventManage';

// Mock the useAuth hook using the mock from authMock.js
jest.mock('../context/AuthContext', () => require('../../__mocks__/authMock'));

// Test to check if the Event Management page renders correctly
test('renders Event Management component', () => {
  renderWithRouter(<EventManage />);
  expect(screen.getByText(/Create Event/i)).toBeInTheDocument();
});

// Test to check if creating a new event works correctly
test('allows user to create a new event', () => {
  renderWithRouter(<EventManage />);

  fireEvent.change(screen.getByPlaceholderText(/Event Name/i), {
    target: { value: "Test Event" },
  });
  fireEvent.change(screen.getByPlaceholderText(/Event Description/i), {
    target: { value: "This is a test event" },
  });
  fireEvent.change(screen.getByPlaceholderText(/Location/i), {
    target: { value: "Test Location" },
  });

  // Open the dropdown menu and select an option
  fireEvent.click(screen.getByTestId("dropdown-button"));
  fireEvent.click(screen.getByTestId("checkbox-option1"));

  fireEvent.change(screen.getByLabelText(/Urgency/i), {
    target: { value: "medium" },
  });
  fireEvent.change(screen.getByLabelText(/Event Date/i), {
    target: { value: "2024-07-18" },
  });

  fireEvent.click(screen.getByText(/Create Event/i));

  expect(screen.getByText(/Test Event/i)).toBeInTheDocument();
  expect(screen.getByText(/This is a test event/i)).toBeInTheDocument();
  expect(screen.getByText(/Test Location/i)).toBeInTheDocument();
  expect(screen.getByText(/Option 1/i)).toBeInTheDocument(); // Verifying the selected option
  expect(screen.getByText(/medium/i)).toBeInTheDocument();
  expect(screen.getByText(/2024-07-18/i)).toBeInTheDocument();
});

// Test to check if editing an event works correctly
test('allows user to edit an event', () => {
  renderWithRouter(<EventManage />);

  // Create an event
  fireEvent.change(screen.getByPlaceholderText(/Event Name/i), {
    target: { value: "Test Event" },
  });
  fireEvent.change(screen.getByPlaceholderText(/Event Description/i), {
    target: { value: "This is a test event" },
  });
  fireEvent.change(screen.getByPlaceholderText(/Location/i), {
    target: { value: "Test Location" },
  });

  // Open the dropdown menu and select an option
  fireEvent.click(screen.getByTestId("dropdown-button"));
  fireEvent.click(screen.getByTestId("checkbox-option1"));

  fireEvent.change(screen.getByLabelText(/Urgency/i), {
    target: { value: "medium" },
  });
  fireEvent.change(screen.getByLabelText(/Event Date/i), {
    target: { value: "2024-07-18" },
  });

  fireEvent.click(screen.getByText(/Create Event/i));

  // Edit the event
  fireEvent.click(screen.getByText(/Edit/i));
  fireEvent.change(screen.getByPlaceholderText(/Event Name/i), {
    target: { value: "Updated Event" },
  });

  fireEvent.click(screen.getByText(/Create Event/i));

  expect(screen.getByText(/Updated Event/i)).toBeInTheDocument();
});

// Test to check if deleting an event works correctly
test('allows user to delete an event', () => {
  renderWithRouter(<EventManage />);

  // Create an event
  fireEvent.change(screen.getByPlaceholderText(/Event Name/i), {
    target: { value: "Test Event" },
  });
  fireEvent.change(screen.getByPlaceholderText(/Event Description/i), {
    target: { value: "This is a test event" },
  });
  fireEvent.change(screen.getByPlaceholderText(/Location/i), {
    target: { value: "Test Location" },
  });

  fireEvent.click(screen.getByTestId("dropdown-button"));
  fireEvent.click(screen.getByTestId("checkbox-option1"));

  fireEvent.change(screen.getByLabelText(/Urgency/i), {
    target: { value: "medium" },
  });
  fireEvent.change(screen.getByLabelText(/Event Date/i), {
    target: { value: "2024-07-18" },
  });

  fireEvent.click(screen.getByText(/Create Event/i));
  fireEvent.click(screen.getByText(/Delete/i));
  expect(screen.queryByText(/Test Event/i)).not.toBeInTheDocument();
});
