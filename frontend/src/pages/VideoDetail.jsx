import { useParams } from 'react-router-dom';
import { Link as RouterLink, useLocation } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import useFetch from '../hooks/useFetch';
import videoService from '../services/videoService';
import playlistService from '../services/playlistService';
import NavBar from '../components/NavBar';
import {
  Container,
  Typography,
  Paper,
  Box,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Snackbar,
  Alert,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';

const VideoDetail = () => {
  
  const { id } = useParams();
  const { data: video, loading } = useFetch(videoService.getVideo, id);
  const [playlists, setPlaylists] = useState([]);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');

  useEffect(() => {
    playlistService.getPlaylists().then(setPlaylists);
  }, []);

  const handleAddToPlaylist = async (playlistId) => {
    try {
      await playlistService.addVideo(playlistId, id);
      setSnackbarMessage('Vídeo adicionado à playlist!');
      setSnackbarSeverity('success');
      setSnackbarOpen(true);
    } catch (err) {
      console.error('Erro ao adicionar vídeo à playlist:', err);
      setSnackbarMessage('Falha ao adicionar vídeo.');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    }
  };

  const handleToastClose = () => {
    setSnackbarOpen(false);
  };
  
  if (loading) return <Typography>Carregando...</Typography>;

  return (
    <Container sx={{ mt: 4 }}>
      <NavBar />
      <Paper elevation={3} sx={{ p: 2, mb: 4 }}>
        <iframe
          width="100%"
          height="480"
          src={`https://www.youtube.com/embed/${video.youtube_id}`}
          frameBorder="0"
          allowFullScreen
          title={video.title}
        />
      </Paper>
      <Paper elevation={1} sx={{ mt: 4, p: 2 }}>
        <Typography variant="h6" gutterBottom>
      Adicionar à Playlist
    </Typography>
    <List>
      {playlists.length > 0 ? (
        playlists.map((pl) => (
          <ListItem
            key={pl.id}
            secondaryAction={
              <IconButton
                edge="end"
                aria-label="add"
                onClick={() => handleAddToPlaylist(pl.id)}
              >
                <AddIcon />
              </IconButton>
            }
          >
            <ListItemText
              primary={pl.title}
              secondary={pl.description}
            />
          </ListItem>
        ))
      ) : (
        <Typography variant="body2">Nenhuma playlist encontrada.</Typography>
      )}
    </List>
      </Paper>

      <Paper elevation={1} sx={{ mt: 4, p: 2 }}>
        <Typography variant="h6" gutterBottom>
          {video.channel.name}
        </Typography>
        <Typography variant="body2">
          {video.channel.bio}
        </Typography>
      </Paper>
      <Snackbar
              open={snackbarOpen}
              autoHideDuration={3000}
              onClose={handleToastClose}
              anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
              <Alert
                onClose={handleToastClose}
                severity={snackbarSeverity}
                sx={{ width: '100%' }}
              >
                {snackbarMessage}
              </Alert>
            </Snackbar>
    </Container>
  );
};

export default VideoDetail;