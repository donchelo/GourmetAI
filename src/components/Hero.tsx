import React, { useState, useEffect } from 'react';
import { Box, Typography, IconButton, Fade, Container, Button, useTheme } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';

interface Slide {
  image: string;
  title: string;
  subtitle: string;
}

// Define content for the slider
const SLIDES: Slide[] = [
  {
    image: 'slide-1.png',
    title: "Diseña Platos Increíbles",
    subtitle: "Visualiza tus ideas culinarias en segundos."
  },
  {
    image: 'slide-2.png',
    title: "Crea Cartas Inteligentes",
    subtitle: "Menús que atraen y venden más."
  },
  {
    image: 'slide-3.png',
    title: "Fotografía de Estudio con IA",
    subtitle: "Resultados profesionales sin cámara."
  },
  {
    image: 'slide-4.png',
    title: "Revoluciona tu Cocina",
    subtitle: "La herramienta creativa para chefs modernos."
  },
  {
    image: 'slide-5.png',
    title: "Inspiración Ilimitada",
    subtitle: "Explora nuevas combinaciones y sabores."
  }
].map(slide => ({
  ...slide,
  image: `/images/home/slides/${slide.image}`
}));

const Hero: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState<number>(0);
  const theme = useTheme();

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % SLIDES.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % SLIDES.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? SLIDES.length - 1 : prev - 1));
  };

  return (
    <Box
      sx={{
        width: '100%',
        height: { xs: 'auto', md: '90vh' },
        minHeight: '700px',
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundImage: `url('/images/home/home.jpg')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        mb: 0,
        py: 4,
        overflow: 'hidden',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          zIndex: 1
        }
      }}
    >
      {/* Título flotante superior */}
      <Box 
        sx={{ 
          position: 'absolute', 
          top: { xs: 20, md: 40 }, 
          left: { xs: 20, md: 60 }, 
          zIndex: 2,
          color: 'white',
          textAlign: 'left',
          width: 'auto'
        }}
      >
        <Typography 
          variant="h6" 
          component="h1" 
          sx={{ 
            fontWeight: 700, 
            letterSpacing: '0.05em',
            textTransform: 'uppercase',
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            fontSize: { xs: '0.9rem', md: '1.1rem' }
          }}
        >
          VISUAL FEAST <span style={{ fontWeight: 400, textTransform: 'none', fontSize: '0.9em', opacity: 0.8 }}>|</span> 
          <Box component="span" sx={{ borderBottom: '2px solid white' }}>
            Design the Taste
          </Box>
        </Typography>
      </Box>

      {/* Contenedor del Slider Centrado */}
      <Container maxWidth="md" sx={{ position: 'relative', zIndex: 2, mt: 4 }}>
        <Box
          sx={{
            position: 'relative',
            width: '100%',
            aspectRatio: '16/9',
            borderRadius: { xs: 2, md: 4 },
            overflow: 'hidden',
            boxShadow: '0 40px 100px rgba(0,0,0,0.6)',
            bgcolor: '#000',
            mb: 6
          }}
        >
          {/* Slides */}
          {SLIDES.map((slide, index) => (
            <Fade
              key={slide.image}
              in={currentSlide === index}
              timeout={1000}
              mountOnEnter={false}
              unmountOnExit={false}
            >
              <Box
                sx={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  zIndex: currentSlide === index ? 1 : 0,
                }}
              >
                <img
                  src={slide.image}
                  alt={`Slide ${index + 1}`}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    display: 'block'
                  }}
                  onError={(e) => {
                    console.error('Error loading image:', slide.image);
                  }}
                />
              </Box>
            </Fade>
          ))}

          {/* Overlay Gradient en el slider */}
           <Box
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'linear-gradient(to bottom, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0) 50%, rgba(0,0,0,0.7) 100%)',
              pointerEvents: 'none',
              zIndex: 2,
            }}
          />

          {/* Textos del Slider */}
          <Box 
            sx={{ 
              position: 'absolute', 
              bottom: {xs: 30, md: 50}, 
              left: {xs: 20, md: 40}, 
              zIndex: 3, 
              color: 'white', 
              maxWidth: '600px', 
              textShadow: '0 2px 20px rgba(0,0,0,0.5)',
              pointerEvents: 'none'
            }}
          >
            <Fade in={true} key={currentSlide} timeout={800}>
              <Box>
                <Typography 
                  variant="h3" 
                  sx={{ 
                    fontWeight: 700, 
                    mb: 1, 
                    fontFamily: theme.typography.h1.fontFamily,
                    fontSize: { xs: '1.8rem', md: '2.8rem' }
                  }}
                >
                  {SLIDES[currentSlide].title}
                </Typography>
                <Typography variant="h6" sx={{ opacity: 0.9, fontWeight: 300, fontSize: { xs: '0.9rem', md: '1.1rem' }, textTransform: 'none', letterSpacing: 'normal' }}>
                  {SLIDES[currentSlide].subtitle}
                </Typography>
              </Box>
            </Fade>
          </Box>

          {/* Flechas de Navegación */}
          <IconButton
            onClick={prevSlide}
            sx={{
              position: 'absolute',
              left: 20,
              top: '50%',
              transform: 'translateY(-50%)',
              color: 'white',
              bgcolor: 'rgba(255,255,255,0.1)',
              backdropFilter: 'blur(5px)',
              '&:hover': { bgcolor: 'rgba(255,255,255,0.2)' },
              zIndex: 3,
              display: { xs: 'none', md: 'flex' }
            }}
          >
            <ArrowBackIosNewIcon />
          </IconButton>

          <IconButton
            onClick={nextSlide}
            sx={{
              position: 'absolute',
              right: 20,
              top: '50%',
              transform: 'translateY(-50%)',
              color: 'white',
              bgcolor: 'rgba(255,255,255,0.1)',
              backdropFilter: 'blur(5px)',
              '&:hover': { bgcolor: 'rgba(255,255,255,0.2)' },
              zIndex: 3,
              display: { xs: 'none', md: 'flex' }
            }}
          >
            <ArrowForwardIosIcon />
          </IconButton>

          {/* Indicadores */}
          <Box
            sx={{
              position: 'absolute',
              bottom: 20,
              left: '50%',
              transform: 'translateX(-50%)',
              display: 'flex',
              gap: 1,
              zIndex: 3
            }}
          >
            {SLIDES.map((_, index) => (
              <Box
                key={index}
                onClick={() => setCurrentSlide(index)}
                sx={{
                  width: currentSlide === index ? 32 : 8,
                  height: 4,
                  borderRadius: 2,
                  bgcolor: 'white',
                  opacity: currentSlide === index ? 1 : 0.5,
                  transition: 'all 0.3s ease',
                  cursor: 'pointer',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.3)'
                }}
              />
            ))}
          </Box>
        </Box>

        {/* CTA Button */}
        <Box sx={{ textAlign: 'center', mt: 2 }}>
          <Button 
            variant="contained" 
            color="secondary" 
            size="large"
            component={RouterLink}
            to="/app"
            startIcon={<PlayArrowIcon />}
            sx={{ 
              py: 2, 
              px: 6, 
              borderRadius: '50px',
              fontWeight: 700,
              fontSize: '1.1rem',
              boxShadow: `0 20px 40px ${theme.palette.secondary.main}55`,
              transition: 'all 0.3s ease',
              '&:hover': {
                transform: 'scale(1.05)',
                boxShadow: `0 25px 50px ${theme.palette.secondary.main}77`,
              }
            }}
          >
            Empezar a Crear
          </Button>
        </Box>
      </Container>
    </Box>
  );
};

export default Hero;
