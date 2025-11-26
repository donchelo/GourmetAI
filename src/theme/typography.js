/**
 * Design System Marquet - Typography
 * Inspirado en la elegancia y sofisticación de Marquet NYC
 * 
 * Fuentes:
 * - Títulos: Cormorant Garamond (serif elegante)
 * - Body: DM Sans (sans-serif limpia y moderna)
 */

// Fuentes del sistema
export const fontFamilies = {
  heading: "'Cormorant Garamond', 'Georgia', 'Times New Roman', serif",
  body: "'DM Sans', 'Helvetica Neue', 'Arial', sans-serif",
  mono: "'JetBrains Mono', 'Fira Code', 'Consolas', monospace",
};

// Escala de tamaños de fuente (en rem)
export const fontSizes = {
  xs: '0.75rem',     // 12px
  sm: '0.875rem',    // 14px
  base: '1rem',      // 16px
  md: '1.125rem',    // 18px
  lg: '1.25rem',     // 20px
  xl: '1.5rem',      // 24px
  '2xl': '1.875rem', // 30px
  '3xl': '2.25rem',  // 36px
  '4xl': '3rem',     // 48px
  '5xl': '3.75rem',  // 60px
  '6xl': '4.5rem',   // 72px
};

// Pesos de fuente
export const fontWeights = {
  light: 300,
  regular: 400,
  medium: 500,
  semibold: 600,
  bold: 700,
};

// Altura de línea
export const lineHeights = {
  tight: 1.1,
  snug: 1.25,
  normal: 1.5,
  relaxed: 1.625,
  loose: 2,
};

// Letter spacing
export const letterSpacings = {
  tighter: '-0.05em',
  tight: '-0.025em',
  normal: '0',
  wide: '0.025em',
  wider: '0.05em',
  widest: '0.1em',
  elegant: '0.15em',  // Para títulos en mayúsculas
};

// Configuración de tipografía para MUI
export const typography = {
  fontFamily: fontFamilies.body,
  
  // Títulos principales - Cormorant Garamond
  h1: {
    fontFamily: fontFamilies.heading,
    fontWeight: fontWeights.light,
    fontSize: fontSizes['5xl'],
    lineHeight: lineHeights.tight,
    letterSpacing: letterSpacings.tight,
  },
  h2: {
    fontFamily: fontFamilies.heading,
    fontWeight: fontWeights.light,
    fontSize: fontSizes['4xl'],
    lineHeight: lineHeights.tight,
    letterSpacing: letterSpacings.tight,
  },
  h3: {
    fontFamily: fontFamilies.heading,
    fontWeight: fontWeights.regular,
    fontSize: fontSizes['3xl'],
    lineHeight: lineHeights.snug,
    letterSpacing: letterSpacings.normal,
  },
  h4: {
    fontFamily: fontFamilies.heading,
    fontWeight: fontWeights.regular,
    fontSize: fontSizes['2xl'],
    lineHeight: lineHeights.snug,
    letterSpacing: letterSpacings.normal,
  },
  h5: {
    fontFamily: fontFamilies.heading,
    fontWeight: fontWeights.medium,
    fontSize: fontSizes.xl,
    lineHeight: lineHeights.snug,
    letterSpacing: letterSpacings.normal,
  },
  h6: {
    fontFamily: fontFamilies.heading,
    fontWeight: fontWeights.medium,
    fontSize: fontSizes.lg,
    lineHeight: lineHeights.snug,
    letterSpacing: letterSpacings.normal,
  },
  
  // Subtítulos elegantes
  subtitle1: {
    fontFamily: fontFamilies.body,
    fontWeight: fontWeights.medium,
    fontSize: fontSizes.md,
    lineHeight: lineHeights.normal,
    letterSpacing: letterSpacings.wide,
  },
  subtitle2: {
    fontFamily: fontFamilies.body,
    fontWeight: fontWeights.medium,
    fontSize: fontSizes.sm,
    lineHeight: lineHeights.normal,
    letterSpacing: letterSpacings.wider,
    textTransform: 'uppercase',
  },
  
  // Texto body
  body1: {
    fontFamily: fontFamilies.body,
    fontWeight: fontWeights.regular,
    fontSize: fontSizes.base,
    lineHeight: lineHeights.relaxed,
    letterSpacing: letterSpacings.normal,
  },
  body2: {
    fontFamily: fontFamilies.body,
    fontWeight: fontWeights.regular,
    fontSize: fontSizes.sm,
    lineHeight: lineHeights.relaxed,
    letterSpacing: letterSpacings.normal,
  },
  
  // Botones
  button: {
    fontFamily: fontFamilies.body,
    fontWeight: fontWeights.medium,
    fontSize: fontSizes.sm,
    lineHeight: lineHeights.normal,
    letterSpacing: letterSpacings.wider,
    textTransform: 'none',
  },
  
  // Caption y overline
  caption: {
    fontFamily: fontFamilies.body,
    fontWeight: fontWeights.regular,
    fontSize: fontSizes.xs,
    lineHeight: lineHeights.normal,
    letterSpacing: letterSpacings.wide,
  },
  overline: {
    fontFamily: fontFamilies.body,
    fontWeight: fontWeights.semibold,
    fontSize: fontSizes.xs,
    lineHeight: lineHeights.normal,
    letterSpacing: letterSpacings.elegant,
    textTransform: 'uppercase',
  },
};

export default typography;

