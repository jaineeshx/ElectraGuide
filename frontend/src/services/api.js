import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

import { auth } from '../config/firebase';

// Add interceptor to include Firebase Token
api.interceptors.request.use(async (config) => {
  const user = auth.currentUser;
  if (user) {
    const token = await user.getIdToken();
    config.headers.Authorization = `Bearer ${token}`;
  }
  // Add custom header for CSRF protection
  config.headers['X-Requested-With'] = 'XMLHttpRequest';
  return config;
}, (error) => {
  return Promise.reject(error);
});

export default api;
