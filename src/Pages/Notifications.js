import Message from '../Components/Message'
import Navigation from '../Components/Navigation'
import "../styles.css"




export default function Notification(){
    return(
        <>
        
        <div>
            <Navigation />
        </div>

        <div>
            <h1 className="pageTitle" >Notification Page</h1>
        </div>

        <div> 
            <h2 className="center-text">Messenger</h2>
            <Message />
        </div>
        </>
     
        
    )
}