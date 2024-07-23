import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import ProfileManage from '../ProfileManage';
import '@testing-library/jest-dom';
import renderWithRouterAndAuth from '../../test-router';
import Select from 'react-select';

jest.mock('react-select', () => ({ options, value, onChange, placeholder, isMulti }) => (
  <div data-testid="select-mock">
    <input
      data-testid="select-input"
      placeholder={placeholder}
      value={value ? value.label : ''}
      onChange={e => onChange({ value: e.currentTarget.value, label: e.currentTarget.value })}
    />
    {options.map(option => (
      <div key={option.value} onClick={() => onChange(option)}>
        {option.label}
      </div>
    ))}
  </div>
));

async function renderComponent() {
  await waitFor(() => renderWithRouterAndAuth(<ProfileManage />));
}

test('renders Profile Management page', async () => {
  await renderComponent();
  const titleElement = await screen.findByText(/Profile Management/i);
  expect(titleElement).toBeInTheDocument();
});

test('renders input fields', async () => {
  await renderComponent();
  expect(screen.getByPlaceholderText(/Full Name/i)).toBeInTheDocument();
  expect(screen.getByPlaceholderText(/Address 1/i)).toBeInTheDocument();
  expect(screen.getByPlaceholderText(/Address 2/i)).toBeInTheDocument();
  expect(screen.getByPlaceholderText(/City/i)).toBeInTheDocument();
  expect(screen.getByPlaceholderText(/State/i)).toBeInTheDocument();
  expect(screen.getByPlaceholderText(/Zip code/i)).toBeInTheDocument();
  expect(screen.getByPlaceholderText(/Enter preferences/i)).toBeInTheDocument();
  expect(screen.getByText(/Choose your skill\(s\)/i)).toBeInTheDocument();
  expect(screen.getByText(/Choose your availability date:/i)).toBeInTheDocument();
});

test('input fields should accept text', async () => {
  await renderComponent();

  const nameInput = screen.getByPlaceholderText(/Full Name/i);
  fireEvent.change(nameInput, { target: { value: 'John Doe' } });
  expect(nameInput.value).toBe('John Doe');

  const addressInput = screen.getByPlaceholderText(/Address 1/i);
  fireEvent.change(addressInput, { target: { value: '123 Main St' } });
  expect(addressInput.value).toBe('123 Main St');

  const cityInput = screen.getByPlaceholderText(/City/i);
  fireEvent.change(cityInput, { target: { value: 'Anytown' } });
  expect(cityInput.value).toBe('Anytown');

  const stateInput = screen.getByPlaceholderText(/State/i);
  fireEvent.change(stateInput, { target: { value: 'CA' } });
  expect(stateInput.value).toBe('CA');

  const zipInput = screen.getByPlaceholderText(/Zip code/i);
  fireEvent.change(zipInput, { target: { value: '12345' } });
  expect(zipInput.value).toBe('12345');

  const prefInput = screen.getByPlaceholderText(/Enter preferences/i);
  fireEvent.change(prefInput, { target: { value: 'Remote' } });
  expect(prefInput.value).toBe('Remote');
});

test('skills can be selected', async () => {
  await renderComponent();

  const skillSelect = screen.getByText(/Choose your skill\(s\)/i);
  fireEvent.mouseDown(skillSelect);

  const adaptabilityOption = await screen.findByText(/Adaptability/i);
  fireEvent.click(adaptabilityOption);

  const teamworkOption = await screen.findByText(/Teamwork/i);
  fireEvent.click(teamworkOption);

  expect(screen.getByDisplayValue(/Adaptability/i)).toBeInTheDocument();
  expect(screen.getByDisplayValue(/Teamwork/i)).toBeInTheDocument();
});

test('date can be selected', async () => {
  await renderComponent();

  const daySelect = screen.getAllByPlaceholderText(/DD/i)[0];
  fireEvent.mouseDown(daySelect);
  const dayOption = await screen.findAllByText('01');
  fireEvent.click(dayOption[0]);

  const monthSelect = screen.getAllByPlaceholderText(/MM/i)[0];
  fireEvent.mouseDown(monthSelect);
  const monthOption = await screen.findAllByText('01');
  fireEvent.click(monthOption[0]);

  const yearSelect = screen.getAllByPlaceholderText(/YYYY/i)[0];
  fireEvent.mouseDown(yearSelect);
  const yearOption = await screen.findAllByText('2024');
  fireEvent.click(yearOption[0]);

  const selectDateButton = screen.getByText(/Select Date/i);
  fireEvent.click(selectDateButton);

  const selectedDate = await screen.findByText(/2024-01-01/i);
  expect(selectedDate).toBeInTheDocument();
});

test('displays alert if date is incomplete', async () => {
  await renderComponent();
  window.alert = jest.fn();

  const selectDateButton = screen.getByText(/Select Date/i);
  fireEvent.click(selectDateButton);

  expect(window.alert).toHaveBeenCalledWith("Please select day, month, and year.");
});

test('submit button is rendered', async () => {
  await renderComponent();
  const submitButton = screen.getByText(/Update Profile/i);
  expect(submitButton).toBeInTheDocument();
});

test('form submits correctly with selected skills and dates', async () => {
  await renderComponent();

  fireEvent.change(screen.getByPlaceholderText(/Full Name/i), { target: { value: 'John Doe' } });
  fireEvent.change(screen.getByPlaceholderText(/Address 1/i), { target: { value: '123 Main St' } });
  fireEvent.change(screen.getByPlaceholderText(/City/i), { target: { value: 'Anytown' } });
  fireEvent.change(screen.getByPlaceholderText(/State/i), { target: { value: 'CA' } });
  fireEvent.change(screen.getByPlaceholderText(/Zip code/i), { target: { value: '12345' } });
  fireEvent.change(screen.getByPlaceholderText(/Enter preferences/i), { target: { value: 'Remote' } });

  const skillSelect = screen.getByText(/Choose your skill\(s\)/i);
  fireEvent.mouseDown(skillSelect);
  const adaptabilityOption = await screen.findByText(/Adaptability/i);
  fireEvent.click(adaptabilityOption);
  const teamworkOption = await screen.findByText(/Teamwork/i);
  fireEvent.click(teamworkOption);

  const daySelect = screen.getAllByPlaceholderText(/DD/i)[0];
  fireEvent.mouseDown(daySelect);
  const dayOption = await screen.findAllByText('01');
  fireEvent.click(dayOption[0]);
  const monthSelect = screen.getAllByPlaceholderText(/MM/i)[0];
  fireEvent.mouseDown(monthSelect);
  const monthOption = await screen.findAllByText('01');
  fireEvent.click(monthOption[0]);
  const yearSelect = screen.getAllByPlaceholderText(/YYYY/i)[0];
  fireEvent.mouseDown(yearSelect);
  const yearOption = await screen.findAllByText('2024');
  fireEvent.click(yearOption[0]);

  const selectDateButton = screen.getByText(/Select Date/i);
  fireEvent.click(selectDateButton);

  const form = screen.getByRole('form');
  fireEvent.submit(form);

  const expectedOutput = {
    fullName: 'John Doe',
    getAdd: '123 Main St',
    getCity: 'Anytown',
    getState: 'CA',
    getZip: '12345',
    skillArray: 'Adaptability, Teamwork',
    dateArray: '2024-01-01'
  };

  const originalConsoleLog = console.log;
  console.log = jest.fn();

  fireEvent.submit(form);

  expect(console.log).toHaveBeenCalledWith(expectedOutput);

  console.log = originalConsoleLog;
});
