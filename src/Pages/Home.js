import React from 'react';
import Navigation from '../Components/Navigation';
import "../styles.css";
import logo from "../Media/volunteer.png";
import { useAuth } from "../context/AuthContext";

export default function Home() {
  const { currentUser } = useAuth();
  return (
    <div>
      <Navigation />
      <h1 className="pageTitle">Home Page</h1><br/>
      <img src={logo} alt="Logo" className='logo'/>
      <p className="center-text">
        Welcome {currentUser && currentUser.email}<br/>
        Save people and maybe animals
      </p>
    </div>
  );
}
