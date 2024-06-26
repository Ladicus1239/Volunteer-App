import Navigation from '../Components/Navigation'
import "../styles.css"
import logo from "../Media/volunteer.png" 




export default function Home(){
    return(
        <div>
            <Navigation />
            <h1 className="pageTitle" >Home Page</h1><br/>
            <img src={logo} alt="Logo" className='logo'/>
            <p className="center-text"> 
                We help people and stuff. sign up and join events.<br/>
                Save people and maybe animals
            </p>
        </div>
    )
}