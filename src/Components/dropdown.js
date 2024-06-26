import React, { useState } from 'react';

const Dropdown = ({ options, label }) => {
  const [selected, setSelected] = useState(options[0]);

  return (
    <div className="dropdown">
      <label>{label}</label>
      <select value={selected} onChange={e => setSelected(e.target.value)}>
        {options.map(option => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  );
};

export default Dropdown;