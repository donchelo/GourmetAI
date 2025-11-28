import React, { useState, useEffect } from 'react';
import { Box, Typography, useTheme, IconButton, Fade } from '@mui/material';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';

// Define images with manual path encoding to be safe
const SLIDE_IMAGES = [
  'slide-1.png',
  'slide-2.png',
  'slide-3.png',
  'slide-4.png',
  'slide-5.png',
].map(filename => `/images/home/slides/${filename}`); 

const Hero = () => {
  const theme = useTheme();
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % SLIDE_IMAGES.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % SLIDE_IMAGES.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? SLIDE_IMAGES.length - 1 : prev - 1));
  };

  return (
    <Box sx={{ width: '100%', mb: 6 }}>
      {/* Header Title Section */}
      <Box sx={{ textAlign: 'center', mb: 4 }}>
        <Typography 
          variant="h6" 
          component="h1" 
          sx={{ 
            fontWeight: 700, 
            letterSpacing: '0.05em',
            textTransform: 'uppercase',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 1,
            fontSize: { xs: '1rem', md: '1.25rem' }
          }}
        >
          FOOD MENU <span style={{ fontWeight: 400, textTransform: 'none', fontSize: '0.9em', color: theme.palette.text.secondary }}>from</span> 
          <Box component="span" sx={{ borderBottom: `2px solid ${theme.palette.text.primary}` }}>
            FoodFest 1.0
          </Box>
        </Typography>
      </Box>

      {/* Hero Slider Container */}
      <Box 
        sx={{ 
          position: 'relative',
          width: '100%',
          // Maintain aspect ratio
          aspectRatio: { xs: '4/3', md: '16/9', lg: '21/9' },
          borderRadius: { xs: 0, md: 4 }, 
          overflow: 'hidden',
          boxShadow: theme.shadows[4],
          bgcolor: '#f0f0f0', // Neutral background while loading
        }}
      >
        {/* Slides */}
        {SLIDE_IMAGES.map((img, index) => (
          <Fade 
            key={img} 
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
                  src={img}
                  alt={`Slide ${index + 1}`}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    display: 'block'
                  }}
                  onError={(e) => {
                    console.error('Error loading image:', img);
                    e.target.style.display = 'none'; // Hide broken images
                  }}
                />
             </Box>
          </Fade>
        ))}

        {/* Overlay Gradient */}
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'linear-gradient(to bottom, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0) 50%, rgba(0,0,0,0.2) 100%)',
            pointerEvents: 'none',
            zIndex: 2,
          }}
        />

        {/* Navigation Arrows */}
        <IconButton
          onClick={prevSlide}
          sx={{
            position: 'absolute',
            left: { xs: 10, md: 20 },
            top: '50%',
            transform: 'translateY(-50%)',
            color: 'white',
            bgcolor: 'rgba(0,0,0,0.3)',
            backdropFilter: 'blur(4px)',
            '&:hover': { bgcolor: 'rgba(0,0,0,0.5)' },
            display: { xs: 'none', md: 'flex' },
            zIndex: 3,
          }}
        >
          <ArrowBackIosNewIcon />
        </IconButton>
        
        <IconButton
          onClick={nextSlide}
          sx={{
            position: 'absolute',
            right: { xs: 10, md: 20 },
            top: '50%',
            transform: 'translateY(-50%)',
            color: 'white',
            bgcolor: 'rgba(0,0,0,0.3)',
            backdropFilter: 'blur(4px)',
            '&:hover': { bgcolor: 'rgba(0,0,0,0.5)' },
            display: { xs: 'none', md: 'flex' },
            zIndex: 3,
          }}
        >
          <ArrowForwardIosIcon />
        </IconButton>

        {/* Slide Indicators */}
        <Box
          sx={{
            position: 'absolute',
            bottom: 20,
            left: '50%',
            transform: 'translateX(-50%)',
            display: 'flex',
            gap: 1.5,
            zIndex: 3,
          }}
        >
          {SLIDE_IMAGES.map((_, index) => (
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
                boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
              }}
            />
          ))}
        </Box>
      </Box>
    </Box>
  );
};

export default Hero;
