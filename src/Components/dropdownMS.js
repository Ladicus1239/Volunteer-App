import React, { useState } from 'react';
import { Form, Dropdown, DropdownButton } from 'react-bootstrap';

export default function DropdownMenu({ selectedItems, setSelectedItems }) {
  const options = ['Adaptability','Communication', 'Creative', 'Interpersonal Communication', 'Leadership','Problem Solving','Strong Work Ethic','Teamwork','Time Management'];
  
  const handleSelect = (e) => {
    const value = e.target.getAttribute('data-value');
    setSelectedItems(prevItems =>
      prevItems.includes(value)
        ? prevItems.filter(item => item !== value)
        : [...prevItems, value]
    );
  };

  return (
    <Form.Group>
      <Form.Label>Select Items</Form.Label>
      <DropdownButton
        id="dropdown-multiselect"
        title="Skills"
        variant="secondary"
      >
        {options.map(option => (
          <Dropdown.Item
            key={option}
            data-value={option}
            onClick={handleSelect}
            active={selectedItems.includes(option)}
          >
            {option}
          </Dropdown.Item>
        ))}
      </DropdownButton>
    </Form.Group>
  );
}
