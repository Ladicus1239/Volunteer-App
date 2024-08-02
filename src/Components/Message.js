import React, { useState, useEffect } from 'react';
import moment from 'moment';
import "../styles/message.css";
import { getFirestore, doc, setDoc, collection, query, orderBy, getDocs, deleteDoc, where, getDocs as getDocsByQuery } from "firebase/firestore";
import { useNavigate } from 'react-router-dom';
import db from '../firebase';
import { getAuth, onAuthStateChanged } from "firebase/auth";

export default function Message() {
  const [inputdata, setInputdata] = useState({
    sender: "",
    message: "",
    receiver: ""
  });
  const [inputarr, setInputarr] = useState([]);
  const [user, setUser] = useState(null);
  const [deleteCountdown, setDeleteCountdown] = useState({});
  const [isAdmin, setIsAdmin] = useState(false);
  const navigate = useNavigate();
  const auth = getAuth();

  useEffect(() => {
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        const userEmail = user.email;
        const querySnapshot = await getDocsByQuery(query(collection(db, "UserCredentials"), where("email", "==", userEmail)));
        if (!querySnapshot.empty) {
          const userData = querySnapshot.docs[0].data();
          if (userData.email === userEmail) {
            setUser(user);
            setIsAdmin(userData.admin);
            setInputdata({ ...inputdata, sender: user.email });
            loadMessages(user.email);
          }
        } else {
          alert("Register to view this page.");
          navigate('/');
        }
      } else {
        alert("You need to be logged in to access this page.");
        navigate('/');
      }
    });
  }, []);

  const loadMessages = async (userEmail) => {
    const userMessagesRef = collection(db, "notifications", userEmail, "messages");
    const everyoneMessagesRef = collection(db, "notifications", "everyone", "messages");
    const qUser = query(userMessagesRef, orderBy("time", "desc"));
    const qEveryone = query(everyoneMessagesRef, orderBy("time", "desc"));
    
    const querySnapshotUser = await getDocs(qUser);
    const querySnapshotEveryone = await getDocs(qEveryone);

    const messages = [];
    querySnapshotUser.forEach((doc) => {
      messages.push({ id: doc.id, ...doc.data() });
    });
    querySnapshotEveryone.forEach((doc) => {
      messages.push({ id: doc.id, ...doc.data() });
    });

    messages.sort((a, b) => moment(b.time, 'MM-DD-YYYY-HH-mm') - moment(a.time, 'MM-DD-YYYY-HH-mm'));
    setInputarr(messages);
  };

  const saveMessage = async () => {
    if (inputdata.sender && inputdata.message && inputdata.receiver) {
      const newMessage = {
        sender: inputdata.sender,
        receiver: inputdata.receiver,
        time: moment().format('MM-DD-YYYY-HH-mm'),
        message: inputdata.message
      };

      const userRef = doc(db, "notifications", newMessage.receiver === "everyone" ? "everyone" : newMessage.receiver);
      await setDoc(userRef, { exists: true }, { merge: true }); // Ensure the document exists
      const messagesRef = collection(userRef, "messages");
      await setDoc(doc(messagesRef), newMessage);

      setInputarr([newMessage, ...inputarr]);
      setInputdata({ sender: inputdata.sender, message: "", receiver: "" });
    }
  };

  const deleteMessage = async (messageId, receiver) => {
    if (!receiver) {
      console.error('Receiver is undefined for message:', messageId);
      return;
    }
    const messageRef = doc(db, "notifications", receiver, "messages", messageId);
    await deleteDoc(messageRef);
    setInputarr(inputarr.filter(msg => msg.id !== messageId));
  };

  const handleDeleteClick = (id, receiver) => {
    if (deleteCountdown[id]) return;
    
    setDeleteCountdown({ ...deleteCountdown, [id]: 5 });

    const countdownInterval = setInterval(() => {
      setDeleteCountdown(prevState => {
        if (prevState[id] === 1) {
          clearInterval(countdownInterval);
          return { ...prevState, [id]: 0 }; // Indicate countdown finished
        }
        return { ...prevState, [id]: prevState[id] - 1 };
      });
    }, 1000);
  };

  const confirmDelete = (id, receiver) => {
    deleteMessage(id, receiver);
    setDeleteCountdown(prevState => {
      const newState = { ...prevState };
      delete newState[id];
      return newState;
    });
  };

  const cancelDelete = (id) => {
    setDeleteCountdown(prevState => {
      const newState = { ...prevState };
      delete newState[id];
      return newState;
    });
  };

  function changehandle(e) {
    setInputdata({ ...inputdata, [e.target.name]: e.target.value });
  }

  return (
    <>
      {isAdmin && (
        <div className='message-container-232'>
          <div className='input-container-232'>
            <input
              className="sender-232"
              type="text"
              placeholder='Sender...'
              autoComplete='off'
              name="sender"
              value={inputdata.sender}
              onChange={changehandle}
              disabled
            /> <br/>
            <input
              className="receiver-232"
              type="text"
              placeholder='Receiver...'
              autoComplete='off'
              name="receiver"
              value={inputdata.receiver}
              onChange={changehandle}
            /> <br/>
          </div>
          <div className='message-box-232'>
            <textarea
              className="message-232"
              autoComplete='off'
              name="message"
              placeholder='Message...'
              value={inputdata.message}
              onChange={changehandle}
              style={{ height: '300px' }}
            />
            <button className="notificationSend-232" onClick={saveMessage}>Send</button>
          </div>
        </div>
      )}

      <table className="announcement-232" border={1} cellPadding={8}>
        <thead>
          <tr className="announcementNames-232">
            <th className="announcementNames-232">Sender</th>
            <th className="announcementNames-232">Message</th>
            <th className="announcementNames-232">Actions</th>
          </tr>
        </thead>
        <tbody>
          {
            inputarr.filter(info => info.receiver === user.email || info.receiver === "everyone").map((info, ind) => (
              <tr key={ind} className="announcementData-232">
                <td className="announcementData-232">{info.sender}</td>
                <td className="announcementData-232">{info.message}</td>
                <td className="announcementData-232">
                  {
                    deleteCountdown[info.id] > 0 ? (
                      <>
                        <button disabled>Are you sure? {deleteCountdown[info.id]}</button>
                        <button onClick={() => cancelDelete(info.id)}>Cancel</button>
                      </>
                    ) : (
                      deleteCountdown[info.id] === 0 ? (
                        <>
                          <button onClick={() => confirmDelete(info.id, info.receiver)}>Are you sure?</button>
                          <button onClick={() => cancelDelete(info.id)}>Cancel</button>
                        </>
                      ) : (
                        <button onClick={() => handleDeleteClick(info.id, info.receiver)}>Delete</button>
                      )
                    )
                  }
                </td>
              </tr>
            ))
          }
        </tbody>
      </table>
    </>
  );
}
