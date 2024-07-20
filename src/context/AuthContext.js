// src/context/AuthContext.js
import React, { useEffect, useContext, useState } from "react";
import { getAuth, createUserWithEmailAndPassword, signOut, signInWithEmailAndPassword } from "firebase/auth";
import { app } from "../firebase";

const AuthContext = React.createContext();
const auth = getAuth(app);

function useAuth() {
    return useContext(AuthContext);
}

function AuthProvider({ children }) {
    const [currentUser, setCurrentUser] = useState(null);
    const [loading, setLoading] = useState(true);

    async function signup(email, password) {
        return createUserWithEmailAndPassword(auth, email, password);
    }

    async function login(email, password) {
        return signInWithEmailAndPassword(auth, email, password);
    }

    async function logout() {
        return signOut(auth);
    }

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(user => {
            setCurrentUser(user);
            setLoading(false);
        });
        return unsubscribe;
    }, []);

    const value = {
        currentUser,
        login,
        signup,
        logout,
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
}

export default AuthContext;

export { AuthProvider, useAuth }; 
