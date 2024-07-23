import React, { useState, useEffect } from "react";
import { Link, useNavigate } from 'react-router-dom';
import "../styles.css";
import { useAuth } from "../context/AuthContext";
import moment from 'moment';

export default function Navigation() {
    const history = useNavigate();
    const { logout } = useAuth();
    const [error1, setError1] = useState("");

    async function handleLogout() {
        setError1('');

        try {
            await logout();
            history('/home');
        } catch {
            setError1('Failed to log out');
        }
    }

    function checkEventsAndRemind() {
        let existingEvents = JSON.parse(localStorage.getItem('event reminder dates')) || [];
        const today = moment().format('YYYY-MM-DD');

        const isEventTomorrow = existingEvents.some(event => {
            const eventDate = moment(event.eventDate).format('YYYY-MM-DD');
            return moment(eventDate).diff(today, 'days') === 1;
        });

        if (isEventTomorrow) {
            remindEventMsg();
            existingEvents = existingEvents.filter(event => {
                const eventDate = moment(event.eventDate).format('YYYY-MM-DD');
                return moment(eventDate).diff(today, 'days') !== 1;
            });
            localStorage.setItem('event reminder dates', JSON.stringify(existingEvents));
        }
    }

    function remindEventMsg() {
        const savedMessages = localStorage.getItem('messages');
        const messages = savedMessages ? JSON.parse(savedMessages) : [];
        const systemMessage = { sender: "System", message: "An event is coming up tomorrow!" };
        const newMessages = [...messages, systemMessage];
        localStorage.setItem('messages', JSON.stringify(newMessages));
        console.log('Added system message to localStorage:', newMessages);
    }

    useEffect(() => {
        checkEventsAndRemind();
    }, []);

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
        </nav>
    );
}
