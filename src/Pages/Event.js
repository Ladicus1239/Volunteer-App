import Navigation from '../Components/Navigation';
import EventDisplay from '../Components/eventdisplay';
import "../styles/events.css";  // Ensure the path is correct

export default function Event() {
  return (
    <>
      <Navigation />
      <div className='main-content'>
        <div className='eventHeader'>Events</div>
        <div className='center-text'>
          <div className='buttonContainer'>
            <a href="/events/volunteerhistory">
              <button className='adminredirect'>Volunteer History</button>
            </a>
            <a href="/events/eventmanagement">
              <button className='adminredirect'>Event Manage</button>
            </a>
            <a href="/events/volunteermatching">
              <button className='adminredirect'>Volunteer Matching</button>
            </a>
          </div>
          <EventDisplay />
        </div>
      </div>
    </>
  );
}
