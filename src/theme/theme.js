import { createTheme } from '@mui/material/styles';

const typography = {
  fontFamily: "'Inter', 'Roboto', 'Helvetica', 'Arial', sans-serif",
  h1: { fontFamily: "'Montserrat', sans-serif", fontWeight: 700 },
  h2: { fontFamily: "'Montserrat', sans-serif", fontWeight: 600 },
  h3: { fontFamily: "'Montserrat', sans-serif", fontWeight: 600 },
  h4: { fontFamily: "'Montserrat', sans-serif", fontWeight: 600 },
  h5: { fontFamily: "'Montserrat', sans-serif", fontWeight: 500 },
  h6: { fontFamily: "'Montserrat', sans-serif", fontWeight: 500 },
  button: { textTransform: 'none', fontWeight: 600 },
};

const components = {
  MuiButton: {
    styleOverrides: {
      root: {
        borderRadius: 12,
        padding: '10px 24px',
        boxShadow: 'none',
        '&:hover': {
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
        },
      },
      contained: {
        '&:active': {
          boxShadow: 'none',
        },
      },
    },
  },
  MuiPaper: {
    styleOverrides: {
      root: {
        backgroundImage: 'none',
      },
      rounded: {
        borderRadius: 16,
      },
      elevation1: {
        boxShadow: '0 2px 12px rgba(0,0,0,0.05)',
      },
      elevation2: {
        boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
      },
    },
  },
  MuiCard: {
    styleOverrides: {
      root: {
        borderRadius: 16,
        overflow: 'hidden',
      },
    },
  },
  MuiTextField: {
    styleOverrides: {
      root: {
        '& .MuiOutlinedInput-root': {
          borderRadius: 12,
        },
      },
    },
  },
  MuiSelect: {
    styleOverrides: {
      root: {
        borderRadius: 12,
      },
    },
  },
  MuiChip: {
    styleOverrides: {
      root: {
        borderRadius: 8,
        fontWeight: 500,
      },
    },
  },
};

// Earth Palette - Inspired by Nature (Soil, Forest, Clay, Sand)
export const lightTheme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#4E342E', // Dark Earth Brown
      light: '#7B5E57',
      dark: '#260E04',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#558B2F', // Forest Green
      light: '#85BB5C',
      dark: '#255D00',
      contrastText: '#ffffff',
    },
    background: {
      default: '#FAFAF5', // Warm Off-White
      paper: '#FFFFFF',
    },
    text: {
      primary: '#3E2723', // Very Dark Brown
      secondary: '#5D4037', // Medium Brown
    },
    divider: 'rgba(78, 52, 46, 0.12)',
  },
  typography,
  components,
  shape: {
    borderRadius: 12,
  },
});

export const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#D7CCC8', // Pale Brown/Beige
      light: '#FFFFFF',
      dark: '#A69B97',
      contrastText: '#3E2723',
    },
    secondary: {
      main: '#AED581', // Light Green
      light: '#E1FFB1',
      dark: '#7DA453',
      contrastText: '#1B1B1B',
    },
    background: {
      default: '#1B1B1B', // Dark Charcoal
      paper: '#262626', // Slightly lighter charcoal
    },
    text: {
      primary: '#EFEBE9', // Off-white
      secondary: '#BCAAA4', // Muted Brownish Grey
    },
    divider: 'rgba(255, 255, 255, 0.1)',
  },
  typography,
  components: {
    ...components,
    MuiPaper: {
      styleOverrides: {
        ...components.MuiPaper.styleOverrides,
        elevation1: {
          boxShadow: '0 2px 12px rgba(0,0,0,0.3)',
        },
        elevation2: {
          boxShadow: '0 4px 20px rgba(0,0,0,0.5)',
        },
      },
    },
  },
  shape: {
    borderRadius: 12,
  },
});

