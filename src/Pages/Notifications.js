import React, { useState, useEffect } from 'react';
import Message from '../Components/Message';
import Navigation from '../Components/Navigation';
import "../styles/message.css";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { collection, query, where, getDocs } from "firebase/firestore";
import db from '../firebase';
import { useNavigate } from 'react-router-dom';

export default function Notification() {
    const [isAdmin, setIsAdmin] = useState(false);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const auth = getAuth();

    useEffect(() => {
        onAuthStateChanged(auth, async (user) => {
            if (user) {
                const userEmail = user.email;
                const querySnapshot = await getDocs(query(collection(db, "UserCredentials"), where("email", "==", userEmail)));
                if (!querySnapshot.empty) {
                    const userData = querySnapshot.docs[0].data();
                    setIsAdmin(userData.admin);
                } else {
                    alert("Register to view this page.");
                    navigate('/');
                }
            } else {
                alert("You need to be logged in to access this page.");
                navigate('/');
            }
            setLoading(false);
        });
    }, []);

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <>
            <div>
                <Navigation />
            </div>
            <div className="notification-header">
                <h1 className="msg-header-232">Notification Page</h1>
            </div>
            <div className="messenger-header">
                {isAdmin && <h2 className="msg-header2-232">Messenger</h2>}
                <Message />
            </div>
        </>
    );
}
