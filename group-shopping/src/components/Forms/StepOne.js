/* eslint-disable react/prop-types */
import React from 'react';
import '../../assets/Registration-step1.css';
import Card from '@mui/material/Card';
import TextField from '@mui/material/TextField';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import validator from 'validator';

// creating functional component ans getting props from app.js and destucturing them
function StepOne({ nextStep, handleFormData, values }) {
  // creating error state for validation
  // const [error, setError] = useState(false);

  // after form submit validating the form data using validator
  const submitFormData = (e) => {
    e.preventDefault();

    // checking if value of first name and last name is empty show error else take to step 2
    if (
      validator.isEmpty(values.firstName)
      || validator.isEmpty(values.lastName)
    ) {
      // setError(true);
    } else {
      nextStep();
    }
  };

  return (
    <div>
      <h1 className="registration-title">Sign-Up Form</h1>
      <Card style={{ marginTop: '5%' }}>
        <h3 className="registration-des">Basic Information</h3>
        <form className="registration-form" onSubmit={submitFormData}>
          <Stack spacing={2}>

            <TextField
              label="First Name"
              required
              value={values.firstName}
              placeholder="First Name"
              onChange={(e) => handleFormData('firstName')(e.target.value)}
            />

            <TextField
              label="Last Name"
              required
              value={values.lastName}
              placeholder="Last Name"
              onChange={(e) => handleFormData('lastName')(e.target.value)}
            />

            <TextField
              label="Email"
              required
              value={values.email}
              placeholder="Email"
              onChange={(e) => handleFormData('email')(e.target.value)}
            />

            <TextField
              label="Phone"
              required
              value={values.phone}
              placeholder="Phone"
              onChange={(e) => handleFormData('phone')(e.target.value)}
            />

            <TextField
              label="Password"
              required
              value={values.password}
              placeholder="Password"
              onChange={(e) => handleFormData('password')(e.target.value)}
            />

            <Button type="submit" variant="contained" color="primary">
              Next
            </Button>

          </Stack>

        </form>
      </Card>
    </div>
  );
}

export default StepOne;
