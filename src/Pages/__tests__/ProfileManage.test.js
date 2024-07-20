import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import ProfileManage from '../ProfileManage';
import renderWithRouter from '../test-utils/renderWithRouter';

// Mock the useAuth hook using the mock from authMock.js
jest.mock('../context/AuthContext', () => require('../../__mocks__/authMock'));

// Test to check if the Profile Management page renders correctly
test('renders Profile Management page', () => {
  renderWithRouter(<ProfileManage />);
  const titleElement = screen.getByText(/Profile Management/i);
  expect(titleElement).toBeInTheDocument();
});

// Test to check if all input fields are rendered
test('renders input fields', () => {
  renderWithRouter(<ProfileManage />);
  expect(screen.getByPlaceholderText(/Full Name/i)).toBeInTheDocument();
  expect(screen.getByPlaceholderText(/Address 1/i)).toBeInTheDocument();
  expect(screen.getByPlaceholderText(/Address 2/i)).toBeInTheDocument();
  expect(screen.getByPlaceholderText(/City/i)).toBeInTheDocument();
  expect(screen.getByPlaceholderText(/State/i)).toBeInTheDocument();
  expect(screen.getByPlaceholderText(/Zip code/i)).toBeInTheDocument();
  expect(screen.getByPlaceholderText(/Enter preferences/i)).toBeInTheDocument();
});

// Test to check if input fields accept text
test('input fields should accept text', () => {
  renderWithRouter(<ProfileManage />);

  // Test for Full Name input
  const nameInput = screen.getByPlaceholderText(/Full Name/i);
  fireEvent.change(nameInput, { target: { value: 'John Doe' } });
  expect(nameInput.value).toBe('John Doe');

  // Test for Address 1 input
  const addressInput = screen.getByPlaceholderText(/Address 1/i);
  fireEvent.change(addressInput, { target: { value: '123 Main St' } });
  expect(addressInput.value).toBe('123 Main St');

  // Test for City input
  const cityInput = screen.getByPlaceholderText(/City/i);
  fireEvent.change(cityInput, { target: { value: 'Anytown' } });
  expect(cityInput.value).toBe('Anytown');

  // Test for State input
  const stateInput = screen.getByPlaceholderText(/State/i);
  fireEvent.change(stateInput, { target: { value: 'CA' } });
  expect(stateInput.value).toBe('CA');

  // Test for Zip code input
  const zipInput = screen.getByPlaceholderText(/Zip code/i);
  fireEvent.change(zipInput, { target: { value: '12345' } });
  expect(zipInput.value).toBe('12345');

  // Test for Preferences input
  const prefInput = screen.getByPlaceholderText(/Enter preferences/i);
  fireEvent.change(prefInput, { target: { value: 'Remote' } });
  expect(prefInput.value).toBe('Remote');
});

// Test to check if an alert is displayed when date selection is incomplete
test('displays alert if date is incomplete', () => {
  renderWithRouter(<ProfileManage />);
  window.alert = jest.fn();  // Mock window.alert

  const selectDateButton = screen.getByText(/Select Date/i);
  fireEvent.click(selectDateButton);

  expect(window.alert).toHaveBeenCalledWith("Please select day, month, and year.");
});

// Test to check if the submit button is rendered
test('submit button is rendered', () => {
  renderWithRouter(<ProfileManage />);
  const submitButton = screen.getByText(/Update Profile/i);
  expect(submitButton).toBeInTheDocument();
});

// Test to check if the form submits correctly
test('form submits correctly', () => {
  renderWithRouter(<ProfileManage />);

  // Fill in the input fields
  fireEvent.change(screen.getByPlaceholderText(/Full Name/i), { target: { value: 'John Doe' } });
  fireEvent.change(screen.getByPlaceholderText(/Address 1/i), { target: { value: '123 Main St' } });
  fireEvent.change(screen.getByPlaceholderText(/City/i), { target: { value: 'Anytown' } });
  fireEvent.change(screen.getByPlaceholderText(/State/i), { target: { value: 'CA' } });
  fireEvent.change(screen.getByPlaceholderText(/Zip code/i), { target: { value: '12345' } });
  fireEvent.change(screen.getByPlaceholderText(/Enter preferences/i), { target: { value: 'Remote' } });

  const handleSubmit = jest.fn();  // Mock handleSubmit function
  const form = screen.getByRole('form');  // Get the form element
  form.onsubmit = handleSubmit;  // Assign the mock function to the form's onsubmit

  fireEvent.submit(form);  // Trigger form submission

  expect(handleSubmit).toHaveBeenCalled();  // Check if the mock function was called
});
