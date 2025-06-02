const prisma = require('../prismaClient');
const PlaylistService = require('../services/PlaylistService');

class PlaylistController {
  static async create(req, res, next) {
    try {
      const { title, description } = req.body;
      const userId = req.user.id;
      if (!title) return res.status(400).json({ error: 'Missing title' });
      const playlist = await prisma.playlist.create({
        data: { title, description, userId }
      });
      res.status(201).json(playlist);
    } catch (err) {
      next(err);
    }
  }

  static async list(req, res, next) {
    try {
      const userId = req.user.id;
      const playlists = await prisma.playlist.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' }
      });
      res.status(200).json(playlists);
    } catch (err) {
      next(err);
    }
  }

  static async get(req, res, next) {
    try {
      const id = Number(req.params.id);
      const playlist = await prisma.playlist.findUnique({ where: { id } });
      if (!playlist) return res.status(404).json({ error: 'Not found' });
      res.json(playlist);
    } catch (err) {
      next(err);
    }
  }

  static async update(req, res, next) {
    try {
      const id = Number(req.params.id);
      const data = (({ title, description }) => ({ title, description }))(req.body);
      const updated = await prisma.playlist.update({ where: { id }, data });
      res.json(updated);
    } catch (err) {
      next(err);
    }
  }

  static async remove(req, res, next) {
    try {
      const id = Number(req.params.id);
      await prisma.playlist.delete({ where: { id } });
      res.status(204).send();
    } catch (err) {
      next(err);
    }
  }

  static async addVideo(req, res, next) {
    try {
      const playlistId = Number(req.params.id);
      const { youtube_id } = req.body;
      if (!youtube_id) return res.status(400).json({ error: 'Missing youtube_id' });
      
      const videoObj = await PlaylistService.addVideo(youtube_id);
      const link = await PlaylistService.addVideoPlaylist(playlistId, videoObj.id);
      res.status(201).json(link);
    } catch (err) {
      next(err);
    }
  }

  static async listVideos(req, res, next) {
    try {
      const playlistId = Number(req.params.id);
      const links = await prisma.playlistVideo.findMany({
        where: { playlistId },
        orderBy: { position: 'asc' },
        include: { video: true }
      });
      const videos = links.map(link => ({
        id: link.video.id,
        youtubeId: link.video.youtubeId,
        title: link.video.title,
        description: link.video.description,
        thumbnailUrl: link.video.thumbnailUrl,
        artistName: link.video.artistName,
        createdAt: link.video.createdAt,
        updatedAt: link.video.updatedAt
      }));
      res.json(videos);
    } catch (err) {
      next(err);
    }
  }

  static async removeVideo(req, res, next) {
    try {
      const playlistId = Number(req.params.id);
      const videoId = Number(req.params.videoId);
      await PlaylistService.removeVideo(playlistId, videoId);
      res.status(204).send();
    } catch (err) {
      next(err);
    }
  }
}

module.exports = PlaylistController;
