import axios from 'axios';

// Update base URL depending on environment, or use relative proxy in vite
const api = axios.create({
  baseURL: 'http://localhost:5050/api',
});

api.interceptors.request.use((config) => {
  const userInfo = localStorage.getItem('userInfo');
  if (userInfo) {
    const { token } = JSON.parse(userInfo);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

export default api;
