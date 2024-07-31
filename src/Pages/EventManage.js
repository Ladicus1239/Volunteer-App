import React, { useState, useEffect } from "react";
import Navigation from "../Components/Navigation";
import DropdownMenu from "../Components/dropdownMS";
import Select from "react-select";
import db from "../firebase";
import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  onSnapshot,
} from "firebase/firestore";
import "../styles/eventmanage.css";

const states = [
  { value: "AL", label: "Alabama, AL" },
  { value: "AK", label: "Alaska, AK" },
  { value: "AZ", label: "Arizona, AZ" },
  { value: "AR", label: "Arkansas, AR" },
  { value: "CA", label: "California, CA" },
  { value: "CO", label: "Colorado, CO" },
  { value: "CT", label: "Connecticut, CT" },
  { value: "DE", label: "Delaware, DE" },
  { value: "FL", label: "Florida, FL" },
  { value: "GA", label: "Georgia, GA" },
  { value: "HI", label: "Hawaii, HI" },
  { value: "ID", label: "Idaho, ID" },
  { value: "IL", label: "Illinois, IL" },
  { value: "IN", label: "Indiana, IN" },
  { value: "IA", label: "Iowa, IA" },
  { value: "KS", label: "Kansas, KS" },
  { value: "KY", label: "Kentucky, KY" },
  { value: "LA", label: "Louisiana, LA" },
  { value: "ME", label: "Maine, ME" },
  { value: "MD", label: "Maryland, MD" },
  { value: "MA", label: "Massachusetts, MA" },
  { value: "MI", label: "Michigan, MI" },
  { value: "MN", label: "Minnesota, MN" },
  { value: "MS", label: "Mississippi, MS" },
  { value: "MO", label: "Missouri, MO" },
  { value: "MT", label: "Montana, MT" },
  { value: "NE", label: "Nebraska, NE" },
  { value: "NV", label: "Nevada, NV" },
  { value: "NH", label: "New Hampshire, NH" },
  { value: "NJ", label: "New Jersey, NJ" },
  { value: "NM", label: "New Mexico, NM" },
  { value: "NY", label: "New York, NY" },
  { value: "NC", label: "North Carolina, NC" },
  { value: "ND", label: "North Dakota, ND" },
  { value: "OH", label: "Ohio, OH" },
  { value: "OK", label: "Oklahoma, OK" },
  { value: "OR", label: "Oregon, OR" },
  { value: "PA", label: "Pennsylvania, PA" },
  { value: "RI", label: "Rhode Island, RI" },
  { value: "SC", label: "South Carolina, SC" },
  { value: "SD", label: "South Dakota, SD" },
  { value: "TN", label: "Tennessee, TN" },
  { value: "TX", label: "Texas, TX" },
  { value: "UT", label: "Utah, UT" },
  { value: "VT", label: "Vermont, VT" },
  { value: "VA", label: "Virginia, VA" },
  { value: "WA", label: "Washington, WA" },
  { value: "WV", label: "West Virginia, WV" },
  { value: "WI", label: "Wisconsin, WI" },
  { value: "WY", label: "Wyoming, WY" }
];

export default function EventManage() {
  const [eventName, setEventName] = useState("");
  const [eventDescription, setEventDescription] = useState("");
  const [city, setCity] = useState("");
  const [selectedState, setSelectedState] = useState(null);
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
      city,
      state: selectedState ? selectedState.value : "",
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
    setCity("");
    setSelectedState(null);
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
    setCity(eventToEdit.city);
    setSelectedState(states.find((state) => state.value === eventToEdit.state));
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

  const handleChangeState = (selectedOption) => {
    setSelectedState(selectedOption);
  };

  return (
    <div>
      <Navigation />
      <h2 className="event-header-manage">Create Event</h2>
      <div className="main-content-manage">
        <div className="event-form-container-manage">
          <form className="eventDiv-manage" onSubmit={handleSubmit}>
            <h3>Event Details</h3>
            <label htmlFor="eventName">Event Name*:</label>
            <input
              type="text"
              id="eventName"
              maxLength="100"
              placeholder="Event Name* (100 character limit)"
              required
              value={eventName}
              onChange={(e) => setEventName(e.target.value)}
            />
            <br />
            <label htmlFor="eventDescription">Event Description*:</label>
            <textarea
              id="eventDescription"
              placeholder="Event Description*"
              required
              value={eventDescription}
              onChange={(e) => setEventDescription(e.target.value)}
            ></textarea>
            <br />
            <div className="state">
              <Select
                className="state"
                options={states}
                value={selectedState}
                onChange={handleChangeState}
                isSearchable={true}
                maxMenuHeight={130}
                placeholder="State*"
              />
            </div>
            <label htmlFor="city">City*:</label>
            <input
              type="text"
              id="city"
              placeholder="City*"
              required
              value={city}
              onChange={(e) => setCity(e.target.value)}
            />
            <h3>Additional Information</h3>
            <label htmlFor="requiredSkills">Required Skills*:</label>
            <DropdownMenu
              selectedItems={requiredSkills}
              setSelectedItems={setRequiredSkills}
              dataTestId="required-skills"
            />
            <label htmlFor="urgency">Urgency*:</label>
            <select
              id="urgency"
              required
              value={urgency}
              onChange={(e) => setUrgency(e.target.value)}
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
            <label htmlFor="eventDate">Event Date*:</label>
            <input
              type="date"
              id="eventDate"
              required
              value={eventDate}
              onChange={(e) => setEventDate(e.target.value)}
            />
            <button type="submit" className="adminredirect create-event-button-manage">
              {isEditing ? "Update Event" : "Create Event"}
            </button>
          </form>
        </div>
        <div className="event-list-container-manage">
          <table className="event-announcement-manage" border={1} cellPadding={8}>
            <thead>
              <tr className="event-announcement-names-manage">
                <th>Event Name</th>
                <th>Event Description</th>
                <th>City</th>
                <th>State</th>
                <th>Required Skills</th>
                <th>Urgency</th>
                <th>Event Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {events.map((event) => (
                <tr key={event.id} className="event-announcement-data-manage">
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
    </div>
  );
}