 //允许用户查看、选择、更新自己的兴趣标签
 
/* eslint-disable react/prop-types */
import React from 'react';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import '../assets/SettingTags.css';
import Grid from '@mui/material/Grid';
import Modal from 'react-modal';
import tagsList from './Data/tags.json';
import BreadNav from './BreadNav';

const UserDB = require('../modules/UserDB');

const storage = window.localStorage;
// creating functional component ans getting props from app.js and destucturing them
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
function SettingTags() {
  const [tags, setTags] = React.useState([]);
  const [modalIsOpen, setIsOpen] = React.useState(false);
  const [note, setNote] = React.useState(null);

  const userID = storage.getItem('UserID');

  function addTags(tag) {
    if (tags.includes(tag)) {
      const newList = tags.filter((item) => item !== tag);
      setTags(newList);
    } else {
      setTags((arr) => [...arr, tag]);
    }
  }

  const closeModal = () => {
    setIsOpen(false);
  };

  const showModal = () => {
    setIsOpen(true);
  };

  React.useEffect(() => {
    UserDB.getUserDetails(userID, (success, data) => {
      if (success) {
        data.interests.forEach((tag) => {
          setTags((arr) => [...arr, tag]);
        });
      } else {
        // handle error
      }
    });
  }, [userID]);

  React.useEffect(() => {
    const allTags = tagsList.map((tag) => tag.label);
    allTags.forEach((tag) => { document.getElementById(tag).className = 'setting-tags-button'; });
    tags.forEach((tag) => { document.getElementById(tag).className = 'setting-tags-button-selected'; });
  }, [tags]);

  // creating error state for validation
  // const [error, setError] = useState(false);

  // after form submit validating the form data using validator
  const handleTags = async () => {
    // checking if value of first name and last name is empty show error else take to next step
    if (tags.length <= 0) {
      //
    } else {
      await UserDB.modifyUser(userID, 'interests', [...new Set(tags)], '', (success) => {
        if (success) {
          setNote('Successfully updated interests');
        } else {
          setNote('Unsuccessfully updated interests');
        }
        showModal();
      });
    }
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

      <h1 className="setting-tags-title">Update your Interests</h1>
      <div className="setting-card-container">
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <Stack spacing={1}>
              {tagsList.slice(tagsList.length / 2).map((tag) => (
                <button
                  className="setting-tags-button"
                  type="button"
                  id={tag.label}
                  key={tag.label}
                  onClick={() => addTags(tag.label)}
                >
                  {tag.label}
                </button>
              ))}
            </Stack>
          </Grid>

          <Grid item xs={6}>
            <Stack spacing={1}>
              {tagsList.slice(0, tagsList.length / 2).map((tag) => (
                <button
                  className="setting-tags-button"
                  type="button"
                  id={tag.label}
                  key={tag.label}
                  onClick={() => addTags(tag.label)}
                >
                  {tag.label}
                </button>
              ))}
            </Stack>

          </Grid>
        </Grid>
        <Stack
          direction="row"
          justifyContent="center"
          alignItems="center"
          spacing={4}
          style={{ marginTop: '5%' }}
        >
          <Button variant="contained" onClick={handleTags}>
            Update
          </Button>

        </Stack>

      </div>
    </div>
  );
}

export default SettingTags;
