import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import NavBar from '../components/NavBar';

const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  __esModule: true,
  useNavigate: () => mockNavigate,
}));

const mockLogout = jest.fn();
jest.mock('../hooks/useAuth', () => ({
  __esModule: true,
  useAuth: () => ({
    logout: mockLogout,
  }),
}));

describe('NavBar component', () => {
  beforeEach(() => {
    mockNavigate.mockClear();
    mockLogout.mockClear();
  });

  test('clica em "YouList" e chama navigate("/app/dashboard")', () => {
    render(<NavBar />);

    const titleElement = screen.getByText('YouList');

    fireEvent.click(titleElement);

    expect(mockNavigate).toHaveBeenCalledTimes(1);
    expect(mockNavigate).toHaveBeenCalledWith('/app/dashboard');
  });

  test('clica no botão de logout, chama logout() e depois navigate("/login", { replace: true })', () => {
    render(<NavBar />);

    const iconButtons = screen.getAllByRole('button');
    expect(iconButtons.length).toBeGreaterThanOrEqual(2);

    const logoutButton = iconButtons[1];
    fireEvent.click(logoutButton);

    expect(mockLogout).toHaveBeenCalledTimes(1);

    expect(mockNavigate).toHaveBeenCalledTimes(1);
    expect(mockNavigate).toHaveBeenCalledWith('/login', { replace: true });
  });
});
