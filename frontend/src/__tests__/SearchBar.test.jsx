import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import SearchBar from '../components/SearchBar';

describe('SearchBar component', () => {
  test('deve renderizar o input com valor e botão de “Pesquisar”', () => {
    const mockOnChange = jest.fn();
    const mockOnSearch = jest.fn((e) => e.preventDefault());
    render(
      <SearchBar
        query="teste"
        onChange={mockOnChange}
        onSearch={mockOnSearch}
      />
    );

    const input = screen.getByLabelText(/buscar vídeos/i);
    const button = screen.getByRole('button', { name: /pesquisar/i });

    expect(input).toBeInTheDocument();
    expect(input.value).toBe('teste');
    expect(button).toBeInTheDocument();
  });

  test('deve chamar onChange ao digitar e onSearch ao clicar no botão', () => {
    const mockOnChange = jest.fn();
    const mockOnSearch = jest.fn((e) => e.preventDefault());
    render(
      <SearchBar
        query=""
        onChange={mockOnChange}
        onSearch={mockOnSearch}
      />
    );

    const input = screen.getByLabelText(/buscar vídeos/i);
    const button = screen.getByRole('button', { name: /pesquisar/i });

    fireEvent.change(input, { target: { value: 'rock' } });
    expect(mockOnChange).toHaveBeenCalledTimes(1);

    fireEvent.click(button);
    expect(mockOnSearch).toHaveBeenCalledTimes(1);
  });
});
