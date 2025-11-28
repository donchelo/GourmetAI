import React, { useState } from 'react';
import { Box, TextField, Typography, Alert, Chip, Stack, FormControl, InputLabel, Select, MenuItem, Grid } from '@mui/material';
import ParameterPanel from '../ParameterPanel';
import { validateParameters } from '../../utils/validation';
import { TIPOS_COCINA, CATEGORIAS_PLATO, TECNICAS_COCCION } from '../../constants/parameters';

const FromScratch = ({ parameters, onParameterChange, onGenerate, isGenerating }) => {
  const [idea, setIdea] = useState('');
  const [ingredientsInput, setIngredientsInput] = useState('');
  const [ingredients, setIngredients] = useState([]);
  const [localError, setLocalError] = useState(null);

  const handleAddIngredient = (e) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      const newIngredient = ingredientsInput.trim();
      if (newIngredient && !ingredients.includes(newIngredient)) {
        setIngredients([...ingredients, newIngredient]);
        setIngredientsInput('');
      }
    }
  };

  const handleDeleteIngredient = (ingredientToDelete) => {
    setIngredients(ingredients.filter((ingredient) => ingredient !== ingredientToDelete));
  };

  const handleGenerate = async () => {
    setLocalError(null);
    if (!idea.trim() && ingredients.length === 0) {
      setLocalError('Por favor, ingresa al menos una idea o un ingrediente.');
      return;
    }

    const paramValidation = validateParameters(parameters);
    if (!paramValidation.valid) {
      setLocalError(paramValidation.error);
      return;
    }

    try {
      // Pass ingredients array and idea string
      await onGenerate(ingredients, idea, parameters);
    } catch (err) {
      console.error('Error en generación:', err);
    }
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      {localError && (
        <Alert severity="error">{localError}</Alert>
      )}

      <Box sx={{ mb: 3 }}>
        <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          Contexto Culinario
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={4}>
            <FormControl fullWidth size="small">
              <InputLabel>Tipo de Cocina</InputLabel>
              <Select
                value={parameters.cuisineType || TIPOS_COCINA[0].value}
                label="Tipo de Cocina"
                onChange={(e) => onParameterChange({ cuisineType: e.target.value })}
              >
                {TIPOS_COCINA.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={4}>
            <FormControl fullWidth size="small">
              <InputLabel>Categoría</InputLabel>
              <Select
                value={parameters.dishCategory || CATEGORIAS_PLATO[0].value}
                label="Categoría"
                onChange={(e) => onParameterChange({ dishCategory: e.target.value })}
              >
                {CATEGORIAS_PLATO.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={4}>
            <FormControl fullWidth size="small">
              <InputLabel>Técnica</InputLabel>
              <Select
                value={parameters.cookingTechnique || TECNICAS_COCCION[0].value}
                label="Técnica"
                onChange={(e) => onParameterChange({ cookingTechnique: e.target.value })}
              >
                {TECNICAS_COCCION.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </Box>

      <Box>
        <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          Concepto / Idea
        </Typography>
        <TextField
          fullWidth
          placeholder="Ej: Un postre elegante de chocolate con frambuesas..."
          multiline
          rows={3}
          value={idea}
          onChange={(e) => setIdea(e.target.value)}
          variant="outlined"
          sx={{ mb: 2 }}
        />

        <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          Ingredientes Principales
        </Typography>
        <TextField
          fullWidth
          placeholder="Escribe y presiona Enter (ej: Salmon, Eneldo, Limón)"
          value={ingredientsInput}
          onChange={(e) => setIngredientsInput(e.target.value)}
          onKeyDown={handleAddIngredient}
          variant="outlined"
          helperText="Presiona Enter o Coma para agregar"
        />
        <Stack direction="row" spacing={1} sx={{ mt: 1, flexWrap: 'wrap', gap: 1 }} useFlexGap>
          {ingredients.map((ingredient, index) => (
            <Chip
              key={index}
              label={ingredient}
              onDelete={() => handleDeleteIngredient(ingredient)}
            />
          ))}
        </Stack>
      </Box>
      
      <ParameterPanel
        parameters={parameters}
        onParameterChange={onParameterChange}
        onGenerate={handleGenerate}
        isGenerating={isGenerating}
      />
    </Box>
  );
};

export default FromScratch;

