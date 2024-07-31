import React, { useState, useEffect } from "react";
import Navigation from '../Components/Navigation';
import { collection, getDocs, query, where, addDoc } from "firebase/firestore";
import db from "../firebase";
import Checkbox from "@mui/material/Checkbox";
import jsPDF from "jspdf";
import "jspdf-autotable";
import { CSVLink } from "react-csv";
import "../styles2.css";

const VolunteerHistory = () => {
    const [data, setData] = useState([]);
    const [checkedItems, setCheckedItems] = useState([]);
    const [selectAll, setSelectAll] = useState(false);

    useEffect(() => {
        const fetchVolunteerHistory = async () => {
            try {
                const volunteerHistoryRef = collection(db, 'VolunteerHistory');
                const volunteerHistorySnapshot = await getDocs(volunteerHistoryRef);
                const volunteerHistoryData = volunteerHistorySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

                console.log("Volunteer History Data:", volunteerHistoryData);

                await updateVolunteerHistory(volunteerHistoryData);

                const updatedVolunteerHistorySnapshot = await getDocs(volunteerHistoryRef);
                const updatedVolunteerHistoryData = updatedVolunteerHistorySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                setData(updatedVolunteerHistoryData);
                setCheckedItems(updatedVolunteerHistoryData.map(() => false));
            } catch (error) {
                console.error("Error fetching volunteer history:", error);
            }
        };

        const updateVolunteerHistory = async (volunteerHistoryData) => {
            try {
                const matchedRef = collection(db, 'Matched');
                const matchedSnapshot = await getDocs(matchedRef);
                const matchedData = matchedSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

                console.log("Matched Data:", matchedData);

                for (const matched of matchedData) {
                    const eventDetailsRef = collection(db, 'EventDetails');
                    const eventQuery = query(eventDetailsRef, where("eventName", "==", matched.event));
                    const eventSnapshot = await getDocs(eventQuery);

                    console.log(`Event Details for event ${matched.event}:`, eventSnapshot.docs.map(doc => doc.data()));

                    if (!eventSnapshot.empty) {
                        const eventData = eventSnapshot.docs[0].data();
                        const existingHistory = volunteerHistoryData.find(vh => vh.name === matched.volunteer && vh.ename === eventData.eventName);

                        if (!existingHistory) {
                            const newVolunteerHistoryData = {
                                name: matched.volunteer,
                                ename: eventData.eventName,
                                description: eventData.eventDescription,
                                location: eventData.state || '',
                                skills: eventData.requiredSkills || [],
                                urgency: eventData.urgency,
                                date: eventData.eventDate,
                                attendance: "Absent"
                            };

                            console.log("Adding new volunteer history data:", newVolunteerHistoryData);

                            Object.keys(newVolunteerHistoryData).forEach(key => {
                                if (newVolunteerHistoryData[key] === undefined) {
                                    console.error(`Field ${key} is undefined for volunteer ${matched.volunteer} and event ${eventData.eventName}`);
                                }
                            });

                            await addDoc(collection(db, 'VolunteerHistory'), newVolunteerHistoryData);
                        } else {
                            console.log("Volunteer history already exists for", matched.volunteer, eventData.eventName);
                        }
                    }
                }
            } catch (error) {
                console.error("Error updating volunteer history:", error);
            }
        };

        fetchVolunteerHistory();
    }, []);

    useEffect(() => {
        console.log("Data state updated:", data);
    }, [data]);

    useEffect(() => {
        console.log("Checked Items state updated:", checkedItems);
    }, [checkedItems]);

    const handleSelectAllChange = (event) => {
        const newCheckedItems = data.map(() => event.target.checked);
        setCheckedItems(newCheckedItems);
        setSelectAll(event.target.checked);
    };

    const handleCheckboxChange = (index) => (event) => {
        const newCheckedItems = [...checkedItems];
        newCheckedItems[index] = event.target.checked;
        setCheckedItems(newCheckedItems);

        setSelectAll(newCheckedItems.every(item => item));
    };

    // Function to format date
    const formatDate = (dateString) => {
        const options = { year: "numeric", month: "long", day: "numeric" };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

    // Function to export table to PDF
    const exportPDF = () => {
        const doc = new jsPDF();

        doc.text("Volunteer History", 14, 16);
        doc.autoTable({
            startY: 20,
            head: [
                ["Name", "Event Name", "Description", "Location", "Skills", "Urgency", "Date", "Attendance"]
            ],
            body: data.map(volunteer => [
                volunteer.name,
                volunteer.ename,
                volunteer.description,
                volunteer.location,
                Array.isArray(volunteer.skills) ? volunteer.skills.join(", ") : "",
                volunteer.urgency,
                formatDate(volunteer.date),
                volunteer.attendance
            ]),
        });

        doc.save("volunteer-history.pdf");
    };

    // CSV data and headers
    const csvHeaders = [
        { label: "Name", key: "name" },
        { label: "Event Name", key: "ename" },
        { label: "Description", key: "description" },
        { label: "Location", key: "location" },
        { label: "Skills", key: "skills" },
        { label: "Urgency", key: "urgency" },
        { label: "Date", key: "date" },
        { label: "Attendance", key: "attendance" },
    ];

    const csvData = data.map(volunteer => ({
        name: volunteer.name,
        ename: volunteer.ename,
        description: volunteer.description,
        location: volunteer.location,
        skills: Array.isArray(volunteer.skills) ? volunteer.skills.join(", ") : "",
        urgency: volunteer.urgency,
        date: formatDate(volunteer.date),
        attendance: volunteer.attendance
    }));

    return (
        <div>
            <Navigation />
            <div className="volunteerContainer">
                <h1 className="volhistory">Volunteer History</h1>
                <div className="table">
                    {data.length === 0 ? (
                        <p>No volunteer history found.</p>
                    ) : (
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
                                    <th>Event Name</th>
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
                                        <td>{val.skills.join(', ')}</td>
                                        <td>{val.urgency}</td>
                                        <td>{val.date}</td>
                                        <td>{val.attendance}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
                <div>
                    <button onClick={exportPDF} className="adminredirect">Export to PDF</button>
                    <CSVLink
                        data={csvData}
                        headers={csvHeaders}
                        filename={"volunteer-history.csv"}
                        className="adminredirect"
                        target="_blank"
                    >
                        Export to CSV
                    </CSVLink>
                </div>
            </div>
        </div>
    );
};

export default VolunteerHistory;
