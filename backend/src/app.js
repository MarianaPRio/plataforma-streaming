require('dotenv').config();
const express = require('express');
const cors = require('cors');

const authRoutes = require('./routes/auth');
const videoRoutes = require('./routes/videos');
const playlistRoutes = require('./routes/playlists');

const authMiddleware = require('./middleware/auth');

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);

app.use('/api', authMiddleware);

app.use('/api/videos', videoRoutes);
app.use('/api/playlists', playlistRoutes);

app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).json({ error: err.message || 'Internal Server Error' });
});

module.exports = app;
