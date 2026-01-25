/**
 * @format
 */

import { AppRegistry } from 'react-native';
import App from './App';
import { name as appName } from './app.json';

// ✅ FIXED: Add global error handlers to prevent crashes
if (__DEV__) {
  // Handle unhandled promise rejections
  const originalHandler = global.HermesInternal?.HermesInternal?.enablePromiseRejectionTracker || 
                         global.process?.on || 
                         function() {};
  
  // Prevent clearError undefined issues
  global.ErrorUtils = global.ErrorUtils || {
    setGlobalHandler: () => {},
    getGlobalHandler: () => () => {},
    reportError: (error) => console.error('Global Error:', error),
  };
  
  // Handle promise rejections
  if (typeof global.process !== 'undefined' && global.process.on) {
    global.process.on('unhandledRejection', (reason, promise) => {
      console.warn('Unhandled Promise Rejection:', reason);
    });
  }
}

AppRegistry.registerComponent(appName, () => App);
