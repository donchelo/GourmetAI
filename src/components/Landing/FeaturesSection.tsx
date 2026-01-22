import React from 'react';
import { Typography, Grid, Card, CardContent, Box, useTheme, alpha } from '@mui/material';
import SectionWrapper from './SectionWrapper';
import RestaurantMenuIcon from '@mui/icons-material/RestaurantMenu';
import CameraEnhanceIcon from '@mui/icons-material/CameraEnhance';
import MenuBookIcon from '@mui/icons-material/MenuBook';

const FeaturesSection: React.FC = () => {
  const theme = useTheme();

  const features = [
    {
      icon: <RestaurantMenuIcon sx={{ fontSize: 50 }} />,
      title: "Impacto Visual",
      description: "Atrae más clientes con imágenes de alta fidelidad que resaltan cada textura y detalle de tus creaciones."
    },
    {
      icon: <CameraEnhanceIcon sx={{ fontSize: 50 }} />,
      title: "Eficiencia Operativa",
      description: "Reduce tiempos de producción de contenido de semanas a segundos, acelerando el lanzamiento de nuevos platos."
    },
    {
      icon: <MenuBookIcon sx={{ fontSize: 50 }} />,
      title: "Estandarización",
      description: "Mantén una estética coherente y profesional en todos tus canales digitales y menús impresos."
    }
  ];

  return (
    <SectionWrapper bgcolor="background.default">
      <Box sx={{ textAlign: 'center', mb: 10 }}>
        <Typography 
          variant="overline" 
          sx={{ color: theme.palette.secondary.main, fontWeight: 700, mb: 2, display: 'block' }}
        >
          Funcionalidades Core
        </Typography>
        <Typography variant="h2" sx={{ fontWeight: 700 }}>
          Todo lo que necesitas en un solo lugar
        </Typography>
      </Box>

      <Grid container spacing={4}>
        {features.map((feature, index) => (
          <Grid item xs={12} md={4} key={index}>
            <Card 
              elevation={0}
              sx={{ 
                height: '100%', 
                textAlign: 'center',
                p: 3,
                bgcolor: 'background.paper',
                border: `1px solid ${theme.palette.divider}`,
                borderRadius: 4,
                transition: 'all 0.3s ease',
                '&:hover': {
                  borderColor: theme.palette.secondary.main,
                  transform: 'translateY(-5px)',
                  boxShadow: `0 20px 40px ${alpha(theme.palette.common.black, 0.05)}`
                }
              }}
            >
              <CardContent>
                <Box sx={{ color: theme.palette.secondary.main, mb: 3 }}>
                  {feature.icon}
                </Box>
                <Typography variant="h5" gutterBottom sx={{ fontWeight: 700 }}>
                  {feature.title}
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  {feature.description}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </SectionWrapper>
  );
};

export default FeaturesSection;
