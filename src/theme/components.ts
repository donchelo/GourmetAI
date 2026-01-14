/**
 * Design System - Component Overrides
 * Modern, clean, and sophisticated component styles.
 */

import { Components, Theme } from '@mui/material/styles';
import { colors } from './palette';
import { transitions, shadows } from './tokens';
import { fontWeights } from './typography';

/**
 * Generates component overrides for a specific mode
 * @param {string} mode - 'light' or 'dark'
 */
export const createComponentOverrides = (mode: 'light' | 'dark'): Components<Omit<Theme, 'components'>> => {
  const isLight = mode === 'light';
  
  // Define colors based on mode for easier usage
  const borderColor = isLight ? 'rgba(0, 0, 0, 0.08)' : 'rgba(255, 255, 255, 0.08)';
  const hoverColor = isLight ? 'rgba(0, 0, 0, 0.04)' : 'rgba(255, 255, 255, 0.08)';
  
  return {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 0,
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
            backgroundColor: isLight ? (colors as any).charcoal : (colors as any).lightGray,
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
          borderRadius: 0,
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

    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: 0,
          '& .MuiOutlinedInput-notchedOutline': {
            borderColor: borderColor,
            borderWidth: '1px',
          },
          '&:hover .MuiOutlinedInput-notchedOutline': {
            borderColor: isLight ? (colors as any).charcoal : (colors as any).lightGray,
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

    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 0,
          fontWeight: fontWeights.medium,
        },
      },
    },

    MuiAppBar: {
      styleOverrides: {
        root: {
          boxShadow: 'none',
        },
      },
    },

    MuiDialog: {
      styleOverrides: {
        paper: {
          borderRadius: 0,
          boxShadow: shadows.xl,
        },
      },
    },
    
    MuiCssBaseline: {
      styleOverrides: {
        html: {
          scrollBehavior: 'smooth',
        },
        body: {
          scrollbarWidth: 'thin',
          scrollbarColor: isLight 
            ? `${(colors as any).mediumGray} ${(colors as any).offWhite}` 
            : `${(colors as any).darkGray} ${colors.black}`,
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
