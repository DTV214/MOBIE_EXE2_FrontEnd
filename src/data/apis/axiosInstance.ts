// src/data/apis/axiosInstance.ts
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Use production server IP since localhost is not running
const BASE_URL = 'http://14.225.207.221:8080';

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 20000, // Increased timeout for external server
  headers: {
    'Content-Type': 'application/json',
  },
});

axiosInstance.interceptors.request.use(
  async config => {
    const token = await AsyncStorage.getItem('accessToken');
    // LOG CHI TIẾT INTERCEPTOR
    console.log(`--- [AXIOS INTERCEPTOR] Preparing Request ---`);
    console.log(`URL: ${config.baseURL}${config.url}`);
    console.log(`Method: ${config.method?.toUpperCase()}`);
    console.log(`Stored Token: ${token}`);

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  error => {
    console.error('--- [AXIOS INTERCEPTOR ERROR] ---', error);
    return Promise.reject(error);
  },
);

export default axiosInstance;
