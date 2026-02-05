// src/data/apis/aiApiClient.ts
import axios from 'axios';

// Create dedicated axios instance for AI APIs
const aiApiClient = axios.create({
  baseURL: 'http://14.225.207.221:8080',
  timeout: 30000, // AI responses might take longer
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// Request interceptor for authentication
aiApiClient.interceptors.request.use(
  (config) => {
    // Get token from storage (will implement in repository)
    const token = null; // TODO: Get from auth storage
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    console.log(`[AI API] ${config.method?.toUpperCase()} ${config.url}`, {
      params: config.params,
      data: config.data,
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