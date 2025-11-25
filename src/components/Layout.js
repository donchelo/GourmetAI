import React from 'react';
import { Box, Container, Typography, AppBar, Toolbar, IconButton, useTheme, alpha } from '@mui/material';
import RestaurantMenuIcon from '@mui/icons-material/RestaurantMenu';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import { useColorMode } from '../context/ThemeContext';

const Layout = ({ children }) => {
  const theme = useTheme();
  const { toggleColorMode, mode } = useColorMode();

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', bgcolor: 'background.default' }}>
      <AppBar 
        position="sticky" 
        sx={{ 
          backgroundColor: alpha(theme.palette.background.paper, 0.8),
          backdropFilter: 'blur(12px)',
          boxShadow: theme.shadows[1],
          color: 'text.primary',
          borderBottom: `1px solid ${theme.palette.divider}`
        }}
      >
        <Toolbar>
          <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1, gap: 1 }}>
            <Box 
              sx={{ 
                p: 1, 
                borderRadius: '12px', 
                bgcolor: alpha(theme.palette.primary.main, 0.1),
                color: 'primary.main',
                display: 'flex'
              }}
            >
              <RestaurantMenuIcon />
            </Box>
            <Typography 
              variant="h5" 
              component="div" 
              sx={{ 
                fontWeight: 700, 
                letterSpacing: '-0.02em',
                background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              GourmetAI
            </Typography>
          </Box>
          
          <IconButton 
            onClick={toggleColorMode} 
            color="inherit"
            sx={{ 
              borderRadius: '12px',
              border: `1px solid ${theme.palette.divider}`,
              ml: 1
            }}
          >
            {mode === 'dark' ? <Brightness7Icon color="warning" /> : <Brightness4Icon color="primary" />}
          </IconButton>
        </Toolbar>
      </AppBar>
      <Container maxWidth="xl" sx={{ flexGrow: 1, py: 4, px: { xs: 2, md: 4 } }}>
        {children}
      </Container>
      <Box 
        component="footer" 
        sx={{ 
          py: 3, 
          textAlign: 'center',
          color: 'text.secondary',
          borderTop: `1px solid ${theme.palette.divider}`,
          mt: 'auto'
        }}
      >
        <Typography variant="body2">
          © {new Date().getFullYear()} GourmetAI • Potenciado por Inteligencia Artificial
        </Typography>
      </Box>
    </Box>
  );
};

export default Layout;
