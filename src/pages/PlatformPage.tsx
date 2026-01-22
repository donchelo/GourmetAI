import React from 'react';
import { Box, Container } from '@mui/material';
import DishModule from '../components/DishModule/DishModule';

const PlatformPage: React.FC = () => {
  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default', pt: 2, pb: 8 }}>
      <Container maxWidth="lg">
        <DishModule />
      </Container>
    </Box>
  );
};

export default PlatformPage;
