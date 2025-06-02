import React from 'react';
import { AppBar, Toolbar, IconButton, Typography, Box } from '@mui/material';
// import HomeIcon from '@mui/icons-material/Home';
import LogoutIcon from '@mui/icons-material/Logout';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import YouTubeIcon from '@mui/icons-material/YouTube';

const NavBar = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleHomeClick = () => {
    navigate('/app/dashboard');
  };

  const handleLogoutClick = () => {
    logout();
    navigate('/login', { replace: true });
  };

  return (
    <>
      <AppBar position="fixed" color="primary" elevation={1}>
        <Toolbar sx={{ justifyContent: 'space-between' }}>

          <IconButton edge="start" color="inherit" onClick={handleHomeClick}>
            <YouTubeIcon fontSize="large" />
          </IconButton>

          <Typography onClick={handleHomeClick} variant="h6" component="div" sx={{ flexGrow: 1, textAlign: 'center', fontFamily: 'Noto Serif, sans-serif', fontSize: '27px'}}>
            YouList
          </Typography>

          <IconButton edge="end" color="inherit" onClick={handleLogoutClick}>
            <LogoutIcon fontSize="large" />
          </IconButton>
        </Toolbar>
      </AppBar>
      <Toolbar />
    </>
  );
};

export default NavBar;
