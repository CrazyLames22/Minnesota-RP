import './dashboard.css';
import { Card, Typography, LinearProgress, Grid, IconButton, Divider, Avatar, Button  } from '@mui/material'
import GavelIcon from '@mui/icons-material/Gavel';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import axios from 'axios'


const Bans = () => {

    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [bolos, setBolos] = useState([]);
    const [bans, setBans] = useState([]);
    axios.defaults.withCredentials = true

    const removeInfraction = (id) => {
        if (!loading) {
            setLoading(true)
            axios.get(`${window.location.origin}/infractions/delete?id=${id}`).then(async (response) => {
                  window.location.reload(false);
            })
        }
    }

    const markBan = (id) => {
        if (!loading) {
            setLoading(true)
            axios.get(`${window.location.origin}/infractions/edit/ban?id=${id}`).then(async (response) => {
                  window.location.reload(false);
            })
        }
    }

    useEffect(() => {
        const getBans = () => {
        axios.get(`${window.location.origin}/infractions/all`).then(async (response) => {
            let tempBans = []
            let tempBolos = []
            await response.data.forEach((infraction) => {
            if(infraction.type === "Ban") {tempBans.push(infraction)}
            if(infraction.type === 'Ban Bolo') {tempBolos.push(infraction)}
            });
            await setBans([...tempBans]);
            return setBolos([...tempBolos]); 
        }).catch((err) => console.error(err))
      }
  
      getBans();
    }, []); //<-- This is the dependency array

    return (
    <div style={{width: '100vw', height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
        <Grid container spacing={5} style={{justifyContent: 'center', width: '75%'}}>
            <Grid item xs={12} md={3}>
                <Card variant='elevation' style={{borderRadius: '1rem', width: '100%', maxHeight: '20rem', overflow: 'auto'}}>
                    <div style={{padding: '1rem'}}>
                        <Typography variant='h6' style={{marginBottom: '.5rem', display: 'block', textAlign: 'center', fontFamily: 'Inter, sans-serif', fontWeight: '600'}}>Ban Bolo's</Typography>
                    </div>
                    <Divider />
                    {bolos.map((infraction, index) => (
                    <div key={index} id={`recentInfract-${index}`} style={{width: '100%', backgroundColor: index % 2 === 0 ? '#fff' : '#ededed', display: 'flex', justifyContent: 'space-around', alignItems: 'center'}}>
                        <div style={{display: 'flex', justifyContent: 'left', alignItems: 'center'}}>
                        <Avatar src={JSON.parse(infraction.suspect).thumbnail} sx={{height: '2rem', width: '2rem'}} alt='tozzleboy' />
                        <Typography variant='h7' style={{fontFamily: 'Inter, sans-serif', fontWeight: '600', cursor: 'pointer', marginLeft: '.5rem'}} onClick={() => window.location.pathname = `dashboard/infractions/${JSON.parse(infraction.suspect).id}`}><u>{JSON.parse(infraction.suspect).name}</u></Typography>
                        </div>
                        <Typography variant='h7' style={{fontFamily: 'Inter, sans-serif', fontWeight: '500', marginLeft: '1rem'}}><b>{infraction.type}</b>: {infraction.reason}</Typography>
                        <div>
                        <Button onClick={() => markBan(infraction.id)} startIcon={<GavelIcon />} color='success'>Ban</Button>
                        <IconButton style={{marginLeft: '.5rem'}} onClick={() => removeInfraction(infraction.id)} color='error' alt='Delete'>
                            <DeleteForeverIcon />
                        </IconButton>
                        </div>
                    </div>
                    ))}
                    {bolos.length === 0 ? <Typography variant='body' style={{margin: '.5rem', display: 'block', textAlign: 'center', fontFamily: 'Inter, sans-serif'}}>Nothing to show.</Typography> : <span /> }
                    <LinearProgress variant={loading ? 'indeterminate' : 'determinate'} value={100}/>
                </Card>
            </Grid>
            <Grid item xs={12} md={3}>
                <Card variant='elevation' style={{borderRadius: '1rem', width: '100%', maxHeight: '20rem', overflow: 'auto'}}>
                    <div style={{padding: '1rem'}}>
                        <Typography variant='h6' style={{marginBottom: '.5rem', display: 'block', textAlign: 'center', fontFamily: 'Inter, sans-serif', fontWeight: '600'}}>Active Bans</Typography>
                    </div>
                    <Divider />
                    {bans.map((infraction, index) => (
                    <div key={index} id={`recentInfract-${index}`} style={{width: '100%', backgroundColor: index % 2 === 0 ? '#fff' : '#ededed', display: 'flex', justifyContent: 'space-around', alignItems: 'center'}}>
                        <div style={{display: 'flex', justifyContent: 'left', alignItems: 'center'}}>
                        <Avatar src={JSON.parse(infraction.suspect).thumbnail} sx={{height: '2rem', width: '2rem'}} alt='tozzleboy' />
                        <Typography variant='h7' style={{fontFamily: 'Inter, sans-serif', fontWeight: '600', cursor: 'pointer', marginLeft: '.5rem'}} onClick={() => navigate(`/dashboard/infractions/${JSON.parse(infraction.suspect).id}`)}><u>{JSON.parse(infraction.suspect).name}</u></Typography>
                        </div>
                        <Typography variant='h7' style={{fontFamily: 'Inter, sans-serif', fontWeight: '500', marginLeft: '1rem'}}><b>{infraction.type}</b>: {infraction.reason}</Typography>
                        <Button startIcon={<DeleteForeverIcon />} color='warning' onClick={() => removeInfraction(infraction.id)}>Unban</Button>
                    </div>
                    ))}
                    {bans.length === 0 ? <Typography variant='body' style={{margin: '.5rem', display: 'block', textAlign: 'center', fontFamily: 'Inter, sans-serif'}}>Nothing to show.</Typography> : <span /> }
                    <LinearProgress variant={loading ? 'indeterminate' : 'determinate'} value={100}/>
                </Card>
            </Grid>
        </Grid>
    </div>  
    )
}

export default Bans;