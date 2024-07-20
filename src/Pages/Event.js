import Navigation from '../Components/Navigation';
import Display from '../Components/eventdisplay';
import "../styles3.css";

export default function Event() {
  return (
    <>
      <div className='center-text'>
        <Navigation />
        <h1 className='pageTitle'>Events</h1><br/>
        <a href="/events/volunteerhistory"><button className='adminredirect'>Volunteer History</button></a>
        <a href="/events/eventmanagement"><button className='adminredirect'>Event Manage</button></a>
        <a href="/events/volunteermatching"><button className='adminredirect'>Volunteer Matching</button></a>
      </div>
      <div>
        <Display />
      </div>
    </>
  );
}
