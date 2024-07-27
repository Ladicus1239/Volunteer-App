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
    getAdd2: '',
    getCity: 'Anytown',
    selectedState: 'CA',
    getZip: '12345',
    getPref: 'Remote',
    skills: ['Adaptability', 'Teamwork'],
    selectedDates: ['2024-01-01']
  };

  const originalConsoleLog = console.log;
  console.log = jest.fn();

  fireEvent.submit(form);

  expect(console.log).toHaveBeenCalledWith(expectedOutput);

  console.log = originalConsoleLog;
});



test('should handle changes in state dropdown', async () => {
  await renderComponent();

  const stateSelect = screen.getByPlaceholderText(/State/i);
  fireEvent.mouseDown(stateSelect);

  const californiaOption = await screen.findByText(/California, CA/i);
  fireEvent.click(californiaOption);

  expect(screen.getByDisplayValue(/California, CA/i)).toBeInTheDocument();
});

test('should handle adding and removing dates correctly', async () => {
  await renderComponent();

  const daySelect = screen.getAllByPlaceholderText(/DD/i)[0];
  fireEvent.mouseDown(daySelect);
  const dayOption = await screen.findAllByText('15');
  fireEvent.click(dayOption[0]);

  const monthSelect = screen.getAllByPlaceholderText(/MM/i)[0];
  fireEvent.mouseDown(monthSelect);
  const monthOption = await screen.findAllByText('07');
  fireEvent.click(monthOption[0]);

  const yearSelect = screen.getAllByPlaceholderText(/YYYY/i)[0];
  fireEvent.mouseDown(yearSelect);
  const yearOption = await screen.findAllByText('2025');
  fireEvent.click(yearOption[0]);

  const selectDateButton = screen.getByText(/Select Date/i);
  fireEvent.click(selectDateButton);

  expect(screen.getByText(/2025-07-15/i)).toBeInTheDocument();

  
  const removeDateButton = screen.getByText(/Remove Date/i);
  fireEvent.click(removeDateButton);

  expect(screen.queryByText(/2025-07-15/i)).not.toBeInTheDocument();
});

test('renders address line 2 input field', async () => {
  await renderComponent();
  expect(screen.getByPlaceholderText(/Address 2/i)).toBeInTheDocument();
});

test('address line 2 field should accept text', async () => {
  await renderComponent();
  const address2Input = screen.getByPlaceholderText(/Address 2/i);
  fireEvent.change(address2Input, { target: { value: 'Suite 100' } });
  expect(address2Input.value).toBe('Suite 100');
});

test('handleStateChange function updates state correctly', async () => {
  await renderComponent();
  const stateSelect = screen.getByPlaceholderText(/State/i);
  fireEvent.mouseDown(stateSelect);
  const stateOption = await screen.findByText(/California, CA/i);
  fireEvent.click(stateOption);
  expect(screen.getByPlaceholderText(/State/i).value).toBe('CA');
});

test('displays alert if user is not logged in', async () => {
  jest.spyOn(require('../context/AuthContext'), 'useAuth').mockReturnValue({ currentUser: null });
  const navigate = jest.fn();
  jest.spyOn(require('react-router-dom'), 'useNavigate').mockReturnValue(navigate);

  await renderComponent();

  expect(window.alert).toHaveBeenCalledWith("User is not logged in. Redirecting to the login page.");
  expect(navigate).toHaveBeenCalledWith("/login");
});

test('form does not submit if user is not logged in', async () => {
  jest.spyOn(require('../context/AuthContext'), 'useAuth').mockReturnValue({ currentUser: null });
  window.alert = jest.fn();

  await renderComponent();

  const form = screen.getByRole('form');
  fireEvent.submit(form);

  expect(window.alert).toHaveBeenCalledWith("User is not logged in.");
});

test('displays alert if date selection is incomplete', async () => {
  await renderComponent();
  window.alert = jest.fn();

  const selectDateButton = screen.getByText(/Select Date/i);
  fireEvent.click(selectDateButton);

  expect(window.alert).toHaveBeenCalledWith("Please select day, month, and year.");
});

test('removes selected skill when clicked again', async () => {
  await renderComponent();

  const skillSelect = screen.getByText(/Choose your skill\(s\)/i);
  fireEvent.mouseDown(skillSelect);

  const adaptabilityOption = await screen.findByText(/Adaptability/i);
  fireEvent.click(adaptabilityOption);
  expect(screen.getByDisplayValue(/Adaptability/i)).toBeInTheDocument();

  fireEvent.click(adaptabilityOption);
  expect(screen.queryByDisplayValue(/Adaptability/i)).not.toBeInTheDocument();
});

test('handles empty skill selection', async () => {
  await renderComponent();

  const skillSelect = screen.getByText(/Choose your skill\(s\)/i);
  fireEvent.mouseDown(skillSelect);
  fireEvent.click(document.body); 

  expect(screen.queryByDisplayValue(/Adaptability/i)).not.toBeInTheDocument();
  expect(screen.queryByDisplayValue(/Teamwork/i)).not.toBeInTheDocument();
});

test('displays error when skill selection exceeds maximum limit', async () => {
  await renderComponent();

  const skillSelect = screen.getByText(/Choose your skill\(s\)/i);
  fireEvent.mouseDown(skillSelect);

  const skills = ['Adaptability', 'Communication', 'Creative', 'Interpersonal Communication', 'Leadership', 'Problem Solving', 'Strong Work Ethic'];

  for (let skill of skills) {
    const skillOption = await screen.findByText(new RegExp(skill, 'i'));
    fireEvent.click(skillOption);
  }

  expect(screen.getAllByText(/Skill/i).length).toBe(5); 
  expect(window.alert).toHaveBeenCalledWith("You can only select up to 5 skills.");
});

test('removes selected date when remove date button is clicked', async () => {
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

  const removeDateButton = screen.getByText(/Remove Date/i);
  fireEvent.click(removeDateButton);

  expect(screen.queryByText(/2024-01-01/i)).not.toBeInTheDocument();
});
