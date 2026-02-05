// src/utils/apiTest.ts
import AsyncStorage from '@react-native-async-storage/async-storage';
import axiosInstance from '../data/apis/axiosInstance';

// Helper function to test API connectivity and authentication
export const testApiConnection = async () => {
  try {
    console.log('🔍 Testing API connection...');
    
    // Check if token exists
    const token = await AsyncStorage.getItem('accessToken');
    console.log('📱 Token exists:', !!token);
    if (token) {
      console.log('🔐 Token preview:', token.substring(0, 20) + '...');
    }
    
    // Test public endpoint first
    console.log('🌐 Testing public endpoint...');
    const publicResponse = await axiosInstance.get('/api/public/hospitals?page=0&size=5');
    console.log('✅ Public API working, status:', publicResponse.status);
    
    // Test protected endpoint
    if (token) {
      console.log('🔒 Testing protected endpoint...');
      try {
        const protectedResponse = await axiosInstance.get('/api/accounts/profile');
        console.log('✅ Protected API working, status:', protectedResponse.status);
        console.log('👤 User profile data:', protectedResponse.data);
        return { success: true, message: 'API connection successful' };
      } catch (protectedError: any) {
        console.log('❌ Protected API failed:', protectedError.response?.status, protectedError.response?.data);
        return { success: false, message: `Auth error: ${protectedError.response?.status}` };
      }
    } else {
      return { success: false, message: 'No authentication token found' };
    }
    
  } catch (error: any) {
    console.error('❌ API test failed:', error);
    return { 
      success: false, 
      message: error.message || 'Connection failed',
      details: error.response?.data 
    };
  }
};

// Helper to clear all stored tokens
export const clearAllTokens = async () => {
  try {
    await AsyncStorage.removeItem('accessToken');
    console.log('🧹 Cleared all tokens');
    return true;
  } catch (error) {
    console.error('Error clearing tokens:', error);
    return false;
  }
};