/**
 * Design System Marquet - Color Palette
 * Inspirado en la elegancia minimalista de Marquet NYC
 * 
 * Paleta sofisticada con tonos neutros cálidos,
 * cremas elegantes y acentos sutiles.
 */

// Colores base del sistema
export const colors = {
  // Neutros cálidos - Base de la paleta
  warmWhite: '#FDFCFA',
  cream: '#F8F6F3',
  ivory: '#F3F0EB',
  sand: '#E8E4DD',
  taupe: '#D4CFC6',
  stone: '#B8B2A7',
  warmGray: '#8F8882',
  charcoal: '#5A5651',
  espresso: '#3D3A36',
  richBlack: '#1A1918',
  
  // Acentos elegantes
  olive: '#7A7A5E',
  sage: '#A3A78E',
  terracotta: '#C4A484',
  dustyRose: '#C9B1A0',
  champagne: '#E8DED1',
  
  // Colores funcionales
  success: '#7A8B6E',
  warning: '#C9A962',
  error: '#B85C5C',
  info: '#6B8299',
};

// Paleta clara (modo light)
export const lightPalette = {
  mode: 'light',
  
  primary: {
    main: colors.espresso,
    light: colors.charcoal,
    dark: colors.richBlack,
    contrastText: colors.warmWhite,
  },
  
  secondary: {
    main: colors.olive,
    light: colors.sage,
    dark: '#5E5E46',
    contrastText: colors.warmWhite,
  },
  
  background: {
    default: colors.cream,
    paper: colors.warmWhite,
    subtle: colors.ivory,
    elevated: '#FFFFFF',
  },
  
  text: {
    primary: colors.espresso,
    secondary: colors.warmGray,
    disabled: colors.stone,
    hint: colors.taupe,
  },
  
  divider: colors.sand,
  
  // Colores de acción
  action: {
    active: colors.espresso,
    hover: 'rgba(61, 58, 54, 0.04)',
    selected: 'rgba(61, 58, 54, 0.08)',
    disabled: colors.stone,
    disabledBackground: colors.sand,
    focus: 'rgba(61, 58, 54, 0.12)',
  },
  
  // Estados funcionales
  success: {
    main: colors.success,
    light: '#9AA88F',
    dark: '#5E6B54',
    contrastText: colors.warmWhite,
  },
  
  warning: {
    main: colors.warning,
    light: '#D9BE7F',
    dark: '#A68B4F',
    contrastText: colors.richBlack,
  },
  
  error: {
    main: colors.error,
    light: '#CC7A7A',
    dark: '#944545',
    contrastText: colors.warmWhite,
  },
  
  info: {
    main: colors.info,
    light: '#8BA3B8',
    dark: '#526B80',
    contrastText: colors.warmWhite,
  },
  
  // Colores personalizados adicionales
  custom: {
    cream: colors.cream,
    ivory: colors.ivory,
    sand: colors.sand,
    taupe: colors.taupe,
    stone: colors.stone,
    champagne: colors.champagne,
    terracotta: colors.terracotta,
    dustyRose: colors.dustyRose,
  },
};

// Paleta oscura (modo dark)
export const darkPalette = {
  mode: 'dark',
  
  primary: {
    main: colors.champagne,
    light: colors.ivory,
    dark: colors.taupe,
    contrastText: colors.richBlack,
  },
  
  secondary: {
    main: colors.sage,
    light: '#BFC3AA',
    dark: colors.olive,
    contrastText: colors.richBlack,
  },
  
  background: {
    default: colors.richBlack,
    paper: '#242220',
    subtle: '#2A2826',
    elevated: '#302E2B',
  },
  
  text: {
    primary: colors.ivory,
    secondary: colors.stone,
    disabled: colors.warmGray,
    hint: colors.charcoal,
  },
  
  divider: 'rgba(248, 246, 243, 0.08)',
  
  // Colores de acción
  action: {
    active: colors.ivory,
    hover: 'rgba(248, 246, 243, 0.06)',
    selected: 'rgba(248, 246, 243, 0.1)',
    disabled: colors.warmGray,
    disabledBackground: colors.charcoal,
    focus: 'rgba(248, 246, 243, 0.14)',
  },
  
  // Estados funcionales (ajustados para dark mode)
  success: {
    main: '#9AA88F',
    light: '#B3BFA8',
    dark: colors.success,
    contrastText: colors.richBlack,
  },
  
  warning: {
    main: '#D9BE7F',
    light: '#E5D199',
    dark: colors.warning,
    contrastText: colors.richBlack,
  },
  
  error: {
    main: '#CC7A7A',
    light: '#D99999',
    dark: colors.error,
    contrastText: colors.richBlack,
  },
  
  info: {
    main: '#8BA3B8',
    light: '#A8BCC9',
    dark: colors.info,
    contrastText: colors.richBlack,
  },
  
  // Colores personalizados adicionales
  custom: {
    cream: colors.cream,
    ivory: colors.ivory,
    sand: colors.sand,
    taupe: colors.taupe,
    stone: colors.stone,
    champagne: colors.champagne,
    terracotta: colors.terracotta,
    dustyRose: colors.dustyRose,
  },
};

const paletteExports = { colors, lightPalette, darkPalette };
export default paletteExports;

