const prisma = require('../prismaClient');
const YoutubeService = require('./YoutubeService');

class PlaylistService {
  static async create({ title, description = null, userId }) {
    if (!userId) {
      throw new Error('Usuário não autenticado');
    }
    return await prisma.playlist.create({
      data: {
        title,
        description,
        userId
      }
    });
  }

  static async listByUser(userId) {
    return await prisma.playlist.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      include: {
        videos: {
          include: {
            video: true
          }
        }
      }
    });
  }

  static async getById(id) {
    return await prisma.playlist.findUnique({
      where: { id: Number(id) },
      include: {
        videos: {
          include: {
            video: true
          }
        }
      }
    });
  }

  static async update(id, { title, description }) {
    const playlistId = Number(id);
    try {
      const updated = await prisma.playlist.update({
        where: { id: playlistId },
        data: { title, description }
      });
      return updated;
    } catch (err) {
      throw new Error('Playlist not found');
    }
  }

  static async remove(id) {
    const playlistId = Number(id);
    try {
      await prisma.playlist.delete({
        where: { id: playlistId }
      });
    } catch (err) {
      throw new Error('Playlist not found');
    }
  }

  static async addVideo(youtube_id) {
    const meta = await YoutubeService.getById(youtube_id);
    if (!meta) throw new Error('Vídeo não encontrado no YouTube');
    
    const exists =  await prisma.video.findUnique({
      where: { youtubeId: youtube_id },
    });
    if (exists)  return exists; 
    try {
      const createVideo = await prisma.video.create({
        data: {youtubeId: youtube_id, title: meta.title}
      });
      return createVideo;
    } catch (err) {
      throw new Error(err);
    }
  }

  static async addVideoPlaylist(playlistId, videoId) {
    const pId = Number(playlistId);
    const vId = Number(videoId);

    const existingLink = await prisma.playlistVideo.findUnique({
      where: { playlistId_videoId: { playlistId: pId, videoId: vId } }
    });
    if (existingLink) return existingLink;

    const newLink = await prisma.playlistVideo.create({
      data: {
        playlist: { connect: { id: pId } },
        video:    { connect: { id: vId } }
      }
    });
    return newLink;
  }

  static async removeVideo(playlistId, videoId) {
    const pId = Number(playlistId);
    const vId = Number(videoId);

    await prisma.playlistVideo.deleteMany({
      where: {
        playlistId: pId,
        videoId: vId
      }
    });

    const video = await prisma.video.findUnique({
      where: { id: vId },
      include: { playlistVideos: true }
    });

    if (video && video.playlistVideos.length === 0) {
      await prisma.video.delete({
        where: { id: vId }
      });
    }
  }

  static async listVideos(playlistId) {
    const pId = Number(playlistId);
    const links = await prisma.playlistVideo.findMany({
      where: { playlistId: pId },
      orderBy: { position: 'asc' },
      include: {
        video: true
      }
    });
    return links.map(link => link.video);
  }
}

module.exports = PlaylistService;
