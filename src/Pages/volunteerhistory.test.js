import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import VolunteerHistory from '..Pages/VolunteerHistory';
import '@testing-library/jest-dom/extend-expect';

// Mock props to be passed to the VolunteerHistory component for testing
const mockProps = {
    fullName: "John Doe",
    getAdd: "123 Main St",
    skillArray: ["JavaScript", "React", "Node.js"]
};

// Render the component before each test
beforeEach(() => {
    render(<VolunteerHistory {...mockProps} />);
});

test('renders Volunteer History title', () => {
    const titleElement = screen.getByText(/Volunteer History/i);
    expect(titleElement).toBeInTheDocument();
});

test('renders table headers correctly', () => {
    const headers = ['Name', 'EventName', 'Description', 'Location', 'Skills', 'Urgency', 'Date', 'Attendance'];
    headers.forEach(header => {
        expect(screen.getByText(header)).toBeInTheDocument();
    });
});

test('renders hardcoded data correctly', () => {
    expect(screen.getByText("John Doe")).toBeInTheDocument();
    expect(screen.getByText("Jane Doe")).toBeInTheDocument();
    expect(screen.getByText("Cookie Dough")).toBeInTheDocument();
});

test('renders location correctly', () => {
    const locationElement = screen.getByText(/123 Main St/i);
    expect(locationElement).toBeInTheDocument();
});

test('renders skills correctly', () => {
    const skillsElement = screen.getByText(/JavaScript,React,Node.js/i);
    expect(skillsElement).toBeInTheDocument();
});

test('select all checkbox selects all rows', () => {
    const selectAllCheckbox = screen.getAllByRole('checkbox')[0];
    fireEvent.click(selectAllCheckbox);

    const checkboxes = screen.getAllByRole('checkbox');
    checkboxes.forEach(checkbox => {
        expect(checkbox).toBeChecked();
    });
});

test('individual checkboxes work correctly', () => {
    const checkboxes = screen.getAllByRole('checkbox');

    // Click the first individual checkbox
    fireEvent.click(checkboxes[1]);
    expect(checkboxes[1]).toBeChecked();
    expect(checkboxes[0]).not.toBeChecked(); // Select all checkbox should not be checked

    // Click the second individual checkbox
    fireEvent.click(checkboxes[2]);
    expect(checkboxes[2]).toBeChecked();

    // Click the select all checkbox
    fireEvent.click(checkboxes[0]);
    checkboxes.forEach(checkbox => {
        expect(checkbox).toBeChecked();
    });

    // Unclick the select all checkbox
    fireEvent.click(checkboxes[0]);
    checkboxes.forEach(checkbox => {
        expect(checkbox).not.toBeChecked();
    });
});
