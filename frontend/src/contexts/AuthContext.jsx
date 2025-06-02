import React, { createContext, useState, useEffect } from 'react';
import authService from '../services/authService';
import api from '../services/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const jwt = localStorage.getItem('token');
    if (jwt) {
      setToken(jwt);
      api.defaults.headers.common.Authorization = `Bearer ${jwt}`;
    }
    setLoading(false);
  }, []);

  const login = async (credentials) => {
    const user = await authService.login(credentials);
    setToken(localStorage.getItem('token'));
    return user;
  };

  const logout = () => {
    authService.logout();
    setToken(null);
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated: !!token,
        login,
        logout,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
