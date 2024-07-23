import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/';
import Message from '../Message';

describe('Message Component', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  test('renders Message component', () => {
    render(<Message />);
    expect(screen.getByPlaceholderText('Sender...')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Message...')).toBeInTheDocument();
    expect(screen.getByText('Send')).toBeInTheDocument();
    expect(screen.getByText('Clear')).toBeInTheDocument();
  });

  test('handles input changes', () => {
    render(<Message />);
    const senderInput = screen.getByPlaceholderText('Sender...');
    const messageInput = screen.getByPlaceholderText('Message...');
    
    fireEvent.change(senderInput, { target: { value: 'John Doe' } });
    fireEvent.change(messageInput, { target: { value: 'Hello there!' } });

    expect(senderInput.value).toBe('John Doe');
    expect(messageInput.value).toBe('Hello there!');
  });

  test('adds a new message', () => {
    render(<Message />);
    const senderInput = screen.getByPlaceholderText('Sender...');
    const messageInput = screen.getByPlaceholderText('Message...');
    const sendButton = screen.getByText('Send');
    
    fireEvent.change(senderInput, { target: { value: 'John Doe' } });
    fireEvent.change(messageInput, { target: { value: 'Hello there!' } });
    fireEvent.click(sendButton);

    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('Hello there!')).toBeInTheDocument();
    expect(senderInput.value).toBe('');
    expect(messageInput.value).toBe('');
  });

  test('clears messages', async () => {
    render(<Message />);
    const senderInput = screen.getByPlaceholderText('Sender...');
    const messageInput = screen.getByPlaceholderText('Message...');
    const sendButton = screen.getByText('Send');
    const clearButton = screen.getByText('Clear');
    
    fireEvent.change(senderInput, { target: { value: 'John Doe' } });
    fireEvent.change(messageInput, { target: { value: 'Hello there!' } });
    fireEvent.click(sendButton);

    fireEvent.click(clearButton);

    await waitFor(() => {
      expect(screen.queryByText('John Doe')).not.toBeInTheDocument();
      expect(screen.queryByText('Hello there!')).not.toBeInTheDocument();
    });
  });

  test('persists messages in localStorage', () => {
    const savedMessages = JSON.stringify([{ sender: 'John Doe', message: 'Hello there!' }]);
    localStorage.setItem('messages', savedMessages);
    
    render(<Message />);
    
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('Hello there!')).toBeInTheDocument();
  });
});
