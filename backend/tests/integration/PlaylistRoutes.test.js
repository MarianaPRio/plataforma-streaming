jest.mock('../../src/services/YoutubeService', () => ({
  getById: jest.fn().mockResolvedValue({
    title: 'Vídeo Mockado',
    description: 'Descrição qualquer',
    thumbnail_url: 'http://img.com/thumb.jpg',
    artist_name: 'Artista Teste'
  })
}));

const request = require('supertest');
const app = require('../../src/app');
const prisma = require('../../src/prismaClient');
const jwt = require('jsonwebtoken');

describe('Playlist Routes (integration)', () => {
  let token, userId, playlistId;
  const JWT_SECRET = process.env.JWT_SECRET || 'test_secret';

  beforeAll(async () => {
    await prisma.playlistVideo.deleteMany();
    await prisma.video.deleteMany();
    await prisma.playlist.deleteMany();
    await prisma.user.deleteMany();

    const user = await prisma.user.create({
      data: {
        name: 'Mariana Rio',
        email: `mariana${Date.now()}@example.com`,
        passwordHash: 'hash'
      }
    });
    userId = user.id;
    token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET);
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  it('POST /api/playlists → cria nova playlist', async () => {
    const res = await request(app)
      .post('/api/playlists')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'Minha Playlist',
        description: 'Playlist de Teste'
      });

    expect(res.status).toBe(201);
    expect(res.body).toMatchObject({
      title: 'Minha Playlist',
      description: 'Playlist de Teste'
    });

    playlistId = res.body.id;
  });

  it('POST /api/playlists/:id/videos → adiciona vídeo na playlist', async () => {
    const res = await request(app)
      .post(`/api/playlists/${playlistId}/videos`)
      .set('Authorization', `Bearer ${token}`)
      .send({ youtube_id: 'VID999' });

    expect(res.status).toBe(201);
    expect(res.body.playlistId).toBe(playlistId);
  });

  it('GET /api/playlists/:id/videos → lista vídeos', async () => {
    const res = await request(app)
      .get(`/api/playlists/${playlistId}/videos`)
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.length).toBeGreaterThan(0);
    expect(res.body[0]).toHaveProperty('youtubeId');
  });
});
