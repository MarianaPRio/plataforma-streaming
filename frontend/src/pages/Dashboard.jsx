import React, { useEffect, useState } from 'react';
import playlistService from '../services/playlistService';
import NavBar from '../components/NavBar';
import {
  Container,
  Typography,
  Button,
  List,
  ListItem,
  ListItemText,
  Box,
  Paper,
  IconButton,
  ListItemButton
} from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import EditIcon from '@mui/icons-material/Edit';

const Dashboard = () => {
  const [playlists, setPlaylists] = useState([]);

  useEffect(() => {
    playlistService.getPlaylists().then(setPlaylists);
  }, []);

  return (
    <Container sx={{ mt: 4 }}>
      <NavBar />

      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
        <Typography variant="h5">Suas Playlists</Typography>
        <Box>
          <Button
            variant="outlined"
            component={RouterLink}
            to="/app/search"
            sx={{ mr: 1 }}
          >
            Buscar Vídeo
          </Button>
          <Button
            variant="contained"
            component={RouterLink}
            to="/app/playlist"
          >
            Nova Playlist
          </Button>
        </Box>
      </Box>

      {playlists.length === 0 ? (
        <Paper sx={{ p: 4, textAlign: 'center', mt: 2 }} elevation={2}>
          <Typography variant="h6" gutterBottom>
            Você ainda não tem playlists
          </Typography>
          <Typography variant="body1" gutterBottom>
            Crie sua primeira playlist para adicionar vídeos depois!
          </Typography>
          <Button
            variant="contained"
            component={RouterLink}
            to="/app/playlist"
          >
            Criar Playlist
          </Button>
        </Paper>
      ) : (
        <Paper
          sx={{
            width: '100%',
            maxWidth: 600,
            mx: 'auto',
            p: 2,
            mb: 4,
            bgcolor: 'background.paper',
            boxShadow: 3,
            borderRadius: 2,
          }}
          elevation={3}
        >
          <List>
            {playlists.map((pl) => (
              <ListItem
                key={pl.id.toString()}
                disablePadding
                sx={{
                  mb: 1,
                  borderRadius: 1,
                  bgcolor: 'background.default',
                  boxShadow: 1,
                }}
                secondaryAction={
                  <IconButton
                    edge="end"
                    aria-label="editar playlist"
                    component={RouterLink}
                    to={`/app/playlist/${pl.id}`}
                  >
                    <EditIcon />
                  </IconButton>
                }
              >
                <ListItemButton
                  component={RouterLink}
                  to={`/app/player/${pl.id}`}
                  sx={{ width: '100%' }}
                >
                  <ListItemText
                    primary={pl.title}
                    secondary={pl.description}
                  />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </Paper>
      )}
    </Container>
  );
};

export default Dashboard;
