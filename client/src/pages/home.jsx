import './home.css';
import { Card, Typography, Divider, LinearProgress, TextField, Button, CardActionArea, IconButton, Grow, Fade } from '@mui/material'
import PolicyIcon from '@mui/icons-material/Policy';
import LoginIcon from '@mui/icons-material/Login';
import LogoutIcon from '@mui/icons-material/Logout';
import CloseIcon from '@mui/icons-material/Close';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import GavelIcon from '@mui/icons-material/Gavel';
import { useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';


const Home = ({user}) => {
  const navigate = useNavigate();
  const [loading, setLoading ] = useState(false);
    const [loginOpen, setLoginOpen ] = useState(false);
    const [widget, setWidget ] = useState(false);
    const [widgetId, setWidgetId ] = useState('false');
    const handleOpen = () => setLoginOpen(true);
    const handleClose = () => setLoginOpen(false);

    const [username, setUsername] = useState('');
    const [usernameError, setUsernameError] = useState(false);

    const Discord = () => {
      window.open(`${window.location.origin}/auth/discord`, "_self")
    }

    useEffect(() => {
      const getWidget = () => {
      axios.get(`${window.location.origin}/public/widget/`).then(async (response) => {
        if(response.data.status === true) {
          setWidget(true)
          setWidgetId(...response.data.id)
        }
      }).catch((err) => console.error(err))
    }

    getWidget();
  }, []); //<-- This is the dependency array

    const LoginPanel = () => {
      if(!user) {
        return (
          <Button onClick={() => Discord()} fullWidth variant='text' startIcon={<LoginIcon />}>Login</Button>
        )
      } else {
        return (
          <div>
          <Button onClick={() => window.open(`${window.location.origin}/auth/logout`, "_self")} fullWidth variant='text' startIcon={<LogoutIcon />}>Logout</Button>
          <Button onClick={() => navigate('/dashboard')} style={{marginTop: '.5rem'}} disabled={!user.moderator} fullWidth variant='outlined'startIcon={<GavelIcon />}>Open Panel</Button>
          </div>
        )
      }
    }

    const getUser = async () => {
      if(loading) return;
      await setLoading(true);
      if(username !== '') {
      setUsernameError(false)
      axios.get(`${window.location.origin}/public/users/get?user=${username}`).then(async (response) => {
        let data = response.data;
        setLoading(false)
        navigate(`/user/${data.id}`)
      }).catch((error) => {console.error(error); setUsernameError('User does not exist.'); setLoading(false)})
      } else {
        setLoading(false)
        setUsernameError('This cannot be blank!')
      }
    }
    
    return (
      <div style={{width: '100vw', height: '100vh', display: 'flex', padding: '0', margin: '0', justifyContent: 'center', alignItems: 'center'}}>
        <Card style={{borderRadius: '1rem'}} variant='elevation'>
          <CardActionArea>
            <div style={{padding: '1rem 2rem'}}>
              <Typography variant='h4' style={{fontFamily: 'Inter, sans-serif', fontWeight: '700', width: '100%', textAlign: 'center'}}>Australian RP</Typography>
              <Typography variant='h6' style={{fontFamily: 'Inter, sans-serif', fontWeight: '500', width: '100%', textAlign: 'center'}}>Infraction Database</Typography>
            </div>
          </CardActionArea>
          <Divider />
          <div style={{padding: '1rem 1rem'}}>
          <TextField error={usernameError ? true : false} helperText={usernameError ? usernameError : ''} value={username} onChange={(e) => setUsername(e.target.value)}  fullWidth variant='outlined' size='small' label='Username' />
          <Button onClick={getUser} style={{marginTop: '.5rem'}} variant='outlined' startIcon={<PolicyIcon />} fullWidth>Query Database</Button>
          </div>
          <LinearProgress variant={loading ? 'indeterminate' : 'determinate'} value='100'/>
        </Card>
        <div style={{position: 'fixed', bottom: 0, right: 0, margin: '1rem', display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
        <Grow in={loginOpen} timeout={250}>
          <Card style={{borderRadius: '1rem', minWidth: '15rem'}} variant='elevation'>
          <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
            <ul style={{listStyle: 'none', padding: '0', margin: '0', width: '100%'}}>
            <div style={{padding: '.5rem 1rem', width: '90%', display: 'flex', alignItems: 'center', justifyContent: 'left'}}>
            <Typography style={{display: 'inline', fontFamily: 'Inter, sans-serif', fontWeight: '700'}} variant='h6'>Moderation Panel</Typography>
            <IconButton style={{display: 'inline', padding: '0', marginLeft: 'auto', float: 'right'}} onClick={handleClose} color='primary' aria-label="Close">
            <CloseIcon />
            </IconButton>
            </div>
            <Divider />
            <div style={{padding: '.5rem 1rem'}}>
              <LoginPanel />
            </div>
            </ul>
          </div>
          </Card>
        </Grow>
        </div>
        <div style={{position: 'fixed', bottom: 0, right: 0, margin: '1rem', display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
        <Fade in={loginOpen === false ? true : false}>
          <IconButton style={{marginTop: 'auto'}} onClick={handleOpen} color='primary' aria-label="Login/Logout">
            <AdminPanelSettingsIcon />
          </IconButton>
        </Fade>
        </div>
        <div id='discordIframeHolder'>
        <Fade in={widget}>
          <iframe title='Discord Advert' style={{height: '100%', width: '100%'}} src={`https://discord.com/widget?id=${widgetId}&theme=light`} allowtransparency="true" frameborder="0" sandbox="allow-popups allow-popups-to-escape-sandbox allow-same-origin allow-scripts"></iframe>
        </Fade>
        </div>
      </div>  
    )
}

export default Home;