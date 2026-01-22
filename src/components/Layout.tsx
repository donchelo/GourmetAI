import React, { useState, useEffect, ReactNode } from 'react';
import { Box, Container, Typography, AppBar, Toolbar, IconButton, useTheme, alpha, Slide, useScrollTrigger, Button, TextField, InputAdornment } from '@mui/material';
import { useLocation, useNavigate, Link as RouterLink } from 'react-router-dom';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import KeyIcon from '@mui/icons-material/Key';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { useColorMode } from '../context/ThemeContext';
import { useApi } from '../context/ApiContext';

interface HideOnScrollProps {
  children: React.ReactElement;
}

function HideOnScroll(props: HideOnScrollProps) {
  const { children } = props;
  const trigger = useScrollTrigger();

  return (
    <Slide appear={false} direction="down" in={!trigger}>
      {children}
    </Slide>
  );
}

interface LayoutProps {
  children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const theme = useTheme();
  const location = useLocation();
  const navigate = useNavigate();
  const { toggleColorMode, mode } = useColorMode();
  const { apiKey, setApiKey } = useApi();
  const [scrolled, setScrolled] = useState(false);
  const [showApiKey, setShowApiKey] = useState(false);
  const [localApiKey, setLocalApiKey] = useState(apiKey);

  const isPlatform = location.pathname === '/app';

  useEffect(() => {
    setLocalApiKey(apiKey);
  }, [apiKey]);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleApiKeyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLocalApiKey(e.target.value);
  };

  const handleApiKeyBlur = () => {
    setApiKey(localApiKey);
  };

  const toggleShowApiKey = () => {
    setShowApiKey(!showApiKey);
  };

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
          elevation={scrolled || isPlatform ? 1 : 0}
          sx={{ 
            backgroundColor: (scrolled || isPlatform) ? alpha(theme.palette.background.paper, 0.9) : 'transparent',
            backdropFilter: (scrolled || isPlatform) ? 'blur(10px)' : 'none',
            color: (scrolled || isPlatform) ? 'text.primary' : (mode === 'dark' ? 'text.primary' : theme.palette.common.black),
            transition: 'all 0.3s ease',
            borderBottom: (scrolled || isPlatform) ? `1px solid ${alpha(theme.palette.divider, 0.5)}` : 'none',
          }}
        >
          <Toolbar sx={{ justifyContent: 'space-between', minHeight: { xs: 64, md: 80 } }}>
            {/* Logo / Brand */}
            <Box 
              sx={{ display: 'flex', alignItems: 'center', gap: 2, cursor: 'pointer' }}
              onClick={() => navigate('/')}
            >
               <Typography 
                variant="h5" 
                component="div" 
                sx={{ 
                  fontFamily: theme.typography.h1.fontFamily,
                  fontWeight: 700,
                  letterSpacing: '-0.02em',
                  fontSize: { xs: '1.5rem', md: '1.8rem' },
                }}
              >
                VisualFeast
                <Box component="span" sx={{ color: theme.palette.secondary.main, fontSize: '2rem', lineHeight: 0 }}>.</Box>
              </Typography>
            </Box>

            {/* Navigation Actions */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              {isPlatform ? (
                <TextField
                  size="small"
                  type={showApiKey ? 'text' : 'password'}
                  placeholder="Gemini API Key"
                  value={localApiKey}
                  onChange={handleApiKeyChange}
                  onBlur={handleApiKeyBlur}
                  variant="outlined"
                  sx={{
                    width: { xs: '150px', sm: '250px' },
                    '& .MuiOutlinedInput-root': {
                      borderRadius: '20px',
                      backgroundColor: alpha(theme.palette.background.paper, 0.1),
                      color: scrolled ? 'text.primary' : (mode === 'dark' ? 'text.primary' : theme.palette.common.black),
                      '& fieldset': {
                        borderColor: alpha(scrolled ? theme.palette.text.primary : (mode === 'dark' ? theme.palette.text.primary : theme.palette.common.black), 0.2),
                      },
                    },
                  }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <KeyIcon fontSize="small" sx={{ color: 'inherit', opacity: 0.7 }} />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          size="small"
                          onClick={toggleShowApiKey}
                          onMouseDown={(e) => e.preventDefault()}
                          sx={{ color: 'inherit', opacity: 0.7 }}
                        >
                          {showApiKey ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              ) : (
                <Button 
                  variant="contained" 
                  color="secondary"
                  component={RouterLink}
                  to="/app"
                  sx={{ 
                    borderRadius: '20px', 
                    px: 3, 
                    fontWeight: 700,
                    display: { xs: 'none', sm: 'inline-flex' }
                  }}
                >
                  Entrar a la Plataforma
                </Button>
              )}
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
          pt: { xs: '64px', md: '80px' }, // Espacio para el AppBar fijo
          display: 'flex', 
          flexDirection: 'column',
        }}
      >
        {children}
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
              VisualFeast.
            </Typography>
            <Typography variant="body2" color="text.secondary">
              © {new Date().getFullYear()} VisualFeast Experience. All rights reserved.
            </Typography>
          </Box>
        </Container>
      </Box>
    </Box>
  );
};

export default Layout;
