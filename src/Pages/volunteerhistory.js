import React, { useState } from "react";
import Navigation from '../Components/Navigation';
import Checkbox from "@mui/material/Checkbox";
import "../styles.css";

export default function VolunteerHistory() {
    const data = [
        { name: "John Doe", ename: "Event name", description: "Event description", location: "location", skills: "Skills", urgency: "Urgency", date: "Date", state: "Absent" },
        { name: "Jane Doe", ename: "Event name", description: "Event description", location: "location", skills: "Skills", urgency: "Urgency", date: "Date", state: "Present" },
        { name: "Cookie Dough", ename: "Event name", description: "Event description", location: "location", skills: "Skills", urgency: "Urgency", date: "Date", state: "Absent" }
    ];

    const [checkedItems, setCheckedItems] = useState(data.map(() => false));
    const [selectAll, setSelectAll] = useState(false);

    const handleSelectAllChange = (event) => {
        const newCheckedItems = data.map(() => event.target.checked);
        setCheckedItems(newCheckedItems);
        setSelectAll(event.target.checked);
    };

    const handleCheckboxChange = (index) => (event) => {
        const newCheckedItems = [...checkedItems];
        newCheckedItems[index] = event.target.checked;
        setCheckedItems(newCheckedItems);

        // If all items are selected after this change, update the selectAll state
        setSelectAll(newCheckedItems.every(item => item));
    };

    return (
        <div>
            <Navigation />
            <div className="volunteerContainer">
                <h1 className="volhistory">Volunteer History</h1>
                <div className="table">
                    <table>
                        <thead>
                            <tr>
                                <th>
                                    <Checkbox
                                        checked={selectAll}
                                        onChange={handleSelectAllChange}
                                    />
                                </th>
                                <th>Name</th>
                                <th>EventName</th>
                                <th>Description</th>
                                <th>Location</th>
                                <th>Skills</th>
                                <th>Urgency</th>
                                <th>Date</th>
                                <th>Attendance</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data.map((val, index) => (
                                <tr key={index}>
                                    <td>
                                        <Checkbox
                                            checked={checkedItems[index]}
                                            onChange={handleCheckboxChange(index)}
                                            className="dataCheckbox"
                                        />
                                    </td>
                                    <td>{val.name}</td>
                                    <td>{val.ename}</td>
                                    <td>{val.description}</td>
                                    <td>{val.location}</td>
                                    <td>{val.skills}</td>
                                    <td>{val.urgency}</td>
                                    <td>{val.date}</td>
                                    <td>{val.state}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
