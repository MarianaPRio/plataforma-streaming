import React from 'react';
import PropTypes from 'prop-types';
import { Box, TextField, Button } from '@mui/material';

const SearchBar = ({ query, onChange, onSearch, sx }) => {
  return (
    <Box
      component="form"
      onSubmit={onSearch}
      sx={{ display: 'flex', alignItems: 'center', gap: 2, ...sx, }}
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
  sx: PropTypes.object,
};

SearchBar.defaultProps = {
  sx: {},
};

export default SearchBar;
