import React from "react";
import Navigation from '../Components/Navigation';
import "../styles2.css";



//create prop function to use values from ProfileManage
const Profile = (props) => {
    const { fullName, getAdd, getCity, getState, getZip, skillArray, getPref, dateArray} = props;
    
    return(
        <div>
            <Navigation />
            <div className="profileContainer5">

                <div className="profileContainer3">

                    <div className="profileContainer1">
                        <h1 className="header">{fullName}'s Profile</h1>
                        <div className="location">
                        <p>Resides in: {getAdd}, {getCity}, {getState}, {getZip}</p>
                        </div>
                    </div>

                    <div className="profileContainer2">
                      <div className="image">Profile image</div>
                    </div>

                </div>
              
                <div className="profileContainer4">

                    <div className="personalPrefDiv">
                      <h3>Skills:</h3>
                      <p> {skillArray} </p>
                      <h3>Preferences: </h3>
                      <p>{getPref}</p>
                      <h3>Dates available:</h3>
                      <p> {dateArray} </p>
                    </div>
                    <br/>
                    <button className="pmbutton">
                      <a href="/profile/profilemanagement">Profile Management</a>
                    </button>

                </div>

            </div>
            
            
            
        </div>
    )
}

export default Profile;