import React from 'react';
import { Box, IconButton } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useNavigate } from 'react-router-dom';

const BackButton = ({ topMargin = 2 }) => {
  const navigate = useNavigate();

  const handleBackClick = () => {
    navigate(-1);
  };

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        mt: topMargin,
      }}
    >
      <IconButton onClick={handleBackClick} color="primary">
        <ArrowBackIcon fontSize="large" />
      </IconButton>
    </Box>
  );
};

export default BackButton;
