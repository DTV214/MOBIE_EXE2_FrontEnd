/**
 * Responsive Utility Module
 * 
 * Cung cấp các hàm scale kích thước theo màn hình thiết bị.
 * Base design: 375 x 812 (iPhone X/11/12)
 * 
 * Sử dụng:
 *   import { wp, hp, fs, scale, isTablet, isSmallDevice } from '@/utils/responsive';
 *   
 *   // Width percentage: wp(50) = 50% chiều rộng màn hình
 *   // Height percentage: hp(10) = 10% chiều cao màn hình
 *   // Font scale: fs(16) = 16 * scaleFactor (tỉ lệ theo width)
 *   // General scale: scale(24) = 24 * scaleFactor
 */

import { Dimensions, PixelRatio, ScaledSize } from 'react-native';

// Base design dimensions (iPhone X/11/12)
const BASE_WIDTH = 375;
const BASE_HEIGHT = 812;

// Get initial dimensions
let { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// Listen for dimension changes (rotation, split screen, etc.)
Dimensions.addEventListener('change', ({ window }: { window: ScaledSize }) => {
  SCREEN_WIDTH = window.width;
  SCREEN_HEIGHT = window.height;
});

/**
 * Get current screen width
 */
export const getScreenWidth = (): number => SCREEN_WIDTH;

/**
 * Get current screen height
 */
export const getScreenHeight = (): number => SCREEN_HEIGHT;

/**
 * Width percentage - Returns a value based on percentage of screen width
 * @param widthPercent - percentage of screen width (0-100)
 */
export const wp = (widthPercent: number): number => {
  return PixelRatio.roundToNearestPixel((SCREEN_WIDTH * widthPercent) / 100);
};

/**
 * Height percentage - Returns a value based on percentage of screen height
 * @param heightPercent - percentage of screen height (0-100)
 */
export const hp = (heightPercent: number): number => {
  return PixelRatio.roundToNearestPixel((SCREEN_HEIGHT * heightPercent) / 100);
};

/**
 * Scale factor based on screen width relative to base design
 */
const getScaleFactor = (): number => {
  const scaleFactor = SCREEN_WIDTH / BASE_WIDTH;
  // Clamp scale factor để tránh quá lớn trên tablet hoặc quá nhỏ trên watch
  return Math.min(Math.max(scaleFactor, 0.8), 1.6);
};

/**
 * Vertical scale factor based on screen height
 */
const getVerticalScaleFactor = (): number => {
  const scaleFactor = SCREEN_HEIGHT / BASE_HEIGHT;
  return Math.min(Math.max(scaleFactor, 0.8), 1.6);
};

/**
 * Scale a value proportionally to screen width
 * Good for: width, horizontal padding/margin, border radius
 * @param size - design size (based on 375px width)
 */
export const scale = (size: number): number => {
  return PixelRatio.roundToNearestPixel(size * getScaleFactor());
};

/**
 * Scale a value proportionally to screen height
 * Good for: height, vertical padding/margin
 * @param size - design size (based on 812px height)
 */
export const verticalScale = (size: number): number => {
  return PixelRatio.roundToNearestPixel(size * getVerticalScaleFactor());
};

/**
 * Moderate scale - scale with a dampening factor
 * Useful when you don't want linear scaling (e.g., font sizes, icon sizes)
 * @param size - design size
 * @param factor - dampening factor (0 = no scale, 1 = full scale). Default: 0.5
 */
export const moderateScale = (size: number, factor: number = 0.5): number => {
  return PixelRatio.roundToNearestPixel(
    size + (scale(size) - size) * factor
  );
};

/**
 * Font scale - scale font sizes with moderate dampening
 * Ensures text doesn't get too large on tablets or too small on tiny screens
 * @param size - design font size
 */
export const fs = (size: number): number => {
  return moderateScale(size, 0.4);
};

/**
 * Is the device a tablet? (screen width >= 600dp)
 */
export const isTablet = (): boolean => {
  // If short dimension >= 600dp, it's a tablet
  const shortDimension = Math.min(SCREEN_WIDTH, SCREEN_HEIGHT);
  return shortDimension >= 600;
};

/**
 * Is small device? (width < 360)
 */
export const isSmallDevice = (): boolean => {
  return SCREEN_WIDTH < 360;
};

/**
 * Is large device? (width >= 414, e.g., iPhone Plus/Max, large Android)
 */
export const isLargeDevice = (): boolean => {
  return SCREEN_WIDTH >= 414;
};

/**
 * Get responsive value based on device type
 * @param phone - value for phone
 * @param tablet - value for tablet
 */
export function deviceSelect<T>(phone: T, tablet: T): T {
  return isTablet() ? tablet : phone;
}

/**
 * Get responsive value based on screen size
 * @param small - value for small screens (<360)
 * @param medium - value for medium screens (360-413)
 * @param large - value for large screens (>=414)
 */
export function sizeSelect<T>(small: T, medium: T, large: T): T {
  if (isSmallDevice()) return small;
  if (isLargeDevice()) return large;
  return medium;
}

/**
 * Get number of columns for a grid layout based on screen width
 * @param minItemWidth - minimum width of each item
 * @param horizontalPadding - total horizontal padding
 */
export const getGridColumns = (minItemWidth: number = 160, horizontalPadding: number = 32): number => {
  const availableWidth = SCREEN_WIDTH - horizontalPadding;
  return Math.max(2, Math.floor(availableWidth / scale(minItemWidth)));
};

/**
 * Get responsive chart width (accounting for padding)
 * @param horizontalPadding - total horizontal padding around chart
 */
export const getChartWidth = (horizontalPadding: number = 80): number => {
  return SCREEN_WIDTH - scale(horizontalPadding);
};

/**
 * Responsive spacing presets
 */
export const spacing = {
  /** 4px scaled */
  xs: scale(4),
  /** 8px scaled */
  sm: scale(8),
  /** 12px scaled */
  md: scale(12),
  /** 16px scaled */
  lg: scale(16),
  /** 20px scaled */
  xl: scale(20),
  /** 24px scaled */
  xxl: scale(24),
  /** 32px scaled */
  xxxl: scale(32),
  /** Screen horizontal padding */
  screenPadding: scale(16),
};

/**
 * Responsive font size presets
 */
export const fontSize = {
  /** 10px */
  tiny: fs(10),
  /** 12px */
  xs: fs(12),
  /** 14px */
  sm: fs(14),
  /** 16px */
  base: fs(16),
  /** 18px */
  lg: fs(18),
  /** 20px */
  xl: fs(20),
  /** 24px */
  xxl: fs(24),
  /** 30px */
  xxxl: fs(30),
  /** 36px */
  display: fs(36),
};

/**
 * Responsive icon size presets
 */
export const iconSize = {
  /** 16px */
  sm: moderateScale(16, 0.3),
  /** 20px */
  md: moderateScale(20, 0.3),
  /** 24px */
  base: moderateScale(24, 0.3),
  /** 28px */
  lg: moderateScale(28, 0.3),
  /** 32px */
  xl: moderateScale(32, 0.3),
  /** 40px */
  xxl: moderateScale(40, 0.3),
};
