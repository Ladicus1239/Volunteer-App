import React, { useState, useEffect } from "react";
import Navigation from "../Components/Navigation";
import DropdownMenu from "../Components/dropdownMS";
import db from "../firebase";
import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  onSnapshot,
} from "firebase/firestore";
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

  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(db, "EventDetails"),
      (snapshot) => {
        setEvents(snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
      }
    );

    return () => unsubscribe();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newEvent = {
      eventName,
      eventDescription,
      location,
      requiredSkills: Array.isArray(requiredSkills) ? requiredSkills : [],
      urgency,
      eventDate,
    };

    try {
      if (isEditing) {
        await updateDoc(doc(db, "EventDetails", currentEventId), newEvent);
      } else {
        await addDoc(collection(db, "EventDetails"), newEvent);
      }
    } catch (error) {
      console.error("Error adding/updating document: ", error);
    }

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
    setRequiredSkills(eventToEdit.requiredSkills || []);
    setUrgency(eventToEdit.urgency);
    setEventDate(eventToEdit.eventDate);
    setIsEditing(true);
    setCurrentEventId(eventId);
  };

  const handleDelete = async (eventId) => {
    try {
      await deleteDoc(doc(db, "EventDetails", eventId));
    } catch (error) {
      console.error("Error deleting document: ", error);
    }
  };

  return (
    <div>
      <Navigation />
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
            <label htmlFor="eventDate">Event Date*</label>
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
        <table className="announcement" border={1} cellPadding={8}>
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
                <td>
                  {Array.isArray(event.requiredSkills)
                    ? event.requiredSkills.join(", ")
                    : ""}
                </td>
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
