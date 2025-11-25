import React from 'react';
import {
  Box,
  Paper,
  Slider,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormControlLabel,
  Checkbox,
  Button,
  Typography,
  Divider
} from '@mui/material';
import {
  ESTILOS_PLATO,
  ILUMINACIONES,
  FONDOS,
  DECORACIONES_EXTRA,
  ANGULOS_CAMARA,
  INTENSIDAD_GOURMET_MIN,
  INTENSIDAD_GOURMET_MAX,
  INTENSIDAD_GOURMET_DEFAULT
} from '../constants/parameters';

const ParameterPanel = ({ parameters, onParameterChange, onGenerate, isGenerating }) => {
  const {
    intensidadGourmet,
    estiloPlato,
    iluminacion,
    fondo,
    decoracionesExtra,
    anguloCamara
  } = parameters;

  const handleDecoracionChange = (value) => {
    const current = decoracionesExtra || [];
    const updated = current.includes(value)
      ? current.filter(d => d !== value)
      : [...current, value];
    onParameterChange({ decoracionesExtra: updated });
  };

  return (
    <Paper elevation={2} sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom>
        Parámetros de Generación
      </Typography>
      <Divider sx={{ mb: 3 }} />

      {/* Intensidad Gourmet */}
      <Box sx={{ mb: 3 }}>
        <Typography gutterBottom>
          Intensidad Gourmet: {intensidadGourmet}
        </Typography>
        <Slider
          value={intensidadGourmet}
          min={INTENSIDAD_GOURMET_MIN}
          max={INTENSIDAD_GOURMET_MAX}
          step={1}
          marks={[
            { value: 1, label: 'Sutil' },
            { value: 5, label: 'Moderado' },
            { value: 10, label: 'Extremo' }
          ]}
          onChange={(e, value) => onParameterChange({ intensidadGourmet: value })}
          disabled={isGenerating}
        />
      </Box>

      {/* Estilo de Plato */}
      <FormControl fullWidth sx={{ mb: 3 }}>
        <InputLabel>Estilo de Plato</InputLabel>
        <Select
          value={estiloPlato}
          label="Estilo de Plato"
          onChange={(e) => onParameterChange({ estiloPlato: e.target.value })}
          disabled={isGenerating}
        >
          {ESTILOS_PLATO.map((estilo) => (
            <MenuItem key={estilo.value} value={estilo.value}>
              {estilo.label}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {/* Iluminación */}
      <FormControl fullWidth sx={{ mb: 3 }}>
        <InputLabel>Iluminación</InputLabel>
        <Select
          value={iluminacion}
          label="Iluminación"
          onChange={(e) => onParameterChange({ iluminacion: e.target.value })}
          disabled={isGenerating}
        >
          {ILUMINACIONES.map((ilum) => (
            <MenuItem key={ilum.value} value={ilum.value}>
              {ilum.label}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {/* Fondo */}
      <FormControl fullWidth sx={{ mb: 3 }}>
        <InputLabel>Fondo</InputLabel>
        <Select
          value={fondo}
          label="Fondo"
          onChange={(e) => onParameterChange({ fondo: e.target.value })}
          disabled={isGenerating}
        >
          {FONDOS.map((f) => (
            <MenuItem key={f.value} value={f.value}>
              {f.label}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {/* Ángulo de Cámara */}
      <FormControl fullWidth sx={{ mb: 3 }}>
        <InputLabel>Ángulo de Cámara</InputLabel>
        <Select
          value={anguloCamara}
          label="Ángulo de Cámara"
          onChange={(e) => onParameterChange({ anguloCamara: e.target.value })}
          disabled={isGenerating}
        >
          {ANGULOS_CAMARA.map((angulo) => (
            <MenuItem key={angulo.value} value={angulo.value}>
              {angulo.label}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {/* Decoración Extra */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="subtitle2" gutterBottom>
          Decoración Extra
        </Typography>
        {DECORACIONES_EXTRA.map((decoracion) => (
          <FormControlLabel
            key={decoracion.value}
            control={
              <Checkbox
                checked={(decoracionesExtra || []).includes(decoracion.value)}
                onChange={() => handleDecoracionChange(decoracion.value)}
                disabled={isGenerating}
              />
            }
            label={decoracion.label}
          />
        ))}
      </Box>

      {/* Botón Generar */}
      <Button
        variant="contained"
        fullWidth
        size="large"
        onClick={onGenerate}
        disabled={isGenerating}
        sx={{ mt: 2, py: 1.5 }}
      >
        {isGenerating ? 'Generando...' : 'Generar Gourmet'}
      </Button>
    </Paper>
  );
};

export default ParameterPanel;

