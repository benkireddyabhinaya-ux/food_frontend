import axios from 'axios';

// Automatically uses environment variable when deployed on Vercel
// Falls back to local Spring Boot backend (http://localhost:8081) during local dev
const baseURL = (import.meta.env.VITE_API_URL || 'http://localhost:8081').replace(/\/+$/, '');

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
