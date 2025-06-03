import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import Search from '../pages/Search';
import videoService from '../services/videoService';
import playlistService from '../services/playlistService';

jest.mock('react-router-dom', () => ({
  __esModule: true,
  MemoryRouter: ({ children }) => children,
  Routes: ({ children }) => <>{children}</>,
  Route: ({ element }) => element,
  useNavigate: () => jest.fn(),
  useLocation: () => ({ search: '?q=test' }),
  Link: ({ children }) => <>{children}</>,
}));

jest.mock('../hooks/useAuth', () => ({
  __esModule: true,
  useAuth: () => ({ logout: jest.fn() }),
}));

jest.mock('../services/videoService');
jest.mock('../services/playlistService');

describe('Search page', () => {
  beforeEach(() => {
    playlistService.getPlaylists.mockResolvedValue([{ id: '1', title: 'P1' }]);
    videoService.searchVideos.mockReset();
    videoService.searchVideos.mockResolvedValue([]);
  });

  function renderWithRouter() {
    return render(
      <MemoryRouter>
        <Routes>
          <Route path="/search" element={<Search />} />
        </Routes>
      </MemoryRouter>
    );
  }

  it('carrega playlists e busca vídeos via query string', async () => {
    videoService.searchVideos.mockResolvedValue([{ id: 'v1', title: 'Teste' }]);
    renderWithRouter();

    await waitFor(() => {
      expect(playlistService.getPlaylists).toHaveBeenCalled();
      expect(videoService.searchVideos).toHaveBeenCalledWith('test');
    });
  });

  it('quando não há resultado, exibe “Nenhum vídeo encontrado.”', async () => {
    videoService.searchVideos.mockResolvedValue([]);
    renderWithRouter();

    await waitFor(() => {
      expect(screen.getByText(/Nenhum vídeo encontrado\./i)).toBeInTheDocument();
    });
  });

  it('clicar em “Adicionar à playlist +” mostra menu com playlists', async () => {
    videoService.searchVideos.mockResolvedValue([{ id: 'v1', title: 'Teste' }]);
    renderWithRouter();

    await waitFor(() => {
      const addButton = screen.getByText(/Adicionar à playlist \+/i);
      fireEvent.click(addButton);
      expect(screen.getByText(/P1/i)).toBeInTheDocument();
    });
  });
});
