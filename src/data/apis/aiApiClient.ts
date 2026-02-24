// src/data/apis/aiApiClient.ts
import axios from 'axios';

// Create dedicated axios instance for AI APIs
const aiApiClient = axios.create({
  baseURL: 'http://14.225.207.221:8080', // Production server (accessible from emulator)
  timeout: 45000, // Increased timeout for emulator network latency
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// Request interceptor for logging
aiApiClient.interceptors.request.use(
  (config) => {
    console.log(`[AI API] ${config.method?.toUpperCase()} ${config.url}`, {
      params: config.params,
      data: config.data,
      headers: config.headers.Authorization ? 'Bearer [TOKEN]' : 'No Auth',
    });
    return config;
  },
  (error) => {
    console.error('[AI API] Request Error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
aiApiClient.interceptors.response.use(
  (response) => {
    console.log(`[AI API] Response:`, {
      status: response.status,
      data: typeof response.data === 'string' ? 'Long text response...' : response.data
    });
    return response;
  },
  (error) => {
    console.error('[AI API] Response Error:', {
      status: error.response?.status,
      data: error.response?.data,
      message: error.message,
    });

    // Handle specific AI API errors
    if (error.response?.status === 401) {
      // Token expired or invalid
      console.log('[AI API] Authentication required');
    }

    return Promise.reject(error);
  }
);

export default aiApiClient;