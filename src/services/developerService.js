import axios from 'axios';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:4000/api/developer',
});

// Attach the dev token to every request.
// Replace this with real auth (cookies / login flow) once the Auth module is ready.
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('devToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const listClients = async () => {
  const res = await api.get('/clients');
  return res.data.clients;
};

export const getClient = async (id) => {
  const res = await api.get(`/clients/${id}`);
  return res.data.client;
};

export const createClient = async (payload) => {
  const res = await api.post('/clients', payload);
  return res.data.client;
};

export const updateClient = async (id, payload) => {
  const res = await api.put(`/clients/${id}`, payload);
  return res.data.client;
};

export const deleteClient = async (id) => {
  const res = await api.delete(`/clients/${id}`);
  return res.data;
};

export const rotateSecret = async (id) => {
  const res = await api.post(`/clients/${id}/rotate-secret`);
  return res.data;
};

export const getClientAnalytics = async (id) => {
  const res = await api.get(`/clients/${id}/analytics`);
  return res.data;
};

export default api;
