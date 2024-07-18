import React from 'react';
import { render, screen } from '@testing-library/react';
import Profile from './Profile';

// Mock props to be passed to the Profile component for testing
const mockProps = {
    fullName: "John Doe",
    getAdd: "123 Main St",
    getCity: "Anytown",
    getState: "CA",
    getZip: "12345",
    skillArray: ["JavaScript", "React", "Node.js"],
    getPref: "Remote",
    dateArray: ["2023-07-20", "2023-07-21"],
};

// Test to check if the profile renders with the correct name
test('renders profile with correct name', () => {
    render(<Profile {...mockProps} />);
    const nameElement = screen.getByText(/John Doe's Profile/i);
    expect(nameElement).toBeInTheDocument();
});

// Test to check if the address is rendered correctly
test('renders address correctly', () => {
    render(<Profile {...mockProps} />);
    const addressElement = screen.getByText(/123 Main St, Anytown, CA, 12345/i);
    expect(addressElement).toBeInTheDocument();
});

// Test to check if the skills are rendered correctly
test('renders skills correctly', () => {
    render(<Profile {...mockProps} />);
    const skillsElement = screen.getByText(/JavaScript,React,Node.js/i);
    expect(skillsElement).toBeInTheDocument();
});

// Test to check if the preferences are rendered correctly
test('renders preferences correctly', () => {
    render(<Profile {...mockProps} />);
    const prefElement = screen.getByText(/Remote/i);
    expect(prefElement).toBeInTheDocument();
});

// Test to check if the dates are rendered correctly
test('renders dates correctly', () => {
    render(<Profile {...mockProps} />);
    const datesElement = screen.getByText(/2023-07-20,2023-07-21/i);
    expect(datesElement).toBeInTheDocument();
});

// Test to check if the profile management link is rendered correctly
test('renders profile management link correctly', () => {
    render(<Profile {...mockProps} />);
    const linkElement = screen.getByText(/Profile Management/i);
    // Check if the link has the correct href attribute
    expect(linkElement.closest('a')).toHaveAttribute('href', '/profile/profilemanagement');
});
