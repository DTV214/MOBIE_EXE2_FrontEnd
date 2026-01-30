// src/data/apis/axiosInstance.ts
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Thay đổi baseURL thành địa chỉ IP máy tính của bạn nếu chạy trên thiết bị thật (VD: 192.168.1.x:8080)
const BASE_URL = 'http://10.0.2.2:8080'; // Dành cho Android Emulator

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
