import React, { useState, useEffect } from "react";
import "../styles.css";

export default function EventDisplay() {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const storedEvents = JSON.parse(localStorage.getItem("events")) || [];
    setEvents(storedEvents);
  }, []);

  return (
    <div className="container">
      <h2>Event List</h2>
      <table className="announcement" border={1} cellPadding={10}>
        <thead>
          <tr className="announcementNames">
            <th>Event Name</th>
            <th>Event Description</th>
            <th>Location</th>
            <th>Required Skills</th>
            <th>Urgency</th>
            <th>Event Date</th>
          </tr>
        </thead>
        <tbody>
          {events.map((event) => (
            <tr key={event.id} className="announcementData">
              <td>{event.eventName}</td>
              <td>{event.eventDescription}</td>
              <td>{event.location}</td>
              <td>{event.requiredSkills}</td>
              <td>{event.urgency}</td>
              <td>{event.eventDate}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
