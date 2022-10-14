import {
    BrowserRouter,
    Routes,
    Route,
} from "react-router-dom";
import * as React from 'react';
import Home from './pages/home';
import { Navigate } from 'react-router-dom';
import PageNotFound from "./pages/404";
import User from "./pages/user";
import Dashboard from "./pages/auth/dashboard";
import BottomNav from "./components/bottomNavigation";
import InfractionPage from "./pages/auth/infractions";
import Bans from "./pages/auth/bans";
import { useState } from "react";
import { LinearProgress } from "@mui/material";


function App() {
  
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true)

  React.useEffect(() => {
    const getUser = () => {
      fetch(`${window.location.origin}/auth/login/success`, {
        method: 'GET',
        credentials: 'include',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          'Access-Control-Allow-Credentials': true
        },
      }).then((response) => {
        if(response.status === 200) return response.json();
        throw new Error('Authentication failed.')
      }).then((resObject) => {
        if(resObject.message === 'Not logged in') {
          setLoading(false)
        } else {setUser({...resObject.user}); setLoading(false)}
      }).catch((err) => {
        console.error(err)
      })
    };
    getUser()
  },[])

  const Authpage = ({element}) => {
    return (
      user ? (
        user.moderator ? ( 
        <div>
        {element}
        <BottomNav />
      </div>
      ) : (<Navigate to='/' />)
      ) : loading ? (<LinearProgress />) : window.open(`${window.location.origin}/auth/discord`, "_self")
    )
  }

    return (
        <BrowserRouter>
          <Routes>
              <Route path="/" element={<Home user={user}/>} />
              <Route path="home" element={<Navigate to="/" />} />
              <Route path="dashboard" element={<Authpage element={<Dashboard user={user}/>} />} />
              <Route path="dashboard/infractions/*" element={<Authpage element={<InfractionPage />} />} />
              <Route path="dashboard/bans" element={<Authpage element={<Bans />} />} />
              <Route path="user/:id" element={<User />} />
              <Route path="*" element={<PageNotFound />} />
          </Routes>
    </BrowserRouter>
    )
}

export default App;