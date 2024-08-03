import React, { useState, useEffect } from "react";
import Navigation from '../Components/Navigation';
import { collection, getDocs, query, where, addDoc } from "firebase/firestore";
import db from "../firebase";
import Checkbox from "@mui/material/Checkbox";
import jsPDF from "jspdf";
import "jspdf-autotable";
import { CSVLink } from "react-csv";
import "../styles2.css";
import { useNavigate } from "react-router-dom";
import { getAuth, onAuthStateChanged } from "firebase/auth";

const VolunteerHistory = () => {
    const [data, setData] = useState([]);
    const [checkedItems, setCheckedItems] = useState([]);
    const [selectAll, setSelectAll] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const auth = getAuth();

    useEffect(() => {
        onAuthStateChanged(auth, async (user) => {
            if (user) {
                const userEmail = user.email;
                const querySnapshot = await getDocs(query(collection(db, "UserCredentials"), where("email", "==", userEmail)));
                if (!querySnapshot.empty) {
                    const userData = querySnapshot.docs[0].data();
                    setIsAdmin(userData.admin);
                    fetchVolunteerHistory(userData.admin, userData.email);
                } else {
                    alert("Register to view this page.");
                    navigate('/');
                }
            } else {
                alert("You need to be logged in to access this page.");
                navigate('/');
            }
            setLoading(false);
        });
    }, []);

    const fetchVolunteerHistory = async (isAdmin, userEmail) => {
        try {
            if (isAdmin) {
                const volunteerHistoryRef = collection(db, 'VolunteerHistory');
                const volunteerHistorySnapshot = await getDocs(volunteerHistoryRef);
                const volunteerHistoryData = volunteerHistorySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                setData(volunteerHistoryData.sort((a, b) => a.name.localeCompare(b.name)));
            } else {
                const userProfileRef = collection(db, 'UserProfiles');
                const userQuery = query(userProfileRef, where("email", "==", userEmail));
                const userSnapshot = await getDocs(userQuery);
                const userName = userSnapshot.docs[0].data().fullName;

                const volunteerHistoryRef = collection(db, 'VolunteerHistory');
                const historyQuery = query(volunteerHistoryRef, where("name", "==", userName));
                const historySnapshot = await getDocs(historyQuery);
                const historyData = historySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                setData(historyData);
            }
            setCheckedItems(data.map(() => false));
        } catch (error) {
            console.error("Error fetching volunteer history:", error);
        }
    };

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

    const formatDate = (dateString) => {
        const options = { year: "numeric", month: "long", day: "numeric" };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

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

    if (loading) {
        return <div>Loading...</div>;
    }

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
                    {isAdmin && (
                        <>
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
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default VolunteerHistory;
