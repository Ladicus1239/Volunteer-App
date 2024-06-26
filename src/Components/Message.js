import React, { useState } from 'react'
import '../styles.css';

export default function Message(){


    const [inputdata, Setinputdata]=useState({
        sender:"",
        message:""
    })

    const [inputarr, Setinputarr]=useState([])

    function changehandle(e){
            
        Setinputdata({...inputdata,[e.target.name]:e.target.value})
    }

    let {sender,message}=inputdata;

    function changhandle(){
        Setinputarr([...inputarr,{sender,message}])
        console.log(inputarr)
        console.log(inputdata)
        Setinputdata({sender:"",message:""})
    }
    return(
        <>
        <div className='msginput'>
            <input className="sender" type="text" placeholder='Sender...' autoComplete='off' name="sender" value={inputdata.sender} onChange={changehandle}/> <br/>
            <textarea className="message" type="text" autoComplete='off' name="message" placeholder='Message...' value={inputdata.message} onChange={changehandle}/>
            <button className="notificationSend" onClick={changhandle}>Send</button><br/><br/>
            
            <table className="announcement" border={1} cellPadding={10}>
            <tbody>
            <tr className="announcementNames">
                <th className="announcementNames">Sender</th>
                <th className="announcementNames">Message</th>
            </tr >
            {
                inputarr.map(
                    (info,ind)=>{
                        return(
                            <tr className="announcementData">
                                <td className="announcementData">{info.sender}</td>
                                <td className="announcementData">{info.message}</td>
                            </tr>
                        )
                    }
                )
            }
            </tbody>
            </table>
        </div>
        </>
    )
}