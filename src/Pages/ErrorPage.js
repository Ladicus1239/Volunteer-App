import Navigation from '../Components/Navigation'
import "../styles.css"
import Crying from "../Media/ErrorFace.png" 



export default function Error(){
    return(
        <div>
            <Navigation />
            <h1 className='pageTitle'>Error 404: Page Not found</h1>
            <img src={Crying} alt="crying" ></img>
        </div>
    )
}