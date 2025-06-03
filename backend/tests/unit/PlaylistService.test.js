jest.mock('../../src/services/YoutubeService', () => ({
  getById: jest.fn().mockResolvedValue({
    title: 'Vídeo Teste',
    description: 'Descrição do vídeo',
    thumbnail_url: 'thumb.jpg',
    artist_name: 'Artista Z'
  })
}));

const prisma = require('../../src/prismaClient');
const PlaylistService = require('../../src/services/PlaylistService');

describe('PlaylistService (unit)', () => {
  let user;

  beforeAll(async () => {
    await prisma.playlistVideo.deleteMany();
    await prisma.video.deleteMany();
    await prisma.playlist.deleteMany();
    await prisma.user.deleteMany();

    user = await prisma.user.create({
      data: {
        name: 'Tester',
        email: 'test@example.com',
        passwordHash: 'hash'
      }
    });
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  it('deve criar playlist com título, descrição e userId corretos', async () => {
    const payload = {
      title: 'Favoritas',
      description: 'Minhas musicas',
      userId: user.id,
    };
    const pl = await PlaylistService.create(payload);
    expect(pl.id).toBeDefined();
    expect(pl.title).toBe(payload.title);
    expect(pl.description).toBe(payload.description);
    expect(pl.userId).toBe(payload.userId);
  });

  it('deve adicionar um vídeo, listá-lo e depois removê-lo', async () => {
    const pl = await PlaylistService.create({
      title: 'Teste Vídeos',
      userId: user.id,
    });

    const video = await PlaylistService.addVideo('VID123');
    const link = await PlaylistService.addVideoPlaylist(pl.id, video.id);
    expect(link.playlistId).toBe(pl.id);

    const items = await PlaylistService.listVideos(pl.id);
    expect(items[0].youtubeId).toBe('VID123');

    await PlaylistService.removeVideo(pl.id, video.id);
    const after = await PlaylistService.listVideos(pl.id);
    expect(after).toHaveLength(0);
  });
});
