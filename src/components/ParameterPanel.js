import React from 'react';
import {
  Box,
  Paper,
  Slider,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Typography,
  Chip,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  useTheme,
  alpha
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import AutoFixHighIcon from '@mui/icons-material/AutoFixHigh';
import TuneIcon from '@mui/icons-material/Tune';
import CameraEnhanceIcon from '@mui/icons-material/CameraEnhance';
import StyleIcon from '@mui/icons-material/Style';
import {
  ESTILOS_PLATO,
  ILUMINACIONES,
  FONDOS,
  DECORACIONES_EXTRA,
  ANGULOS_CAMARA,
  INTENSIDAD_GOURMET_MIN,
  INTENSIDAD_GOURMET_MAX
} from '../constants/parameters';

const ParameterPanel = ({ parameters, onParameterChange, onGenerate, isGenerating }) => {
  const theme = useTheme();
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

  const accordionStyle = {
    background: 'transparent',
    boxShadow: 'none',
    '&:before': { display: 'none' },
    '&.Mui-expanded': { margin: 0 },
  };

  const summaryStyle = {
    px: 0,
    '& .MuiAccordionSummary-content': { margin: '12px 0' },
  };

  return (
    <Paper 
      elevation={2} 
      sx={{ 
        p: 3, 
        borderRadius: 4, 
        border: `1px solid ${theme.palette.divider}` 
      }}
    >
      <Box sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
        <TuneIcon color="primary" />
        <Typography variant="h6" fontWeight="600">
          Personalización
        </Typography>
      </Box>

      {/* Intensidad Gourmet - Always Visible */}
      <Box sx={{ mb: 4, px: 1 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
          <Typography variant="subtitle2" color="text.secondary">
            Nivel de Transformación
          </Typography>
          <Typography variant="subtitle2" color="primary.main" fontWeight="600">
            {intensidadGourmet}/10
          </Typography>
        </Box>
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
          sx={{
            height: 8,
            '& .MuiSlider-track': { border: 'none' },
            '& .MuiSlider-thumb': {
              height: 24,
              width: 24,
              backgroundColor: '#fff',
              border: '2px solid currentColor',
              '&:focus, &:hover, &.Mui-active, &.Mui-focusVisible': {
                boxShadow: 'inherit',
              },
            },
          }}
        />
      </Box>

      {/* Sección 1: Estilo & Ambiente */}
      <Accordion defaultExpanded sx={accordionStyle}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />} sx={summaryStyle}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Box sx={{ p: 0.5, borderRadius: 1, bgcolor: alpha(theme.palette.secondary.main, 0.1), color: 'secondary.main' }}>
              <StyleIcon fontSize="small" />
            </Box>
            <Typography variant="subtitle1" fontWeight="600">Estilo & Ambiente</Typography>
          </Box>
        </AccordionSummary>
        <AccordionDetails sx={{ px: 0, pb: 2 }}>
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>Estilo de Plato</InputLabel>
            <Select
              value={estiloPlato}
              label="Estilo de Plato"
              onChange={(e) => onParameterChange({ estiloPlato: e.target.value })}
              disabled={isGenerating}
            >
              {ESTILOS_PLATO.map((estilo) => (
                <MenuItem key={estilo.value} value={estilo.value}>{estilo.label}</MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl fullWidth>
            <InputLabel>Fondo</InputLabel>
            <Select
              value={fondo}
              label="Fondo"
              onChange={(e) => onParameterChange({ fondo: e.target.value })}
              disabled={isGenerating}
            >
              {FONDOS.map((f) => (
                <MenuItem key={f.value} value={f.value}>{f.label}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </AccordionDetails>
      </Accordion>

      {/* Sección 2: Cámara & Iluminación */}
      <Accordion sx={accordionStyle}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />} sx={summaryStyle}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
             <Box sx={{ p: 0.5, borderRadius: 1, bgcolor: alpha(theme.palette.info.main, 0.1), color: 'info.main' }}>
              <CameraEnhanceIcon fontSize="small" />
            </Box>
            <Typography variant="subtitle1" fontWeight="600">Cámara & Iluminación</Typography>
          </Box>
        </AccordionSummary>
        <AccordionDetails sx={{ px: 0, pb: 2 }}>
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>Iluminación</InputLabel>
            <Select
              value={iluminacion}
              label="Iluminación"
              onChange={(e) => onParameterChange({ iluminacion: e.target.value })}
              disabled={isGenerating}
            >
              {ILUMINACIONES.map((ilum) => (
                <MenuItem key={ilum.value} value={ilum.value}>{ilum.label}</MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl fullWidth>
            <InputLabel>Ángulo de Cámara</InputLabel>
            <Select
              value={anguloCamara}
              label="Ángulo de Cámara"
              onChange={(e) => onParameterChange({ anguloCamara: e.target.value })}
              disabled={isGenerating}
            >
              {ANGULOS_CAMARA.map((angulo) => (
                <MenuItem key={angulo.value} value={angulo.value}>{angulo.label}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </AccordionDetails>
      </Accordion>

      {/* Sección 3: Detalles Extra */}
      <Box sx={{ mt: 2 }}>
        <Typography variant="subtitle2" gutterBottom sx={{ mb: 1.5 }}>
          Decoración Extra
        </Typography>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
          {DECORACIONES_EXTRA.map((decoracion) => {
            const isSelected = (decoracionesExtra || []).includes(decoracion.value);
            return (
              <Chip
                key={decoracion.value}
                label={decoracion.label}
                onClick={() => !isGenerating && handleDecoracionChange(decoracion.value)}
                color={isSelected ? "primary" : "default"}
                variant={isSelected ? "filled" : "outlined"}
                clickable={!isGenerating}
                sx={{ 
                  borderRadius: '8px',
                  border: isSelected ? 'none' : `1px solid ${theme.palette.divider}`,
                }}
              />
            );
          })}
        </Box>
      </Box>

      <Button
        variant="contained"
        fullWidth
        size="large"
        onClick={onGenerate}
        disabled={isGenerating}
        startIcon={!isGenerating && <AutoFixHighIcon />}
        sx={{ 
          mt: 4, 
          py: 1.5,
          background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
          fontSize: '1.1rem'
        }}
      >
        {isGenerating ? 'Creando Obra Maestra...' : 'Generar Gourmet'}
      </Button>
    </Paper>
  );
};

export default ParameterPanel;
