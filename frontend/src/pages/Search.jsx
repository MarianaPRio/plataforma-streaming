import React, { useState, useEffect} from 'react';
import { Link as RouterLink, useLocation, useNavigate } from 'react-router-dom';
import videoService from '../services/videoService';
import playlistService from '../services/playlistService';
import NavBar from '../components/NavBar';
import SearchBar from '../components/SearchBar';
import BackButton from '../components/BackButton';
import {
  Container,
  Typography,
  Grid,
  Card,
  CardMedia,
  CardContent,
  CardActions,
  Button,
  Menu,
  MenuItem,
  Snackbar,
  Alert,
  Box
} from '@mui/material';

const Search = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [playlists, setPlaylists] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [hasSearched, setHasSearched] = useState(false);

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');

  const navigate = useNavigate();

  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const initialQuery = params.get('q') || '';

  useEffect(() => {
    playlistService.getPlaylists().then(setPlaylists);
  }, []);

  useEffect(() => {
    if (initialQuery.trim()) {
      setQuery(initialQuery);
      setHasSearched(true);
      videoService.searchVideos(initialQuery)
        .then((videos) => setResults(videos))
        .catch(() => setResults([]));
    }
  }, []);

  const handleSearch = async (e) => {
    e.preventDefault();
    setHasSearched(true);
    try {
      const data = await videoService.searchVideos(query);
      setResults(data);
    } catch {
      setResults([]);
    }
  };

  const openMenu = Boolean(anchorEl);
  const handleMenuOpen = (e, video) => {
    setAnchorEl(e.currentTarget);
    setSelectedVideo(video);
  };
  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedVideo(null);
  };

  const handleAddToPlaylist = async (playlistId) => {
    if (!selectedVideo) return;
    try {
      await playlistService.addVideo(playlistId, selectedVideo.youtube_id);
      setSnackbarMessage('Vídeo adicionado à playlist!');
      setSnackbarSeverity('success');
      setSnackbarOpen(true);
    } catch (err) {
      setSnackbarMessage('Falha ao adicionar vídeo.');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    }
    handleMenuClose();
  };

  const handleToastClose = () => {
    setSnackbarOpen(false);
  };

  return (
    <Container sx={{ mt: 4 }}>
      <NavBar />
      <Box
        sx={{
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          mt: 2,
          mb: 4,
        }}
      >
        <Box sx={{ position: 'absolute', left: 0 }}>
          <BackButton topMargin={0} />
        </Box>
        <Box sx={{ width: '100%', maxWidth: 600 }}>
          <SearchBar
            query={query}
            onChange={(e) => setQuery(e.target.value)}
            onSearch={handleSearch}
          />
        </Box>
      </Box>
      {hasSearched && results.length === 0 && (
        <Typography align="center">Nenhum vídeo encontrado.</Typography>
      )}
      {results.length > 0 && (
        <Grid container spacing={2} justifyContent="center">
          {results.map((video) => (
            <Grid item key={video.youtube_id}>
              <Card sx={{ width: 280, maxWidth: '100%', display: 'flex', flexDirection: 'column' }}>
                <RouterLink to={`/app/video/${video.youtube_id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                  <CardMedia
                    component="img"
                    sx={{ height: 180, objectFit: 'cover' }}
                    image={video.thumbnail_url}
                    alt={video.title}
                  />
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Typography variant="subtitle1" noWrap>
                      {video.title}
                    </Typography>
                  </CardContent>
                </RouterLink>
                <CardActions sx={{ p: 0 }}>
                  <Button
                    size="small"
                    onClick={(e) => handleMenuOpen(e, video)}
                    sx={{
                      width: '100%',
                      textTransform: 'none',
                      fontWeight: 500,
                      justifyContent: 'center',
                      bgcolor: '#305280',
                      color: '#ffffff',
                      '&:hover': {
                        bgcolor: '#005a99'
                      }
                    }}
                  >
                    Adicionar à playlist +
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
      <Menu
        anchorEl={anchorEl}
        open={openMenu}
        onClose={handleMenuClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
        transformOrigin={{ vertical: 'top', horizontal: 'left' }}
        MenuListProps={{
          sx: {
            width: 280,
            maxWidth: '100%'
          }
        }}
      >
        {playlists.length > 0 ? (
          playlists.map((pl) => (
            <MenuItem key={pl.id} onClick={() => handleAddToPlaylist(pl.id)}>
              {pl.title}
            </MenuItem>
          ))
        ) : (
          <MenuItem onClick={() => {
            if (selectedVideo) {
              navigate(`/app/playlist?video=${selectedVideo.youtube_id}`);
            }
          }}>
            Criar nova playlist
          </MenuItem>
        )}
      </Menu>
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

export default Search;
