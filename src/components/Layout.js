import React from 'react';
import { Box, Container, Typography, AppBar, Toolbar, IconButton, useTheme, alpha } from '@mui/material';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import { useColorMode } from '../context/ThemeContext';

const Layout = ({ children }) => {
  const theme = useTheme();
  const { toggleColorMode, mode } = useColorMode();
  const isLight = mode === 'light';

  return (
    <Box 
      sx={{ 
        display: 'flex', 
        flexDirection: 'column', 
        minHeight: '100vh', 
        bgcolor: 'background.default',
        transition: 'background-color 0.3s ease',
      }}
    >
      {/* Header elegante con efecto glassmorphism */}
      <AppBar 
        position="sticky" 
        elevation={0}
        sx={{ 
          backgroundColor: alpha(theme.palette.background.paper, isLight ? 0.85 : 0.9),
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          color: 'text.primary',
          borderBottom: `1px solid ${theme.palette.divider}`,
        }}
      >
        <Toolbar 
          sx={{ 
            minHeight: { xs: '64px', md: '80px' },
            px: { xs: 2, md: 4 },
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1, gap: 2 }}>
            {/* Logo */}
            <Box 
              component="img"
              src="/images/logo.png"
              alt="GourmetAI Logo"
              sx={{ 
                height: { xs: 36, md: 44 },
                width: 'auto',
                objectFit: 'contain',
                filter: mode === 'dark' ? 'invert(1) brightness(0.9)' : 'none',
                transition: 'filter 0.3s ease',
              }}
            />
            
            {/* Nombre de la marca */}
            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
              <Typography 
                variant="h4" 
                component="div" 
                sx={{ 
                  fontWeight: 300,
                  letterSpacing: '-0.02em',
                  lineHeight: 1,
                  color: 'text.primary',
                  fontSize: { xs: '1.5rem', md: '1.875rem' },
                }}
              >
                Gourmet
                <Box 
                  component="span" 
                  sx={{ 
                    fontWeight: 500,
                    color: 'secondary.main',
                  }}
                >
                  AI
                </Box>
              </Typography>
              <Typography
                variant="caption"
                sx={{
                  color: 'text.secondary',
                  letterSpacing: '0.15em',
                  textTransform: 'uppercase',
                  fontSize: '0.625rem',
                  mt: 0.25,
                  display: { xs: 'none', sm: 'block' },
                }}
              >
                Transformación culinaria
              </Typography>
            </Box>
          </Box>
          
          {/* Toggle de tema */}
          <IconButton 
            onClick={toggleColorMode} 
            size="medium"
            sx={{ 
              borderRadius: '12px',
              border: `1.5px solid ${theme.palette.divider}`,
              p: 1.25,
              transition: 'all 0.2s ease',
              '&:hover': {
                backgroundColor: alpha(theme.palette.primary.main, 0.06),
                borderColor: theme.palette.text.secondary,
                transform: 'scale(1.05)',
              },
            }}
          >
            {mode === 'dark' ? (
              <Brightness7Icon 
                sx={{ 
                  fontSize: 22,
                  color: 'warning.main',
                }} 
              />
            ) : (
              <Brightness4Icon 
                sx={{ 
                  fontSize: 22,
                  color: 'text.secondary',
                }} 
              />
            )}
          </IconButton>
        </Toolbar>
      </AppBar>

      {/* Contenido principal */}
      <Container 
        maxWidth="xl" 
        sx={{ 
          flexGrow: 1, 
          py: { xs: 3, md: 5 }, 
          px: { xs: 2, sm: 3, md: 4 }, 
          display: 'flex', 
          flexDirection: 'column',
        }}
      >
        {children}
      </Container>

      {/* Footer elegante y minimalista */}
      <Box 
        component="footer" 
        sx={{ 
          py: { xs: 3, md: 4 }, 
          px: { xs: 2, md: 4 },
          textAlign: 'center',
          color: 'text.secondary',
          borderTop: `1px solid ${theme.palette.divider}`,
          mt: 'auto',
          backgroundColor: alpha(theme.palette.background.paper, 0.5),
        }}
      >
        <Typography 
          variant="body2" 
          sx={{ 
            fontWeight: 400,
            letterSpacing: '0.02em',
          }}
        >
          © {new Date().getFullYear()}{' '}
          <Box 
            component="span" 
            sx={{ 
              fontFamily: "'Cormorant Garamond', serif",
              fontWeight: 500,
              fontSize: '1.05em',
            }}
          >
            GourmetAI
          </Box>
          {' '}
          <Box 
            component="span" 
            sx={{ 
              mx: 1, 
              opacity: 0.4,
              display: { xs: 'none', sm: 'inline' },
            }}
          >
            •
          </Box>
          <Box 
            component="span"
            sx={{ 
              display: { xs: 'block', sm: 'inline' },
              mt: { xs: 0.5, sm: 0 },
            }}
          >
            Potenciado por Inteligencia Artificial
          </Box>
        </Typography>
      </Box>
    </Box>
  );
};

export default Layout;
