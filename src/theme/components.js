/**
 * Design System - Component Overrides
 * Modern, clean, and sophisticated component styles.
 */

import { colors } from './palette';
import { borderRadius, transitions, shadows } from './tokens';
import { fontFamilies, fontWeights } from './typography';
import { alpha } from '@mui/material/styles';

/**
 * Generates component overrides for a specific mode
 * @param {string} mode - 'light' or 'dark'
 */
export const createComponentOverrides = (mode) => {
  const isLight = mode === 'light';
  
  // Define colors based on mode for easier usage
  const borderColor = isLight ? 'rgba(0, 0, 0, 0.08)' : 'rgba(255, 255, 255, 0.08)';
  const hoverColor = isLight ? 'rgba(0, 0, 0, 0.04)' : 'rgba(255, 255, 255, 0.08)';
  
  return {
    // ============================================
    // BUTTONS
    // ============================================
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 0, // Sharp corners for modern look
          padding: '14px 32px',
          fontWeight: fontWeights.medium,
          textTransform: 'uppercase',
          letterSpacing: '0.1em',
          boxShadow: 'none',
          transition: transitions.all,
          fontSize: '0.875rem',
          
          '&:hover': {
            boxShadow: 'none',
            transform: 'translateY(-1px)',
          },
          '&:active': {
            transform: 'translateY(0)',
          },
        },
        contained: {
          backgroundColor: isLight ? colors.black : colors.white,
          color: isLight ? colors.white : colors.black,
          '&:hover': {
            backgroundColor: isLight ? colors.charcoal : colors.lightGray,
            boxShadow: shadows.md,
          },
        },
        outlined: {
          borderWidth: '1px',
          borderColor: isLight ? colors.black : colors.white,
          color: isLight ? colors.black : colors.white,
          '&:hover': {
            borderWidth: '1px',
            backgroundColor: hoverColor,
            borderColor: isLight ? colors.black : colors.white,
          },
        },
        text: {
          '&:hover': {
            backgroundColor: hoverColor,
          },
        },
      },
    },

    // ============================================
    // CARDS
    // ============================================
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
        },
        elevation0: {
          border: `1px solid ${borderColor}`,
        },
        elevation1: {
          boxShadow: shadows.sm,
        },
      },
    },

    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 0, // Sharp corners
          border: `1px solid ${borderColor}`,
          boxShadow: 'none',
          transition: transitions.all,
          '&:hover': {
             borderColor: isLight ? colors.black : colors.white,
             transform: 'translateY(-4px)',
          },
        },
      },
    },

    // ============================================
    // INPUTS
    // ============================================
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: 0,
          '& .MuiOutlinedInput-notchedOutline': {
            borderColor: borderColor,
            borderWidth: '1px',
          },
          '&:hover .MuiOutlinedInput-notchedOutline': {
            borderColor: isLight ? colors.charcoal : colors.lightGray,
          },
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderColor: isLight ? colors.black : colors.white,
            borderWidth: '1px',
          },
        },
        input: {
          padding: '16px',
        },
      },
    },

    // ============================================
    // CHIPS
    // ============================================
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 0,
          fontWeight: fontWeights.medium,
        },
      },
    },

    // ============================================
    // APPBAR
    // ============================================
    MuiAppBar: {
      styleOverrides: {
        root: {
          boxShadow: 'none',
        },
      },
    },

    // ============================================
    // DIALOG
    // ============================================
    MuiDialog: {
      styleOverrides: {
        paper: {
          borderRadius: 0,
          boxShadow: shadows.xl,
        },
      },
    },
    
    // ============================================
    // CSS BASELINE
    // ============================================
    MuiCssBaseline: {
      styleOverrides: {
        html: {
          scrollBehavior: 'smooth',
        },
        body: {
          scrollbarWidth: 'thin',
          scrollbarColor: isLight 
            ? `${colors.mediumGray} ${colors.offWhite}` 
            : `${colors.darkGray} ${colors.black}`,
        },
        '::selection': {
          backgroundColor: colors.orangeZest,
          color: colors.white,
        },
      },
    },
  };
};

export default createComponentOverrides;
