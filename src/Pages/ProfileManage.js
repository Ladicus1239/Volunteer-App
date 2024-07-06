import React from "react";
import Navigation from '../Components/Navigation';
import Profile from '../Pages/Profile';
import "../styles.css";
import Select from "react-select";    /*use "npm i --save react-select" to install react select (useState is built in) */
import { useState } from "react";

//skills list start -------------------------------------
const skills = [
  { value: "adaptability", label: "Adaptability" },
  { value: "communication", label: "Communication" },
  { value: "creative", label: "Creative" },
  { value: "interpersonal communication", label: "Interpersonal Communication" },
  { value: "leadership", label: "Leadership" },
  { value: "problem solving", label: "Problem Solving" },
  { value: "strong work ethic", label: "Strong Work Ethic" },
  { value: "teamwork", label: "Teamwork" },
  { value: "time management", label: "Time Management" }
];
//skills list end -------------------------------------

//days list start -------------------------------------
const days = [
  { value: "1", label: "01" },
  { value: "2", label: "02" },
  { value: "3", label: "03" },
  { value: "4", label: "04" },
  { value: "5", label: "05" },
  { value: "6", label: "06" },
  { value: "7", label: "07" },
  { value: "8", label: "08" },
  { value: "9", label: "09" },
  { value: "10", label: "10" },
  { value: "11", label: "11" },
  { value: "12", label: "12" },
  { value: "13", label: "13" },
  { value: "14", label: "14" },
  { value: "15", label: "15" },
  { value: "16", label: "16" },
  { value: "17", label: "17" },
  { value: "18", label: "18" },
  { value: "19", label: "19" },
  { value: "20", label: "20" },
  { value: "21", label: "21" },
  { value: "22", label: "22" },
  { value: "23", label: "23" },
  { value: "24", label: "24" },
  { value: "25", label: "25" },
  { value: "26", label: "26" },
  { value: "27", label: "27" },
  { value: "28", label: "28" },
  { value: "29", label: "29" },
  { value: "30", label: "30" },
  { value: "31", label: "31" }
];
//days list end -------------------------------------

//months list start -------------------------------------
const months = [
  { value: "1", label: "01" },
  { value: "2", label: "02" },
  { value: "3", label: "03" },
  { value: "4", label: "04" },
  { value: "5", label: "05" },
  { value: "6", label: "06" },
  { value: "7", label: "07" },
  { value: "8", label: "08" },
  { value: "9", label: "09" },
  { value: "10", label: "10" },
  { value: "11", label: "11" },
  { value: "12", label: "12" },
];
//month list end -------------------------------------

//years list start -------------------------------------
const years = [
  { value: "2024", label: "2024" },
  { value: "2025", label: "2025" },
  { value: "2026", label: "2026" }
];
//years list end -------------------------------------

//function for dropdown selection of skills, and date -------------------------------------
const ProfileManage = () => {
  const [selectedSkill, setSelectedSkill] = useState([]);
  const handleChangeSkill = (selectedSkill) => {
    setSelectedSkill(selectedSkill);
  };

  const [selectedDay, setSelectedDay] = useState(null);
  const handleChange = (selectedDay) => {
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
        setSelectedDates([...selectedDates, newDate]);
      }
    } else {
      alert("Please select day, month, and year.");
    }
  };
  //function for dropdown selection of skills and dates end -------------------------------------

  //grabbing inputs of each selection -------------------------------------
  const [fullName, setName] = useState('');   //grab name input
  const [getAdd, setAddr] = useState('');   //grab address 1 input
  const [getAdd2, setAddr2] = useState('');   //grab address 2 input
  const [getCity, setCity] = useState('');   //grab city input
  const [getState, setState] = useState('');   //grab state input
  const [getZip, setZip] = useState('');   //grab zip input
  const [getPref, setPref] = useState('');   //grab preferences input
  //grabbing inputs of each selection end -------------------------------------

  //submit form -------------------------------------
  const handleSubmit = (e) => {
    e.preventDefault();
    const page = { fullName, getAdd, getCity, getState, getZip, selectedSkill, selectedDates };

    console.log(page);
  }
  //submit form end -------------------------------------

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
            <div className="date"
              style={{ maxWidth: "300px" }}>

              <Select className="day" options={days}
                value={selectedDay}
                onChange={handleChange}
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
/*    place under "buttonDates"
     <p>Selected Dates:</p>
            {selectedDates.length > 0 && (
              <div className="datesSelected">
              {selectedDates.map((date, index) => (
                <p key={index}>{date}</p>
              ))}
              </div>
            )}
*/