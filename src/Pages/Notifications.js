// src/Pages/Notification.js
import React from 'react';
import Message from '../Components/Message';
import Navigation from '../Components/Navigation';
import "../styles/message.css";

export default function Notification() {
    return (
        <>
            <div>
                <Navigation />
            </div>
            <div className="notification-header">
                <h1 className="msg-header-232">Notification Page</h1>
            </div>
            <div className="messenger-header">
                <h2 className="msg-header2-232">Messenger</h2>
                <Message />
            </div>
        </>
    );
}
