import React, { useState, useEffect } from "react";
import Navigation from "../Components/Navigation";
import DropdownMenu from "../Components/dropdownMS";
import moment from 'moment';
import "../styles3.css";

export default function EventManage() {
  const [eventName, setEventName] = useState("");
  const [eventDescription, setEventDescription] = useState("");
  const [location, setLocation] = useState("");
  const [requiredSkills, setRequiredSkills] = useState([]);
  const [urgency, setUrgency] = useState("low");
  const [eventDate, setEventDate] = useState("");
  const [events, setEvents] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [currentEventId, setCurrentEventId] = useState(null);

  function createEventMsg(eventname) {
    const savedMessages = localStorage.getItem('messages');
    const messages = savedMessages ? JSON.parse(savedMessages) : [];
    const systemMessage = { sender: "System", message: "The event, "+eventname+" has been created." };
    const newMessages = [...messages, systemMessage];
    localStorage.setItem('messages', JSON.stringify(newMessages));
    console.log('Added system message to localStorage:', newMessages);
  }

  function updateEventMsg(eventname) {
    const savedMessages = localStorage.getItem('messages');
    const messages = savedMessages ? JSON.parse(savedMessages) : [];
    const systemMessage = { sender: "System", message: eventname+" has been updated." };
    const newMessages = [...messages, systemMessage];
    localStorage.setItem('messages', JSON.stringify(newMessages));
    console.log('Added system message to localStorage:', newMessages);
  }

  function deleteEventMsg(eventname) {
    const savedMessages = localStorage.getItem('messages');
    const messages = savedMessages ? JSON.parse(savedMessages) : [];
    const systemMessage = { sender: "System", message: eventname+" has been canceled." };
    const newMessages = [...messages, systemMessage];
    localStorage.setItem('messages', JSON.stringify(newMessages));
    console.log('Added system message to localStorage:', newMessages);
  }

  useEffect(() => {
    const storedEvents = JSON.parse(localStorage.getItem("events")) || [];
    setEvents(storedEvents);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();

    const newEvent = {
      id: isEditing ? currentEventId : Date.now(),
      eventName,
      eventDescription,
      location,
      requiredSkills,
      urgency,
      eventDate,
    };

    const updatedEvents = isEditing
      ? events.map((event) => (event.id === currentEventId ? newEvent : event))
      : [...events, newEvent];

    setEvents(updatedEvents);
    localStorage.setItem("events", JSON.stringify(updatedEvents));
    
    createEventMsg(eventName);

    const existingEvents = JSON.parse(localStorage.getItem('event reminder dates')) || [];

    const reminder = {
      eventName: eventName,
      eventDate: eventDate
    };
    existingEvents.push(reminder);

    localStorage.setItem('event reminder dates', JSON.stringify(existingEvents));

    setEventName("");
    setEventDescription("");
    setLocation("");
    setRequiredSkills([]);
    setUrgency("low");
    setEventDate("");
    setIsEditing(false);
    setCurrentEventId(null);
  };

  const handleEdit = (eventId) => {
    const eventToEdit = events.find((event) => event.id === eventId);
    setEventName(eventToEdit.eventName);
    setEventDescription(eventToEdit.eventDescription);
    setLocation(eventToEdit.location);
    setRequiredSkills(eventToEdit.requiredSkills);
    setUrgency(eventToEdit.urgency);
    setEventDate(eventToEdit.eventDate);
    setIsEditing(true);
    setCurrentEventId(eventId);
    updateEventMsg(eventToEdit.eventName)
  };

  const handleDelete = (eventId) => {
    const eventToDelete = events.find((event) => event.id === eventId);
    deleteEventMsg(eventToDelete.eventName);
    const updatedEvents = events.filter((event) => event.id !== eventId);
    setEvents(updatedEvents);
    localStorage.setItem("events", JSON.stringify(updatedEvents));
  };

  return (
    <div>
      <div>
        <Navigation />
      </div>
      <h2 className="event-management">Create Event</h2>
      <div className="container">
        <form onSubmit={handleSubmit}>
          <div className="eventDiv1">
            <h3>Event Details</h3>
            <input
              type="text"
              id="eventName"
              maxLength="100"
              placeholder="Event Name* (100 character limit)"
              required
              style={{ width: "300px" }}
              value={eventName}
              onChange={(e) => setEventName(e.target.value)}
            />
            <br />
            <textarea
              id="eventDescription"
              placeholder="Event Description*"
              required
              style={{ width: "300px", height: "100px" }}
              value={eventDescription}
              onChange={(e) => setEventDescription(e.target.value)}
            ></textarea>
            <br />
            <textarea
              id="location"
              placeholder="Location*"
              required
              style={{ width: "300px", height: "100px" }}
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            ></textarea>
          </div>
          <div className="eventDiv2">
            <h3>Additional Information</h3>
            <h4 htmlFor="requiredSkills">Required Skills*:</h4>
            <DropdownMenu
              selectedItems={requiredSkills}
              setSelectedItems={setRequiredSkills}
              dataTestId="required-skills"
            />
            <h4 htmlFor="urgency">Urgency*:</h4>
            <select
              id="urgency"
              required
              style={{ width: "300px", height: "25px" }}
              value={urgency}
              onChange={(e) => setUrgency(e.target.value)}
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
            <h4 htmlFor="eventDate">Event Date*:</h4>
            <input
              type="date"
              id="eventDate"
              required
              style={{ width: "300px", height: "25px" }}
              value={eventDate}
              onChange={(e) => setEventDate(e.target.value)}
            />
          </div>
          <br />
          <button type="submit" className="button submit">
            {isEditing ? "Update Event" : "Create Event"}
          </button>
        </form>
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
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {events.map((event) => (
              <tr key={event.id} className="announcementData">
                <td>{event.eventName}</td>
                <td>{event.eventDescription}</td>
                <td>{event.location}</td>
                <td>{event.requiredSkills.join(", ")}</td>
                <td>{event.urgency}</td>
                <td>{event.eventDate}</td>
                <td>
                  <button onClick={() => handleEdit(event.id)}>Edit</button>
                  <button onClick={() => handleDelete(event.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
