import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import VolunteerHistory from "./Pages/volunteerhistory";
import EventManage from "./Pages/EventManage";
import Event from "./Pages/Event";
import Home from "./Pages/Home";
import Signup from "./Pages/Register";
import Login from "./Pages/Login";
import Notification from "./Pages/Notifications";
import Profile from "./Pages/Profile";
import ProfileManage from "./Pages/ProfileManage";
import Error from "./Pages/ErrorPage";
import "./styles.css";
import { AuthProvider } from "./context/AuthContext";

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route index element={<Home />} />
          <Route path="/home" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Signup />} />
          <Route path="/notification" element={<Notification />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/profile/profilemanagement" element={<ProfileManage />} />
          <Route path="/events" element={<Event />} />
          <Route path="/events/eventmanagement" element={<EventManage />} />
          <Route path="/events/volunteerhistory" element={<VolunteerHistory />} />
          <Route path="*" element={<Error />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
