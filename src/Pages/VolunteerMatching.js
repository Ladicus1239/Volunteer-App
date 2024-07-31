// src/Pages/VolunteerMatching.js
import React, { useEffect, useState } from 'react';
import Navigation from "../Components/Navigation";
import db from "../firebase";
import { collection, getDocs, setDoc, doc, query, where, deleteDoc } from "firebase/firestore";
import "../styles/VolunteerMatching.css";

// Fetch volunteers from Firestore
async function fetchVolunteers() {
  const volunteersCollection = collection(db, 'UserProfiles');
  const volunteerSnapshot = await getDocs(volunteersCollection);
  const volunteerList = volunteerSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  console.log('Fetched volunteers:', volunteerList);
  return volunteerList;
}

// Fetch events from Firestore
async function fetchEvents() {
  const eventsCollection = collection(db, 'EventDetails');
  const eventSnapshot = await getDocs(eventsCollection);
  const eventList = eventSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  console.log('Fetched events:', eventList);
  return eventList;
}

// Fetch existing matches from Firestore
async function fetchExistingMatches() {
  const matchesCollection = collection(db, 'Matched');
  const matchSnapshot = await getDocs(matchesCollection);
  const matchList = matchSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  console.log('Fetched matches:', matchList);
  return matchList;
}

// Check if a match already exists in Firestore
export async function matchExists(volunteerName, eventName) {
  const matchesCollection = collection(db, 'Matched');
  const q = query(matchesCollection, where("volunteer", "==", volunteerName), where("event", "==", eventName));
  const matchSnapshot = await getDocs(q);
  console.log(`Match exists for ${volunteerName} and ${eventName}:`, !matchSnapshot.empty);
  return !matchSnapshot.empty;
}

// Save matched volunteers to Firestore
export async function saveMatches(newMatches, existingMatches) {
  // Find matches to delete
  const matchesToDelete = existingMatches.filter(
    existingMatch => !newMatches.some(newMatch => 
      newMatch.volunteer === existingMatch.volunteer && newMatch.event === existingMatch.event
    )
  );

  // Delete outdated matches
  for (const match of matchesToDelete) {
    const matchRef = doc(db, 'Matched', match.id);
    await deleteDoc(matchRef);
    console.log(`Deleted match: ${match.id}`);
  }

  // Add new matches
  for (const match of newMatches) {
    const exists = await matchExists(match.volunteer, match.event);
    if (!exists) {
      const matchRef = doc(collection(db, 'Matched'));
      await setDoc(matchRef, match);
      console.log(`Added match: ${match.volunteer} to ${match.event}`);
    }
  }
}

function matchVolunteersToEvents(volunteers, events) {
  const matches = [];

  events.forEach((event) => {
    const matchedVolunteers = volunteers.filter((volunteer) => {
      const skillsMatch = event.requiredSkills?.some((skill) =>
        volunteer.skills?.includes(skill)
      );
      const locationMatch = volunteer.getCity === event.city;

      return skillsMatch && locationMatch;
    });

    matchedVolunteers.forEach(volunteer => {
      matches.push({
        event: event.eventName,
        volunteer: volunteer.fullName,
      });
    });
  });

  return matches;
}

export default function VolunteerMatching() {
  const [volunteers, setVolunteers] = useState([]);
  const [matches, setMatches] = useState([]);
  const [error, setError] = useState(false);

  useEffect(() => {
    async function fetchData() {
      try {
        const volunteers = await fetchVolunteers();
        const events = await fetchEvents();
        const existingMatches = await fetchExistingMatches();

        setVolunteers(volunteers);

        if (volunteers.length && events.length) {
          const matchedVolunteers = matchVolunteersToEvents(volunteers, events);
          setMatches(matchedVolunteers);

          // Save matched volunteers to Firestore
          await saveMatches(matchedVolunteers, existingMatches);
        }
      } catch (error) {
        console.error("Error fetching data: ", error);
        setError(true);
      }
    }

    fetchData();
  }, []);

  return (
    <div>
      <Navigation />
      <h1 className="header-box-353">Volunteer Matching</h1>
      <div className="vm-container-353">
        <h2 className="header-box-353">All Volunteers</h2>
        {volunteers.length === 0 && !error ? (
          <div>No matches found</div>
        ) : (
          <table className="vm-volunteer-announcement-353">
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
                <tr key={volunteer.email}>
                  <td>{volunteer.fullName}</td>
                  <td>{volunteer.skills?.join(', ') || 'N/A'}</td>
                  <td>{volunteer.availability?.join(', ') || 'N/A'}</td>
                  <td>{volunteer.getCity || 'N/A'}</td>
                  <td>{volunteer.getPref || 'N/A'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        {error && <div>Error fetching data</div>}
        <h2 className="header-box-353">Matched Volunteers</h2>
        <table className="vm-matched-announcement-353">
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
