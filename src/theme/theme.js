/**
 * Design System Marquet - Theme Configuration
 * Integración completa del sistema de diseño inspirado en Marquet NYC
 */

import { createTheme } from '@mui/material/styles';
import { typography } from './typography';
import { lightPalette, darkPalette } from './palette';
import { muiShadows, darkShadows, shape, spacingUnit, breakpoints } from './tokens';
import { createComponentOverrides } from './components';

/**
 * Tema claro - Elegante y minimalista
 */
export const lightTheme = createTheme({
  palette: lightPalette,
  typography,
  shadows: muiShadows,
  shape,
  spacing: spacingUnit,
  breakpoints: {
    values: breakpoints,
  },
  components: createComponentOverrides('light'),
});

/**
 * Tema oscuro - Sofisticado y refinado
 */
export const darkTheme = createTheme({
  palette: darkPalette,
  typography,
  shadows: darkShadows,
  shape,
  spacing: spacingUnit,
  breakpoints: {
    values: breakpoints,
  },
  components: createComponentOverrides('dark'),
});

const themeExports = { lightTheme, darkTheme };
export default themeExports;
