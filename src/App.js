import React from "react";
import { BrowserRouter, Routes, Route} from "react-router-dom";
import VolunteerHistory from "./Pages/volunteerhistory"
import EventMangage from "./Pages/EventManage";
import Event from "./Pages/Event";
import Home from "./Pages/Home";
import Register from "./Pages/Register";
import Login from "./Pages/Login";
import Notification from "./Pages/Notifications";
import Profile from "./Pages/Profile";
import ProfileManage from "./Pages/ProfileManage";
import Error from "./Pages/ErrorPage";
import "./styles.css"

export default function App() {
  return (
      <div>
        <BrowserRouter>
          <Routes>
            <Route index element={<Home />} />
            <Route path="/home" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/notification" element={<Notification />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/profile/profilemanagement" element={<ProfileManage />} />
            <Route path="/events" element={<Event />} />
            <Route path="/events/eventmanagement" element={<EventMangage />} />
            <Route path="/events/volunteerhistory" element={<VolunteerHistory />} />
            <Route path="*" element={<Error />} />
          </Routes>
        </BrowserRouter>
      </div>
  )
}


