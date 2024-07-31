import React from 'react';
import { screen, act } from '@testing-library/react';
import Error from '../ErrorPage'; 
import '@testing-library/jest-dom';
import renderWithRouterAndAuth from '../../test-router'; 

jest.mock('../../Media/ErrorFace.png', () => 'mockImage.png');

describe('Error Page', () => {
  test('renders Error 404 page with correct elements', async () => {
    await act(async () => {
      renderWithRouterAndAuth(<Error />, { route: '/invalid-route' });
    });


    screen.debug();
    
    const titleElement = screen.queryByText(/Error 404: Page Not found/i);
    expect(titleElement).toBeInTheDocument();
       
    const imageElement = screen.getByAltText('crying');
    expect(imageElement).toBeInTheDocument();
    expect(imageElement.src).toContain('mockImage.png');
  });
});
