/* eslint-disable react/prop-types */
import React from 'react';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import '../../assets/Registration-step2.css';
import Grid from '@mui/material/Grid';
import tagsList from '../Data/tags.json';

// creating functional component ans getting props from app.js and destucturing them
function StepTwo({
  nextStep, handleFormData, prevStep,
}) {
  const [tags, setTags] = React.useState([]);

  function addTags(tag) {
    if (tags.includes(tag)) {
      const newList = tags.filter((item) => item !== tag);
      setTags(newList);
    } else {
      setTags((arr) => [...arr, tag]);
    }
  }

  React.useEffect(() => {
    const allTags = tagsList.map((tag) => tag.label);
    allTags.forEach((tag) => { document.getElementById(tag).className = 'tags-button'; });
    tags.forEach((tag) => { document.getElementById(tag).className = 'tags-button-selected'; });
  }, [tags]);

  // creating error state for validation
  // const [error, setError] = useState(false);

  // after form submit validating the form data using validator
  const submitFormData = () => {
    // checking if value of first name and last name is empty show error else take to next step
    if (tags.length <= 0) {
      //
    } else {
      handleFormData('tags')(tags);
      nextStep();
    }
  };
  return (
    <div>
      <h1 className="tags-title">Choose your Interests</h1>
      <div className="card-container">
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <Stack spacing={1}>
              {tagsList.slice(tagsList.length / 2).map((tag) => (
                <button
                  className="tags-button"
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
                  className="tags-button"
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

          <Button variant="contained" onClick={prevStep}>
            Previous
          </Button>

          <Button variant="contained" onClick={submitFormData}>
            Next
          </Button>

        </Stack>

      </div>
    </div>
  );
}

export default StepTwo;
