import "../styles.css"






export default function Navigation() {
    return <nav className="nav">
        <a href="/" className="HomeButton">VolunteerOrg</a>
        <ul>
            <li>
                <a href="/login" className="navbutton">Login</a>
            </li>

            <li>
                <a href="/register" className="navbutton">Register</a>
            </li>

            <li>
                <a href="/profile" className="navbutton">Profile</a>
            </li>

            <li>
                <a href="/notification" className="navbutton">Notifications</a>
            </li>

            <li>
                <a href="/events" className="navbutton">Events</a>
            </li>
        </ul>
    </nav>
    
  }
  