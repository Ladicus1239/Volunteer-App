import React, { useEffect, useState } from "react";
import Navigation from "../Components/Navigation";
import db from "../firebase";
import { collection, getDocs, getDoc, doc, query, where } from "firebase/firestore";
import "../styles2.css";
import { useAuth } from "../context/AuthContext";

const Profile = () => {
  const { currentUser } = useAuth();

  // State for user profile details
  const [profileData, setProfileData] = useState({
    fullName: '',
    getAdd: '',
    getAdd2: '',
    getCity: '',
    selectedState: '',
    getZip: '',
    selectedSkill: [],
    getPref: '',
    selectedDates: []
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
            fullName: '',
            getAdd: '',
            getAdd2: '',
            getCity: '',
            selectedState: '',
            getZip: '',
            selectedSkill: [],
            getPref: '',
            selectedDates: []
          });
        }
      }
    };

    fetchProfileData();
  }, [currentUser]);

  return (
    <div>
      <Navigation />
      <div className="profileContainer5">
        <div className="profileContainer3">
          <div className="profileContainer1">
            <h1 className="header">{profileData.fullName}'s Profile</h1>
            <div className="location">
              <p>Resides in: {profileData.getAdd}, {profileData.getCity}, {profileData.selectedState}, {profileData.getZip}</p>
            </div>
          </div>
          <div className="profileContainer2">
            <div className="image">Profile image</div>
          </div>
        </div>
        <div className="profileContainer4">
          <div className="personalPrefDiv">
            <h3>Skills:</h3>
            <p>{profileData.skills && profileData.skills.length > 0 ? profileData.skills.join(', ') : 'No skills listed'}</p>
            <h3>Preferences: </h3>
            <p>{profileData.getPref || 'No preferences listed'}</p>
            <h3>Dates available:</h3>
            <p>{profileData.selectedDates && profileData.selectedDates.length > 0 ? profileData.selectedDates.join(', ') : 'No dates available'}</p>
          </div>
          <br />
          <button className="pmbutton">
            <a href="/profile/profilemanagement">Profile Management</a>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Profile;