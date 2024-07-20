import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/';
import Notification from './Notification';
import Message from '../../Components/Message';
import Navigation from '../../Components/Navigation';

jest.mock('../Components/Message', () => () => <div>Mocked Message Component</div>);
jest.mock('../Components/Navigation', () => () => <div>Mocked Navigation Component</div>);

describe('Notification Component', () => {
  test('renders Notification component', () => {
    render(<Notification />);
    expect(screen.getByText('Notification Page')).toBeInTheDocument();
    expect(screen.getByText('Messenger')).toBeInTheDocument();
    expect(screen.getByText('Mocked Message Component')).toBeInTheDocument();
    expect(screen.getByText('Mocked Navigation Component')).toBeInTheDocument();
  });
});
