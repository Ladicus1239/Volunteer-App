import React, { useEffect, useState } from "react";
import Navigation from "../Components/Navigation";
import db from "../firebase";
import { collection, getDocs, getDoc, doc, query, where, updateDoc } from "firebase/firestore";
import "../styles2.css";
import { useAuth } from "../context/AuthContext";
import { Avatar, Button, Modal, Box, Typography } from "@mui/material";
import { storage } from "../firebase";
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

const Profile = () => {
  const { currentUser } = useAuth();
  const [url, setUrl] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [tempImage, setTempImage] = useState(null);
  const [errorModalOpen, setErrorModalOpen] = useState(false);

  const handleImageChange = (e) => {
    if (e.target.files[0]) {
      setTempImage(e.target.files[0]);
    }
  };

  const handleImageSubmit = async () => {
    if (!tempImage) return;

    const imageRef = ref(storage, `images/${currentUser.uid}/${tempImage.name}`);
    await uploadBytes(imageRef, tempImage);
    const imageUrl = await getDownloadURL(imageRef);

    const docId = await queryUserProfile(currentUser.email);
    if (docId) {
      const userRef = doc(db, "UserProfiles", docId);
      await updateDoc(userRef, { imageUrl });
      setUrl(imageUrl);
    }

    setTempImage(null);
    setModalOpen(false);
  };

  const openImageChangeModal = () => {
    if (currentUser) {
      setModalOpen(true);
    } else {
      setErrorModalOpen(true);
    }
  };

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
      const userProfileRef = collection(db, 'UserProfiles');
      const q = query(userProfileRef, where("email", "==", userEmail));
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        return null;
      }

      let docId = null;
      querySnapshot.forEach(doc => {
        docId = doc.id;
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
        const currentUserEmail = currentUser.email;
        const docId = await queryUserProfile(currentUserEmail);
        if (docId) {
          const docRef = doc(db, "UserProfiles", docId);
          const docSnap = await getDoc(docRef);

          if (docSnap.exists()) {
            setProfileData(docSnap.data());
            setUrl(docSnap.data().imageUrl || null);
          }
        } else {
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
            <div className="image">
              <Avatar className="avatar" src={url} variant="square" sx={{ width: 150, height: 150 }} />
              <Button className="imageButton" onClick={openImageChangeModal}>Change Image</Button>
            </div>
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
          <Button className="pmbutton" component="a" href="/profile/profilemanagement">Profile Management</Button>
        </div>
      </div>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)}>
        <Box sx={{ ...style }}>
          <Typography variant="h6" component="label" htmlFor="image-upload">Select a new image</Typography>
          <input id="image-upload" type="file" onChange={handleImageChange} />
          <div>
            <Button className="change" onClick={handleImageSubmit}>Change</Button>
            <Button className="cancel" onClick={() => setModalOpen(false)}>Cancel</Button>
          </div>
        </Box>
      </Modal>

      <Modal open={errorModalOpen} onClose={() => setErrorModalOpen(false)}>
        <Box sx={{ ...style }}>
          <Typography variant="h6" color="error">Error</Typography>
          <Typography variant="body1">You must be signed in to change the image.</Typography>
          <Button className="close" onClick={() => setErrorModalOpen(false)}>Close</Button>
        </Box>
      </Modal>
    </div>
  );
};

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

export default Profile;