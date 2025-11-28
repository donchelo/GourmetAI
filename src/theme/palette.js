/**
 * Design System - FoodFest Inspiration
 * Modern, clean, and appetite-inducing colors.
 */

export const colors = {
  // Base Neutrals
  white: '#FFFFFF',
  offWhite: '#FAFAFA',
  lightGray: '#F4F4F4',
  mediumGray: '#E0E0E0',
  darkGray: '#757575',
  charcoal: '#333333',
  black: '#111111',
  pureBlack: '#000000',

  // Food Accents
  orangeZest: '#FF6B35', // Vibrant appetite color
  freshGreen: '#4CAF50', // Freshness
  deepRed: '#D32F2F',    // Richness
  gold: '#FFC107',       // Quality/Premium
};

// Light Mode Palette
export const lightPalette = {
  mode: 'light',
  primary: {
    main: colors.black,
    light: colors.charcoal,
    dark: colors.pureBlack,
    contrastText: colors.white,
  },
  secondary: {
    main: colors.orangeZest,
    light: '#FF9E75',
    dark: '#C63F17',
    contrastText: colors.white,
  },
  background: {
    default: colors.offWhite,
    paper: colors.white,
    subtle: colors.lightGray,
  },
  text: {
    primary: colors.black,
    secondary: colors.darkGray,
    disabled: colors.mediumGray,
  },
  divider: 'rgba(0, 0, 0, 0.08)',
  action: {
    active: colors.black,
    hover: 'rgba(0, 0, 0, 0.04)',
    selected: 'rgba(0, 0, 0, 0.08)',
    disabled: 'rgba(0, 0, 0, 0.26)',
    disabledBackground: 'rgba(0, 0, 0, 0.12)',
  },
  success: {
    main: colors.freshGreen,
  },
  error: {
    main: colors.deepRed,
  },
};

// Dark Mode Palette
export const darkPalette = {
  mode: 'dark',
  primary: {
    main: colors.white,
    light: colors.offWhite,
    dark: colors.lightGray,
    contrastText: colors.black,
  },
  secondary: {
    main: colors.orangeZest,
    light: '#FF9E75',
    dark: '#C63F17',
    contrastText: colors.white,
  },
  background: {
    default: colors.pureBlack,
    paper: '#1E1E1E',
    subtle: '#2C2C2C',
  },
  text: {
    primary: colors.white,
    secondary: '#AAAAAA',
    disabled: '#666666',
  },
  divider: 'rgba(255, 255, 255, 0.08)',
  action: {
    active: colors.white,
    hover: 'rgba(255, 255, 255, 0.08)',
    selected: 'rgba(255, 255, 255, 0.16)',
    disabled: 'rgba(255, 255, 255, 0.3)',
    disabledBackground: 'rgba(255, 255, 255, 0.12)',
  },
  success: {
    main: '#81C784',
  },
  error: {
    main: '#E57373',
  },
};

const paletteExports = { colors, lightPalette, darkPalette };
export default paletteExports;
