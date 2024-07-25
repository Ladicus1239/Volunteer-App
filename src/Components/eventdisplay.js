import React, { useState, useEffect } from "react";
import db from "../firebase";
import { collection, onSnapshot } from "firebase/firestore";
import "../styles/events.css";  // Ensure the path is correct

export default function EventDisplay() {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(db, "EventDetails"),
      (snapshot) => {
        setEvents(snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
      }
    );

    return () => unsubscribe();
  }, []);

  // Function to format date
  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className="container">
      <table className="announcement">
        <thead>
          <tr className="announcement-names">
            <th>Event Name</th>
            <th>Event Description</th>
            <th>City</th>
            <th>State</th>
            <th>Required Skills</th>
            <th>Urgency</th>
            <th>Event Date</th>
          </tr>
        </thead>
        <tbody>
          {events.map((event) => (
            <tr key={event.id} className="announcement-data">
              <td>{event.eventName}</td>
              <td>{event.eventDescription}</td>
              <td>{event.city}</td>
              <td>{event.state}</td>
              <td>
                {Array.isArray(event.requiredSkills)
                  ? event.requiredSkills.join(", ")
                  : ""}
              </td>
              <td>{event.urgency}</td>
              <td>{formatDate(event.eventDate)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
