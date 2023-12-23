import React, { useState } from 'react';
import { Form, Button, Alert } from 'react-bootstrap';
import { useMutation } from "@apollo/client";
import { ADD_USER } from "../utils/mutations";
import Auth from '../utils/auth';
import { useNavigate } from 'react-router-dom';

const SignupForm = () => {
  const history = useNavigate();
  const [formState, setFormState] = useState({
    username: '',
    email: '',
    password: ''
  });
  const [validated, setValidated] = useState(false);
  const [showAlert, setShowAlert] = useState(false);

  const [addUser, { error, data }] = useMutation(ADD_USER);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormState({
      ...formState,
      [name]: value
    });
  };

  const handleFormSubmit = async (event) => {
    event.preventDefault();

    const form = event.currentTarget;

    if (form.checkValidity() === false) {
      event.stopPropagation();
    } else {
      try {
        const { data } = await addUser({
          variables: { ...formState }
        });

        // Assume your server sends back a token in the response
        const token = data.signup.token;

        // Store the token in your authentication system (e.g., localStorage, cookies, etc.)
        // This depends on how you've implemented your Auth system
        Auth.login(token);

        // Clear form values
        setFormState({
          username: '',
          email: '',
          password: ''
        });

        // Redirect to the login page upon successful signup
        history.push('/login');
      } catch (error) {
        console.error(error);

        // Handle the error (show an error message, etc.)
        setShowAlert(true);
      }
    }

    setValidated(true);
  };

  return (
    <>
      <Form noValidate validated={validated} onSubmit={handleFormSubmit}>
        {/* show alert if server response is bad */}
        <Alert dismissible onClose={() => setShowAlert(false)} show={showAlert} variant='danger'>
          Something went wrong with your signup!
        </Alert>

        <Form.Group className='mb-3'>
          <Form.Label htmlFor='username'>Username</Form.Label>
          <Form.Control
            type='text'
            placeholder='Your username'
            name='username'
            onChange={handleInputChange}
            value={formState.username}
            required
          />
          <Form.Control.Feedback type='invalid'>Username is required!</Form.Control.Feedback>
        </Form.Group>

        <Form.Group className='mb-3'>
          <Form.Label htmlFor='email'>Email</Form.Label>
          <Form.Control
            type='email'
            placeholder='Your email address'
            name='email'
            onChange={handleInputChange}
            value={formState.email}
            required
          />
          <Form.Control.Feedback type='invalid'>Email is required!</Form.Control.Feedback>
        </Form.Group>

        <Form.Group className='mb-3'>
          <Form.Label htmlFor='password'>Password</Form.Label>
          <Form.Control
            type='password'
            placeholder='Your password'
            name='password'
            onChange={handleInputChange}
            value={formState.password}
            required
          />
          <Form.Control.Feedback type='invalid'>Password is required!</Form.Control.Feedback>
        </Form.Group>

        <Button
          disabled={!(formState.username && formState.email && formState.password)}
          type='submit'
          variant='success'
        >
          Submit
        </Button>
      </Form>
      {error && (
        <div className="my-3 p-3 bg-danger text-white">
          {error.message}
        </div>
      )}
    </>
  );
};

export default SignupForm;