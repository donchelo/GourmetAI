import React from 'react';
import { Typography, Grid, Box, Paper, useTheme, alpha } from '@mui/material';
import SectionWrapper from './SectionWrapper';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import TimerIcon from '@mui/icons-material/Timer';
import PaymentsIcon from '@mui/icons-material/Payments';

const ProblemSection: React.FC = () => {
  const theme = useTheme();

  const problems = [
    {
      icon: <PaymentsIcon sx={{ fontSize: 40 }} />,
      title: "Costos Elevados",
      description: "La fotografía gastronómica profesional es costosa y requiere equipos que no siempre están al alcance."
    },
    {
      icon: <TimerIcon sx={{ fontSize: 40 }} />,
      title: "Lentitud en Diseño",
      description: "Actualizar un menú o lanzar un nuevo plato toma semanas entre la preparación, la foto y el diseño."
    },
    {
      icon: <ErrorOutlineIcon sx={{ fontSize: 40 }} />,
      title: "Inconsistencia Visual",
      description: "Fotos de baja calidad o estilos mezclados que no transmiten la verdadera esencia de tu cocina."
    }
  ];

  return (
    <SectionWrapper bgcolor={theme.palette.mode === 'dark' ? alpha(theme.palette.common.black, 0.4) : '#111'}>
      <Typography 
        variant="overline" 
        sx={{ color: theme.palette.secondary.main, fontWeight: 700, mb: 2, display: 'block' }}
      >
        El Desafío Culinario
      </Typography>
      <Typography 
        variant="h2" 
        sx={{ 
          color: 'white', 
          mb: 6, 
          maxWidth: '800px',
          fontWeight: 700
        }}
      >
        ¿Por qué es tan difícil hacer que tu comida se vea tan bien como sabe?
      </Typography>

      <Grid container spacing={4}>
        {problems.map((problem, index) => (
          <Grid item xs={12} md={4} key={index}>
            <Paper 
              elevation={0}
              sx={{ 
                p: 4, 
                height: '100%', 
                bgcolor: 'rgba(255,255,255,0.03)', 
                border: '1px solid rgba(255,255,255,0.1)',
                transition: 'transform 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-10px)',
                  bgcolor: 'rgba(255,255,255,0.05)',
                }
              }}
            >
              <Box sx={{ color: theme.palette.secondary.main, mb: 2 }}>
                {problem.icon}
              </Box>
              <Typography variant="h5" sx={{ color: 'white', mb: 2, fontWeight: 600 }}>
                {problem.title}
              </Typography>
              <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                {problem.description}
              </Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </SectionWrapper>
  );
};

export default ProblemSection;
