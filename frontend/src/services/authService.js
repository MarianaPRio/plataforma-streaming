import api from './api';

const login = async (credentials) => {
  const { data } = await api.post('/auth/login', credentials);
  localStorage.setItem('token', data.token);
  api.defaults.headers.Authorization = `Bearer ${data.token}`;
  return data.user;
};

const logout = () => {
  localStorage.removeItem('token');
  delete api.defaults.headers.Authorization;
};

const register = async (data) => {
  const response = await api.post('/auth/register', data);
  return response.data;
};

export default { login, logout, register };
