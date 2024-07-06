import Navigation from '../Components/Navigation'
import DropdownMenu from '../Components/dropdownMS'
import "../styles.css"

export default function EventManagement() {
  return (
    <div>
      <div>
        <Navigation />
      </div>
      <h1 className="pageTitle">Create Event</h1><br/>

    <div className='container'>
        <div className="eventDiv1">
          <h3>Event Details</h3>
          <input 
            type="text" 
            id="eventName" 
            maxLength="100" 
            placeholder='Event Name* (100 character limit)' 
            required 
            style={{ width: "300px" }} 
          />
          <br/>
          <textarea 
            id="eventDescription" 
            placeholder='Event Description*' 
            required 
            style={{ width: "300px", height: "100px" }} 
          ></textarea>
          <br/>
          <textarea 
            id="location" 
            placeholder='Location*' 
            required 
            style={{ width: "300px", height: "100px" }} 
          ></textarea>
        </div>


        <div className="eventDiv2">
          <h3>Additional Information</h3>
          <h4 htmlFor="requiredSkills">Required Skills*:</h4>
          <DropdownMenu/>

          <h4 htmlFor="urgency">Urgency*:</h4>
          <select 
            id="urgency" 
            required 
            style={{ width: "300px", height:"25px" }}
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
          <h4 htmlFor="eventDate">Event Date*:</h4>
          <input 
            type="date" 
            id="eventDate" 
            required 
            style={{ width: "300px", height:"25px" }} 
          />
        </div>
        <br/>
        <button type="submit" className="button submit">Create Event</button>
        </div>
    </div>
    
  )
}