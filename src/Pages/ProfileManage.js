import React from "react";
import Navigation from '../Components/Navigation';
import Select from "react-select";
import { useState } from "react";

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

const days = [...Array(31)].map((_, i) => ({ value: String(i + 1), label: String(i + 1).padStart(2, '0') }));
const months = [...Array(12)].map((_, i) => ({ value: String(i + 1), label: String(i + 1).padStart(2, '0') }));
const years = [
  { value: "2024", label: "2024" },
  { value: "2025", label: "2025" },
  { value: "2026", label: "2026" }
];

const ProfileManage = () => {
  const [selectedSkill, setSelectedSkill] = useState([]);
  const [skillArray, setSkillArray] = useState([]);

  const handleChangeSkill = (selectedSkill) => {
    setSelectedSkill(Array.isArray(selectedSkill) ? selectedSkill : []);
    const skillString = (selectedSkill || []).map(skill => skill.value).join(", ");
    setSkillArray(skillString);
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
  const [dateArray, setDateArray] = useState([]);

  const handleDateSelection = () => {
    if (selectedDay && selectedMonth && selectedYear) {
      const newDate = `${selectedYear.label}-${selectedMonth.label}-${selectedDay.label}`;
      if (!selectedDates.includes(newDate)) {
        const updatedDates = [...selectedDates, newDate];
        setSelectedDates(updatedDates);
        setDateArray(updatedDates.join(", "));
      }
    } else {
      alert("Please select day, month, and year.");
    }
  };

  const [fullName, setName] = useState('');  
  const [getAdd, setAddr] = useState('');    
  const [getAdd2, setAddr2] = useState('');  
  const [getCity, setCity] = useState('');   
  const [getState, setState] = useState(''); 
  const [getZip, setZip] = useState('');     
  const [getPref, setPref] = useState('');   

  const handleSubmit = (e) => {
    e.preventDefault();
    const page = { fullName, getAdd, getCity, getState, getZip, skillArray, dateArray };
    console.log(page);
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
      <form onSubmit={handleSubmit} role="form">
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

            <input type="text"
              id="state"
              maxLength="2"
              placeholder='State*'
              required
              value={getState}
              onChange={(e) => setState(e.target.value)} /><br />

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
