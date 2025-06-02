import api from './api';

const searchVideos = async (query) => {
  if (!query.trim()) return [];
  const { data } = await api.get('/videos/search', { params: { q: query } });
  return data;
};

// const getVideoDetails = async (id) => {
//   const { data } = await api.get(`/videos/${id}`);
//   console.log(data)
//   return data;
// };

const getVideo = async (youtube_id) => {
  console.log('Chamando getVideo com id =', youtube_id);
  const { data } = await api.get(`/videos/${youtube_id}`);
  console.log('Chamando getVideo com id =', data)
  return data;
};

export default { searchVideos, getVideo };
