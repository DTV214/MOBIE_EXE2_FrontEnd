// Network Configuration Debug
// Để debug network issues cho APK builds

import { Alert } from 'react-native';

export const debugNetworkConfig = () => {
  console.log('=== NETWORK DEBUG INFO ===');
  console.log('BASE_URL:', 'http://14.225.207.221:8080');
  console.log('Environment:', __DEV__ ? 'Development' : 'Production');
  console.log('Platform:', __DEV__ ? 'Metro Bundler' : 'APK Build');
  console.log('=============================');
};

export const showNetworkErrorDialog = (error: any) => {
  let message = 'Lỗi kết nối mạng';
  
  if (error.code === 'NETWORK_ERROR') {
    message = 'Không thể kết nối đến server. Vui lòng kiểm tra kết nối mạng.';
  } else if (error.response?.status === 500) {
    message = 'Server đang bảo trì. Vui lòng thử lại sau.';
  } else if (error.response?.status >= 400 && error.response?.status < 500) {
    message = 'Lỗi xác thực. Vui lòng đăng nhập lại.';
  }
  
  if (!__DEV__) { // Chỉ show Alert trong production APK
    Alert.alert(
      'Lỗi kết nối',
      message,
      [
        { text: 'Thử lại', style: 'default' },
        { text: 'Đóng', style: 'cancel' }
      ]
    );
  }
  
  console.error('Network Error:', {
    message: error.message,
    status: error.response?.status,
    url: error.config?.url,
    baseURL: error.config?.baseURL
  });
};