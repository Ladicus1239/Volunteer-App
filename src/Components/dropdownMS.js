import React, { useState } from "react";
import "../styles.css";

const options = [
  { value: "option1", label: "Option 1" },
  { value: "option2", label: "Option 2" },
  { value: "option3", label: "Option 3" },
  { value: "option4", label: "Option 4" },
];

const DropdownMenu = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [selectedOptions, setSelectedOptions] = useState([]);

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const handleChange = (event) => {
    const value = event.target.value;
    setSelectedOptions((prevSelectedOptions) =>
      event.target.checked
        ? [...prevSelectedOptions, value]
        : prevSelectedOptions.filter((option) => option !== value)
    );
  };

  return (
    <div className="dropdown-container">
      <button
        onClick={toggleDropdown}
        className="dropdown-button"
        data-testid="dropdown-button"
      >
        Select Options
      </button>
      {dropdownOpen && (
        <div className="dropdown-menu" data-testid="dropdown-menu">
          {options.map((option) => (
            <label key={option.value} data-testid={`option-${option.value}`}>
              <input
                type="checkbox"
                value={option.value}
                onChange={handleChange}
                checked={selectedOptions.includes(option.value)}
              />
              {option.label}
            </label>
          ))}
        </div>
      )}
    </div>
  );
};

export default DropdownMenu;
