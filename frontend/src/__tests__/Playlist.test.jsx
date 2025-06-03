import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import * as router from 'react-router-dom';
import Playlist from '../pages/Playlist';
import playlistService from '../services/playlistService';

const mockNavigate = jest.fn();
const mockConfirm = jest.fn();
window.confirm = mockConfirm;

jest.mock('react-router-dom', () => ({
  __esModule: true,
  MemoryRouter: ({ children }) => children,
  Routes: ({ children }) => <>{children}</>,
  Route: ({ element }) => element,
  useNavigate: () => mockNavigate,
  useParams: jest.fn(() => ({})),
  useSearchParams: jest.fn(() => [new URLSearchParams()]),
}));

jest.mock('../services/playlistService');

describe('Playlist page', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    router.useParams.mockReturnValue({});
    router.useSearchParams.mockReturnValue([new URLSearchParams()]);
  });

  function renderCreate() {
    router.useParams.mockReturnValue({});
    return render(
      <router.MemoryRouter initialEntries={['/playlist']}>
        <router.Routes>
          <router.Route path="/playlist" element={<Playlist />} />
        </router.Routes>
      </router.MemoryRouter>
    );
  }

  function renderEdit(id, playlistData) {
    playlistService.getPlaylists.mockResolvedValue([playlistData]);
    router.useParams.mockReturnValue({ id });
    return render(
      <router.MemoryRouter initialEntries={[`/playlist/${id}`]}>
        <router.Routes>
          <router.Route path="/playlist/:id" element={<Playlist />} />
        </router.Routes>
      </router.MemoryRouter>
    );
  }

  it('renderiza formulário vazio para criar', () => {
    renderCreate();
    expect(screen.getByText(/Criar Playlist/i)).toBeInTheDocument();
    const titleFields = screen.getAllByLabelText(/Título/i);
    expect(titleFields[0]).toHaveValue('');
    expect(screen.getByLabelText(/Descrição/i)).toHaveValue('');
    expect(screen.getByRole('button', { name: /Criar/i })).toBeInTheDocument();
  });

  it('carrega dados para edição e atualiza', async () => {
    const data = { id: '1', title: 'P', description: 'D' };
    renderEdit('1', data);

    await waitFor(() => {
      expect(screen.getByText(/Editar Descrição/i)).toBeInTheDocument();
      const titleField = screen.getAllByLabelText(/Título/i)[0];
      expect(titleField).toHaveValue('P');
      expect(screen.getByLabelText(/Descrição/i)).toHaveValue('D');
    });

    fireEvent.change(screen.getByLabelText(/Descrição/i), {
      target: { name: 'description', value: 'Nova D' },
    });
    fireEvent.click(screen.getByRole('button', { name: /Atualizar/i }));

    await waitFor(() => {
      expect(playlistService.updatePlaylist).toHaveBeenCalledWith('1', {
        title: 'P',
        description: 'Nova D',
      });
      expect(mockNavigate).toHaveBeenCalledWith('/app/dashboard', { replace: true });
    });
  });

  it('exclui playlist confirmando e navega', async () => {
    const data = { id: '2', title: 'X', description: '' };
    mockConfirm.mockReturnValue(true);
    renderEdit('2', data);

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /Excluir/i })).toBeInTheDocument();
    });
    fireEvent.click(screen.getByRole('button', { name: /Excluir/i }));

    await waitFor(() => {
      expect(playlistService.deletePlaylist).toHaveBeenCalledWith('2');
      expect(mockNavigate).toHaveBeenCalledWith('/app/dashboard', { replace: true });
    });
  });

  it('não exclui se cancelar confirmação', async () => {
    const data = { id: '3', title: '', description: '' };
    mockConfirm.mockReturnValue(false);
    renderEdit('3', data);

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /Excluir/i })).toBeInTheDocument();
    });
    fireEvent.click(screen.getByRole('button', { name: /Excluir/i }));

    await waitFor(() => {
      expect(playlistService.deletePlaylist).not.toHaveBeenCalled();
      expect(mockNavigate).not.toHaveBeenCalled();
    });
  });
});
