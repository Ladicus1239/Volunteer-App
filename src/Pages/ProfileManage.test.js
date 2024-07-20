import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import ProfileManage from './ProfileManage';
import '@testing-library/jest-dom/';

// Test to check if the Profile Management page renders correctly
test('renders Profile Management page', () => {
    render(<ProfileManage />);
    const titleElement = screen.getByText(/Profile Management/i);
    expect(titleElement).toBeInTheDocument();
});

// Test to check if all input fields are rendered
test('renders input fields', () => {
    render(<ProfileManage />);
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

// Test to check if input fields accept text
test('input fields should accept text', async () => {
    await act(async () => {
        render(<ProfileManage />);
    });

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

// Test to check if skills can be selected
test('skills can be selected', async () => {
    await act(async () => {
        render(<ProfileManage />);
    });

    const skillSelect = screen.getByText(/Choose your skill\(s\)/i);
    fireEvent.mouseDown(skillSelect);

    const adaptabilityOption = screen.getByText(/Adaptability/i);
    fireEvent.click(adaptabilityOption);

    const teamworkOption = screen.getByText(/Teamwork/i);
    fireEvent.click(teamworkOption);

    const selectedSkills = screen.getByText((content, element) => {
        return /Adaptability/.test(content) && /Teamwork/.test(content);
    });
    expect(selectedSkills).toBeInTheDocument();
});


// Test to check if date can be selected
test('date can be selected', async () => {
    await act(async () => {
        render(<ProfileManage />);
    });

    const daySelect = screen.getByPlaceholderText(/DD/i);
    fireEvent.mouseDown(daySelect);
    const dayOption = screen.getByText('01');
    fireEvent.click(dayOption);

    const monthSelect = screen.getByPlaceholderText(/MM/i);
    fireEvent.mouseDown(monthSelect);
    const monthOption = screen.getByText('01');
    fireEvent.click(monthOption);

    const yearSelect = screen.getByPlaceholderText(/YYYY/i);
    fireEvent.mouseDown(yearSelect);
    const yearOption = screen.getByText('2024');
    fireEvent.click(yearOption);

    const selectDateButton = screen.getByText(/Select Date/i);
    fireEvent.click(selectDateButton);

    const selectedDate = screen.getByText(/2024-01-01/i);
    expect(selectedDate).toBeInTheDocument();
});

// Test to check if an alert is displayed when date selection is incomplete
test('displays alert if date is incomplete', async () => {
    await act(async () => {
        render(<ProfileManage />);
    });
    window.alert = jest.fn(); // Mock window.alert

    const selectDateButton = screen.getByText(/Select Date/i);
    fireEvent.click(selectDateButton);

    expect(window.alert).toHaveBeenCalledWith("Please select day, month, and year.");
});

// Test to check if the submit button is rendered
test('submit button is rendered', async () => {
    await act(async () => {
        render(<ProfileManage />);
    });
    const submitButton = screen.getByText(/Update Profile/i);
    expect(submitButton).toBeInTheDocument();
});

// Test to check if the form submits correctly with selected skills and dates
test('form submits correctly with selected skills and dates', async () => {
    await act(async () => {
        render(<ProfileManage />);
    });

    // Fill in the input fields
    fireEvent.change(screen.getByPlaceholderText(/Full Name/i), { target: { value: 'John Doe' } });
    fireEvent.change(screen.getByPlaceholderText(/Address 1/i), { target: { value: '123 Main St' } });
    fireEvent.change(screen.getByPlaceholderText(/City/i), { target: { value: 'Anytown' } });
    fireEvent.change(screen.getByPlaceholderText(/State/i), { target: { value: 'CA' } });
    fireEvent.change(screen.getByPlaceholderText(/Zip code/i), { target: { value: '12345' } });
    fireEvent.change(screen.getByPlaceholderText(/Enter preferences/i), { target: { value: 'Remote' } });

    // Select skills
    const skillSelect = screen.getByText(/Choose your skill\(s\)/i);
    fireEvent.mouseDown(skillSelect);
    const adaptabilityOption = screen.getByText(/Adaptability/i);
    fireEvent.click(adaptabilityOption);
    const teamworkOption = screen.getByText(/Teamwork/i);
    fireEvent.click(teamworkOption);

    // Select date
    const daySelect = screen.getByPlaceholderText(/DD/i);
    fireEvent.mouseDown(daySelect);
    const dayOption = screen.getByText('01');
    fireEvent.click(dayOption);
    const monthSelect = screen.getByPlaceholderText(/MM/i);
    fireEvent.mouseDown(monthSelect);
    const monthOption = screen.getByText('01');
    fireEvent.click(monthOption);
    const yearSelect = screen.getByPlaceholderText(/YYYY/i);
    fireEvent.mouseDown(yearSelect);
    const yearOption = screen.getByText('2024');
    fireEvent.click(yearOption);

    const selectDateButton = screen.getByText(/Select Date/i);
    fireEvent.click(selectDateButton);

    // Submit form
    const handleSubmit = jest.fn(); // Mock handleSubmit function
    const form = screen.getByRole('form'); // Get the form element
    form.onsubmit = handleSubmit; // Assign the mock function to the form's onsubmit

    fireEvent.submit(form); // Trigger form submission

    expect(handleSubmit).toHaveBeenCalled(); // Check if the mock function was called

    // Check if the submitted data includes the selected skills and date
    expect(handleSubmit).toHaveBeenCalledWith(expect.objectContaining({
        fullName: 'John Doe',
        getAdd: '123 Main St',
        getCity: 'Anytown',
        getState: 'CA',
        getZip: '12345',
        skillArray: ['Adaptability', 'Teamwork'],
        dateArray: ['2024-01-01']
    }));
});
