// 更改密码

import React from 'react';
import '../assets/SettingPassword.css';
import TextField from '@mui/material/TextField';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Modal from 'react-modal';
import BreadNav from './BreadNav';

const UserDB = require('../modules/UserDB');

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

const storage = window.localStorage;

function SettingPassword() {
  const fieldToChange = 'password';
  const [newValue, setNewValue] = React.useState(null);
  const [note, setNote] = React.useState(null);
  const [modalIsOpen, setIsOpen] = React.useState(false);
  const [oldPassword, setOldpassword] = React.useState(null);
  const userID = storage.getItem('UserID');
  const [confirmPassword, setConfirmPassword] = React.useState(null);

  const closeModal = () => {
    setIsOpen(false);
  };

  const showModal = () => {
    setIsOpen(true);
  };

  const handleNewValue = async (e) => {
    e.preventDefault();
    if (confirmPassword !== newValue) {
      setNote('please confirm your new password again ');
      showModal();
      return;
    }
    await UserDB.modifyUser(userID, fieldToChange, newValue, oldPassword, (success) => {
      if (success) {
        setNote('Successfully updated password');
      } else {
        setNote('Unsuccessfully updated password');
      }
      showModal();
    });
  };

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
      <h1 className="settingPassword-title">SettingPassword Page</h1>
      <div className="settingPassword-card">
        <form className="settingPassword-form">
          <Stack spacing={3}>
            <TextField
              label="Old Password"
              type="password"
              required
              fullWidth
              placeholder="Old Password"
              onChange={(e) => setOldpassword(e.target.value)}
            />

            <TextField
              label="New Password"
              type="password"
              required
              fullWidth
              placeholder="New Password"
              onChange={(e) => setNewValue(e.target.value)}
            />

            <TextField
              label="Confirm Password"
              type="password"
              required
              fullWidth
              placeholder="Confirm Password"
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            <div style={{ width: '20', textAlign: 'right', marginTop: '4%' }}>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                size="lg"
                onClick={handleNewValue}
              >
                Update
              </Button>
            </div>

          </Stack>

        </form>
      </div>
    </div>
  );
}

export default SettingPassword;
