import React, { useState, useEffect } from "react";
import db from "../firebase";
import { collection, query, where, onSnapshot, getDocs } from "firebase/firestore";
import jsPDF from "jspdf";
import "jspdf-autotable";
import { CSVLink } from "react-csv";
import "../styles/events.css";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import moment from 'moment';

export default function EventDisplay() {
  const [events, setEvents] = useState([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const auth = getAuth();

  useEffect(() => {
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        const userEmail = user.email;
        const querySnapshot = await getDocs(query(collection(db, "UserCredentials"), where("email", "==", userEmail)));
        if (!querySnapshot.empty) {
          const userData = querySnapshot.docs[0].data();
          setIsAdmin(userData.admin);
          if (userData.admin) {
            loadAllEvents();
          } else {
            loadMatchedEvents(userEmail);
          }
        } else {
          alert("Register to view this page.");
          // navigate to home or login page
        }
      } else {
        alert("You need to be logged in to access this page.");
        // navigate to home or login page
      }
    });
  }, []);

  const loadAllEvents = () => {
    const unsubscribe = onSnapshot(collection(db, "EventDetails"), (snapshot) => {
      setEvents(snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
    });
    return () => unsubscribe();
  };

  const loadMatchedEvents = async (userEmail) => {
    const userProfilesSnapshot = await getDocs(query(collection(db, "UserProfiles"), where("email", "==", userEmail)));
    if (!userProfilesSnapshot.empty) {
      const userName = userProfilesSnapshot.docs[0].data().fullName;
      const matchedSnapshot = await getDocs(query(collection(db, "Matched"), where("volunteer", "==", userName)));
      const eventNames = matchedSnapshot.docs.map((doc) => doc.data().event);

      if (eventNames.length > 0) {
        const eventsQuery = query(collection(db, "EventDetails"), where("eventName", "in", eventNames));
        const eventsSnapshot = await getDocs(eventsQuery);
        setEvents(eventsSnapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
      } else {
        setEvents([]);
      }
    }
  };

  const formatDate = (dateString) => {
    return moment(dateString).format('MMMM D, YYYY'); // Ensure consistent date format
  };

  const exportPDF = () => {
    const doc = new jsPDF();
    doc.text("Event Details", 14, 16);
    doc.autoTable({
      startY: 20,
      head: [["Event Name", "Event Description", "City", "State", "Required Skills", "Urgency", "Event Date"]],
      body: events.map(event => [
        event.eventName,
        event.eventDescription,
        event.city,
        event.state,
        Array.isArray(event.requiredSkills) ? event.requiredSkills.join(", ") : "",
        event.urgency,
        formatDate(event.eventDate)
      ]),
    });
    doc.save("event-details.pdf");
  };

  const csvHeaders = [
    { label: "Event Name", key: "eventName" },
    { label: "Event Description", key: "eventDescription" },
    { label: "City", key: "city" },
    { label: "State", key: "state" },
    { label: "Required Skills", key: "requiredSkills" },
    { label: "Urgency", key: "urgency" },
    { label: "Event Date", key: "eventDate" },
  ];

  const csvData = events.map(event => ({
    eventName: event.eventName,
    eventDescription: event.eventDescription,
    city: event.city,
    state: event.state,
    requiredSkills: Array.isArray(event.requiredSkills) ? event.requiredSkills.join(", ") : "",
    urgency: event.urgency,
    eventDate: formatDate(event.eventDate)
  }));

  return (
    <>
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
      {isAdmin && (
        <div>
          <button onClick={exportPDF} className="adminredirect">Export to PDF</button>
          <CSVLink
            data={csvData}
            headers={csvHeaders}
            filename={"event-details.csv"}
            className="adminredirect"
            target="_blank"
          >
            Export to CSV
          </CSVLink>
        </div>
      )}
    </>
  );
}
