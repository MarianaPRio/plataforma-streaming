import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Login from '../pages/Login';

const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  __esModule: true,
  MemoryRouter: ({ children }) => children,
  useNavigate: () => mockNavigate,
  Link: ({ children, to }) => <a href={to}>{children}</a>,
}));

const mockLogin = jest.fn();
jest.mock('../hooks/useAuth', () => ({
  __esModule: true,
  useAuth: () => ({ login: mockLogin }),
}));

describe('Login page', () => {
  beforeEach(() => {
    mockNavigate.mockClear();
    mockLogin.mockClear();
  });

  it('renderiza campos e botão', () => {
    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );
    expect(screen.getByLabelText(/E-mail/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Senha/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Entrar/i })).toBeInTheDocument();
    expect(screen.getByText(/Não tem conta\?/i)).toBeInTheDocument();
  });

  it('faz login com sucesso e navega para dashboard', async () => {
    mockLogin.mockResolvedValueOnce({});
    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );
    fireEvent.change(screen.getByLabelText(/E-mail/i), {
      target: { name: 'email', value: 'user@example.com' },
    });
    fireEvent.change(screen.getByLabelText(/Senha/i), {
      target: { name: 'password', value: 'password123' },
    });
    fireEvent.click(screen.getByRole('button', { name: /Entrar/i }));
    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith({
        email: 'user@example.com',
        password: 'password123',
      });
      expect(mockNavigate).toHaveBeenCalledWith('/app/dashboard');
    });
  });

  it('exibe erro quando login falha', async () => {
    mockLogin.mockRejectedValueOnce({
      response: { data: { error: 'Credenciais inválidas' } },
    });
    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );
    fireEvent.change(screen.getByLabelText(/E-mail/i), {
      target: { name: 'email', value: 'wrong@example.com' },
    });
    fireEvent.change(screen.getByLabelText(/Senha/i), {
      target: { name: 'password', value: 'wrongpass' },
    });
    fireEvent.click(screen.getByRole('button', { name: /Entrar/i }));
    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith({
        email: 'wrong@example.com',
        password: 'wrongpass',
      });
      expect(screen.getByText(/Credenciais inválidas/i)).toBeInTheDocument();
    });
  });
});
