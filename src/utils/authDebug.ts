// src/utils/authDebug.ts
import AsyncStorage from '@react-native-async-storage/async-storage';

export const debugAuth = async () => {
  try {
    console.log('🔍 === AUTH DEBUG INFO ===');
    
    // Check stored token
    const token = await AsyncStorage.getItem('accessToken');
    if (token) {
      console.log('✅ Token exists:', token.substring(0, 20) + '...');
      
      // Try to decode JWT payload (React Native compatible)
      try {
        const parts = token.split('.');
        if (parts.length === 3) {
          console.log('📄 Token has 3 parts (valid JWT structure)');
          console.log('🔍 Token header part length:', parts[0].length);
          console.log('🔍 Token payload part length:', parts[1].length);
          console.log('🔍 Token signature part length:', parts[2].length);
          
          // Skip complex decode for now, just log basic info
          console.log('⚠️  Payload decode skipped (React Native compatibility)');
          console.log('💡 To see payload, use online JWT decoder with the token');
        }
      } catch (decodeError) {
        console.log('❌ Cannot analyze token structure:', decodeError);
      }
    } else {
      console.log('❌ No token found');
    }
    
    console.log('🔍 === END AUTH DEBUG ===');
  } catch (error) {
    console.error('Debug error:', error);
  }
};

export const clearAllAuthData = async () => {
  try {
    console.log('🧹 Clearing all auth data...');
    await AsyncStorage.removeItem('accessToken');
    await AsyncStorage.removeItem('refreshToken'); // if exists
    await AsyncStorage.removeItem('hasOnboarded');
    console.log('✅ All auth data cleared');
    return true;
  } catch (error) {
    console.error('❌ Error clearing auth data:', error);
    return false;
  }
};