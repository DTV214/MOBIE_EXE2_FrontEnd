// src/contexts/ThemeContext.tsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface ThemeContextType {
  isDarkMode: boolean;
  toggleDarkMode: () => void;
  colors: {
    // Background colors
    background: string;
    surface: string;
    card: string;
    
    // Text colors
    text: string;
    textSecondary: string;
    textMuted: string;
    
    // UI colors
    primary: string;
    primaryLight: string;
    border: string;
    shadow: string;
    
    // Status bar
    statusBarStyle: 'dark-content' | 'light-content';
    statusBarBackground: string;
  };
}

const lightTheme = {
  background: '#F8FAFC',
  surface: '#FFFFFF', 
  card: '#FFFFFF',
  text: '#1F2937',
  textSecondary: '#6B7280',
  textMuted: '#9CA3AF',
  primary: '#7FB069',
  primaryLight: '#E8F5E3',
  border: '#E5E7EB',
  shadow: 'rgba(0, 0, 0, 0.1)',
  statusBarStyle: 'dark-content' as const,
  statusBarBackground: '#FFFFFF',
};

const darkTheme = {
  background: '#0F172A',
  surface: '#1E293B',
  card: '#334155', 
  text: '#F8FAFC',
  textSecondary: '#CBD5E1',
  textMuted: '#94A3B8',
  primary: '#7FB069',
  primaryLight: '#1E3A20',
  border: '#475569',
  shadow: 'rgba(0, 0, 0, 0.4)',
  statusBarStyle: 'light-content' as const,
  statusBarBackground: '#1E293B',
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Load saved theme từ AsyncStorage
  useEffect(() => {
    loadTheme();
  }, []);

  const loadTheme = async () => {
    try {	
      const savedTheme = await AsyncStorage.getItem('app_theme');
      if (savedTheme !== null) {
        setIsDarkMode(savedTheme === 'dark');
      }
    } catch (error) {
      console.error('Error loading theme:', error);
    }
  };

  const toggleDarkMode = async () => {
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);
    
    try {
      await AsyncStorage.setItem('app_theme', newMode ? 'dark' : 'light');
    } catch (error) {
      console.error('Error saving theme:', error);
    }
  };

  const colors = isDarkMode ? darkTheme : lightTheme;

  return (
    <ThemeContext.Provider value={{ isDarkMode, toggleDarkMode, colors }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};