/**
 * Design System - Typography
 * Bold, editorial, and clean.
 */

// System Fonts
export const fontFamilies = {
  heading: "'Playfair Display', 'Georgia', serif", // More editorial/fashion vibe
  body: "'Inter', 'system-ui', '-apple-system', sans-serif", // Clean modern sans
  mono: "'JetBrains Mono', monospace",
};

// Font Weights
export const fontWeights = {
  light: 300,
  regular: 400,
  medium: 500,
  semibold: 600,
  bold: 700,
};

export const typography = {
  fontFamily: fontFamilies.body,
  fontWeightLight: fontWeights.light,
  fontWeightRegular: fontWeights.regular,
  fontWeightMedium: fontWeights.medium,
  fontWeightBold: fontWeights.bold,
  
  // Display Headings
  h1: {
    fontFamily: fontFamilies.heading,
    fontWeight: fontWeights.bold,
    fontSize: 'clamp(3.5rem, 8vw, 6rem)', // Responsive large text
    lineHeight: 1.1,
    letterSpacing: '-0.02em',
  },
  h2: {
    fontFamily: fontFamilies.heading,
    fontWeight: fontWeights.semibold,
    fontSize: 'clamp(2.5rem, 5vw, 4.5rem)',
    lineHeight: 1.2,
    letterSpacing: '-0.01em',
  },
  h3: {
    fontFamily: fontFamilies.heading,
    fontWeight: fontWeights.semibold,
    fontSize: 'clamp(2rem, 4vw, 3.5rem)',
    lineHeight: 1.2,
  },
  h4: {
    fontFamily: fontFamilies.heading,
    fontWeight: fontWeights.medium,
    fontSize: '2rem',
    lineHeight: 1.3,
  },
  h5: {
    fontFamily: fontFamilies.body, // Switch to sans for smaller headings
    fontWeight: fontWeights.semibold,
    fontSize: '1.5rem',
    lineHeight: 1.4,
  },
  h6: {
    fontFamily: fontFamilies.body,
    fontWeight: fontWeights.semibold,
    fontSize: '1.125rem',
    lineHeight: 1.4,
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
  },
  
  // Body Text
  subtitle1: {
    fontFamily: fontFamilies.body,
    fontWeight: fontWeights.medium,
    fontSize: '1.125rem',
    lineHeight: 1.6,
  },
  subtitle2: {
    fontFamily: fontFamilies.body,
    fontWeight: fontWeights.medium,
    fontSize: '0.875rem',
    lineHeight: 1.6,
    letterSpacing: '0.05em',
    textTransform: 'uppercase',
  },
  body1: {
    fontFamily: fontFamilies.body,
    fontWeight: fontWeights.regular,
    fontSize: '1rem',
    lineHeight: 1.7,
  },
  body2: {
    fontFamily: fontFamilies.body,
    fontWeight: fontWeights.regular,
    fontSize: '0.875rem',
    lineHeight: 1.7,
    color: 'text.secondary',
  },
  button: {
    fontFamily: fontFamilies.body,
    fontWeight: fontWeights.semibold,
    fontSize: '0.875rem',
    textTransform: 'uppercase',
    letterSpacing: '0.1em',
  },
  caption: {
    fontFamily: fontFamilies.body,
    fontWeight: fontWeights.regular,
    fontSize: '0.75rem',
    letterSpacing: '0.02em',
  },
  overline: {
    fontFamily: fontFamilies.body,
    fontWeight: fontWeights.bold,
    fontSize: '0.75rem',
    letterSpacing: '0.15em',
    textTransform: 'uppercase',
  },
};

export default typography;
