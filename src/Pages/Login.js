// src/Pages/Login.js
import React, { useRef, useState } from 'react';
import { Container, Form, Card, Alert } from 'react-bootstrap';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import Navigation from '../Components/Navigation';
import '../styles.css';

export default function Login() {
    const emailRef = useRef();
    const passwordRef = useRef();
    const { login } = useAuth();
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    async function handleSubmit(e) {
        e.preventDefault();

        try {
            setError('');
            setLoading(true);
            await login(emailRef.current.value, passwordRef.current.value);
            navigate('/home');
        } catch {
            setError('Failed to login');
        }
        setLoading(false);
    }

    return (
        <>
            <Navigation />
            <Container className="signup-container">
                <div className="signup-container">
                    <Card className='signup-card'>
                        <Card.Body>
                            <h2 className='signup-header'>Login Page</h2>
                            {error && <Alert variant="danger">{error}</Alert>}
                            <Form className='signup-form' onSubmit={handleSubmit}>
                                <Form.Group id="email">
                                    <Form.Label htmlFor="email-input">Email</Form.Label>
                                    <Form.Control id="email-input" type="email" ref={emailRef} required />
                                </Form.Group>
                                <Form.Group id="password">
                                    <Form.Label htmlFor="password-input">Password</Form.Label>
                                    <Form.Control id="password-input" type="password" ref={passwordRef} required />
                                </Form.Group>
                                <button disabled={loading} className="signup-button" type="submit">Log in</button>
                            </Form>
                        </Card.Body>
                    </Card>
                    <div className='SignInRedirect'>
                        Need an account? <a href='/register'>Sign up</a>
                    </div>
                </div>
            </Container>
        </>
    );
}
