const axios = require('axios');
const YT_API_KEY = process.env.YT_API_KEY;

class YoutubeService {
  static async search(q, maxResults = 10) {
    const res = await axios.get('https://www.googleapis.com/youtube/v3/search', {
      params: { key: YT_API_KEY, part: 'snippet', q, maxResults, type: 'video' }
    });
    return res.data.items.map(item => ({
      youtube_id:    item.id.videoId,
      title:         item.snippet.title,
      description:   item.snippet.description,
      thumbnail_url: item.snippet.thumbnails.default.url,
      artist_name:   item.snippet.channelTitle
    }));
  }
  static async getById(youtube_id) {
    const res = await axios.get('https://www.googleapis.com/youtube/v3/videos', {
      params: {
        key: YT_API_KEY,
        part: 'snippet,contentDetails',
        id: youtube_id
      }
    });
    if (!res.data.items.length) return null;
    const item = res.data.items[0];
    return {
      youtube_id: item.id,
      title:      item.snippet.title,
      description: item.snippet.description,
      channel: {
        name: item.snippet.channelTitle,
        bio:  item.snippet.description
      }
    };
  }
}

module.exports = YoutubeService;