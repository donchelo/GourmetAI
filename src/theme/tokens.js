/**
 * Design System Marquet - Design Tokens
 * Tokens de diseño para espaciado, sombras, bordes y transiciones
 */

// Sistema de espaciado (basado en 4px)
export const spacing = {
  0: '0',
  1: '4px',
  2: '8px',
  3: '12px',
  4: '16px',
  5: '20px',
  6: '24px',
  8: '32px',
  10: '40px',
  12: '48px',
  16: '64px',
  20: '80px',
  24: '96px',
  32: '128px',
};

// Factor de espaciado para MUI (base 8px)
export const spacingUnit = 8;

// Sistema de sombras elegantes
export const shadows = {
  none: 'none',
  
  // Sombras sutiles para elementos elevados
  xs: '0 1px 2px rgba(26, 25, 24, 0.04)',
  sm: '0 2px 4px rgba(26, 25, 24, 0.06)',
  md: '0 4px 8px rgba(26, 25, 24, 0.08)',
  lg: '0 8px 16px rgba(26, 25, 24, 0.1)',
  xl: '0 16px 32px rgba(26, 25, 24, 0.12)',
  '2xl': '0 24px 48px rgba(26, 25, 24, 0.16)',
  
  // Sombras para focus y hover
  focus: '0 0 0 3px rgba(61, 58, 54, 0.15)',
  focusPrimary: '0 0 0 3px rgba(61, 58, 54, 0.2)',
  
  // Sombra interna sutil
  inner: 'inset 0 1px 2px rgba(26, 25, 24, 0.06)',
  innerLg: 'inset 0 2px 4px rgba(26, 25, 24, 0.08)',
};

// Array de sombras para MUI (0-24)
export const muiShadows = [
  shadows.none,                                          // 0
  shadows.xs,                                            // 1
  shadows.sm,                                            // 2
  shadows.md,                                            // 3
  shadows.md,                                            // 4
  shadows.lg,                                            // 5
  shadows.lg,                                            // 6
  shadows.lg,                                            // 7
  shadows.xl,                                            // 8
  shadows.xl,                                            // 9
  shadows.xl,                                            // 10
  shadows.xl,                                            // 11
  shadows['2xl'],                                        // 12
  shadows['2xl'],                                        // 13
  shadows['2xl'],                                        // 14
  shadows['2xl'],                                        // 15
  '0 32px 64px rgba(26, 25, 24, 0.18)',                 // 16
  '0 32px 64px rgba(26, 25, 24, 0.18)',                 // 17
  '0 32px 64px rgba(26, 25, 24, 0.2)',                  // 18
  '0 32px 64px rgba(26, 25, 24, 0.2)',                  // 19
  '0 40px 80px rgba(26, 25, 24, 0.22)',                 // 20
  '0 40px 80px rgba(26, 25, 24, 0.22)',                 // 21
  '0 48px 96px rgba(26, 25, 24, 0.24)',                 // 22
  '0 48px 96px rgba(26, 25, 24, 0.24)',                 // 23
  '0 56px 112px rgba(26, 25, 24, 0.26)',               // 24
];

// Sombras para modo oscuro
export const darkShadows = [
  shadows.none,                                          // 0
  '0 1px 2px rgba(0, 0, 0, 0.2)',                       // 1
  '0 2px 4px rgba(0, 0, 0, 0.25)',                      // 2
  '0 4px 8px rgba(0, 0, 0, 0.3)',                       // 3
  '0 4px 8px rgba(0, 0, 0, 0.3)',                       // 4
  '0 8px 16px rgba(0, 0, 0, 0.35)',                     // 5
  '0 8px 16px rgba(0, 0, 0, 0.35)',                     // 6
  '0 8px 16px rgba(0, 0, 0, 0.35)',                     // 7
  '0 16px 32px rgba(0, 0, 0, 0.4)',                     // 8
  '0 16px 32px rgba(0, 0, 0, 0.4)',                     // 9
  '0 16px 32px rgba(0, 0, 0, 0.4)',                     // 10
  '0 16px 32px rgba(0, 0, 0, 0.4)',                     // 11
  '0 24px 48px rgba(0, 0, 0, 0.45)',                    // 12
  '0 24px 48px rgba(0, 0, 0, 0.45)',                    // 13
  '0 24px 48px rgba(0, 0, 0, 0.45)',                    // 14
  '0 24px 48px rgba(0, 0, 0, 0.45)',                    // 15
  '0 32px 64px rgba(0, 0, 0, 0.5)',                     // 16
  '0 32px 64px rgba(0, 0, 0, 0.5)',                     // 17
  '0 32px 64px rgba(0, 0, 0, 0.5)',                     // 18
  '0 32px 64px rgba(0, 0, 0, 0.5)',                     // 19
  '0 40px 80px rgba(0, 0, 0, 0.55)',                    // 20
  '0 40px 80px rgba(0, 0, 0, 0.55)',                    // 21
  '0 48px 96px rgba(0, 0, 0, 0.6)',                     // 22
  '0 48px 96px rgba(0, 0, 0, 0.6)',                     // 23
  '0 56px 112px rgba(0, 0, 0, 0.65)',                  // 24
];

// Bordes redondeados
export const borderRadius = {
  none: '0',
  sm: '4px',
  md: '8px',
  lg: '12px',
  xl: '16px',
  '2xl': '24px',
  '3xl': '32px',
  full: '9999px',
};

// Grosor de bordes
export const borderWidth = {
  0: '0',
  1: '1px',
  2: '2px',
  3: '3px',
  4: '4px',
};

// Transiciones elegantes
export const transitions = {
  // Duraciones
  duration: {
    instant: '0ms',
    fast: '150ms',
    normal: '250ms',
    slow: '350ms',
    slower: '500ms',
  },
  
  // Easing functions
  easing: {
    linear: 'linear',
    easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
    easeOut: 'cubic-bezier(0, 0, 0.2, 1)',
    easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
    elegant: 'cubic-bezier(0.25, 0.1, 0.25, 1)',
    bounce: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
  },
  
  // Presets comunes
  default: '250ms cubic-bezier(0.4, 0, 0.2, 1)',
  fast: '150ms cubic-bezier(0.4, 0, 0.2, 1)',
  slow: '350ms cubic-bezier(0.25, 0.1, 0.25, 1)',
  color: 'color 250ms cubic-bezier(0.4, 0, 0.2, 1)',
  opacity: 'opacity 250ms cubic-bezier(0.4, 0, 0.2, 1)',
  transform: 'transform 250ms cubic-bezier(0.25, 0.1, 0.25, 1)',
  all: 'all 250ms cubic-bezier(0.4, 0, 0.2, 1)',
};

// Z-index scale
export const zIndex = {
  hide: -1,
  base: 0,
  dropdown: 1000,
  sticky: 1100,
  fixed: 1200,
  modalBackdrop: 1300,
  modal: 1400,
  popover: 1500,
  tooltip: 1600,
};

// Breakpoints
export const breakpoints = {
  xs: 0,
  sm: 600,
  md: 900,
  lg: 1200,
  xl: 1536,
};

// Configuración de forma para MUI
export const shape = {
  borderRadius: 12, // valor por defecto
};

const tokensExports = {
  spacing,
  spacingUnit,
  shadows,
  muiShadows,
  darkShadows,
  borderRadius,
  borderWidth,
  transitions,
  zIndex,
  breakpoints,
  shape,
};
export default tokensExports;

