import api from './api';

const getPlaylists = () => api.get('/playlists').then(r => r.data);
const createPlaylist = (data) => api.post('/playlists', data).then(r => r.data);
const getById = (id) => api.get(`/playlists/${id}`).then(r => r.data);

const updatePlaylist = async (id, data) => {
  const response = await api.put(`/playlists/${id}`, data);
  return response.data;
};

const deletePlaylist = async (id) => {
  await api.delete(`/playlists/${id}`);
};

const addVideo = async (playlistId, youtube_id) => {
  console.log(playlistId, youtube_id);
  const data = await api.post(`/playlists/${playlistId}/videos`, { youtube_id });
  console.log('adawdawd222222');
  return data;
};

const getVideosFromPlaylist = async (playlistId) => {
  const { data } = await api.get(`/playlists/${playlistId}/videos`);
  return data;
};

const removeVideo = async (playlistId, videoId) => {
  await api.delete(`/playlists/${playlistId}/videos/${videoId}`);
};

export default { getVideosFromPlaylist, getById, getPlaylists, createPlaylist, updatePlaylist, deletePlaylist, addVideo, removeVideo };
