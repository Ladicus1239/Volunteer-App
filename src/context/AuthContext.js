import React,{ useEffect, useContext, useState } from "react";
import { getAuth, createUserWithEmailAndPassword, signOut, signInWithEmailAndPassword } from "firebase/auth";
import app from "../firebase"
<app/>
const AuthContext = React.createContext();
const auth = getAuth();


export function useAuth(){
    return useContext(AuthContext)
}

export function AuthProvider({ children }){

    const [currentUser, setCurrentUser]=useState()
    const [loading, setLoading] = useState(true)

    function signup(email, password) {
        return createUserWithEmailAndPassword(auth, email, password)
      }

    function login(email, password) {
        return signInWithEmailAndPassword(auth, email, password)
      }

    function logout() {
        return signOut(auth)
      }

    useEffect(()=>{
        const unsubcribe = auth.onAuthStateChanged(user=> {
            setCurrentUser(user)
            setLoading(false)
        })
        return unsubcribe
    }, [])
    

    const value={
        currentUser,
        login,
        signup,
        logout
    }

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    )
}

export default AuthContext;