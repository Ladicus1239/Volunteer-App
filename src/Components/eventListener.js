import React, { useState, useEffect } from 'react';

const EventListenerComponent = () => {
  
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    
    const handleButtonClick = () => {
      setSuccess(true);
    };

    
    const button = document.getElementById('eventcreate');

    
    if (button) {
      button.addEventListener('submit', handleButtonClick);
    }

    
    return () => {
      if (button) {
        button.removeEventListener('submit', handleButtonClick);
      }
    };
  }, []);

  return (
    <div>
      <p>Button clicked: {success ? 'Success' : 'Not yet'}</p>
      
    </div>
  );
};

export default EventListenerComponent;
