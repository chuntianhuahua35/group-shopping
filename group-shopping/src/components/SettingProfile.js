// 更改用户的基本信息，如名字、姓氏、电子邮件和电话号码，并通过模态框给出反馈。

import React from 'react';
import '../assets/SettingProfile.css';
import Card from '@mui/material/Card';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Modal from 'react-modal';
import BreadNav from './BreadNav';

const UserDB = require('../modules/UserDB');

const storage = window.localStorage;

const customStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
    background: '#FFD9A0',
  },
};
function SettingProfile() {
  const [firstName, setFirstName] = React.useState(null);
  const [lastName, setLastName] = React.useState(null);
  const [email, setEmail] = React.useState(null);
  const [phone, setPhone] = React.useState(null);
  const [modalIsOpen, setIsOpen] = React.useState(false);
  const [note, setNote] = React.useState(null);
  const [personalDetails, setPersonalDetails] = React.useState(null);

  const userID = storage.getItem('UserID');

  React.useEffect(() => {
    UserDB.getUserDetails(userID, (success, data) => {
      if (success) {
        setPersonalDetails(data);
      } else {
        // handle error
      }
    });
  }, [userID]);

  const closeModal = () => {
    setIsOpen(false);
  };

  const showModal = () => {
    setIsOpen(true);
  };

  const handleFirstName = async () => {
    await UserDB.modifyUser(userID, 'firstName', firstName, '', (success) => {
      if (success) {
        setNote('Successfully updated first name');
        storage.setItem(`${firstName} ${storage.getItem('UserName').split(' ')[1]}`);
      } else {
        setNote('Unsuccessfully updated first name');
      }
      showModal();
    });
  };

  const handleLastName = async () => {
    await UserDB.modifyUser(userID, 'lastName', lastName, '', (success) => {
      if (success) {
        setNote('Successfully updated last name');
        storage.setItem(`${storage.getItem('UserName').split(' ')[0]} ${lastName}`);
      } else {
        setNote('Unsuccessfully updated last name');
      }
      showModal();
    });
  };

  const handleEmail = async () => {
    await UserDB.modifyUser(userID, 'email', email, '', (success) => {
      if (success) {
        setNote('Successfully updated email');
      } else {
        setNote('Unsuccessfully updated email');
      }
      showModal();
    });
  };

  const handlePhone = async () => {
    await UserDB.modifyUser(userID, 'phone', phone, '', (success) => {
      if (success) {
        setNote('Successfully updated phone');
      } else {
        setNote('Unsuccessfully updated phone');
      }
      showModal();
    });
  };

  if (personalDetails === null) {
    return null;
  }

  return (
    <div>
      <div>
        <Modal
          isOpen={modalIsOpen}
          onRequestClose={closeModal}
          style={customStyles}
          contentLabel="Example Modal"
          ariaHideApp={false}
        >
          <div className="modalContent">
            <h2>{note}</h2>
            <button className="modalButton" type="button" onClick={closeModal}>Close</button>
          </div>
        </Modal>
      </div>
      <BreadNav />
      <h1 className="setting-title">Basic Information</h1>
      <Card style={{ marginLeft: '25%', marginTop: '5%', width: '50%' }}>
        <div className="setting-form">
          <Grid container rowSpacing={2} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>

            <Grid item xs={10}>
              <TextField
                label="First Name"
                required
                placeholder={personalDetails.firstName}
                fullWidth
                onChange={(e) => setFirstName(e.target.value)}
              />
            </Grid>
            <Grid item xs={2}>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                style={{ marginTop: '5%' }}
                onClick={handleFirstName}
              >
                Update
              </Button>
            </Grid>

            <Grid item xs={10}>
              <TextField
                label="Last Name"
                required
                placeholder={personalDetails.lastName}
                fullWidth
                onChange={(e) => setLastName(e.target.value)}
              />
            </Grid>
            <Grid item xs={2}>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                style={{ marginTop: '5%' }}
                onClick={handleLastName}
              >
                Update
              </Button>
            </Grid>

            <Grid item xs={10}>
              <TextField
                label="Email"
                required
                placeholder={personalDetails.email}
                fullWidth
                onChange={(e) => setEmail(e.target.value)}
              />
            </Grid>
            <Grid item xs={2}>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                style={{ marginTop: '5%' }}
                onClick={handleEmail}
              >
                Update
              </Button>
            </Grid>

            <Grid item xs={10}>
              <TextField
                label="Phone"
                required
                placeholder={personalDetails.phone.phoneNumber}
                fullWidth
                onChange={(e) => setPhone(e.target.value)}
              />
            </Grid>
            <Grid item xs={2}>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                style={{ marginTop: '5%' }}
                onClick={handlePhone}
              >
                Update
              </Button>
            </Grid>

          </Grid>
        </div>
      </Card>
    </div>
  );
}

export default SettingProfile;
