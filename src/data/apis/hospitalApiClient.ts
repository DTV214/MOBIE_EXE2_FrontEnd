// src/data/apis/hospitalApiClient.ts
import axios from 'axios';

// Create dedicated axios instance for hospital APIs
const hospitalApiClient = axios.create({
  baseURL: 'http://14.225.207.221:8080', // Production server IP (works from emulator)
  timeout: 20000, // Increased timeout for external server and emulator latency
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// Request interceptor for logging
hospitalApiClient.interceptors.request.use(
  (config) => {
    console.log(`[Hospital API] ${config.method?.toUpperCase()} ${config.url}`, {
      params: config.params,
      data: config.data,
    });
    return config;
  },
  (error) => {
    console.error('[Hospital API] Request Error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
hospitalApiClient.interceptors.response.use(
  (response) => {
    console.log(`[Hospital API] Response:`, response.data);
    return response;
  },
  (error) => {
    console.error('[Hospital API] Response Error:', {
      status: error.response?.status,
      data: error.response?.data,
      message: error.message,
    });
    return Promise.reject(error);
  }
);

export default hospitalApiClient;