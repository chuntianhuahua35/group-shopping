// 登录

import React from 'react';
import '../assets/Login.css';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Grid from '@mui/material/Grid';
import { useNavigate } from 'react-router-dom';
import { Alert } from '@mui/material';
import hamster from '../assets/images/hamster.GIF';

const UserDB = require('../modules/UserDB');

const storage = window.localStorage;

export default function Login() {
  const navigate = useNavigate();
  const [userName, setUserName] = React.useState(null);
  const [password, setPassword] = React.useState(null);
  const countryCode = '86';
  const [loginFailed, setLoginFailed] = React.useState(null);
  const handleLogin = async (e) => {
    e.preventDefault();
    if (userName.includes('@')) {
      // login with email
      await UserDB.loginUserWithEmail(userName, password, (success, id, error) => {
        if (success) {
          storage.setItem('UserID', id);
          navigate('/');
        } else {
          setLoginFailed(`Login failed, error message: ${error}`);
        }
      });
    } else {
      // login with phone
      await UserDB.loginUserWithPhone(
        countryCode,
        userName,
        password,
        (success, id, error) => {
          if (success) {
            storage.setItem('UserID', id);
            navigate('/');
          } else {
            setLoginFailed(`Login failed, error message: ${error}`);
          }
        },
      );
    }
    await UserDB.getUserDetails(
      storage.getItem('UserID'),
      (success, data) => {
        if (success) {
          storage.setItem('UserName', `${data.firstName} ${data.lastName}`);
        } else {
          //
        }
      },
    );
  };

  return (
    <div className="login-body">
      <Grid container spacing={2}>
        <Grid item xs={6}>
          <div className="welcome-box">
            Welcome
            <br />
            to
            <br />
            our
            <br />
            APP!
          </div>
          <img src={hamster} alt="hamster" style={{ marginLeft: '40%' }} />
          <div />
        </Grid>

        <Grid item xs={6}>
          <div className="login-box">
            <div className="login-header">
              <h2>
                Log In
              </h2>
            </div>

            <div className="login-des">
              This is a secure system and you will need to
              provide your login details to access the site.
            </div>

            {loginFailed ? (
              <div className="login-fail">
                <Alert variant="filled" severity="error">
                  {loginFailed}
                </Alert>
              </div>
            ) : null}
            <form onSubmit={handleLogin}>
              <Stack spacing={2} className="form-stack">

                <TextField
                  required
                  id="outlined-required"
                  label="User Name"
                  onChange={(e) => setUserName(e.target.value)}
                />

                <TextField
                  required
                  id="outlined-password-input"
                  label="Password"
                  type="password"
                  autoComplete="current-password"
                  onChange={(e) => setPassword(e.target.value)}
                />

                <Button
                  variant="outlined"
                  className="login-button"
                  type="submit"
                >
                  Log In
                </Button>

                <Stack
                  direction="row"
                  justifyContent="center"
                  alignItems="center"
                  spacing={4}
                >
                  <button className="redirect-button" type="button" onClick={() => navigate('/Registration')}>Registration</button>
                  <button className="redirect-button" type="button">Forget Password?</button>
                </Stack>
              </Stack>

            </form>
          </div>
        </Grid>
      </Grid>

      <div className="bottom-area" />
    </div>
  );
}
