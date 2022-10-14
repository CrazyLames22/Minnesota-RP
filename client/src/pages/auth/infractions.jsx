import './dashboard.css';
import { Card, LinearProgress, TextField, Button, Fade, Typography, Avatar, Divider, Grid, Select, MenuItem, FormControl, InputLabel, FormHelperText, IconButton } from '@mui/material'
import PolicyIcon from '@mui/icons-material/Policy';
import { useState, useRef } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import GavelIcon from '@mui/icons-material/Gavel';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import { useEffect } from 'react';

const InfractionPage = () => {

  const navigate = useNavigate();
  const userFinderBox = useRef();
  const infractionReason = useRef();
  const infractionNotes = useRef();
  const [infractions, setInfractions] = useState([]);
  const [dailyInfractions, setDailyInfractions] = useState(0);
  const [recentInfractions, setRecentInfractions] = useState([]);
  const [infractionType, setInfractionType] = useState();
  const [infractionSent, sendInfraction] = useState();
  const [user, setUser] = useState('');
  const [loading, setLoading] = useState();
  const [errors, setErrors] = useState({
    Username: {active: false, msg: ''},
    Reason: {active: false, msg: ''},
    Notes: {active: false, msg: ''},
    infractionType: {active: false, msg: ''},
  });
  axios.defaults.withCredentials = true

const removeInfraction = (id) => {
    if (!loading) {
        axios.get(`${window.location.origin}/infractions/delete?id=${id}`).then(async (response) => {
              window.location.reload(false);
        })
    }
}

  const handleChange = (event) => {
    setInfractionType(event.target.value);
  };

  const setError = async (inputValue, error) => {
    const newData = await errors
    if(error) {
    newData[inputValue] = await {active: true, msg: error}
    } else newData[inputValue]= await {active: false, msg: ''}
    setErrors({...newData})
  }

  const InputField = ({Label, Props, Reference}) => {
    return (
      <TextField error={errors[Label].active} helperText={errors[Label].msg} inputRef={Reference} label={Label} {... Props}/>
    )
  }


    useEffect(() => {
      const getRecents = () => {
      axios.get(`${window.location.origin}/infractions/all`).then(async (response) => {
        let tempInfractions = []
        await response.data.forEach((infraction) => tempInfractions.push(infraction));
        return setRecentInfractions([...tempInfractions])
      }).catch((err) => console.error(err))
    }

    getRecents();
  }, []); //<-- This is the dependency array

  const PlayerPage = () => {
    return (
      <div style={{paddingTop: '1rem', width: '90%', height: '90%', margin: 'auto', display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
        <Card style={{borderRadius: '1rem', width: '75%', height: '75%', margin: 'auto', overflow: 'auto'}} variant='elevation'>
        <div style={{padding: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'left'}}>
                <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                    <Avatar src={user.thumbnail} sx={{height: '3rem', width: '3rem'}} alt='tozzleboy' />
                    <ul style={{listStyle: 'none', padding: '0', margin: '0', marginLeft: '.5rem'}}>
                        <Typography variant='h6' style={{fontFamily: 'Inter, sans-serif', fontWeight: '600'}}>{user.username}</Typography>
                        <Typography variant='h7' style={{fontFamily: 'Inter, sans-serif', fontWeight: '500'}}>{infractions.length || 0} Infractions</Typography>
                    </ul>
                </div>
                <Button id='mobileHide' style={{float: 'right', marginLeft: 'auto'}} startIcon={<PolicyIcon />} onClick={() => window.location.pathname = 'dashboard/infractions'}>Search More</Button>
            </div>
            <Divider />
            <div id='mobileShow' style={{marginTop: '1rem', justifyContent: 'center', alignItems: 'center'}}>
            <Button startIcon={<PolicyIcon />} onClick={() => window.location.pathname = 'dashboard/infractions'}>Search More</Button>
            </div>
            <div style={{padding: '1rem'}}>
            <Grid style={{justifyContent: 'left'}} container spacing={2}>
              <Grid item xs={12} md={3}>
              <Card style={{width: '100%', borderRadius: '1rem', overflow: 'auto'}} variant='outlined'>
                <div style={{padding: '1rem'}}>
                  <Typography variant='h2' style={{fontFamily: 'Inter, sans-serif', fontWeight: '600', width: '100%'}}>{infractions.length || 0}</Typography>
                  <Typography variant='body1' style={{fontFamily: 'Inter, sans-serif', fontWeight: '400', width: '100%'}}>All time infractions</Typography>
                </div>
                </Card>
                <Card style={{width: '100%', borderRadius: '1rem', marginTop: '1rem'}} variant='outlined'>
                <div style={{padding: '1rem'}}>
                  <Typography variant='h2' style={{fontFamily: 'Inter, sans-serif', fontWeight: '600', width: '100%'}}>{dailyInfractions || 0} </Typography>
                  <Typography variant='body1' style={{fontFamily: 'Inter, sans-serif', fontWeight: '400', width: '100%'}}>Infraction/s today</Typography>
                </div>
                </Card>
              </Grid>
              <Grid style={{justifySelf: 'right', marginLeft: 'auto', float: 'right'}} item xs={12} md={5}>
                <Card style={{width: '100%', borderRadius: '1rem'}} variant='outlined'>
                  <div style={{padding: '.5rem'}}>
                      <div style={{padding: '2rem', display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                      {!infractionSent ? (
                        <Fade in={!infractionSent}>
                        <ul style={{width: '100%', listStyle: 'none', padding: '0', margin: '0'}}>
                          <FormControl fullWidth error={errors.infractionType.active}>
                            <InputLabel id="demo-simple-select-label">Infraction Type</InputLabel>
                              <Select
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                value={infractionType}
                                label="Infraction Type"
                                onChange={handleChange}
                                size='small'
                                variant='standard'
                                style={{textAlign: 'left'}}
                              >
                                <MenuItem value='Warning'>Warning</MenuItem>
                                <MenuItem value='Kick'>Kick</MenuItem>
                                <Divider />
                                <MenuItem value='Ban Bolo'>Ban Bolo</MenuItem>
                                <MenuItem value='Ban'>Ban</MenuItem>
                              </Select>
                              <FormHelperText>{errors.infractionType.msg}</FormHelperText>
                          </FormControl>
                          <InputField Label='Reason' Props={{size: 'small', fullWidth: true, style: {margin: '.5rem 0'}, required: true, disabled: infractionType ? false : true, inputProps: { maxLength: 150 }}} Reference={infractionReason}/>
                          <InputField Label='Notes' Props={{size: 'small', fullWidth: true, disabled: infractionType ? false : true, inputProps: { maxLength: 150 }}} Reference={infractionNotes}/>
                          <Button variant='outlined' onClick={async () => {
                            let returnAfter = false;
                            if(infractionReason.current.value === '') {
                              setError('Reason', 'You must set a reason.')
                              returnAfter = true
                            }
                            if(!infractionType) {
                              setError('infractionType', 'You must set an infraction type.')
                              returnAfter = true
                            }
                            if(returnAfter) return;
                            setError('infractionType')
                            setError('Reason')
                            const data = {user: user.id, reason: infractionReason.current.value, type: infractionType, note: infractionNotes.current.value !== '' ? infractionNotes.current.value : 'None!'}
                            if(infractionNotes.current.value !== '') {data.notes = infractionNotes.current.value} else {data.notes = 'None!'}
                            await console.log(data)
                            setLoading(true)
                            sendInfraction(true)
                            axios.post(`${window.location.origin}/infractions/create`, {infractionData: data}
                            ).then(async (response) => {
                              setLoading(false)
                            }).catch((err) => {setLoading(false); console.error(err);})
                            setInfractionType()

                          }}fullWidth style={{marginTop: '1rem'}} startIcon={<GavelIcon />}>Infract</Button>
                        </ul>
                      </Fade>
                      ) : (
                      <Fade in={infractionSent}>
                        <ul style={{width: '100%', listStyle: 'none', padding: '0', margin: '0'}}>
                          <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: '.5rem'}}>
                          <Fade in={!loading}>
                          <VerifiedUserIcon style={{marginRight: '.5rem'}}/>
                          </Fade>
                          <Typography style={{textAlign: 'center'}} variant='body'>{loading ? 'Recording incident, please wait...' : 'Incident Recorded'}</Typography>
                          </div>
                          <Fade in={loading}><LinearProgress /></Fade>
                          <Button style={{marginTop: '.5rem'}} variant='outlined' startIcon={<RestartAltIcon />} fullWidth disabled={loading} onClick={() => sendInfraction(false)}>Reset</Button>
                        </ul>
                      </Fade>
                      )}
                    </div>
                  </div>
                </Card>
              </Grid>
            </Grid>
            </div>
            <Divider />
            <div style={{overflow: 'auto', width: '100%'}}>

            <div id='mobileHide2'>
            {infractions.map((infraction, index) => (
              <div id={`infraction-${index}`} style={{width: '100%', padding: '.8rem .4rem', backgroundColor: index % 2 === 0 ? '#fff' : '#ededed', display: 'flex', justifyContent: 'end', alignItems: 'center'}}>
                <ul style={{listStyle: 'none', padding: '0', margin: '0'}}>
                  <Typography style={{display: 'block'}} variant='caption'>Reason</Typography>
                  <Typography variant='body'>{infraction.reason}</Typography>
                </ul>
                <ul style={{listStyle: 'none', padding: '0', margin: '0', marginLeft: '5rem'}}>
                  <Typography style={{display: 'block'}} variant='caption'>Type</Typography>
                  <Typography variant='body'>{infraction.type}</Typography>
                </ul>
                <ul style={{listStyle: 'none', padding: '0', margin: '0', marginLeft: '5rem'}}>
                  <Typography style={{display: 'block'}} variant='caption'>Date</Typography>
                  <Typography variant='body'>{new Date(infraction.date).getDate() + "/"
                + (new Date(infraction.date).getMonth()+1)  + "/" 
                + new Date(infraction.date).getFullYear() + " @ "  
                + new Date(infraction.date).getHours() + ":"  
                + new Date(infraction.date).getMinutes() + ":" 
                + new Date(infraction.date).getSeconds()}</Typography>
                </ul>
                <ul style={{listStyle: 'none', padding: '0', margin: '0', marginLeft: '5rem'}}>
                  <Typography style={{display: 'block'}} variant='caption'>Moderator</Typography>
                  <div style={{display: 'flex', justifyContent: 'left', alignItems:'center'}}>
                  <Avatar style={{width: '1.5rem', height: '1.5rem', marginRight: '.5rem'}} src={JSON.parse(infraction.moderator).avatar} />
                  <Typography onClick={() => window.open(`https://lookup.guru/${JSON.parse(infraction.moderator).id}`, "_self")} style={{display: 'inline', cursor: 'pointer'}} variant='body'><u>{JSON.parse(infraction.moderator).username}</u></Typography>
                  </div>
                </ul>
                <Button onClick={() => removeInfraction(infraction.id)} style={{marginLeft: '1rem'}} variant='text' color='error' startIcon={<DeleteForeverIcon />}>Delete</Button>
              </div>
            ))}
            {infractions.length === 0 ? (<div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%', height: '100%', padding: '5rem 0'}}><Typography style={{margin: 'auto'}} variant='h6'>No incidents recorded.</Typography></div>) : (<span />)}
            </div>
            <div id='mobileShow2'>
            {infractions.map((infraction, index) => (
              <div id={`infraction-${index}`} style={{minWidth: '270%', padding: '.8rem .4rem', backgroundColor: index % 2 === 0 ? '#fff' : '#ededed', display: 'flex', justifyContent: 'left', alignItems: 'center'}}>
                <ul style={{listStyle: 'none', padding: '0', margin: '0'}}>
                  <Typography style={{display: 'block'}} variant='caption'>Reason</Typography>
                  <Typography variant='body'>{infraction.reason}</Typography>
                </ul>
                <ul style={{listStyle: 'none', padding: '0', marginLeft: '5rem'}}>
                  <Typography style={{display: 'block'}} variant='caption'>Type</Typography>
                  <Typography variant='body'>{infraction.type}</Typography>
                </ul>
                <ul style={{listStyle: 'none', padding: '0', margin: '0', marginLeft: '5rem'}}>
                  <Typography style={{display: 'block'}} variant='caption'>Date</Typography>
                  <Typography variant='body'>{new Date(infraction.date).getDate() + "/"
                + (new Date(infraction.date).getMonth()+1)  + "/" 
                + new Date(infraction.date).getFullYear() + " @ "  
                + new Date(infraction.date).getHours() + ":"  
                + new Date(infraction.date).getMinutes() + ":" 
                + new Date(infraction.date).getSeconds()}</Typography>
                </ul>
                <ul style={{listStyle: 'none', padding: '0', margin: '0', marginLeft: '5rem'}}>
                  <Typography style={{display: 'block'}} variant='caption'>Moderator</Typography>
                  <div style={{display: 'flex', justifyContent: 'left', alignItems:'center'}}>
                  <Avatar style={{width: '1.5rem', height: '1.5rem', marginRight: '.5rem'}} src={JSON.parse(infraction.moderator).avatar} />
                  <Typography onClick={() => window.open(`https://lookup.guru/${JSON.parse(infraction.moderator).id}`, "_self")} style={{display: 'inline', cursor: 'pointer'}} variant='body'><u>{JSON.parse(infraction.moderator).username}</u></Typography>
                  </div>
                </ul>
                <IconButton onClick={() => removeInfraction(infraction.id)} style={{margin: 'auto', marginLeft: '1rem'}} color='error' aria-label="Delete">
                  <DeleteForeverIcon />
                </IconButton>
              </div>
            ))}
                        {infractions.length === 0 ? (<div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%', height: '100%', padding: '5rem 0'}}><Typography style={{margin: 'auto'}} variant='h6'>No incidents recorded.</Typography></div>) : (<span />)}
            </div>
            </div>
        </Card>
      </div>
    )
  }

if(window.location.pathname.split('/')[3] && !user){
    const userData = {}
    userData.id = window.location.pathname.split('/')[3]
    axios.get(`${window.location.origin}/data/users/get?plrid=${window.location.pathname.split('/')[3]}`).then(async (response) => {
      let data = response.data;
      setLoading(false)
      setError('Username')
      userData.thumbnail = data.thumbnail
      userData.username = data.username
      setInfractions(data.infractions || [])
      let dailyInfractionsTemp = 0;
      await data.infractions.forEach((infraction) => {
        if(new Date(infraction.date).getDate() === new Date().getDate()) dailyInfractionsTemp = dailyInfractionsTemp + 1
      })
      setDailyInfractions(dailyInfractionsTemp);
      setUser(userData)
  }).catch((error) => navigate('/dashboard/infractions'))

} else {

  const findUser = async () => {
    const userData = {}
    if(userFinderBox.current.value === '') {
      setError('Username', 'This field is required.')
      return;
    } else {
      setError('Username')
    }
    if(loading) return;
    setLoading(true)
    axios.get(`${window.location.origin}/data/users/get?user=${userFinderBox.current.value}`).then(async (response) => {
      let data = response.data;
      setLoading(false)
      setError('Username')
      userData.thumbnail = data.thumbnail
      userData.username = data.username
      userData.id = data.id
      setInfractions(data.infractions || [])
      let dailyInfractionsTemp;
      await data.infractions.forEach((infraction) => {
        console.log(new Date(infraction.date).getDate() === new Date().getDate())
        if(new Date(infraction.date).getDate() === new Date().getDate()) dailyInfractionsTemp = dailyInfractions + 1
      })
      setDailyInfractions(dailyInfractionsTemp);
      setUser(userData)
      window.history.replaceState(null, `${data.username}'s Infractions`, `/dashboard/infractions/${userData.id}`)
  }).catch((error) => {console.error(error); setError('Username', 'User does not exist.'); setLoading(false)})
  }

  return (
  <div style={{width: '100vw', height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
    {!user ? (
      <Fade in={user ? false : true}>
        <div>
      <Card style={{width: 'calc(20rem + 4vw)', borderRadius: '1rem'}} variant='elevation'>
        <div style={{padding: '1rem'}}>
        <InputField Label='Username' Reference={userFinderBox} Props={{style: {paddingBottom: '.1rem'}, fullWidth: true, variant: 'outlined', size: 'small' }} />
        <Button startIcon={<PolicyIcon />} onClick={() => {findUser();}} fullWidth variant='outlined'>Query</Button>
        </div>
        <LinearProgress variant={loading ? 'indeterminate' : "determinate"} value={100}/>
      </Card>
      <Card style={{width: 'calc(20rem + 4vw)', borderRadius: '1rem', marginTop: '2rem', overflow: 'auto'}} variant='elevation'>
        <div style={{padding: '1rem'}}>
        <Typography variant='body' style={{fontFamily: 'Inter, sans-serif', marginBottom: '1rem', overflow: 'auto'}}><b>Recent Infractions</b></Typography>
        </div>
        <Divider />
        {recentInfractions.slice(0, 10).map((infraction, index) => (
          <div key={index} id={`recentInfract-${index}`} style={{width: '97%', padding: '.8rem .4rem', backgroundColor: index % 2 === 0 ? '#fff' : '#ededed', display: 'flex', justifyContent: 'space-around', alignItems: 'center'}}>
            <Avatar src={JSON.parse(infraction.suspect).thumbnail} sx={{height: '2rem', width: '2rem'}} alt='tozzleboy' />
            <Typography variant='h7' style={{fontFamily: 'Inter, sans-serif', fontWeight: '600', cursor: 'pointer'}} onClick={() => navigate(JSON.parse(infraction.suspect).id + '/')}><u>{JSON.parse(infraction.suspect).name}</u></Typography>
            <Typography variant='h7' style={{fontFamily: 'Inter, sans-serif', fontWeight: '500', width: '60%'}}><b>{infraction.type}</b>: {infraction.reason}</Typography>
            <IconButton onClick={() => removeInfraction(infraction.id)} color='error' alt='Delete'>
            <DeleteForeverIcon />
          </IconButton>
          </div>
        ))}
        {recentInfractions.length === 0 ? <Typography style={{display: 'block', textAlign: 'left', margin: '1rem'}} variant='body'>Nothing to show!</Typography>: <span />}
        <LinearProgress variant="determinate" value={100}/>
      </Card>
      </div>
    </Fade>
    ) : (
      <PlayerPage />
    )}
  </div>
  )
}
}

export default InfractionPage;