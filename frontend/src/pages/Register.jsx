import React, { useState } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  Alert,
  Link
} from '@mui/material';
import authService from '../services/authService';

const Register = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await authService.register(form);
      navigate('/login', { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || 'Erro ao registrar');
    }
  };

  return (
    <Container maxWidth="xs">
      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{ mt: 8, display: 'flex', flexDirection: 'column', gap: 2 }}
      >
        <Typography variant="h5" component="h1" align="center">
          Crie sua conta
        </Typography>

        {error && <Alert severity="error">{error}</Alert>}

        <TextField
          label="Nome completo"
          name="name"
          value={form.name}
          onChange={handleChange}
          required
        />

        <TextField
          label="E-mail"
          name="email"
          type="email"
          value={form.email}
          onChange={handleChange}
          required
        />

        <TextField
          label="Senha"
          name="password"
          type="password"
          value={form.password}
          onChange={handleChange}
          required
        />

        <Button type="submit" variant="contained" size="large">
          Registrar
        </Button>

        <Typography variant="body2" align="center">
          Já tem conta?{' '}
          <Link component={RouterLink} to="/login">
            Faça login
          </Link>
        </Typography>
      </Box>
    </Container>
  );
};

export default Register;