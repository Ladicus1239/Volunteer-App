import React, { useState, useEffect } from 'react';
import Navigation from '../Components/Navigation';
import EventDisplay from '../Components/eventdisplay';
import "../styles/events.css";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { collection, query, where, getDocs } from "firebase/firestore";
import db from '../firebase';
import { useNavigate } from 'react-router-dom';

export default function Event() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const navigate = useNavigate();
  const auth = getAuth();

  useEffect(() => {
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        const userEmail = user.email;
        const querySnapshot = await getDocs(query(collection(db, "UserCredentials"), where("email", "==", userEmail)));
        if (!querySnapshot.empty) {
          const userData = querySnapshot.docs[0].data();
          if (userData.email === userEmail) {
            setIsAdmin(userData.admin);
          }
        } else {
          setAlertMessage("Register to view this page.");
          navigate('/');
        }
      } else {
        setAlertMessage("You need to be logged in to access this page.");
        navigate('/');
      }
    });
  }, [auth, navigate]);

  useEffect(() => {
    if (alertMessage) {
      alert(alertMessage);
      setAlertMessage(""); // Clear the alert message after showing it
    }
  }, [alertMessage]);

  return (
    <>
      <Navigation />
      <div className='main-content'>
        <div className='eventHeader'>Events</div>
        <div className='center-text'>
          <div className='buttonContainer'>
            <a href="/events/volunteerhistory">
              <button className='adminredirect'>Volunteer History</button>
            </a>
            {isAdmin && (
              <>
                <a href="/events/eventmanagement">
                  <button className='adminredirect'>Event Manage</button>
                </a>
                <a href="/events/volunteermatching">
                  <button className='adminredirect'>Volunteer Matching</button>
                </a>
              </>
            )}
          </div>
          <EventDisplay />
        </div>
      </div>
    </>
  );
}
