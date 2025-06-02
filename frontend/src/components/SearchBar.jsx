import React from 'react';
import PropTypes from 'prop-types';
import { Box, TextField, Button } from '@mui/material';

const SearchBar = ({ query, onChange, onSearch }) => {
  return (
    <Box
      component="form"
      onSubmit={onSearch}
      sx={{ mb: 4, display: 'flex', gap: 2 }}
    >
      <TextField
        fullWidth
        label="Buscar vídeos"
        value={query}
        onChange={onChange}
      />
      <Button type="submit" variant="contained">
        Pesquisar
      </Button>
    </Box>
  );
};

SearchBar.propTypes = {
  query: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  onSearch: PropTypes.func.isRequired,
};

export default SearchBar;
