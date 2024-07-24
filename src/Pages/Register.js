import React, { useRef, useState } from 'react';
import { Container, Form, Card, Alert } from 'react-bootstrap';
import { useAuth } from '../context/AuthContext';
import db from '../firebase';
import { collection, addDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import Navigation from '../Components/Navigation';
import "../styles.css";
import { encryptData } from '../encrypt';

export default function Signup() {
  const emailRef = useRef();
  const passwordRef = useRef();
  const passwordConfirmRef = useRef();
  const { signup } = useAuth();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const history = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    if (passwordRef.current.value !== passwordConfirmRef.current.value) {
      return setError('Passwords do not match');
    }
    try {
      setError('');
      setLoading(true);
      await signup(emailRef.current.value, passwordRef.current.value);

      try {
        const docRef = await addDoc(collection(db, "UserCredentials"), {
          email: emailRef.current.value,
          password: encryptData(passwordRef.current.value)
        });
        console.log("Document written with ID: ", docRef.id);
      } catch (e) {
        console.error("Error adding document: ", e);
      }

      history('/home');
    } catch (error) {
      setError('Failed to create an account');
      console.log(error);
    }
    setLoading(false);
  }

  return (
    <>
      <Navigation />
      <Container className="signup-container">
        <div className="signup-container">
          <Card className="signup-card">
            <Card.Body>
              <h2 className="signup-header">Registration Page</h2>
              {error && <Alert variant="danger">{error}</Alert>}
              <Form className="signup-form" onSubmit={handleSubmit}>
                <Form.Group controlId="email">
                  <Form.Label>Email</Form.Label>
                  <Form.Control type="email" ref={emailRef} required />
                </Form.Group>

                <Form.Group controlId="password">
                  <Form.Label>Password</Form.Label>
                  <Form.Control type="password" ref={passwordRef} required />
                </Form.Group>

                <Form.Group controlId="password-confirm">
                  <Form.Label>Confirm Password</Form.Label>
                  <Form.Control type="password" ref={passwordConfirmRef} required />
                </Form.Group>
                <button disabled={loading} className="signup-button" type="submit">Sign Up</button>
              </Form>
              {loading && <div>Loading...</div>}
            </Card.Body>
          </Card>
          <div className="SignInRedirect">
            Already have an account? <a href="/login">Log in</a>
          </div>
        </div>
      </Container>
    </>
  );
}
