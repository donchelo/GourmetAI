import React, { useState, useEffect } from 'react';
import { 
  Box, 
  TextField, 
  Typography, 
  Alert, 
  Chip, 
  Stack, 
  FormControl, 
  InputLabel, 
  Select, 
  MenuItem, 
  Grid,
  Paper,
  OutlinedInput,
  Checkbox,
  ListItemText,
  Button,
  useTheme,
  SelectChangeEvent
} from '@mui/material';
import CasinoIcon from '@mui/icons-material/Casino';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import ParameterPanel from '../ParameterPanel';
import { validateParameters } from '../../utils/validation';
import { TIPOS_COCINA, CATEGORIAS_PLATO, TECNICAS_COCCION, TAGS_CULINARIOS } from '../../constants/parameters';
import { generateRandomParameters, getDefaultParameters } from '../../utils/randomParameters';
import { DishParameters } from '../../types';

interface FromScratchProps {
  parameters: DishParameters;
  onParameterChange: (newParams: Partial<DishParameters>) => void;
  onGenerate: (ingredientsList: string[], idea: string, parameters: DishParameters) => Promise<any>;
  isGenerating: boolean;
}

const FromScratch: React.FC<FromScratchProps> = ({ parameters, onParameterChange, onGenerate, isGenerating }) => {
  const [idea, setIdea] = useState<string>('');
  const [ingredientsInput, setIngredientsInput] = useState<string>('');
  const [ingredients, setIngredients] = useState<string[]>([]);
  const [localError, setLocalError] = useState<string | null>(null);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const theme = useTheme();

  useEffect(() => {
    if (parameters.culinaryTags && Array.isArray(parameters.culinaryTags)) {
      setSelectedTags(parameters.culinaryTags);
    }
  }, [parameters.culinaryTags]);

  const handleAddIngredient = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      const newIngredient = ingredientsInput.trim();
      if (newIngredient && !ingredients.includes(newIngredient)) {
        setIngredients([...ingredients, newIngredient]);
        setIngredientsInput('');
      }
    }
  };

  const handleDeleteIngredient = (ingredientToDelete: string) => {
    setIngredients(ingredients.filter((ingredient) => ingredient !== ingredientToDelete));
  };

  const handleTagChange = (event: SelectChangeEvent<string[]>) => {
    const {
      target: { value },
    } = event;
    const newTags = typeof value === 'string' ? value.split(',') : value;
    setSelectedTags(newTags);
    onParameterChange({ culinaryTags: newTags });
  };

  const handleMultiSelectChange = (paramName: keyof DishParameters, event: SelectChangeEvent<string[]>) => {
    const { target: { value } } = event;
    const newValue = typeof value === 'string' ? value.split(',') : value;
    onParameterChange({ [paramName]: newValue });
  };

  const handleRandomize = () => {
    const randomParams = generateRandomParameters();
    onParameterChange(randomParams);
  };

  const handleReset = () => {
    const defaultParams = getDefaultParameters();
    onParameterChange(defaultParams);
    setIdea('');
    setIngredients([]);
    setSelectedTags([]);
  };

  const handleGenerate = async () => {
    setLocalError(null);
    if (!idea.trim() && ingredients.length === 0) {
      setLocalError('Por favor, ingresa al menos una idea o un ingrediente.');
      return;
    }

    const paramValidation = validateParameters(parameters);
    if (!paramValidation.valid) {
      setLocalError(paramValidation.error || 'Error en los parámetros');
      return;
    }

    try {
      await onGenerate(ingredients, idea, { ...parameters, culinaryTags: selectedTags });
    } catch (err) {
      console.error('Error en generación:', err);
    }
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      {localError && (
        <Alert severity="error">{localError}</Alert>
      )}

      <Box sx={{ display: 'flex', gap: 2 }}>
        <Button
          variant="outlined"
          startIcon={<CasinoIcon />}
          onClick={handleRandomize}
          disabled={isGenerating}
          fullWidth
          sx={{ borderRadius: 0, borderColor: theme.palette.divider, color: 'text.secondary' }}
        >
          Aleatorio
        </Button>
        
        <Button
          variant="outlined"
          startIcon={<RestartAltIcon />}
          onClick={handleReset}
          disabled={isGenerating}
          fullWidth
          sx={{ borderRadius: 0, borderColor: theme.palette.divider, color: 'text.secondary' }}
        >
          Reset
        </Button>
      </Box>

      <Paper elevation={0} sx={{ p: 2, border: '1px solid', borderColor: 'divider', borderRadius: 2 }}>
        <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'primary.main', mb: 2 }}>
          1. Contexto Culinario
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={4}>
            <FormControl fullWidth size="small">
              <InputLabel>Tipo de Cocina</InputLabel>
              <Select
                multiple
                value={parameters.cuisineType || []}
                label="Tipo de Cocina"
                onChange={(e) => handleMultiSelectChange('cuisineType', e as SelectChangeEvent<string[]>)}
                input={<OutlinedInput label="Tipo de Cocina" />}
                renderValue={(selected) => {
                   if (!selected || selected.length === 0) return <em>Sin preferencia</em>;
                   const selectedArray = Array.isArray(selected) ? selected : [selected];
                   return (
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                        {selectedArray.map((value) => {
                           if (value === 'sin-preferencia') return null;
                           const option = TIPOS_COCINA.find(o => o.value === value);
                           return <Chip key={value} label={option ? option.label : value} size="small" />;
                        })}
                    </Box>
                   );
                }}
              >
                {TIPOS_COCINA.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    <Checkbox checked={(parameters.cuisineType || []).indexOf(option.value) > -1} />
                    <ListItemText primary={option.label} />
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={4}>
            <FormControl fullWidth size="small">
              <InputLabel>Categoría</InputLabel>
              <Select
                multiple
                value={parameters.dishCategory || []}
                label="Categoría"
                onChange={(e) => handleMultiSelectChange('dishCategory', e as SelectChangeEvent<string[]>)}
                input={<OutlinedInput label="Categoría" />}
                renderValue={(selected) => {
                   if (!selected || selected.length === 0) return <em>Sin preferencia</em>;
                   const selectedArray = Array.isArray(selected) ? selected : [selected];
                   return (
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                        {selectedArray.map((value) => {
                           if (value === 'sin-preferencia') return null;
                           const option = CATEGORIAS_PLATO.find(o => o.value === value);
                           return <Chip key={value} label={option ? option.label : value} size="small" />;
                        })}
                    </Box>
                   );
                }}
              >
                {CATEGORIAS_PLATO.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    <Checkbox checked={(parameters.dishCategory || []).indexOf(option.value) > -1} />
                    <ListItemText primary={option.label} />
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={4}>
            <FormControl fullWidth size="small">
              <InputLabel>Técnica</InputLabel>
              <Select
                multiple
                value={parameters.cookingTechnique || []}
                label="Técnica"
                onChange={(e) => handleMultiSelectChange('cookingTechnique', e as SelectChangeEvent<string[]>)}
                input={<OutlinedInput label="Técnica" />}
                renderValue={(selected) => {
                   if (!selected || selected.length === 0) return <em>Sin preferencia</em>;
                   const selectedArray = Array.isArray(selected) ? selected : [selected];
                   return (
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                        {selectedArray.map((value) => {
                           if (value === 'sin-preferencia') return null;
                           const option = TECNICAS_COCCION.find(o => o.value === value);
                           return <Chip key={value} label={option ? option.label : value} size="small" />;
                        })}
                    </Box>
                   );
                }}
              >
                {TECNICAS_COCCION.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                     <Checkbox checked={(parameters.cookingTechnique || []).indexOf(option.value) > -1} />
                     <ListItemText primary={option.label} />
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          
          <Grid item xs={12}>
             <FormControl fullWidth size="small">
              <InputLabel>Etiquetas / Características</InputLabel>
              <Select
                multiple
                value={selectedTags}
                onChange={handleTagChange}
                input={<OutlinedInput label="Etiquetas / Características" />}
                renderValue={(selected) => (
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                    {selected.map((value) => {
                       const tag = TAGS_CULINARIOS.find(t => t.value === value);
                       return <Chip key={value} label={tag ? tag.label : value} size="small" />;
                    })}
                  </Box>
                )}
              >
                {TAGS_CULINARIOS.map((tag) => (
                  <MenuItem key={tag.value} value={tag.value}>
                    <Checkbox checked={selectedTags.indexOf(tag.value) > -1} />
                    <ListItemText primary={tag.label} />
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </Paper>

      <Paper elevation={0} sx={{ p: 2, border: '1px solid', borderColor: 'divider', borderRadius: 2 }}>
        <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'primary.main', mb: 2 }}>
          2. Definición del Plato
        </Typography>
        
        <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle2" gutterBottom>Ingredientes Clave</Typography>
            <TextField
              fullWidth
              size="small"
              placeholder="Escribe un ingrediente y presiona Enter (ej: Trufa negra, Salmón)"
              value={ingredientsInput}
              onChange={(e) => setIngredientsInput(e.target.value)}
              onKeyDown={handleAddIngredient}
              variant="outlined"
              helperText={ingredients.length === 0 ? "Agrega los ingredientes principales de tu plato" : ""}
            />
            <Stack direction="row" spacing={1} sx={{ mt: 1.5, flexWrap: 'wrap', gap: 1 }} useFlexGap>
              {ingredients.map((ingredient, index) => (
                <Chip
                  key={index}
                  label={ingredient}
                  onDelete={() => handleDeleteIngredient(ingredient)}
                  color="secondary"
                  variant="outlined"
                />
              ))}
            </Stack>
        </Box>

        <Box>
            <Typography variant="subtitle2" gutterBottom>Concepto Visual / Idea Creativa</Typography>
            <TextField
              fullWidth
              placeholder="Describe cómo imaginas el plato. Ej: Un postre minimalista con texturas contrastantes, servido sobre una piedra volcánica..."
              multiline
              rows={3}
              value={idea}
              onChange={(e) => setIdea(e.target.value)}
              variant="outlined"
            />
        </Box>
      </Paper>
      
       <Paper elevation={0} sx={{ p: 2, border: '1px solid', borderColor: 'divider', borderRadius: 2 }}>
        <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'primary.main', mb: 1 }}>
          3. Estilo Visual
        </Typography>
        <ParameterPanel
            parameters={parameters}
            onParameterChange={onParameterChange}
            onGenerate={handleGenerate}
            isGenerating={isGenerating}
            hideHeaderControls={true}
        />
      </Paper>
    </Box>
  );
};

export default FromScratch;
