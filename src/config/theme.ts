import { MD3LightTheme, MD3DarkTheme } from 'react-native-paper';

// Google's Material Design colors
export const googleColors = {
  // Primary Google Blue
  primary: '#1a73e8',
  primaryDark: '#1557b0',
  primaryLight: '#4285f4',
  
  // Google colors
  googleRed: '#ea4335',
  googleYellow: '#fbbc04',
  googleGreen: '#34a853',
  googleBlue: '#4285f4',
  
  // Neutrals (Google's grays)
  gray50: '#f8f9fa',
  gray100: '#f1f3f4',
  gray200: '#e8eaed',
  gray300: '#dadce0',
  gray400: '#bdc1c6',
  gray500: '#9aa0a6',
  gray600: '#80868b',
  gray700: '#5f6368',
  gray800: '#3c4043',
  gray900: '#202124',
  
  // Status colors
  success: '#34a853',
  warning: '#fbbc04',
  error: '#ea4335',
  info: '#4285f4',
  
  // Background
  background: '#ffffff',
  surface: '#ffffff',
  surfaceVariant: '#f8f9fa',
};

export const lightTheme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    primary: googleColors.primary,
    primaryContainer: googleColors.primaryLight,
    secondary: googleColors.googleGreen,
    secondaryContainer: googleColors.gray100,
    tertiary: googleColors.googleYellow,
    error: googleColors.error,
    errorContainer: '#fce8e6',
    background: googleColors.background,
    surface: googleColors.surface,
    surfaceVariant: googleColors.surfaceVariant,
    onPrimary: '#ffffff',
    onSecondary: '#ffffff',
    onBackground: googleColors.gray900,
    onSurface: googleColors.gray900,
    outline: googleColors.gray300,
  },
};

export const darkTheme = {
  ...MD3DarkTheme,
  colors: {
    ...MD3DarkTheme.colors,
    primary: googleColors.primaryLight,
    primaryContainer: googleColors.primaryDark,
    secondary: googleColors.googleGreen,
    secondaryContainer: googleColors.gray700,
    tertiary: googleColors.googleYellow,
    error: googleColors.error,
    errorContainer: '#93000a',
    background: googleColors.gray900,
    surface: googleColors.gray800,
    surfaceVariant: googleColors.gray700,
    onPrimary: '#ffffff',
    onSecondary: '#ffffff',
    onBackground: '#ffffff',
    onSurface: '#ffffff',
    outline: googleColors.gray600,
  },
};
