import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import playlistService from '../services/playlistService';
import {
  Container,
  TextField,
  Button,
  Paper,
  Typography,
  Box
} from '@mui/material';

const Playlist = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({ title: '', description: '' });

  useEffect(() => {
    if (id) {
      playlistService.getPlaylists().then((list) => {
        const pl = list.find((p) => p.id === id);
        if (pl) setForm({ title: pl.title, description: pl.description });
      });
    }
  }, [id]);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (id) await playlistService.updatePlaylist(id, form);
    else await playlistService.createPlaylist(form);
    navigate('/app/dashboard', { replace: true });
  };

  const handleDelete = async () => {
    const confirmed = window.confirm('Tem certeza que deseja excluir esta playlist?');
    if (!confirmed) return;

    try {
      await playlistService.deletePlaylist(id);
      navigate('/app/dashboard', { replace: true });
    } catch (error) {
      console.error('Erro ao excluir playlist:', error);
      alert('Houve um erro ao tentar excluir a playlist.');
    }
  };

  return (
    <Container sx={{ mt: 4 }}>
      <Paper elevation={3} sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>
          {id ? 'Editar Descrição' : 'Criar Playlist'}
        </Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            name="title"
            label="Título"
            value={form.title}
            onChange={handleChange}
            sx={{ mb: 2 }}
            required
          />
          <TextField
            fullWidth
            name="description"
            label="Descrição"
            value={form.description}
            onChange={handleChange}
            multiline
            rows={4}
            sx={{ mb: 2 }}
          />
          
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
            {id && (
              <Button
                variant="contained"
                color="error"
                onClick={handleDelete}
              >
                Excluir
              </Button>
            )}
            <Button type="submit" variant="contained">
              {id ? 'Atualizar' : 'Criar'}
            </Button>
            <Button
              variant="outlined"
              color="secondary"
              onClick={() => navigate('/app/dashboard')}
              sx={{ ml: 'auto' }}>
              Cancelar
            </Button>
          </Box>
        </form>
      </Paper>
    </Container>
  );
};

export default Playlist;