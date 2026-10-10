import axios from 'axios';

// Automatically uses environment variable VITE_API_URL if configured.
// In development, defaults to local backend (http://localhost:8081).
// In production (e.g. Vercel), defaults to the live Render backend (https://food-backend-hix6.onrender.com).
const defaultUrl = import.meta.env.DEV
  ? 'http://localhost:8081'
  : 'https://food-backend-hix6.onrender.com';

const baseURL = (import.meta.env.VITE_API_URL || defaultUrl).replace(/\/+$/, '');

const API = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000,
});

// Response interceptor for consistent error messaging
API.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error.response?.data?.message ||
      error.message ||
      'Network error. Please check your backend connection.';
    return Promise.reject(new Error(message));
  }
);

export default API;
