import Navigation from '../Components/Navigation'
import React,{useRef,useState} from 'react'
import {Container,Form, Card, Alert} from 'react-bootstrap'
import {AuthProvider, useAuth} from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import "../styles.css"

const USER_REGEX = /^[a-zA-Z0-9._:$!%-]+@[a-zA-Z0-9.-]+.[a-zA-Z]$/;
const PWD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{8,24}$/;
const REGISTER_URL = '/register';

export default function Signup() {

    const emailRef =useRef()
    const passwordRef =useRef()
    const passwordConfirmRef =useRef()
    const { signup } =useAuth()
    const [error, setError] = useState('')
    const [loading, setLoading] = useState('')
    const history = useNavigate()

    async function handleSubmit(e){
        e.preventDefault()
        if (passwordRef.current.value !==
         passwordConfirmRef.current.value){
            return setError('Passwords do not match')
        }
        try{
            setError('')
            setLoading(true)
           await signup(emailRef.current.value, passwordRef.current.value)
           history("/home")
        }catch(error){
            setError('Failed to create an account')
            console.log(error)
        }
        setLoading(false)
    }

    return (
        <>
        <Navigation/>
        <Container className="signup-container">
        <AuthProvider>
        <div className="signup-container">
            <Card className='signup-card'>
                    <Card.Body>
                        <h2 className='signup-header'>Registration Page</h2>
                        {error && <Alert variant="danger">{error}</Alert>}
                        <Form className='signup-form' onSubmit={handleSubmit}>
                            <Form.Group id="email">
                                <Form.Label>Email</Form.Label>
                                <Form.Control type="email" ref={emailRef}required/>
                            </Form.Group>

                            <Form.Group id="password">
                                <Form.Label>Password</Form.Label>
                                <Form.Control type="password" ref={passwordRef}required/>
                            </Form.Group>

                            <Form.Group id="password-confirm">
                                <Form.Label>Confirm Password</Form.Label>
                                <Form.Control type="password" ref={passwordConfirmRef}required/>
                            </Form.Group>
                            <button disabled={loading}className="signup-button" type="submit">Sign Up</button>
                        </Form>
                    </Card.Body>
            </Card>
            <div className='SignInRedirect'>
                Already have an account? <a href='/login'>Log in</a>
            </div>
        </div>
           
        </AuthProvider>
        </Container>
        </>
    )
}