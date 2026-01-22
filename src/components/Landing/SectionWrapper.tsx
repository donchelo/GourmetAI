import React from 'react';
import { Box, Container, SxProps, Theme } from '@mui/material';

interface SectionWrapperProps {
  children: React.ReactNode;
  id?: string;
  bgcolor?: string;
  sx?: SxProps<Theme>;
  maxWidth?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | false;
}

const SectionWrapper: React.FC<SectionWrapperProps> = ({ 
  children, 
  id, 
  bgcolor = 'transparent', 
  sx = {}, 
  maxWidth = 'lg' 
}) => {
  return (
    <Box 
      id={id}
      component="section"
      sx={{ 
        py: { xs: 10, md: 15 },
        bgcolor,
        ...sx 
      }}
    >
      <Container maxWidth={maxWidth}>
        {children}
      </Container>
    </Box>
  );
};

export default SectionWrapper;
