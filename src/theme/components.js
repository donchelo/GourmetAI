/**
 * Design System Marquet - Component Overrides
 * Estilos elegantes y minimalistas para componentes MUI
 */

import { colors } from './palette';
import { borderRadius, transitions, shadows } from './tokens';
import { fontFamilies, fontWeights, letterSpacings } from './typography';

/**
 * Genera los overrides de componentes para un modo específico
 * @param {string} mode - 'light' o 'dark'
 */
export const createComponentOverrides = (mode) => {
  const isLight = mode === 'light';
  
  return {
    // ============================================
    // BOTONES
    // ============================================
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: borderRadius.lg,
          padding: '12px 28px',
          fontWeight: fontWeights.medium,
          letterSpacing: letterSpacings.wide,
          textTransform: 'none',
          boxShadow: 'none',
          transition: transitions.all,
          
          '&:hover': {
            boxShadow: shadows.sm,
            transform: 'translateY(-1px)',
          },
          '&:active': {
            transform: 'translateY(0)',
            boxShadow: 'none',
          },
        },
        contained: {
          '&:hover': {
            boxShadow: shadows.md,
          },
        },
        outlined: {
          borderWidth: '1.5px',
          '&:hover': {
            borderWidth: '1.5px',
            backgroundColor: isLight 
              ? 'rgba(61, 58, 54, 0.04)' 
              : 'rgba(248, 246, 243, 0.06)',
          },
        },
        text: {
          '&:hover': {
            backgroundColor: isLight 
              ? 'rgba(61, 58, 54, 0.04)' 
              : 'rgba(248, 246, 243, 0.06)',
          },
        },
        sizeSmall: {
          padding: '8px 20px',
          fontSize: '0.8125rem',
        },
        sizeLarge: {
          padding: '16px 36px',
          fontSize: '1rem',
        },
      },
    },

    // ============================================
    // ICONBUTTON
    // ============================================
    MuiIconButton: {
      styleOverrides: {
        root: {
          borderRadius: borderRadius.lg,
          transition: transitions.all,
          
          '&:hover': {
            backgroundColor: isLight 
              ? 'rgba(61, 58, 54, 0.06)' 
              : 'rgba(248, 246, 243, 0.08)',
            transform: 'scale(1.05)',
          },
        },
      },
    },

    // ============================================
    // PAPER Y CARDS
    // ============================================
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          transition: transitions.all,
        },
        rounded: {
          borderRadius: borderRadius.xl,
        },
        elevation0: {
          boxShadow: 'none',
        },
        elevation1: {
          boxShadow: shadows.sm,
        },
        elevation2: {
          boxShadow: shadows.md,
        },
        elevation3: {
          boxShadow: shadows.lg,
        },
        elevation4: {
          boxShadow: shadows.xl,
        },
      },
    },

    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: borderRadius.xl,
          overflow: 'hidden',
          boxShadow: shadows.sm,
          border: `1px solid ${isLight ? colors.sand : 'rgba(248, 246, 243, 0.08)'}`,
          transition: transitions.all,
          
          '&:hover': {
            boxShadow: shadows.lg,
            transform: 'translateY(-2px)',
          },
        },
      },
    },

    MuiCardContent: {
      styleOverrides: {
        root: {
          padding: '24px',
          '&:last-child': {
            paddingBottom: '24px',
          },
        },
      },
    },

    MuiCardHeader: {
      styleOverrides: {
        root: {
          padding: '24px 24px 16px',
        },
        title: {
          fontFamily: fontFamilies.heading,
          fontWeight: fontWeights.medium,
        },
      },
    },

    // ============================================
    // INPUTS Y FORMS
    // ============================================
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: borderRadius.lg,
            transition: transitions.all,
            
            '& fieldset': {
              borderColor: isLight ? colors.sand : 'rgba(248, 246, 243, 0.12)',
              borderWidth: '1.5px',
              transition: transitions.all,
            },
            '&:hover fieldset': {
              borderColor: isLight ? colors.stone : 'rgba(248, 246, 243, 0.2)',
            },
            '&.Mui-focused fieldset': {
              borderWidth: '2px',
            },
          },
        },
      },
    },

    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: borderRadius.lg,
          
          '& fieldset': {
            borderColor: isLight ? colors.sand : 'rgba(248, 246, 243, 0.12)',
            borderWidth: '1.5px',
          },
          '&:hover fieldset': {
            borderColor: isLight ? colors.stone : 'rgba(248, 246, 243, 0.2)',
          },
        },
        input: {
          padding: '14px 16px',
        },
      },
    },

    MuiInputLabel: {
      styleOverrides: {
        root: {
          fontWeight: fontWeights.medium,
          letterSpacing: letterSpacings.wide,
        },
      },
    },

    MuiSelect: {
      styleOverrides: {
        root: {
          borderRadius: borderRadius.lg,
        },
      },
    },

    MuiFormLabel: {
      styleOverrides: {
        root: {
          fontWeight: fontWeights.medium,
          letterSpacing: letterSpacings.wide,
        },
      },
    },

    // ============================================
    // CHIPS
    // ============================================
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: borderRadius.md,
          fontWeight: fontWeights.medium,
          letterSpacing: letterSpacings.wide,
          transition: transitions.fast,
          
          '&:hover': {
            transform: 'scale(1.02)',
          },
        },
        outlined: {
          borderWidth: '1.5px',
        },
        filled: {
          boxShadow: shadows.xs,
        },
      },
    },

    // ============================================
    // ACCORDION
    // ============================================
    MuiAccordion: {
      styleOverrides: {
        root: {
          borderRadius: `${borderRadius.lg} !important`,
          border: `1px solid ${isLight ? colors.sand : 'rgba(248, 246, 243, 0.08)'}`,
          boxShadow: 'none',
          overflow: 'hidden',
          transition: transitions.all,
          
          '&:before': {
            display: 'none',
          },
          '&.Mui-expanded': {
            margin: 0,
            boxShadow: shadows.sm,
          },
        },
      },
    },

    MuiAccordionSummary: {
      styleOverrides: {
        root: {
          padding: '0 20px',
          minHeight: '60px',
          
          '&.Mui-expanded': {
            minHeight: '60px',
          },
        },
        content: {
          margin: '16px 0',
          
          '&.Mui-expanded': {
            margin: '16px 0',
          },
        },
      },
    },

    MuiAccordionDetails: {
      styleOverrides: {
        root: {
          padding: '0 20px 20px',
        },
      },
    },

    // ============================================
    // APPBAR Y TOOLBAR
    // ============================================
    MuiAppBar: {
      styleOverrides: {
        root: {
          boxShadow: 'none',
          borderBottom: `1px solid ${isLight ? colors.sand : 'rgba(248, 246, 243, 0.08)'}`,
        },
      },
    },

    MuiToolbar: {
      styleOverrides: {
        root: {
          minHeight: '72px !important',
          padding: '0 24px !important',
        },
      },
    },

    // ============================================
    // SLIDER
    // ============================================
    MuiSlider: {
      styleOverrides: {
        root: {
          height: 6,
          
          '& .MuiSlider-track': {
            border: 'none',
            borderRadius: borderRadius.full,
          },
          '& .MuiSlider-rail': {
            opacity: 0.3,
            borderRadius: borderRadius.full,
          },
          '& .MuiSlider-thumb': {
            height: 20,
            width: 20,
            backgroundColor: isLight ? colors.warmWhite : colors.ivory,
            border: '2px solid currentColor',
            boxShadow: shadows.sm,
            
            '&:focus, &:hover, &.Mui-active, &.Mui-focusVisible': {
              boxShadow: shadows.md,
            },
            '&:before': {
              display: 'none',
            },
          },
          '& .MuiSlider-valueLabel': {
            borderRadius: borderRadius.md,
            backgroundColor: isLight ? colors.espresso : colors.ivory,
            color: isLight ? colors.warmWhite : colors.richBlack,
            fontWeight: fontWeights.medium,
          },
        },
      },
    },

    // ============================================
    // DIVIDER
    // ============================================
    MuiDivider: {
      styleOverrides: {
        root: {
          borderColor: isLight ? colors.sand : 'rgba(248, 246, 243, 0.08)',
        },
      },
    },

    // ============================================
    // ALERT
    // ============================================
    MuiAlert: {
      styleOverrides: {
        root: {
          borderRadius: borderRadius.lg,
          padding: '16px 20px',
        },
        standardSuccess: {
          backgroundColor: isLight ? 'rgba(122, 139, 110, 0.1)' : 'rgba(154, 168, 143, 0.15)',
        },
        standardError: {
          backgroundColor: isLight ? 'rgba(184, 92, 92, 0.1)' : 'rgba(204, 122, 122, 0.15)',
        },
        standardWarning: {
          backgroundColor: isLight ? 'rgba(201, 169, 98, 0.1)' : 'rgba(217, 190, 127, 0.15)',
        },
        standardInfo: {
          backgroundColor: isLight ? 'rgba(107, 130, 153, 0.1)' : 'rgba(139, 163, 184, 0.15)',
        },
      },
    },

    // ============================================
    // TOOLTIP
    // ============================================
    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          backgroundColor: isLight ? colors.espresso : colors.ivory,
          color: isLight ? colors.warmWhite : colors.richBlack,
          borderRadius: borderRadius.md,
          padding: '8px 14px',
          fontSize: '0.8125rem',
          fontWeight: fontWeights.medium,
          boxShadow: shadows.lg,
        },
        arrow: {
          color: isLight ? colors.espresso : colors.ivory,
        },
      },
    },

    // ============================================
    // SKELETON
    // ============================================
    MuiSkeleton: {
      styleOverrides: {
        root: {
          borderRadius: borderRadius.md,
          backgroundColor: isLight ? colors.sand : 'rgba(248, 246, 243, 0.08)',
        },
        rectangular: {
          borderRadius: borderRadius.lg,
        },
      },
    },

    // ============================================
    // MENU
    // ============================================
    MuiMenu: {
      styleOverrides: {
        paper: {
          borderRadius: borderRadius.lg,
          boxShadow: shadows.xl,
          border: `1px solid ${isLight ? colors.sand : 'rgba(248, 246, 243, 0.08)'}`,
          marginTop: '8px',
        },
      },
    },

    MuiMenuItem: {
      styleOverrides: {
        root: {
          padding: '12px 20px',
          borderRadius: borderRadius.md,
          margin: '4px 8px',
          transition: transitions.fast,
          
          '&:hover': {
            backgroundColor: isLight 
              ? 'rgba(61, 58, 54, 0.04)' 
              : 'rgba(248, 246, 243, 0.06)',
          },
          '&.Mui-selected': {
            backgroundColor: isLight 
              ? 'rgba(61, 58, 54, 0.08)' 
              : 'rgba(248, 246, 243, 0.1)',
            
            '&:hover': {
              backgroundColor: isLight 
                ? 'rgba(61, 58, 54, 0.12)' 
                : 'rgba(248, 246, 243, 0.14)',
            },
          },
        },
      },
    },

    // ============================================
    // DIALOG
    // ============================================
    MuiDialog: {
      styleOverrides: {
        paper: {
          borderRadius: borderRadius.xl,
          boxShadow: shadows['2xl'],
        },
      },
    },

    MuiDialogTitle: {
      styleOverrides: {
        root: {
          fontFamily: fontFamilies.heading,
          fontWeight: fontWeights.medium,
          padding: '24px 24px 16px',
        },
      },
    },

    MuiDialogContent: {
      styleOverrides: {
        root: {
          padding: '16px 24px',
        },
      },
    },

    MuiDialogActions: {
      styleOverrides: {
        root: {
          padding: '16px 24px 24px',
          gap: '12px',
        },
      },
    },

    // ============================================
    // TABS
    // ============================================
    MuiTabs: {
      styleOverrides: {
        root: {
          minHeight: '48px',
        },
        indicator: {
          height: '3px',
          borderRadius: `${borderRadius.full} ${borderRadius.full} 0 0`,
        },
      },
    },

    MuiTab: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: fontWeights.medium,
          letterSpacing: letterSpacings.wide,
          minHeight: '48px',
          padding: '12px 24px',
          transition: transitions.fast,
        },
      },
    },

    // ============================================
    // PROGRESS
    // ============================================
    MuiLinearProgress: {
      styleOverrides: {
        root: {
          borderRadius: borderRadius.full,
          height: 6,
        },
        bar: {
          borderRadius: borderRadius.full,
        },
      },
    },

    MuiCircularProgress: {
      styleOverrides: {
        root: {
          strokeLinecap: 'round',
        },
      },
    },

    // ============================================
    // SWITCH
    // ============================================
    MuiSwitch: {
      styleOverrides: {
        root: {
          width: 52,
          height: 32,
          padding: 0,
        },
        switchBase: {
          padding: 4,
          
          '&.Mui-checked': {
            transform: 'translateX(20px)',
            
            '& + .MuiSwitch-track': {
              opacity: 1,
            },
          },
        },
        thumb: {
          width: 24,
          height: 24,
          boxShadow: shadows.sm,
        },
        track: {
          borderRadius: borderRadius.full,
          opacity: 0.3,
        },
      },
    },

    // ============================================
    // BADGE
    // ============================================
    MuiBadge: {
      styleOverrides: {
        badge: {
          fontWeight: fontWeights.semibold,
          borderRadius: borderRadius.full,
          padding: '0 6px',
          minWidth: '20px',
          height: '20px',
        },
      },
    },

    // ============================================
    // AVATAR
    // ============================================
    MuiAvatar: {
      styleOverrides: {
        root: {
          fontWeight: fontWeights.medium,
          letterSpacing: letterSpacings.wide,
        },
        rounded: {
          borderRadius: borderRadius.lg,
        },
      },
    },

    // ============================================
    // LIST
    // ============================================
    MuiListItem: {
      styleOverrides: {
        root: {
          borderRadius: borderRadius.md,
          margin: '2px 0',
        },
      },
    },

    MuiListItemButton: {
      styleOverrides: {
        root: {
          borderRadius: borderRadius.md,
          transition: transitions.fast,
          
          '&:hover': {
            backgroundColor: isLight 
              ? 'rgba(61, 58, 54, 0.04)' 
              : 'rgba(248, 246, 243, 0.06)',
          },
          '&.Mui-selected': {
            backgroundColor: isLight 
              ? 'rgba(61, 58, 54, 0.08)' 
              : 'rgba(248, 246, 243, 0.1)',
          },
        },
      },
    },

    // ============================================
    // BACKDROP
    // ============================================
    MuiBackdrop: {
      styleOverrides: {
        root: {
          backgroundColor: isLight 
            ? 'rgba(26, 25, 24, 0.5)' 
            : 'rgba(0, 0, 0, 0.7)',
          backdropFilter: 'blur(4px)',
        },
      },
    },

    // ============================================
    // CSS BASELINE
    // ============================================
    MuiCssBaseline: {
      styleOverrides: {
        '*': {
          boxSizing: 'border-box',
        },
        html: {
          scrollBehavior: 'smooth',
        },
        body: {
          scrollbarWidth: 'thin',
          scrollbarColor: isLight 
            ? `${colors.stone} ${colors.sand}` 
            : `${colors.charcoal} ${colors.richBlack}`,
        },
        '::-webkit-scrollbar': {
          width: '10px',
          height: '10px',
        },
        '::-webkit-scrollbar-track': {
          backgroundColor: isLight ? colors.sand : colors.richBlack,
          borderRadius: borderRadius.full,
        },
        '::-webkit-scrollbar-thumb': {
          backgroundColor: isLight ? colors.stone : colors.charcoal,
          borderRadius: borderRadius.full,
          border: `2px solid ${isLight ? colors.sand : colors.richBlack}`,
          
          '&:hover': {
            backgroundColor: isLight ? colors.warmGray : colors.warmGray,
          },
        },
        '::selection': {
          backgroundColor: isLight 
            ? 'rgba(61, 58, 54, 0.2)' 
            : 'rgba(248, 246, 243, 0.25)',
        },
      },
    },
  };
};

export default createComponentOverrides;

