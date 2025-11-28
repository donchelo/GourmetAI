import React from 'react';
import GeneratedImages from '../GeneratedImages';
import { Paper, Typography, Box, Divider, Button, CircularProgress } from '@mui/material';
import ReactMarkdown from 'react-markdown';
import RestaurantMenuIcon from '@mui/icons-material/RestaurantMenu';

const DishPreview = ({ 
  images, 
  isLoading, 
  error, 
  parameters, 
  seed, 
  ingredients, 
  recipe,
  onGenerateRecipe,
  isRecipeLoading
}) => {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, height: '100%' }}>
      <GeneratedImages 
        images={images}
        isLoading={isLoading}
        error={error}
        parameters={parameters}
        seed={seed}
        ingredients={ingredients}
      />
      
      {/* Botón para generar receta (si hay imagen pero no receta) */}
      {images && images.length > 0 && !recipe && !isLoading && (
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 1 }}>
              <Button 
                variant="outlined" 
                startIcon={isRecipeLoading ? <CircularProgress size={20} /> : <RestaurantMenuIcon />}
                onClick={onGenerateRecipe}
                disabled={isRecipeLoading}
                sx={{ 
                    textTransform: 'uppercase', 
                    letterSpacing: '0.05em',
                    fontWeight: 600
                }}
              >
                  {isRecipeLoading ? 'Generando Receta...' : 'Generar Receta del Plato'}
              </Button>
          </Box>
      )}

      {/* Receta generada */}
      {recipe && !isLoading && (
        <Paper 
          elevation={0} 
          sx={{ 
            p: 3, 
            border: '1px solid', 
            borderColor: 'divider',
            bgcolor: 'background.paper',
            overflowY: 'auto',
            maxHeight: '400px'
          }}
        >
          <Typography variant="h6" gutterBottom sx={{ textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 700 }}>
            Receta Sugerida
          </Typography>
          <Divider sx={{ mb: 2 }} />
          <Box sx={{ 
            '& h3': { fontSize: '1.1rem', mt: 0, mb: 2, color: 'primary.main' },
            '& strong': { color: 'text.primary' },
            '& ul, & ol': { pl: 2 },
            '& li': { mb: 0.5 },
            typography: 'body2',
            color: 'text.secondary'
          }}>
            <ReactMarkdown>{recipe}</ReactMarkdown>
          </Box>
        </Paper>
      )}
    </Box>
  );
};

export default DishPreview;
