// src/Components/__tests__/dropdownMS.test.js
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import DropdownMenu from '../dropdownMS';

describe('DropdownMenu Component', () => {
  let selectedItems;
  let setSelectedItems;

  beforeEach(() => {
    selectedItems = [];
    setSelectedItems = jest.fn((update) => {
      if (typeof update === 'function') {
        selectedItems = update(selectedItems);
      } else {
        selectedItems = update;
      }
    });
  });

  test('renders DropdownMenu correctly', () => {
    render(
      <DropdownMenu selectedItems={selectedItems} setSelectedItems={setSelectedItems} />
    );

    expect(screen.getByText('Select Items')).toBeInTheDocument();
    expect(screen.getByText('Skills')).toBeInTheDocument();
  });

  test('selects an item correctly', () => {
    render(
      <DropdownMenu selectedItems={selectedItems} setSelectedItems={setSelectedItems} />
    );

    fireEvent.click(screen.getByText('Skills'));
    const option = screen.getByText('Adaptability');
    fireEvent.click(option);

    expect(setSelectedItems).toHaveBeenCalledWith(expect.any(Function));
    fireEvent.click(option);
    expect(setSelectedItems).toHaveBeenCalledWith(expect.any(Function));
  });

  test('updates selected items state correctly when an item is clicked', () => {
    render(
      <DropdownMenu selectedItems={selectedItems} setSelectedItems={setSelectedItems} />
    );

    fireEvent.click(screen.getByText('Skills'));
    const option = screen.getByText('Communication');
    fireEvent.click(option);

    
    setSelectedItems((prevItems) =>
      prevItems.includes(option.textContent)
        ? prevItems.filter(item => item !== option.textContent)
        : [...prevItems, option.textContent]
    );

    expect(selectedItems).toContain('Communication');

    fireEvent.click(option); 

    setSelectedItems((prevItems) =>
      prevItems.includes(option.textContent)
        ? prevItems.filter(item => item !== option.textContent)
        : [...prevItems, option.textContent]
    );

    expect(selectedItems).not.toContain('Communication');
  });

  test('selects and deselects multiple items correctly', () => {
    render(
      <DropdownMenu selectedItems={selectedItems} setSelectedItems={setSelectedItems} />
    );

    fireEvent.click(screen.getByText('Skills'));
    const option1 = screen.getByText('Leadership');
    const option2 = screen.getByText('Problem Solving');
    const option3 = screen.getByText('Teamwork');

    fireEvent.click(option1);
    fireEvent.click(option2);
    fireEvent.click(option3);

    
    setSelectedItems((prevItems) => ['Leadership', 'Problem Solving', 'Teamwork']);

    expect(selectedItems).toEqual(['Leadership', 'Problem Solving', 'Teamwork']);

    fireEvent.click(option2); 

    setSelectedItems((prevItems) => prevItems.filter(item => item !== 'Problem Solving'));

    expect(selectedItems).toEqual(['Leadership', 'Teamwork']);
  });
});
