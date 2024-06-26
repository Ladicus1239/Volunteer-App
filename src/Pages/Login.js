import Navigation from '../Components/Navigation'
import google from '../Media/google.png'
import "../styles.css"




export default function Login(){
    return(
        <>
         <div>
            <Navigation />
            <h1 className="pageTitle">Login Page</h1>
        </div>
        <br/>
        <div className='login'>
        <input className='loginInput' type='text' placeholder='Email...'/><br/>
        <input className='loginInput' type='text' placeholder='Password...'/><br/>
        <button className='loginButton'>Log in</button><br/>
        <h3 >OR</h3>
        <img src={google} alt="GoogleLogin" className='googlelogin'/>
        </div>
        </>
    )
}