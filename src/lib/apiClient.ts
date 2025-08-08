import axios, { AxiosInstance } from 'axios';

console.log('환경변수:', process.env.NEXT_PUBLIC_BASE_URL);

export const apiClient: AxiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BASE_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Note: Request and response interceptors are handled in AuthService.js
// to avoid conflicts with the authentication logic

