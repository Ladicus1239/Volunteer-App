import React, { useEffect, useState } from 'react';
import Navigation from "../Components/Navigation";
import "../styles.css";

const hardCodedVolunteers = [
  {
    id: 1,
    name: "Alice",
    skills: ["Adaptability", "Communication"],
    availability: ["weekends"],
    location: "New York",
    preferences: ["teaching"],
  },
  {
    id: 2,
    name: "Bob",
    skills: ["Leadership", "Strong Work Ethic"],
    availability: ["weekdays", "weekends"],
    location: "Los Angeles",
    preferences: ["driving"],
  },
  {
    id: 3,
    name: "Charlie",
    skills: ["Creative", "Interpersonal Communication"],
    availability: ["weekdays"],
    location: "New York",
    preferences: ["first aid"],
  },
];

function matchVolunteersToEvents(volunteers, events) {
  const matches = [];

  events.forEach((event) => {
    const matchedVolunteers = volunteers.filter((volunteer) => {
      const skillsMatch = event.requiredSkills.some((skill) =>
        volunteer.skills.includes(skill)
      );
      const locationMatch = volunteer.location === event.location;

      return skillsMatch && locationMatch;
    });

    matchedVolunteers.forEach(volunteer => {
      matches.push({
        event: event.eventName,
        volunteer: volunteer.name,
      });
    });
  });

  return matches;
}

export default function VolunteerMatching() {
  const [volunteers, setVolunteers] = useState([]);
  const [matches, setMatches] = useState([]);

  useEffect(() => {
    // Set volunteers in local storage
    localStorage.setItem('volunteers', JSON.stringify(hardCodedVolunteers));

    const storedVolunteers = JSON.parse(localStorage.getItem('volunteers')) || [];
    setVolunteers(storedVolunteers);

    const storedEvents = JSON.parse(localStorage.getItem('events')) || [];
    const matchedVolunteers = matchVolunteersToEvents(storedVolunteers, storedEvents);
    setMatches(matchedVolunteers);
  }, []);

  return (
    <div>
      <Navigation />
      <h1 className="pageTitle">Volunteer Matching</h1>
      <div className="container">
        <h2>All Volunteers</h2>
        <table className="volunteerTable">
          <thead>
            <tr>
              <th>Name</th>
              <th>Skills</th>
              <th>Availability</th>
              <th>Location</th>
              <th>Preferences</th>
            </tr>
          </thead>
          <tbody>
            {volunteers.map((volunteer) => (
              <tr key={volunteer.id}>
                <td>{volunteer.name}</td>
                <td>{volunteer.skills.join(', ')}</td>
                <td>{volunteer.availability.join(', ')}</td>
                <td>{volunteer.location}</td>
                <td>{volunteer.preferences.join(', ')}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <h2>Matched Volunteers</h2>
        <table className="matchedTable">
          <thead>
            <tr>
              <th>Volunteer Name</th>
              <th>Event Name</th>
            </tr>
          </thead>
          <tbody>
            {matches.map((match, index) => (
              <tr key={index}>
                <td>{match.volunteer}</td>
                <td>{match.event}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
