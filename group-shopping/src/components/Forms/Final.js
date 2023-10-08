/* eslint-disable react/prop-types */
import React from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '@mui/material/Card';
import Button from '@mui/material/Button';
import '../../assets/Registration-step3.css';

const UserDB = require('../../modules/UserDB');

function Final({ values }) {
  // destructuring the object from values
  const {
    firstName, lastName, email, phone, password, tags,
  } = values;

  const navigate = useNavigate();
  const handleRegistration = async () => {
    UserDB.createUser(
      '86',
      phone,
      email,
      password,
      firstName,
      lastName,
      tags,
      (success, error) => {
        if (success) {
          console.log('registration is successful');
          navigate('/Login');
        } else {
          console.log('registration failed', error);
        }
      },
    );
  };

  return (
    <div>
      <h1 className="final-title">Please check your Information</h1>
      <Card style={{ marginTop: '10%', textAlign: 'left' }}>
        <div className="final-card-body">
          <p>
            <strong>First Name :</strong>
            {' '}
            {firstName}
            {' '}
          </p>
          <p>
            <strong>Last Name :</strong>
            {' '}
            {lastName}
            {' '}
          </p>
          <p>
            <strong>Last Name :</strong>
            {' '}
            {email}
            {' '}
          </p>
          <p>
            <strong>Phone :</strong>
            {' '}
            {phone}
            {' '}
          </p>
          <p>
            <strong>Password :</strong>
            {' '}
            {password}
            {' '}
          </p>
          <p>
            <strong>Interests :</strong>
            {' '}
            {tags.join(' / ')}
            {' '}
          </p>
          <div className="final-button">
            <Button variant="outlined" onClick={handleRegistration}>Register</Button>
          </div>
        </div>

      </Card>
    </div>
  );
}

export default Final;
