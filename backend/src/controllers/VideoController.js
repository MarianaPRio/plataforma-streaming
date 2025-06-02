const YouTubeService = require('../services/YoutubeService');

class VideoController {
  static async search(req, res, next) {
    try {
      const { q } = req.query;
      if (!q) return res.status(400).json({ error: 'Missing query param q' });
      const results = await YouTubeService.search(q);
      res.json(results);
    } catch (err) {
      next(err);
    }
  }
  static async getById(req, res, next) {
    try {
      const youtube_id = req.params.youtube_id;
      const video = await YouTubeService.getById(youtube_id);
      if (!video) return res.status(404).json({ error: 'Not found' });
      res.json(video);
    } catch(err) {
      next(err);
    }
  }

}

module.exports = VideoController;
