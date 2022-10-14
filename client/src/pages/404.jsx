import './404.css';
import { Typography, Button } from '@mui/material'
import { useNavigate } from 'react-router-dom';
import HomeIcon from '@mui/icons-material/Home';

const PageNotFound = () => {
    window.history.replaceState(null, "Page not found!", "/404")
    const navigate = useNavigate();
    return (
      <div style={{width: '100vw', height: '100vh', display: 'flex', padding: '0', margin: '0', justifyContent: 'center', alignItems: 'center'}}>
        <ul style={{padding: '0', listStyle: 'none'}}>
        <Typography variant='h1' style={{width: '100%', textAlign: 'center', fontFamily: 'Inter, sans-serif'}}><b>404</b></Typography>
        <Typography variant='h3' style={{width: '100%', textAlign: 'center', fontFamily: 'Inter, sans-serif'}}>Page not found.</Typography>
        <Button size='large' style={{width: '100%'}} onClick={() => navigate('/home')} startIcon={<HomeIcon />}>Home</Button>
        </ul>
      </div>  
    )
}

export default PageNotFound;