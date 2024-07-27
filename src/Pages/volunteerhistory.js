import React, { useState, useEffect } from "react";
import Navigation from '../Components/Navigation';
import { collection, getDocs, query, where, addDoc } from "firebase/firestore";
import db from "../firebase";
import Checkbox from "@mui/material/Checkbox";
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
            </div>
        </div>
    );
};

export default VolunteerHistory;
