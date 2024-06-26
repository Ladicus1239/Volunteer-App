import React from "react";
import Navigation from '../Components/Navigation';
import "../styles.css";
import Select from "react-select";    /*use "npm i --save react-select" to install react select (useState is built in) */
import { useState } from "react";

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

const years = [
  { value: "2024", label: "2024" },
  { value: "2025", label: "2025" },
  { value: "2026", label: "2026" }
];

export default function ProfileManage() {
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

  return (
    <div>
      <div>
        <Navigation />
      </div>

      <div className="center-text">
      <h1 className="pageTitle">Profile Management</h1>
      <p className="center-text">An asterisk '*' means the field is required.</p>
      </div>
      <div className="PManageContainer1">
          <div class="registerDiv1">
              <h3>Fill out your Name and Location</h3>
              <br/>
              <input type="text" id="fullName" maxlength="50" placeholder='Full Name* (50 character limit)'/><br/>

              <input type="text" id="add1" maxlength="100" placeholder='Address 1* (100 character limit)'/><br/>

              <input type="text" id="add2" maxlength="100" placeholder='Address 2 (optional)'/><br/>

              <input type="text" id="city" maxlength="100" placeholder='City* (100 character limit)'/><br/>

              <input type="text" id="add1" maxlength="2" placeholder='State*'/><br/>

              <input type="text" id="zip" minlength="5" maxlength="9" placeholder='Zip code* (5-9 character limit)'/><br/>
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
            <input type="text" id="preferences" style={{ width: "300px" }} placeholder='Enter preferences'></input>

            <p>Choose your availability date:</p>
            <div className="date" style={{ maxWidth: "300px" }}>

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
    </div>
  );
}
/*
     <p>Selected Dates:</p>
            {selectedDates.length > 0 && (
              <div className="datesSelected">
              {selectedDates.map((date, index) => (
                <p key={index}>{date}</p>
              ))}
              </div>
            )}
*/