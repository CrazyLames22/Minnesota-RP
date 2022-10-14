import './user.css';
import { Card, Typography, Divider, Avatar, Button } from '@mui/material'
import React from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import PolicyIcon from '@mui/icons-material/Policy';

const User = () => {
    const navigate = useNavigate()
    const [thumbnail, setThumbnail] = React.useState();
    const [username, setUsername] = React.useState();
    const [infractions, setInfractions] = React.useState([]);
    const user = window.location.pathname.split('/')[2]

    axios.get(`${window.location.origin}/public/users/get?plrid=${user}`).then(async (response) => {
      let data = response.data;
      setUsername(data.username)
      setThumbnail(data.thumbnail)
      setInfractions([...data.infractions])
  }).catch((error) => {console.error(error);})
    
    return (
      <div style={{width: '100vw', height: '100vh', display: 'flex', padding: '0', margin: '0', justifyContent: 'center', alignItems: 'center'}}>
        <ul style={{listStyle: 'none', padding: '0', margin: '0', width: '100%', height: '100%'}}>
        <div style={{margin: '2rem'}}>
        <Typography variant='h3' style={{fontFamily: 'Inter, sans-serif', fontWeight: '600', textAlign: 'center'}}>Australian RP</Typography>
        <Typography variant='h5' style={{fontFamily: 'Inter, sans-serif', fontWeight: '600', textAlign: 'center'}}>Infraction Database</Typography>
        </div>
        <Card style={{borderRadius: '1rem', width: '75%', height: '75%', margin: 'auto', overflow: 'auto'}} variant='elevation'>
            <div style={{padding: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'left'}}>
                <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                    <Avatar src={thumbnail} sx={{height: '3rem', width: '3rem'}} alt='tozzleboy' />
                    <ul style={{listStyle: 'none', padding: '0', margin: '0', marginLeft: '.5rem'}}>
                        <Typography variant='h6' style={{fontFamily: 'Inter, sans-serif', fontWeight: '600'}}>{username}</Typography>
                        <Typography variant='h7' style={{fontFamily: 'Inter, sans-serif', fontWeight: '500'}}>{infractions.length || 0} Infractions</Typography>
                    </ul>
                </div>
                <Button startIcon={<PolicyIcon />} id='mobileHide' style={{marginLeft: 'auto', float: 'right'}} onClick={() => navigate('/')}>Back</Button>
            </div>
            <Divider />
            <div id='mobileHide2'>
            {infractions.map((infraction, index) => (
              <div style={{width: '100%', padding: '.8rem .4rem', backgroundColor: index % 2 === 0 ? '#fff' : '#ededed', display: 'flex', justifyContent: 'end', alignItems: 'center'}}>
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
              </div>
            ))}
            </div>
            <div id='mobileShow2'>
            {infractions.map((infraction, index) => (
              <div style={{minWidth: '270%', padding: '.8rem .4rem', backgroundColor: index % 2 === 0 ? '#fff' : '#ededed', display: 'flex', justifyContent: 'end', alignItems: 'center'}}>
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
              </div>
            ))}
            </div>
            {infractions.length === 0 ? (<div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%', height: '90%'}}><Typography variant='h6'>No incidents recorded.</Typography></div>) : (<span />)}
        </Card>
        </ul>
      </div>
    )
}

export default User;