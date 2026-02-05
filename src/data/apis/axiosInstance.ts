// src/data/apis/axiosInstance.ts
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Production server URL - same as AI Chat API
const BASE_URL = 'http://14.225.207.221:8080'; // Production server

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor: Tự động gắn Token vào mọi request
axiosInstance.interceptors.request.use(
  async config => {
    const token = await AsyncStorage.getItem('accessToken'); // Lấy token đã lưu khi Login
    if (token) {
      config.headers.Authorization = `Bearer ${token}`; // Gắn vào Header
    }
    return config;
  },
  error => Promise.reject(error),
);

export default axiosInstance;
