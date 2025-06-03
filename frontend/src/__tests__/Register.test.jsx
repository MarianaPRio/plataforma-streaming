import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Register from '../pages/Register';
import authService from '../services/authService';

const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  __esModule: true,
  MemoryRouter: ({ children }) => children,
  useNavigate: () => mockNavigate,
  Link: ({ children, to }) => <a href={to}>{children}</a>,
}));

jest.mock('../services/authService');

describe('Register page', () => {
  beforeEach(() => {
    mockNavigate.mockClear();
    authService.register.mockClear();
  });

  it('renderiza campos e botão', () => {
    render(
      <MemoryRouter>
        <Register />
      </MemoryRouter>
    );
    expect(screen.getByLabelText(/Nome completo/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/E-mail/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Senha/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Registrar/i })).toBeInTheDocument();
    expect(screen.getByText(/Já tem conta\?/i)).toBeInTheDocument();
  });

  it('faz registro com sucesso e navega para login', async () => {
    authService.register.mockResolvedValueOnce({});
    render(
      <MemoryRouter>
        <Register />
      </MemoryRouter>
    );
    fireEvent.change(screen.getByLabelText(/Nome completo/i), {
      target: { name: 'name', value: 'John Doe' },
    });
    fireEvent.change(screen.getByLabelText(/E-mail/i), {
      target: { name: 'email', value: 'john@example.com' },
    });
    fireEvent.change(screen.getByLabelText(/Senha/i), {
      target: { name: 'password', value: 'password123' },
    });
    fireEvent.click(screen.getByRole('button', { name: /Registrar/i }));
    await waitFor(() => {
      expect(authService.register).toHaveBeenCalledWith({
        name: 'John Doe',
        email: 'john@example.com',
        password: 'password123',
      });
      expect(mockNavigate).toHaveBeenCalledWith('/login', { replace: true });
    });
  });

  it('exibe erro quando falha o registro', async () => {
    authService.register.mockRejectedValueOnce({
      response: { data: { message: 'E-mail já existe' } },
    });
    render(
      <MemoryRouter>
        <Register />
      </MemoryRouter>
    );
    fireEvent.change(screen.getByLabelText(/Nome completo/i), {
      target: { name: 'name', value: 'Jane Doe' },
    });
    fireEvent.change(screen.getByLabelText(/E-mail/i), {
      target: { name: 'email', value: 'jane@example.com' },
    });
    fireEvent.change(screen.getByLabelText(/Senha/i), {
      target: { name: 'password', value: 'password456' },
    });
    fireEvent.click(screen.getByRole('button', { name: /Registrar/i }));
    await waitFor(() => {
      expect(authService.register).toHaveBeenCalledWith({
        name: 'Jane Doe',
        email: 'jane@example.com',
        password: 'password456',
      });
      expect(screen.getByText(/E-mail já existe/i)).toBeInTheDocument();
    });
  });
});
