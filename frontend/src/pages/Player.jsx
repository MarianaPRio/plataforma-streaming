import React, { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { Link as RouterLink } from 'react-router-dom';
import NavBar from '../components/NavBar';
import {
  Container,
  Paper,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Button,
  Box,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import playlistService from '../services/playlistService';

const Player = () => {
  const { id } = useParams();
  const [videos, setVideos] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const iframeRef = useRef(null);

  useEffect(() => {
    setCurrentIndex(0);
    playlistService
      .getVideosFromPlaylist(id)
      .then((videosDaApi) => {
        setVideos(videosDaApi || []);
      })
      .catch(() => {
        setVideos([]);
      });
  }, [id]);

  useEffect(() => {
    if (iframeRef.current && videos.length > 0) {
      const currentVideo = videos[currentIndex];
      iframeRef.current.src = `https://www.youtube.com/embed/${currentVideo.youtubeId}`;
    }
  }, [videos, currentIndex]);

  if (videos.length === 0) {
    return (
      <Container
        maxWidth="sm"
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
          px: 2,
        }}
      >
        <NavBar />
        <Typography variant="h6" sx={{ mb: 2 }}>
          Nenhum vídeo nesta playlist.
        </Typography>
        <Button variant="contained" component={RouterLink} to="/app/search?q=">
          Adicione seu primeiro vídeo
        </Button>
      </Container>
    );
  }

  const currentVideo = videos[currentIndex];
  const nextVideos = videos.slice(currentIndex + 1);

  const handleSelect = (indexNaNext) => {
    setCurrentIndex(indexNaNext + 1);
  };

  const handleRemoveCurrent = async () => {
    try {
      await playlistService.removeVideo(id, currentVideo.id);
      const novaLista = videos.filter((v) => v.id !== currentVideo.id);

      if (novaLista.length > 0) {
        setVideos(novaLista);
        setCurrentIndex(0);
      } else {
        setVideos([]);
        setCurrentIndex(0);
      }
    } catch (err) {
      console.error('Erro ao remover vídeo atual:', err);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 4, mb: 4 }}>
      <NavBar />
      <Box sx={{ textAlign: 'center', mb: 3 }}>
        <Button variant="contained" component={RouterLink} to={`/app/search?q=`}>
          Adicionar mais vídeos +
        </Button>
      </Box>
      <Paper elevation={3} sx={{ p: 2, mb: 4, mx: 'auto', maxWidth: 800 }}>
        <iframe
          ref={iframeRef}
          width="100%"
          height="450"
          src={
            currentVideo
              ? `https://www.youtube.com/embed/${currentVideo.youtubeId}`
              : ''
          }
          frameBorder="0"
          allow="autoplay; encrypted-media"
          allowFullScreen
          title={currentVideo.title || currentVideo.youtubeId}
        />
        <Typography variant="h6" sx={{ mt: 2, textAlign: 'center' }}>
          {currentVideo.title || currentVideo.youtubeId}
        </Typography>
        <Box sx={{ textAlign: 'center', mt: 2 }}>
          <Button variant="outlined" color="error" onClick={handleRemoveCurrent}>
            Remover este vídeo
          </Button>
        </Box>
      </Paper>
      {nextVideos.length > 0 && (
        <Paper elevation={2} sx={{ p: 2, mx: 'auto', maxWidth: 800 }}>
          <Typography variant="subtitle1" gutterBottom sx={{ textAlign: 'center' }}>
            Próximos vídeos
          </Typography>
          <List>
            {nextVideos.map((v, idx) => (
              <ListItem
                key={v.id}
                button
                onClick={() => handleSelect(idx)}
                sx={{
                  borderBottom: '1px solid rgba(0,0,0,0.12)',
                  '&:last-of-type': { borderBottom: 'none' },
                }}
              >
                <ListItemText primary={v.title || v.youtubeId} />
                <ListItemSecondaryAction>
                  <IconButton
                    edge="end"
                    aria-label="deletar"
                    onClick={() => {
                      playlistService
                        .removeVideo(id, v.id)
                        .then(() => {
                          const filtrada = videos.filter((x) => x.id !== v.id);
                          setVideos(filtrada);
                          if (videos.findIndex((x) => x.id === v.id) < currentIndex) {
                            setCurrentIndex(currentIndex - 1);
                          }
                        })
                        .catch((err) => console.error('Erro ao remover vídeo:', err));
                    }}
                  >
                    <DeleteIcon />
                  </IconButton>
                </ListItemSecondaryAction>
              </ListItem>
            ))}
          </List>
        </Paper>
      )}
    </Container>
  );
};

export default Player;
