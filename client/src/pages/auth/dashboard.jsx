import './dashboard.css';
import { Avatar, Card, Typography, LinearProgress, CircularProgress, Box   } from '@mui/material'
import InfractionForm from '../../components/infractionForm';
import axios from 'axios'
import { useState, useEffect } from 'react';
import React from 'react';

function CircularProgressWithLabel(props) {
  return (
    <Box sx={{ position: 'relative', display: 'inline-flex' }}>
      <CircularProgress variant="determinate" {...props} />
      <Box
        sx={{
          top: 0,
          left: 0,
          bottom: 0,
          right: 0,
          position: 'absolute',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Typography variant="caption" component="div" color="text.secondary">
          {`${Math.round(props.value)}%`}
        </Typography>
      </Box>
    </Box>
  );
}

const Dashboard = ({user}) => {
    const [myInfractions, setMyInfractions] = useState(0);

    useEffect(() => {
      const getMyInfractions = () => {
      axios.get(`${window.location.origin}/infractions/all`).then(async (response) => {
        let tempInfractions = 0
        await response.data.forEach((infraction) => {
          if(JSON.parse(infraction.moderator).id === user.discordId) tempInfractions++
        });
        return setMyInfractions(tempInfractions)
      }).catch((err) => console.error(err))
    }

    getMyInfractions();
  }, [user]); //<-- This is the dependency array
    
    return (
      <div style={{paddingTop: '1rem'}}>
        <ul style={{listStyle: 'none', padding: '0', margin: '0', maxWidth: '100vw', textAlign: 'center'}}>
          <Avatar src={`https://cdn.discordapp.com/avatars/${user.discordId}/${user.avatar}`} sx={{width: '10rem', height: '10rem', margin: 'auto'}} alt={user.username} />
          <Typography variant='h5' style={{fontFamily: 'Inter, sans-serif', fontWeight: '400'}}>Greetings,</Typography>
          <Typography variant='h4' style={{fontFamily: 'Inter, sans-serif', fontWeight: '600'}}>{user.username}</Typography>
          <Card style={{width: 'calc(20rem + 4vw)', margin: 'auto', marginTop: '3rem', borderRadius: '1rem'}} variant='elevation'>
            <div style={{padding: '1rem', display: 'flex', justifyContent: 'right', alignItems: 'center'}}>
              <div style={{justifySelf: 'left', float: 'left', marginRight: 'auto'}}>
                <Typography variant='h4' style={{textAlign: 'left', fontFamily: 'Inter, sans-serif', fontWeight: '600'}}>{Math.ceil(myInfractions / 10) * 10 === 0 ? 10 : Math.ceil(myInfractions / 10) * 10 - myInfractions} Infractions</Typography>
                <Typography variant='h6' style={{textAlign: 'left', fontFamily: 'Inter, sans-serif', fontWeight: '400'}}>To reach {Math.ceil(myInfractions / 10) * 10 === 0 ? 10 : Math.ceil(myInfractions / 10) * 10} infractions</Typography>
              </div>
              <CircularProgressWithLabel  style={{marginLeft: 'auto', float: 'right'}} variant="determinate" value={(myInfractions - Math.floor(myInfractions / 10) * 10) / (Math.ceil(myInfractions / 10) * 10 - Math.floor(myInfractions / 10) * 10) * 100 || 0} />
            </div>
            <LinearProgress variant='determinate' value={(myInfractions - Math.floor(myInfractions / 10) * 10) / (Math.ceil(myInfractions / 10) * 10 - Math.floor(myInfractions / 10) * 10) * 100 || 0}/>
          </Card>
          <Card style={{width: 'calc(20rem + 4vw)', margin: 'auto', marginTop: '3rem', borderRadius: '1rem'}} variant='elevation'>
            <div style={{padding: '1rem', display: 'flex', justifyContent: 'right', alignItems: 'center'}}>
              <div style={{justifySelf: 'left', float: 'left', marginRight: 'auto'}}>
                <Typography variant='h4' style={{textAlign: 'left', fontFamily: 'Inter, sans-serif', fontWeight: '600'}}>{myInfractions} Infractions</Typography>
                <Typography variant='h6' style={{textAlign: 'left', fontFamily: 'Inter, sans-serif', fontWeight: '400'}}>Given all time</Typography>
              </div>
            </div>
            <LinearProgress variant='determinate' />
          </Card>

          <Card style={{width: 'calc(20rem + 4vw)', margin: 'auto', marginTop: '5rem', borderRadius: '1rem', marginBottom: '10rem'}} variant='elevation'>
            <div style={{padding: '1rem', display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
            <ul style={{listStyle: 'none', padding: '0', margin: '0', marginLeft: '.5rem', width: '100%'}}>
            <Typography variant='h4' style={{textAlign: 'center', fontFamily: 'Inter, sans-serif', fontWeight: '600'}}>Quick Infract</Typography>
            <div style={{marginTop: '2rem'}}>
            <InfractionForm />
            </div>
            </ul>
            </div>
          </Card>
        </ul>
      </div>  
    )
}

export default Dashboard;