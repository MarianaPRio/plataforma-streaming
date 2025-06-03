import React, { useEffect, useState } from 'react';
import { useParams, Link as RouterLink } from 'react-router-dom';
import NavBar from '../components/NavBar';
import BackButton from '../components/BackButton';
import useFetch from '../hooks/useFetch';
import videoService from '../services/videoService';
import playlistService from '../services/playlistService';
import {
  Container,
  Box,
  Paper,
  Typography,
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
      setSnackbarMessage('Falha ao adicionar vídeo.');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    }
  };

  const handleToastClose = () => {
    setSnackbarOpen(false);
  };

  if (loading) {
    return (
      <Container maxWidth="md" sx={{ px: 2, py: 4 }}>
        <NavBar />
        <Typography>Carregando...</Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ px: 2, py: 4 }}>
      <NavBar />

      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          position: 'relative',
          mt: 2,
          mb: 4,
        }}
      >
        <Box sx={{ position: 'absolute', left: 0 }}>
          <BackButton topMargin={0} />
        </Box>
      </Box>

      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 4,
          mb: 4,
        }}
      >
        <Paper elevation={3} sx={{ width: '100%', maxWidth: 960 }}>
          <Box sx={{ position: 'relative', pt: '56.25%' }}>
            <iframe
              width="100%"
              height="100%"
              src={`https://www.youtube.com/embed/${video.youtube_id}`}
              frameBorder="0"
              allowFullScreen
              title={video.title}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
              }}
            />
          </Box>
        </Paper>

        <Paper elevation={1} sx={{ width: '100%', maxWidth: 960, p: 2 }}>
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
                  <ListItemText primary={pl.title} secondary={pl.description} />
                </ListItem>
              ))
            ) : (
              <Typography variant="body2">Nenhuma playlist encontrada.</Typography>
            )}
          </List>
        </Paper>

        <Paper elevation={1} sx={{ width: '100%', maxWidth: 960, p: 2 }}>
          <Typography variant="h6" gutterBottom>
            {video.channel.name}
          </Typography>
          <Typography variant="body2">{video.channel.bio}</Typography>
        </Paper>
      </Box>

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
