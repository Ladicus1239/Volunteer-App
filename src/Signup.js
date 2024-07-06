import React from 'react'
import {Card, Form, Button} from 'react-bootstrap'


export default function Signup() {
  return (
    <>
    <Card>
        <Card.Body>
            <h2 className='signup-header'> </h2>
            <Form>
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
            </Form>
        </Card.Body>
    </Card>
    <div className='SignInRedirect'>
        Already have an account? Log in 
    </div>
    </>
  )
}
