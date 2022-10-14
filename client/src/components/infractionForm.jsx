import * as React from 'react';
import Box from '@mui/material/Box';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import StepContent from '@mui/material/StepContent';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import { TextField, Avatar, LinearProgress, Fade, InputLabel, FormControl, MenuItem, Select, Divider, FormHelperText } from '@mui/material';
import PolicyIcon from '@mui/icons-material/Policy';
import axios from 'axios';
import { useState, createRef } from 'react';
import GavelIcon from '@mui/icons-material/Gavel';

const InfractionForm = () => {
    const [loading, setLoading] = useState(false)
    const [activeStep, setActiveStep] = useState(0);
    const [user, setUser] = useState();
    const [username, setUsername] = useState();
    const [infractions, setInfractions] = useState();
    const [thumbnail, setThumbnail] = useState();
    const [infractionType, setInfractionType] = useState();
    const [reason, setReason] = useState();
    const [notes, setNotes] = useState();
    const [submitMessage, setSubmitMessage] = useState('Submitting infraction, please wait...');
    const usernameBox = createRef(null);
    const reasonBox = createRef(null);
    const notesBox = createRef(null);

    const [usernameError, setUsernameError] = useState(false);
    const [typeError, setTypeError] = useState(false);
    const [reasonError, setReasonError] = useState(false);
    axios.defaults.withCredentials = true

  const handleNext = async () => {
        setActiveStep((prevActiveStep) => prevActiveStep + 1);
        if(activeStep === 2) {
          setLoading(true)
          setSubmitMessage('Submitting Infraction, please wait...')
          const submissionData = await {user: user, type: infractionType, reason: reason, note: notes}
          
          axios.post(`${window.location.origin}/infractions/create`, {infractionData: submissionData}
          ).then(async (response) => {
            setLoading(false)
            setSubmitMessage('Incident Recorded')
          }).catch((err) => {setSubmitMessage('Failed to submit, try again later.'); setLoading(false); console.error(err);})
        }
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleReset = () => {
    setActiveStep(0);
    setUser(); setThumbnail(); setUsername(); setInfractionType(); setSubmitMessage('Submitting infraction, please wait...');
  };

  const handleChange = (event) => {
    setInfractionType(event.target.value);
  };

  const findUser = () => {
    setLoading(true);
    if(usernameBox.current.value === '') {
        setLoading(false)
        setUsernameError('This cannot be empty!')
    } else {
        setUsernameError(false);
        axios.get(`${window.location.origin}/data/users/get?user=${usernameBox.current.value}`).then(async (response) => {
            let data = response.data;
            setLoading(false)
            setUser(data.id)
            setUsername(data.username)
            setThumbnail(data.thumbnail)
            setInfractions(data.infractions.length)
        }).catch((error) => {console.error(error); setUsernameError('User does not exist.'); setLoading(false)})
    }
  }

  const UserFinder = () => {
    if(!user) {
        return (
            <div>
                <TextField style={{marginBottom: '.5rem'}} error={usernameError ? true : false} helperText={usernameError ? usernameError : ''} fullWidth size='small' inputRef={usernameBox} label="Suspect's Username"/>
                <Button onClick={findUser} startIcon={<PolicyIcon />} fullWidth variant='outlined'>Query</Button>
                <Fade in={loading}>
                  <LinearProgress />
                </Fade>
            </div>
        )
    } else {
        return (
            <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                <Avatar src={thumbnail} sx={{height: '3rem', width: '3rem'}} alt='tozzleboy' />
                <ul style={{listStyle: 'none', padding: '0', margin: '0', marginLeft: '.5rem'}}>
                    <Typography variant='h6' style={{fontFamily: 'Inter, sans-serif', fontWeight: '600'}}>{username}</Typography>
                    <Typography variant='h7' style={{fontFamily: 'Inter, sans-serif', fontWeight: '500'}}>{infractions || 0} Infractions</Typography>
                </ul>
                <Fade in={loading}>
                  <LinearProgress />
                </Fade>
                <Button style={{display: 'block', marginLeft: 'auto'}} variant='outlined' size='small' onClick={() => {setUser(); setThumbnail(); setUsername()}}>Reset</Button>
            </div>
        )
    }
  }

  const StepOne = ({index}) => {
    return (
      <Box key='stepOne'>
      <UserFinder />            
      <Box sx={{ mb: 2 }}>
      <div>
        <Button
          variant="contained"
          onClick={handleNext}
          disabled={user ? false : true}
          sx={{ mt: 1, mr: 1 }}
        >
        Next
        </Button>
        <Button
          disabled={index === 0}
          onClick={handleBack}
          sx={{ mt: 1, mr: 1 }}
        >
          Back
        </Button>
      </div>
    </Box>
    </Box>
  )
  }

  const StepTwo = ({index}) => {
    return (
      <Box key='stepTwo'>
      <FormControl style={{marginBottom: '1rem'}} fullWidth error={typeError ? true : false}>
      <InputLabel id="demo-simple-select-label">Infraction Type</InputLabel>
      <Select
        labelId="demo-simple-select-label"
        id="demo-simple-select"
        value={infractionType}
        label="Infraction Type"
        onChange={handleChange}
        size='large'
        style={{textAlign: 'left'}}
      >
        <MenuItem value='Warning'>Warning</MenuItem>
        <MenuItem value='Kick'>Kick</MenuItem>
        <Divider />
        <MenuItem value='Ban Bolo'>Ban Bolo</MenuItem>
        <MenuItem value='Ban'>Ban</MenuItem>
      </Select>
      <FormHelperText>{typeError ? typeError : ''}</FormHelperText>
    </FormControl>

      <TextField key='reason' inputRef={reasonBox} inputProps={{ maxLength: 150 }} error={reasonError ? true : false} helperText={reasonError ? reasonError : ''} fullWidth size='small' required label='Reason' style={{marginBottom: '.5rem'}} variant='outlined' />
      <TextField key='notes' inputRef={notesBox} inputProps={{ maxLength: 150 }} fullWidth size='small' label='Notes' variant='outlined' />
      <Box sx={{ mb: 2 }}>
      <div>
        <Button
          variant="contained"
          onClick={async () => {
            let returnAfter = false
              if(reasonBox.current.value === '') {
                setReasonError('This field is required.')
                returnAfter = await true
            }
            if(!infractionType) {
              setTypeError('You must set a type!')
              returnAfter = await true
            }
            if(returnAfter === true) return;
            setReason(reasonBox.current.value)
            if(notesBox.current.value !== '') {
              setNotes(notesBox.current.value)
            } else {
              setNotes('None!')
            }
            handleNext()
            setReasonError()
            setTypeError()
          }
          }
          sx={{ mt: 1, mr: 1 }}
        >
          Review
        </Button>
        <Button
          disabled={index === 0}
          onClick={handleBack}
          sx={{ mt: 1, mr: 1 }}
        >
          Back
        </Button>
      </div>
    </Box>
    </Box>
  )
  }

  const StepThree = ({index}) => {
    return (
      <Box>
      <Typography variant='h6' style={{display: 'block', textAlign: 'left', fontFamily: 'Inter, sans-serif', fontWeight: '500', marginBottom: '.5rem'}}>New <u><b>{infractionType}</b></u></Typography>
      <div style={{display: 'flex', justifyContent: 'left', alignItems: 'center'}}>
          <Avatar src={thumbnail} sx={{height: '3rem', width: '3rem'}} alt='tozzleboy' />
          <ul style={{listStyle: 'none', padding: '0', margin: '0', marginLeft: '.5rem'}}>
              <Typography variant='h6' style={{fontFamily: 'Inter, sans-serif', fontWeight: '600'}}>{username}</Typography>
              <Typography variant='h7' style={{fontFamily: 'Inter, sans-serif', fontWeight: '500'}}>{infractions || 0} Infractions</Typography>
          </ul>
      </div>
      <Typography variant='h7' style={{marginTop: '.4rem', display: 'block', textAlign: 'left', fontFamily: 'Inter, sans-serif', fontWeight: '500'}}>Reason: <b>{reason}</b></Typography>
      <Typography variant='h7' style={{display: 'block', textAlign: 'left', fontFamily: 'Inter, sans-serif', fontWeight: '500'}}>Notes: <b>{notes}</b></Typography>
      <Box sx={{ mb: 2 }}>
      <div>
        <Button
          variant="contained"
          onClick={handleNext}
          sx={{ mt: 1, mr: 1 }}
          startIcon={<GavelIcon />}
        >
          Infract
        </Button>
        <Button
          disabled={index === 0}
          onClick={handleBack}
          sx={{ mt: 1, mr: 1 }}
        >
          Back
        </Button>
      </div>
    </Box>
    </Box>
  )
  }

  return (
    <Box sx={{ maxWidth: 400 }}>
      <Stepper activeStep={activeStep} orientation="vertical">
        <Step key='stepOne'>
            <StepLabel>
              Find Suspect
            </StepLabel>
            <StepContent key='stepContent1'>
              <StepOne index={activeStep}/>
            </StepContent>
          </Step>
          <Step key='stepTwo'>
            <StepLabel>
              Reasoning and Notes
            </StepLabel>
            <StepContent key='stepContent2'>
              <StepTwo index={activeStep}/>
            </StepContent>
          </Step>
          <Step key='stepThree'>
            <StepLabel>
              Review and Submit
            </StepLabel>
            <StepContent key='stepContent3'>
              <StepThree index={activeStep}/>
            </StepContent>
          </Step>
      </Stepper>
      {activeStep === 3 && (
        <Paper square elevation={0} sx={{ p: 3 }}>
          <Typography>{submitMessage}</Typography>
          <Fade in={loading}>
          <LinearProgress />
          </Fade>
          <Button disabled={loading ? true : false} onClick={handleReset} sx={{ mt: 1, mr: 1 }}>
            Reset
          </Button>
        </Paper>
      )}
    </Box>
  );
}

export default InfractionForm;