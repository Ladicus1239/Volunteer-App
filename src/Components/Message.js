import React, { useState, useEffect } from 'react';
import moment from 'moment';
import "../styles/message.css"

export default function Message() {
  const [inputdata, setInputdata] = useState({
    sender: "",
    message: ""
  });

  const [inputarr, setInputarr] = useState([]);

  useEffect(() => {
    const savedMessages = localStorage.getItem('messages');
    if (savedMessages) {
      setInputarr(JSON.parse(savedMessages));
      console.log('Loaded messages from localStorage:', JSON.parse(savedMessages));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('messages', JSON.stringify(inputarr));
    console.log('Saved messages to localStorage:', inputarr);
  }, [inputarr]);

  function changehandle(e) {
    setInputdata({ ...inputdata, [e.target.name]: e.target.value });
  }

  let { sender, message } = inputdata;

  function changhandle() {
    if (sender && message) {
      const newMessages = [...inputarr, { sender, message }];
      setInputarr(newMessages);
      setInputdata({ sender: "", message: "" });
    }
  }

  function clearMessages() {
    setInputarr([]);
    localStorage.removeItem('messages');
    console.log('Cleared messages from localStorage');
  }

  return (
    <>
      <div className='msginput'>
        <input
          className="sender"
          type="text"
          placeholder='Sender...'
          autoComplete='off'
          name="sender"
          value={inputdata.sender}
          onChange={changehandle}
        /> <br/>
        <textarea
          className="message"
          autoComplete='off'
          name="message"
          placeholder='Message...'
          value={inputdata.message}
          onChange={changehandle}
        />

        <button className="notificationSend" onClick={changhandle}>Send</button>
        <button className="clearMessages" onClick={clearMessages}>Clear</button><br/><br/>

        <table className="announcement" border={1} cellPadding={10}>
          <tbody>
            <tr className="announcementNames">
              <th className="announcementNames">Sender</th>
              <th className="announcementNames">Message</th>
            </tr>
            {
              inputarr.slice().reverse().map((info, ind) => (
                <tr key={ind} className="announcementData">
                  <td className="announcementData">{info.sender}</td>
                  <td className="announcementData">{info.message}</td>
                </tr>
              ))
            }
          </tbody>
        </table>

      </div>
    </>
  );
}
