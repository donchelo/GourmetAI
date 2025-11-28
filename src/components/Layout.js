import React, { useState, useEffect } from 'react';
import { Box, Container, Typography, AppBar, Toolbar, IconButton, useTheme, alpha, Slide, useScrollTrigger } from '@mui/material';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import { useColorMode } from '../context/ThemeContext';

function HideOnScroll(props) {
  const { children } = props;
  const trigger = useScrollTrigger();

  return (
    <Slide appear={false} direction="down" in={!trigger}>
      {children}
    </Slide>
  );
}

const Layout = ({ children }) => {
  const theme = useTheme();
  const { toggleColorMode, mode } = useColorMode();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <Box 
      sx={{ 
        display: 'flex', 
        flexDirection: 'column', 
        minHeight: '100vh', 
        bgcolor: 'background.default',
        color: 'text.primary',
        transition: 'background-color 0.3s ease, color 0.3s ease',
      }}
    >
      <HideOnScroll>
        <AppBar 
          position="fixed" 
          elevation={scrolled ? 1 : 0}
          sx={{ 
            backgroundColor: scrolled ? alpha(theme.palette.background.paper, 0.9) : 'transparent',
            backdropFilter: scrolled ? 'blur(10px)' : 'none',
            color: scrolled ? 'text.primary' : (mode === 'dark' ? 'text.primary' : 'black'), // Adjust text color based on bg
            transition: 'all 0.3s ease',
            borderBottom: scrolled ? `1px solid ${alpha(theme.palette.divider, 0.5)}` : 'none',
          }}
        >
          <Toolbar sx={{ justifyContent: 'space-between', minHeight: { xs: 64, md: 80 } }}>
            {/* Logo / Brand */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
               <Typography 
                variant="h5" 
                component="div" 
                sx={{ 
                  fontFamily: theme.typography.h1.fontFamily,
                  fontWeight: 700,
                  letterSpacing: '-0.02em',
                  fontSize: { xs: '1.5rem', md: '1.8rem' },
                  cursor: 'pointer',
                }}
              >
                FoodFest
                <Box component="span" sx={{ color: theme.palette.secondary.main, fontSize: '2rem', lineHeight: 0 }}>.</Box>
              </Typography>
            </Box>

            {/* Navigation Actions */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <IconButton 
                onClick={toggleColorMode} 
                size="large"
                edge="end"
                color="inherit"
                sx={{
                  border: `1px solid ${alpha(theme.palette.text.primary, 0.2)}`,
                  borderRadius: '50%',
                  '&:hover': {
                    backgroundColor: alpha(theme.palette.text.primary, 0.05),
                    borderColor: theme.palette.text.primary,
                  }
                }}
              >
                {mode === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
              </IconButton>
            </Box>
          </Toolbar>
        </AppBar>
      </HideOnScroll>

      {/* Main Content */}
      <Box 
        component="main" 
        sx={{ 
          flexGrow: 1, 
          pt: { xs: 10, md: 12 }, // Padding top to account for fixed header
          display: 'flex', 
          flexDirection: 'column',
        }}
      >
        <Container maxWidth="xl" sx={{ flexGrow: 1 }}>
          {children}
        </Container>
      </Box>

      {/* Footer */}
      <Box 
        component="footer" 
        sx={{ 
          py: 6, 
          px: 2,
          mt: 'auto',
          borderTop: `1px solid ${theme.palette.divider}`,
          backgroundColor: theme.palette.background.paper,
        }}
      >
        <Container maxWidth="lg">
          <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, justifyContent: 'space-between', alignItems: 'center', gap: 2 }}>
            <Typography variant="h6" sx={{ fontFamily: theme.typography.h1.fontFamily, fontWeight: 700 }}>
              FoodFest.
            </Typography>
            <Typography variant="body2" color="text.secondary">
              © {new Date().getFullYear()} GourmetAI Experience. All rights reserved.
            </Typography>
          </Box>
        </Container>
      </Box>
    </Box>
  );
};

export default Layout;
