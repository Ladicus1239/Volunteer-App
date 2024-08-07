import React, { useState, useEffect } from "react";
import { Link, useNavigate } from 'react-router-dom';
import "../styles.css";
import { useAuth } from "../context/AuthContext";
import { getFirestore, collection, query, where, getDocs, addDoc, setDoc, doc, deleteDoc, getDoc } from "firebase/firestore";
import moment from 'moment';

export default function Navigation() {
    const history = useNavigate();
    const { logout, currentUser } = useAuth();
    const [error1, setError1] = useState("");
    const [volunteers, setVolunteers] = useState([]);
    const [matches, setMatches] = useState([]);
    const [error, setError] = useState(false);
    const db = getFirestore();

    async function handleLogout() {
        setError1('');

        try {
            await logout();
            history('/home');
        } catch {
            setError1('Failed to log out');
        }
    }

    async function fetchVolunteers() {
        const volunteersCollection = collection(db, 'UserProfiles');
        const volunteerSnapshot = await getDocs(volunteersCollection);
        const volunteerList = volunteerSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        console.log('Fetched volunteers:', volunteerList);
        return volunteerList;
    }

    async function fetchEvents() {
        const eventsCollection = collection(db, 'EventDetails');
        const eventSnapshot = await getDocs(eventsCollection);
        const eventList = eventSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        console.log('Fetched events:', eventList);
        return eventList;
    }

    async function fetchExistingMatches() {
        const matchesCollection = collection(db, 'Matched');
        const matchSnapshot = await getDocs(matchesCollection);
        const matchList = matchSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        console.log('Fetched matches:', matchList);
        return matchList;
    }

    async function matchExists(volunteerName, eventName) {
        const matchesCollection = collection(db, 'Matched');
        const q = query(matchesCollection, where("volunteer", "==", volunteerName), where("event", "==", eventName));
        const matchSnapshot = await getDocs(q);
        console.log(`Match exists for ${volunteerName} and ${eventName}:`, !matchSnapshot.empty);
        return !matchSnapshot.empty;
    }

    async function saveMatches(newMatches, existingMatches) {
        const matchesToDelete = existingMatches.filter(
            existingMatch => !newMatches.some(newMatch => 
                newMatch.volunteer === existingMatch.volunteer && newMatch.event === existingMatch.event
            )
        );

        for (const match of matchesToDelete) {
            const matchRef = doc(db, 'Matched', match.id);
            await deleteDoc(matchRef);
            console.log(`Deleted match: ${match.id}`);
        }

        for (const match of newMatches) {
            const exists = await matchExists(match.volunteer, match.event);
            if (!exists) {
                const matchRef = doc(collection(db, 'Matched'));
                await setDoc(matchRef, match);
                console.log(`Added match: ${match.volunteer} to ${match.event}`);
                await sendMatchUpdateMessage(match.volunteer, match.event);
            }
        }
    }

    async function sendMatchUpdateMessage(volunteerName, eventName) {
        // Fetch volunteer email
        const userProfilesRef = collection(db, 'UserProfiles');
        const userProfileQuery = query(userProfilesRef, where("fullName", "==", volunteerName));
        const userProfileSnapshot = await getDocs(userProfileQuery);

        if (!userProfileSnapshot.empty) {
            const volunteerEmail = userProfileSnapshot.docs[0].data().email;
            const message = {
                sender: "System",
                receiver: volunteerEmail,
                time: moment().format('MM-DD-YYYY-HH-mm'),
                message: `You have been matched with the event: ${eventName}`
            };

            const notificationsDocRef = doc(db, 'notifications', volunteerEmail);
            const notificationsDoc = await getDoc(notificationsDocRef);

            if (notificationsDoc.exists()) {
                const messagesRef = collection(db, `notifications/${volunteerEmail}/messages`);
                await addDoc(messagesRef, message);
            } else {
                await setDoc(notificationsDocRef, { exists: true });
                const messagesRef = collection(db, `notifications/${volunteerEmail}/messages`);
                await addDoc(messagesRef, message);
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

    async function checkEventsAndRemind() {
        if (!currentUser) return;

        const userEmail = currentUser.email;

        const userProfileRef = collection(db, 'UserProfiles');
        const q = query(userProfileRef, where("email", "==", userEmail));
        const userProfileSnapshot = await getDocs(q);
        if (userProfileSnapshot.empty) {
            console.log('No matching user profile found.');
            return;
        }

        const userProfile = userProfileSnapshot.docs[0].data();
        const userName = userProfile.fullName;

        const matchedRef = collection(db, 'Matched');
        const matchedQuery = query(matchedRef, where("volunteer", "==", userName));
        const matchedSnapshot = await getDocs(matchedQuery);
        const matchedEvents = matchedSnapshot.docs.map(doc => doc.data().event);

        if (matchedEvents.length === 0) {
            console.log('No matched events found for the user.');
            return;
        }

        const eventDetailsRef = collection(db, 'EventDetails');
        const eventQuery = query(eventDetailsRef, where("eventName", "in", matchedEvents));
        const eventSnapshot = await getDocs(eventQuery);
        const events = eventSnapshot.docs.map(doc => doc.data());

        const today = moment().format('YYYY-MM-DD');
        const messages = [];

        const notificationsRef = collection(db, 'notifications', userEmail, 'messages');
        const notificationsSnapshot = await getDocs(notificationsRef);
        const existingMessages = notificationsSnapshot.docs.map(doc => doc.data().message);

        events.forEach(event => {
            const eventDate = moment(event.eventDate).format('YYYY-MM-DD');
            if (moment(eventDate).diff(today, 'days') === 1) {
                const reminderMessage = `${event.eventName} is tomorrow`;
                if (!existingMessages.includes(reminderMessage)) {
                    messages.push({
                        sender: "System",
                        receiver: userEmail,
                        time: moment().format('MM-DD-YYYY-HH-mm'),
                        message: reminderMessage
                    });
                }
            }
        });

        if (messages.length > 0) {
            const notificationsDocRef = doc(db, 'notifications', userEmail);
            const notificationsDoc = await getDoc(notificationsDocRef);

            if (notificationsDoc.exists()) {
                const messagesRef = collection(db, `notifications/${userEmail}/messages`);
                messages.forEach(async msg => {
                    await addDoc(messagesRef, msg);
                });
            } else {
                await setDoc(notificationsDocRef, { exists: true });
                const messagesRef = collection(db, `notifications/${userEmail}/messages`);
                messages.forEach(async msg => {
                    await addDoc(messagesRef, msg);
                });
            }
        }
    }

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

                    await saveMatches(matchedVolunteers, existingMatches);
                }
            } catch (error) {
                console.error("Error fetching data: ", error);
                setError(true);
            }
        }

        fetchData();
    }, []);

    useEffect(() => {
        checkEventsAndRemind();
    }, [currentUser]);

    return (
        <nav className="nav">
            <Link to="/" className="HomeButton">VolunteerOrg</Link>
            <ul>
                <li>
                    <Link to="/login" className="navbutton">Login</Link>
                </li>
                <li>
                    <Link to="/register" className="navbutton">Register</Link>
                </li>
                <li>
                    <Link to="/profile" className="navbutton">Profile</Link>
                </li>
                <li>
                    <Link to="/notification" className="navbutton">Notifications</Link>
                </li>
                <li>
                    <Link to="/events" className="navbutton">Events</Link>
                </li>
                <li>
                    <button onClick={handleLogout} className="logoutButton">Logout</button>
                </li>
            </ul>
            {error1 && <div className="error">{error1}</div>}
        </nav>
    );
}
