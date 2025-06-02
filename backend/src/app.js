// backend/src/app.js
require('dotenv').config();
const express = require('express');
const app = express();

// middlewares
app.use(express.json());

// health check
app.get('/health', (_req, res) => res.json({ status: 'ok' }));

// no futuro: importe aqui suas rotas
// const authRoutes = require('./routes/auth');
// app.use('/auth', authRoutes);

module.exports = app;
