import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { CircularProgress, Box } from '@mui/material';

import Dashboard from '../pages/Dashboard';
import Search from '../pages/Search';
import VideoDetail from '../pages/VideoDetail';
import Playlist from '../pages/Playlist';
import Player from '../pages/Player';
import { useAuth } from '../hooks/useAuth';

const PrivateRoutes = () => {
  const { isAuthenticated, loading } = useAuth();
  if (loading) {
    return (
      <Box
        sx={{
          height: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <Routes>
      <Route path="/" element={<Navigate to="dashboard" replace />} />
      <Route path="dashboard" element={<Dashboard />} />
      <Route path="search" element={<Search />} />
      <Route path="video/:id" element={<VideoDetail />} />
      <Route path="playlist/:id?" element={<Playlist />} />
      <Route path="player/:id" element={<Player />} />
      <Route path="*" element={<Navigate to="dashboard" replace />} />
    </Routes>
  );
};

export default PrivateRoutes;