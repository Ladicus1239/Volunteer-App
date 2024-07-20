// src/Pages/__tests__/EventManage.test.js
import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import EventManage from '../EventManage';
import { BrowserRouter } from 'react-router-dom';

// Mock the subcomponents
jest.mock('../../Components/Navigation', () => () => <nav role="navigation">Mocked Navigation</nav>);
jest.mock('../../Components/dropdownMS', () => ({ selectedItems, setSelectedItems, dataTestId }) => (
  <div data-testid={dataTestId}>Mocked Dropdown Menu</div>
));

const renderWithRouter = (ui, { route = '/' } = {}) => {
    window.history.pushState({}, 'Test page', route);
    return render(ui, { wrapper: ({ children }) => <BrowserRouter>{children}</BrowserRouter> });
};

beforeEach(() => {
    localStorage.clear(); // Clear localStorage before each test to isolate them
});

test('renders EventManage page correctly', async () => {
    await act(async () => {
        renderWithRouter(<EventManage />);
    });

    // Check if Navigation component is rendered
    expect(screen.getByRole('navigation')).toBeInTheDocument();

    // Check if form elements are rendered
    expect(screen.getByPlaceholderText(/Event Name/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Event Description/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Location/i)).toBeInTheDocument();
    expect(screen.getByTestId('required-skills')).toBeInTheDocument();
    expect(screen.getAllByText(/Urgency/i)[0]).toBeInTheDocument();
    expect(screen.getByLabelText(/Event Date/i)).toBeInTheDocument();

    // Check if submit button is rendered
    expect(screen.getByRole('button', { name: /Create Event/i })).toBeInTheDocument();
});

test('creates a new event', async () => {
    await act(async () => {
        renderWithRouter(<EventManage />);
    });

    fireEvent.change(screen.getByPlaceholderText(/Event Name/i), { target: { value: 'Test Event' } });
    fireEvent.change(screen.getByPlaceholderText(/Event Description/i), { target: { value: 'This is a test event' } });
    fireEvent.change(screen.getByPlaceholderText(/Location/i), { target: { value: 'Test Location' } });
    fireEvent.change(screen.getByLabelText(/Event Date/i), { target: { value: '2024-01-01' } });

    fireEvent.click(screen.getByRole('button', { name: /Create Event/i }));

    // Check if the new event is added to the event list
    expect(screen.getAllByText(/Test Event/i)[0]).toBeInTheDocument();
    expect(screen.getByText(/This is a test event/i)).toBeInTheDocument();
    expect(screen.getByText(/Test Location/i)).toBeInTheDocument();
    expect(screen.getByText(/2024-01-01/i)).toBeInTheDocument();
});

test('edits an existing event', async () => {
    await act(async () => {
        renderWithRouter(<EventManage />);
    });

    fireEvent.change(screen.getByPlaceholderText(/Event Name/i), { target: { value: 'Test Event' } });
    fireEvent.change(screen.getByPlaceholderText(/Event Description/i), { target: { value: 'This is a test event' } });
    fireEvent.change(screen.getByPlaceholderText(/Location/i), { target: { value: 'Test Location' } });
    fireEvent.change(screen.getByLabelText(/Event Date/i), { target: { value: '2024-01-01' } });

    fireEvent.click(screen.getByRole('button', { name: /Create Event/i }));

    fireEvent.click(screen.getAllByText(/Edit/i)[0]);

    fireEvent.change(screen.getByPlaceholderText(/Event Name/i), { target: { value: 'Updated Event' } });
    fireEvent.change(screen.getByPlaceholderText(/Event Description/i), { target: { value: 'This is an updated test event' } });

    fireEvent.click(screen.getByRole('button', { name: /Update Event/i }));

    // Check if the event is updated in the event list
    expect(screen.getAllByText(/Updated Event/i)[0]).toBeInTheDocument();
    expect(screen.getByText(/This is an updated test event/i)).toBeInTheDocument();
});

test('deletes an event', async () => {
    await act(async () => {
        renderWithRouter(<EventManage />);
    });

    fireEvent.change(screen.getByPlaceholderText(/Event Name/i), { target: { value: 'Test Event' } });
    fireEvent.change(screen.getByPlaceholderText(/Event Description/i), { target: { value: 'This is a test event' } });
    fireEvent.change(screen.getByPlaceholderText(/Location/i), { target: { value: 'Test Location' } });
    fireEvent.change(screen.getByLabelText(/Event Date/i), { target: { value: '2024-01-01' } });

    fireEvent.click(screen.getByRole('button', { name: /Create Event/i }));

    fireEvent.click(screen.getAllByText(/Delete/i)[0]);

    // Check if the event is removed from the event list
    expect(screen.queryByText(/Test Event/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/This is a test event/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/Test Location/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/2024-01-01/i)).not.toBeInTheDocument();
});
