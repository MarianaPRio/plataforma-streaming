import React, { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { Link as RouterLink } from 'react-router-dom';
import NavBar from '../components/NavBar';
import BackButton from '../components/BackButton';
import {
  Container,
  Box,
  Paper,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Button,
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
      <Container maxWidth="md" sx={{ px: 2, py: 2, minHeight: '100vh' }}>
        <NavBar />

        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
            mt: 2,
            mb: 4,
          }}
        >
          <Box sx={{ position: 'absolute', left: 0 }}>
            <BackButton topMargin={0} />
          </Box>

          <Button
            variant="contained"
            component={RouterLink}
            to="/app/search?q="
          >
            Adicione seu primeiro vídeo
          </Button>
        </Box>

        <Typography variant="h6" sx={{ textAlign: 'center', mt: 4 }}>
          Nenhum vídeo nesta playlist.
        </Typography>
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
      console.error(err);
    }
  };

  return (
    <Container maxWidth="md" sx={{ px: 2, py: 2 }}>
      <NavBar />

      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          mt: 2,
          mb: 4,
        }}
      >
        <Box sx={{ position: 'absolute', left: 0 }}>
          <BackButton topMargin={0} />
        </Box>

        <Button
          variant="contained"
          component={RouterLink}
          to={`/app/search?q=`}
        >
          Adicionar mais vídeos +
        </Button>
      </Box>

      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Paper
          elevation={3}
          sx={{ width: '100%', maxWidth: 960, mb: 4 }}
        >
          <Box sx={{ position: 'relative', pt: '56.25%' }}>
            <iframe
              ref={iframeRef}
              width="100%"
              height="100%"
              src={
                currentVideo
                  ? `https://www.youtube.com/embed/${currentVideo.youtubeId}`
                  : ''
              }
              frameBorder="0"
              allow="autoplay; encrypted-media"
              allowFullScreen
              title={currentVideo.title || currentVideo.youtubeId}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
              }}
            />
          </Box>

          <Typography
            variant="h5"
            sx={{ mt: 2, mb: 1, textAlign: 'center' }}
          >
            {currentVideo.title || currentVideo.youtubeId}
          </Typography>

          <Box sx={{ textAlign: 'center', mb: 2 }}>
            <Button
              variant="outlined"
              color="error"
              onClick={handleRemoveCurrent}
            >
              Remover este vídeo
            </Button>
          </Box>
        </Paper>

        {nextVideos.length > 0 && (
          <Paper
            elevation={2}
            sx={{ width: '100%', maxWidth: 960, mb: 4, p: 2 }}
          >
            <Typography
              variant="h6"
              sx={{ textAlign: 'center', mb: 2 }}
            >
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
                    py: 1.5,
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
                            if (
                              videos.findIndex((x) => x.id === v.id) <
                              currentIndex
                            ) {
                              setCurrentIndex(currentIndex - 1);
                            }
                          })
                          .catch((err) => console.error(err));
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
      </Box>
    </Container>
  );
};

export default Player;
