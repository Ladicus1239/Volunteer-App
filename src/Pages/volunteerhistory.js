import React, { useState, useEffect } from "react";
import Navigation from '../Components/Navigation';
import db from "../firebase";
import { collection, getDocs, getDoc, doc, query, where } from "firebase/firestore";
import { useAuth } from "../context/AuthContext";
import Checkbox from "@mui/material/Checkbox";
import "../styles2.css";

const VolunteerHistory = ({fullName, getAdd, skillArray }) => {
    const { currentUser } = useAuth();
    //hardcoded data for testing purposes
    const data = [
        { name: fullName, ename: "Event name", description: "Event description", location: getAdd, skills: skillArray, urgency: "Urgency", date: "Date", state: "Absent" },
        { name: "Jane Doe", ename: "Event name", description: "Event description", location: "location", skills: "Skills", urgency: "Urgency", date: "Date", state: "Present" },
        { name: "Cookie Dough", ename: "Event name", description: "Event description", location: "location", skills: "Skills", urgency: "Urgency", date: "Date", state: "Absent" }
    ];

    // State for user profile details
  const [profileData, setProfileData] = useState({
    fullName: '',
  });

  const queryUserProfile = async (userEmail) => {
    try {
      console.log('Current User Email:', userEmail);

      // Reference to the Firestore collection
      const userProfileRef = collection(db, 'UserProfiles');

      // Create a query against the collection to find the document with the matching email
      const q = query(userProfileRef, where("email", "==", userEmail));
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        console.log('No matching documents.');
        return null;
      }

      let docId = null;
      querySnapshot.forEach(doc => {
        const docData = doc.data();
        console.log('Matching Document Data:', docData);
        console.log('Stored Email:', docData.email);
        docId = doc.id;
        console.log('Matching Document ID:', docId);
      });

      return docId;
    } catch (error) {
      console.error('Error querying Firestore:', error);
      return null;
    }
  };

  useEffect(() => {
    const fetchProfileData = async () => {
      if (currentUser) {
        const currentUserEmail = currentUser.email; // Get the current user's email
        console.log('Current user email:', currentUserEmail);

        const docId = await queryUserProfile(currentUserEmail);
        if (docId) {
          console.log('Found document ID:', docId);

          // Fetch the document with the found docId
          const docRef = doc(db, "UserProfiles", docId);
          const docSnap = await getDoc(docRef);

          if (docSnap.exists()) {
            console.log('Document Data:', docSnap.data());
            setProfileData(docSnap.data());
          } else {
            console.log('No such document!');
          }
        } else {
          console.log('No document found.');
          setProfileData({
            fullName: ''
          });
        }
      }
    };

    fetchProfileData();
  }, [currentUser]);

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
                                    <td>{profileData.fullName}</td>
                                    <td>{val.ename}</td>
                                    <td>{val.description}</td>
                                    <td>{profileData.getCity}</td>
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

export default VolunteerHistory;