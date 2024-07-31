import React, { useState, useEffect } from "react";
import { getFirestore, collection, updateDoc, addDoc, query, where, getDocs } from "firebase/firestore";
import { useAuth } from "../context/AuthContext";
//import { getAuth } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import Navigation from '../Components/Navigation';
import Select from "react-select";
//import { Email } from "@mui/icons-material";
//import db from "../firebase";

const skills = [
  { value: "Adaptability", label: "Adaptability" },
  { value: "Communication", label: "Communication" },
  { value: "Creative", label: "Creative" },
  { value: "Interpersonal Communication", label: "Interpersonal Communication" },
  { value: "Leadership", label: "Leadership" },
  { value: "Problem Solving", label: "Problem Solving" },
  { value: "Strong Work Ethic", label: "Strong Work Ethic" },
  { value: "Teamwork", label: "Teamwork" },
  { value: "Time Management", label: "Time Management" }
];

const states = [
  { value: "AL", label: "Alabama, AL" },
  { value: "AK", label: "Alaska, AK" },
  { value: "AZ", label: "Arizona, AK" },
  { value: "AR", label: "Arkansas, AR" },
  { value: "CA", label: "California, CA" },
  { value: "CO", label: "Colorado, CO" },
  { value: "CT", label: "Connecticut, CT" },
  { value: "DE", label: "Delaware, DE" },
  { value: "FL", label: "Florida, FL" },
  { value: "GA", label: "Georgia, GA" },
  { value: "HI", label: "Hawaii, HI" },
  { value: "ID", label: "Idaho, ID" },
  { value: "IL", label: "Illinois, IL" },
  { value: "IN", label: "Indiana, IN" },
  { value: "IA", label: "Iowa, IA" },
  { value: "KS", label: "Kansas, KS" },
  { value: "KY", label: "Kentucky, KY" },
  { value: "LA", label: "Louisiana, LA" },
  { value: "ME", label: "Maine, ME" },
  { value: "MD", label: "Maryland, MD" },
  { value: "MA", label: "Massachusetts, MA" },
  { value: "MI", label: "Michigan, MI" },
  { value: "MN", label: "Minnesota, MN" },
  { value: "MS", label: "Mississippi, MS" },
  { value: "MO", label: "Missouri, MO" },
  { value: "MT", label: "Montana, MT" },
  { value: "NE", label: "Nebraska, NE" },
  { value: "NV", label: "Nevada, NV" },
  { value: "NH", label: "New Hampshire, NH" },
  { value: "NJ", label: "New Jersey, NJ" },
  { value: "NM", label: "New Mexico, NM" },
  { value: "NY", label: "New York, NY" },
  { value: "NC", label: "North Carolina, NC" },
  { value: "ND", label: "North Dakota, ND" },
  { value: "OH", label: "Ohio, OH" },
  { value: "OK", label: "Oklahoma, OK" },
  { value: "OR", label: "Oregon, OR" },
  { value: "PA", label: "Pennsylvania, PA" },
  { value: "RI", label: "Rhode Island, RI" },
  { value: "SC", label: "South Carolina, SC" },
  { value: "SD", label: "South Dakota, SD" },
  { value: "TN", label: "Tennessee, TN" },
  { value: "TX", label: "Texas, TX" },
  { value: "UT", label: "Utah, UT" },
  { value: "VT", label: "Vermont, VT" },
  { value: "VA", label: "Virginia, VA" },
  { value: "WA", label: "Washington, WA" },
  { value: "WV", label: "West Virginia, WV" },
  { value: "WI", label: "Wisconsin, WI" },
  { value: "WY", label: "Wyoming, WY" }
];

const days = [...Array(31)].map((_, i) => ({ value: String(i + 1), label: String(i + 1).padStart(2, '0') }));
const months = [...Array(12)].map((_, i) => ({ value: String(i + 1), label: String(i + 1).padStart(2, '0') }));
const years = [
  { value: "2024", label: "2024" },
  { value: "2025", label: "2025" },
  { value: "2026", label: "2026" }
];

const ProfileManage = () => {
  const { currentUser } = useAuth(); // Get current user from useAuth
  const navigate = useNavigate();

  useEffect(() => {
    if (!currentUser) {
      alert("User is not logged in. Redirecting to the login page.");
      navigate("/login");
    }
  }, [currentUser, navigate]);

  const [selectedState, setSelectedState] = useState(null);
  const handleChangeState = (selectedState) => {
    setSelectedState(selectedState.value);
  };

  const [selectedSkill, setSelectedSkill] = useState([]);
  const [skillArray, setSkillArray] = useState([]);

  const handleChangeSkill = (selectedSkill) => {
    setSelectedSkill(selectedSkill);
    const skillLabels = (selectedSkill || []).map(skill => skill.label);
    setSkillArray(skillLabels);
  };

  const [selectedDay, setSelectedDay] = useState(null);
  const handleChangeDay = (selectedDay) => {
    setSelectedDay(selectedDay);
  };

  const [selectedMonth, setSelectedMonth] = useState(null);
  const handleChangeMonth = (selectedMonth) => {
    setSelectedMonth(selectedMonth);
  };

  const [selectedYear, setSelectedYear] = useState(null);
  const handleChangeYear = (selectedYear) => {
    setSelectedYear(selectedYear);
  };

  const [selectedDates, setSelectedDates] = useState([]);

  const handleDateSelection = () => {
    if (selectedDay && selectedMonth && selectedYear) {
      const newDate = `${selectedYear.label}-${selectedMonth.label}-${selectedDay.label}`;
      if (!selectedDates.includes(newDate)) {
        const updatedDates = [...selectedDates, newDate];
        setSelectedDates(updatedDates);
      }
    } else {
      alert("Please select day, month, and year.");
    }
  };

  const [fullName, setName] = useState('');
  const [getAdd, setAddr] = useState('');
  const [getAdd2, setAddr2] = useState('');
  const [getCity, setCity] = useState('');
  const [getZip, setZip] = useState('');
  const [getPref, setPref] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!currentUser) {
      alert("User is not logged in.");
      return;
    }

    const db = getFirestore();
    const userEmail = currentUser.email; // Get the user's email
    const userProfilesCollectionRef = collection(db, "UserProfiles");

    const page = {
      email: userEmail,
      fullName,
      getAdd,
      getAdd2,
      getCity,
      selectedState,
      getZip,
      getPref,
      skills: skillArray,
      selectedDates
    };

    try {
      // Query for documents matching the user's email
      const q = query(userProfilesCollectionRef, where("email", "==", userEmail));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        // If a document exists, update the first document found
        const userDocRef = querySnapshot.docs[0].ref;
        await updateDoc(userDocRef, page);
        console.log("Document updated with email: ", userEmail);
      } else {
        // If no document exists, create a new document
        const newDocRef = await addDoc(userProfilesCollectionRef, page);
        console.log("New document created with ID: ", newDocRef.id);
      }
    } catch (error) {
      console.error("Error handling document: ", error);
    }
  };
  
  return (
    <div>
      <div>
        <Navigation />
      </div>

      <div className="center-text">
        <h1 className="pageTitle">Profile Management</h1>
        <p className="center-text">An asterisk '*' means the field is required.</p>
      </div>
      <form onSubmit={handleSubmit}>
        <div className="PManageContainer1">
          <div className="registerDiv1">
            <h3>Fill out your Name and Location</h3>
            <br />
            <input type="text"
              id="fullName" maxLength="50"
              placeholder='Full Name* (50 character limit)'
              required
              value={fullName}
              onChange={(e) => setName(e.target.value)} /><br />

            <input type="text"
              id="add1"
              maxLength="100"
              placeholder='Address 1* (100 character limit)'
              required
              value={getAdd}
              onChange={(e) => setAddr(e.target.value)} /><br />

            <input type="text"
              id="add2"
              maxLength="100"
              placeholder='Address 2 (optional)'
              value={getAdd2}
              onChange={(e) => setAddr2(e.target.value)} /><br />

            <input type="text"
              id="city"
              maxLength="100"
              placeholder='City* (100 character limit)'
              required
              value={getCity}
              onChange={(e) => setCity(e.target.value)} /><br />

            <div className="state" style={{ maxWidth: "300px" }}>
              <Select className="state" options={states}
                value={selectedState}
                onChange={handleChangeState}
                isSearchable={true}
                maxMenuHeight={130}
                placeholder='State*'
              />
            </div>

            <input type="text"
              id="zip"
              minLength="5"
              maxLength="9"
              placeholder='Zip code* (5-9 character limit)'
              required
              value={getZip}
              onChange={(e) => setZip(e.target.value)} /><br />
          </div>

          <div className="registerDiv2">
            <h3>Fill out Credentials for your Profile</h3>

            <div className="skills" style={{ maxWidth: "300px" }}>
              <p>Choose your skill(s)</p>
              <Select options={skills}
                value={selectedSkill}
                onChange={handleChangeSkill}
                isSearchable={true}
                maxMenuHeight={150}
                placeholder='Ex: creative, interpersonal communication, teamwork, etc'
                isMulti={true}
              />
            </div>

            <p>Preferences (optional)</p>
            <input type="text"
              id="preferences"
              style={{ width: "300px" }}
              placeholder='Enter preferences'
              value={getPref}
              onChange={(e) => setPref(e.target.value)}></input>

            <p>Choose your availability date:</p>
            <div className="date" style={{ maxWidth: "300px" }}>
              <Select className="day" options={days}
                value={selectedDay}
                onChange={handleChangeDay}
                isSearchable={true}
                maxMenuHeight={130}
                placeholder='DD'
              />

              <Select className="month" options={months}
                value={selectedMonth}
                onChange={handleChangeMonth}
                isSearchable={true}
                maxMenuHeight={130}
                placeholder='MM'
              />

              <Select className="year" options={years}
                value={selectedYear}
                onChange={handleChangeYear}
                isSearchable={true}
                maxMenuHeight={130}
                placeholder='YYYY'
              />
            </div>
            <button className="buttonDates" onClick={handleDateSelection}>Select Date</button>
          </div>
          <button className="button submit">Update Profile</button>
        </div>
      </form>
    </div>
  );
}

export default ProfileManage;
