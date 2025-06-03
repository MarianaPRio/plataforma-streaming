import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import Player from '../pages/Player';
import videoService from '../services/videoService';
import playlistService from '../services/playlistService';

jest.mock('react-router-dom', () => ({
  __esModule: true,
  MemoryRouter: ({ children }) => children,
  Routes: ({ children }) => <>{children}</>,
  Route: ({ element }) => element,
  useNavigate: () => jest.fn(),
  useParams: () => ({ id: 'v1' }),
  Link: ({ children }) => <>{children}</>,
}));

jest.mock('../hooks/useAuth', () => ({
  __esModule: true,
  useAuth: () => ({ logout: jest.fn() }),
}));

jest.mock('../services/videoService');
jest.mock('../services/playlistService');

describe('Player page', () => {
  beforeEach(() => {
    videoService.getVideo.mockReset();
    playlistService.getVideosFromPlaylist.mockReset();
    playlistService.removeVideo.mockReset();
    playlistService.getVideosFromPlaylist.mockResolvedValue([]);
  });

  function renderWithRouter() {
    return render(
      <MemoryRouter>
        <Routes>
          <Route path="/player/:id" element={<Player />} />
        </Routes>
      </MemoryRouter>
    );
  }

  it('quando não há vídeos, exibe mensagem e botão de adicionar', async () => {
    videoService.getVideo.mockResolvedValue(null);
    renderWithRouter();

    await waitFor(() => {
      expect(screen.getByText(/Nenhum vídeo nesta playlist\./i)).toBeInTheDocument();
      expect(screen.getByText(/Adicione seu primeiro vídeo/i)).toBeInTheDocument();
    });
  });

  it('quando há vídeos, exibe iframe e lista de próximos', async () => {
    videoService.getVideo.mockResolvedValue({ id: 'v1', youtubeId: 'yt1' });
    playlistService.getVideosFromPlaylist.mockResolvedValue([
      { id: 'v2', youtubeId: 'yt2' },
    ]);

    renderWithRouter();

    await waitFor(() => {
      expect(screen.getByTitle('yt2')).toBeInTheDocument();
      expect(screen.getByText(/yt2/i)).toBeInTheDocument();
    });
  });

  it('remover vídeo atual chama serviço e exibe próximo', async () => {
    videoService.getVideo.mockResolvedValue({ id: 'v1', youtubeId: 'yt1' });
    playlistService.getVideosFromPlaylist.mockResolvedValue([
      { id: 'v2', youtubeId: 'yt2' },
    ]);
    playlistService.removeVideo.mockResolvedValue({});

    renderWithRouter();

    await waitFor(() => {
      const removeButton = screen.getByText(/Remover este vídeo/i);
      fireEvent.click(removeButton);
      expect(playlistService.removeVideo).toHaveBeenCalledWith('v1', 'v2');
    });
  });
});
