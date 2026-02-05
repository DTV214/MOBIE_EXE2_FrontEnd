// src/utils/debugAI.ts
import AsyncStorage from '@react-native-async-storage/async-storage';
import aiApiClient from '../data/apis/aiApiClient';
import axiosInstance from '../data/apis/axiosInstance';

// Debug function to test AI API with stored token
export const debugAIAPI = async () => {
  try {
    console.log('🔍 DEBUGGING AI API...');
    
    // 1. Check stored token
    const token = await AsyncStorage.getItem('accessToken');
    console.log('📱 Stored token exists:', !!token);
    if (token) {
      console.log('🔐 Token preview:', token.substring(0, 30) + '...');
    }
    
    if (!token) {
      console.log('❌ No token found - user needs to login first');
      return { success: false, message: 'No authentication token' };
    }
    
    // 2. Test profile API first (should work)
    console.log('🧪 Testing profile API first...');
    try {
      const profileResponse = await axiosInstance.get('/api/accounts/profile');
      console.log('✅ Profile API works:', profileResponse.status);
    } catch (profileError: any) {
      console.log('❌ Profile API failed:', profileError.response?.status);
      return { success: false, message: 'Profile API failed - token may be invalid' };
    }
    
    // 3. Test AI API with same token
    console.log('🤖 Testing AI API...');
    aiApiClient.defaults.headers.Authorization = `Bearer ${token}`;
    
    const aiResponse = await aiApiClient.post('/api/public/ai/prompt', {
      message: 'test',
      isSpeech: false
    });
    
    console.log('✅ AI API works:', aiResponse.status);
    console.log('🤖 AI Response:', aiResponse.data);
    
    return { success: true, message: 'AI API working correctly' };
    
  } catch (error: any) {
    console.error('❌ AI API Debug Error:', {
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data
    });
    
    return {
      success: false,
      message: `AI API Error: ${error.response?.status} - ${error.response?.data?.error || error.message}`
    };
  }
};

// Helper function to get and print current auth status
export const checkAuthStatus = async () => {
  const token = await AsyncStorage.getItem('accessToken');
  console.log('Auth Status:', {
    hasToken: !!token,
    tokenLength: token?.length || 0,
    tokenPreview: token ? token.substring(0, 20) + '...' : 'No token'
  });
  return !!token;
};