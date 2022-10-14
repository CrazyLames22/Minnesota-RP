import { BottomNavigation, BottomNavigationAction } from '@mui/material'
import MapsHomeWorkIcon from '@mui/icons-material/MapsHomeWork';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import WarningIcon from '@mui/icons-material/Warning';
import { useNavigate } from 'react-router-dom';
import React from 'react'

const BottomNav = () => {
    const [value, setValue] = React.useState(window.location.pathname === '/dashboard' ? 'dashboard' : window.location.pathname === '/dashboard/bans' ? 'dashboard/bans' : window.location.pathname.startsWith('/dashboard/infractions') ? 'dashboard/infractions' : 'dashboard');
    const navigate = useNavigate();

    const handleChange = (event, newValue) => {
      setValue(newValue);
      if(newValue === 'dashboard/infractions') {
        if(!window.location.pathname.split('/')[3]) {
          navigate(`/${newValue}`)
        }
      } else navigate(`/${newValue}`)
    };

    return (
      <BottomNavigation sx={{ width: '100%', position: 'fixed', bottom: '0'}} value={value} showLabels onChange={handleChange}>
        <BottomNavigationAction
          label="Bans"
          value="dashboard/bans"
          icon={<RemoveCircleOutlineIcon />}
        />
        <BottomNavigationAction
          label="Dashboard"
          value="dashboard"
          icon={<MapsHomeWorkIcon />}
        />
        <BottomNavigationAction
          label="Infractions"
          value="dashboard/infractions"
          icon={<WarningIcon />}
        />
      </BottomNavigation>
    );
}

export default BottomNav;