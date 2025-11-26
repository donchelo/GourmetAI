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
  alpha,
  CircularProgress
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import AutoFixHighIcon from '@mui/icons-material/AutoFixHigh';
import TuneIcon from '@mui/icons-material/Tune';
import CameraEnhanceIcon from '@mui/icons-material/CameraEnhance';
import StyleIcon from '@mui/icons-material/Style';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import CasinoIcon from '@mui/icons-material/Casino';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import TableRestaurantIcon from '@mui/icons-material/TableRestaurant';
import {
  ESTILOS_PLATO,
  ILUMINACIONES,
  FONDOS,
  DECORACIONES_EXTRA,
  ANGULOS_CAMARA,
  INTENSIDAD_GOURMET_MIN,
  INTENSIDAD_GOURMET_MAX,
  TIPOS_VAJILLA,
  COLORES_VAJILLA,
  AMBIENTES,
  MOMENTOS_DIA,
  PROFUNDIDADES_CAMPO,
  ASPECT_RATIOS,
  EFECTOS_VAPOR,
  EFECTOS_FRESCURA,
  // Nuevos parámetros
  DIRECCIONES_LUZ,
  PROPS,
  SATURACIONES,
  TEXTURAS_FONDO
} from '../constants/parameters';
import { generateRandomParameters, getDefaultParameters } from '../utils/randomParameters';

const ParameterPanel = ({ parameters, onParameterChange, onGenerate, isGenerating }) => {
  const theme = useTheme();
  const {
    intensidadGourmet,
    estiloPlato,
    iluminacion,
    fondo,
    decoracionesExtra,
    anguloCamara,
    tipoVajilla,
    colorVajilla,
    ambiente,
    momentoDelDia,
    profundidadCampo,
    aspectRatio,
    efectoVapor,
    efectoFrescura,
    // Nuevos parámetros
    direccionLuz,
    props,
    saturacion,
    texturaFondo
  } = parameters;

  const handleDecoracionChange = (value) => {
    const current = decoracionesExtra || [];
    const updated = current.includes(value)
      ? current.filter(d => d !== value)
      : [...current, value];
    onParameterChange({ decoracionesExtra: updated });
  };

  const handleRandomize = () => {
    const randomParams = generateRandomParameters();
    onParameterChange(randomParams);
  };

  const handleReset = () => {
    const defaultParams = getDefaultParameters();
    onParameterChange(defaultParams);
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
      <Box sx={{ mb: 2, px: 1 }}>
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

      {/* Botones de Aleatorio y Restablecer */}
      <Box sx={{ 
        display: 'flex', 
        gap: 1, 
        mb: 3,
        mt: 2 
      }}>
        <Button
          variant="outlined"
          startIcon={<CasinoIcon />}
          onClick={handleRandomize}
          disabled={isGenerating}
          sx={{ 
            flex: 1,
            borderRadius: 2,
            textTransform: 'none',
            fontWeight: 500
          }}
        >
          Aleatorio
        </Button>
        
        <Button
          variant="outlined"
          color="secondary"
          startIcon={<RestartAltIcon />}
          onClick={handleReset}
          disabled={isGenerating}
          sx={{ 
            flex: 1,
            borderRadius: 2,
            textTransform: 'none',
            fontWeight: 500
          }}
        >
          Restablecer
        </Button>
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

          <FormControl fullWidth sx={{ mb: 2 }}>
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

          {/* Nuevo: Textura de Fondo */}
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>Textura de Fondo</InputLabel>
            <Select
              value={texturaFondo || 'lisa'}
              label="Textura de Fondo"
              onChange={(e) => onParameterChange({ texturaFondo: e.target.value })}
              disabled={isGenerating}
            >
              {TEXTURAS_FONDO.map((t) => (
                <MenuItem key={t.value} value={t.value}>{t.label}</MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>Tipo de Vajilla</InputLabel>
            <Select
              value={tipoVajilla || 'original'}
              label="Tipo de Vajilla"
              onChange={(e) => onParameterChange({ tipoVajilla: e.target.value })}
              disabled={isGenerating}
            >
              {TIPOS_VAJILLA.map((v) => (
                <MenuItem key={v.value} value={v.value}>{v.label}</MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>Color de Vajilla</InputLabel>
            <Select
              value={colorVajilla || 'original'}
              label="Color de Vajilla"
              onChange={(e) => onParameterChange({ colorVajilla: e.target.value })}
              disabled={isGenerating}
            >
              {COLORES_VAJILLA.map((c) => (
                <MenuItem key={c.value} value={c.value}>{c.label}</MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl fullWidth>
            <InputLabel>Ambiente</InputLabel>
            <Select
              value={ambiente || 'sin-preferencia'}
              label="Ambiente"
              onChange={(e) => onParameterChange({ ambiente: e.target.value })}
              disabled={isGenerating}
            >
              {AMBIENTES.map((a) => (
                <MenuItem key={a.value} value={a.value}>{a.label}</MenuItem>
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

          {/* Nuevo: Dirección de Luz */}
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>Dirección de Luz</InputLabel>
            <Select
              value={direccionLuz || 'natural'}
              label="Dirección de Luz"
              onChange={(e) => onParameterChange({ direccionLuz: e.target.value })}
              disabled={isGenerating}
            >
              {DIRECCIONES_LUZ.map((dl) => (
                <MenuItem key={dl.value} value={dl.value}>{dl.label}</MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl fullWidth sx={{ mb: 2 }}>
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

          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>Profundidad de Campo</InputLabel>
            <Select
              value={profundidadCampo || 'moderado'}
              label="Profundidad de Campo"
              onChange={(e) => onParameterChange({ profundidadCampo: e.target.value })}
              disabled={isGenerating}
            >
              {PROFUNDIDADES_CAMPO.map((p) => (
                <MenuItem key={p.value} value={p.value}>{p.label}</MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl fullWidth>
            <InputLabel>Relación de Aspecto</InputLabel>
            <Select
              value={aspectRatio || 'original'}
              label="Relación de Aspecto"
              onChange={(e) => onParameterChange({ aspectRatio: e.target.value })}
              disabled={isGenerating}
            >
              {ASPECT_RATIOS.map((ar) => (
                <MenuItem key={ar.value} value={ar.value}>{ar.label}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </AccordionDetails>
      </Accordion>

      {/* Sección 3: Efectos Especiales */}
      <Accordion sx={accordionStyle}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />} sx={summaryStyle}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Box sx={{ p: 0.5, borderRadius: 1, bgcolor: alpha(theme.palette.warning.main, 0.1), color: 'warning.main' }}>
              <AutoAwesomeIcon fontSize="small" />
            </Box>
            <Typography variant="subtitle1" fontWeight="600">Efectos Especiales</Typography>
          </Box>
        </AccordionSummary>
        <AccordionDetails sx={{ px: 0, pb: 2 }}>
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>Momento del Día</InputLabel>
            <Select
              value={momentoDelDia || 'sin-preferencia'}
              label="Momento del Día"
              onChange={(e) => onParameterChange({ momentoDelDia: e.target.value })}
              disabled={isGenerating}
            >
              {MOMENTOS_DIA.map((m) => (
                <MenuItem key={m.value} value={m.value}>{m.label}</MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* Nuevo: Saturación */}
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>Saturación de Colores</InputLabel>
            <Select
              value={saturacion || 'normal'}
              label="Saturación de Colores"
              onChange={(e) => onParameterChange({ saturacion: e.target.value })}
              disabled={isGenerating}
            >
              {SATURACIONES.map((s) => (
                <MenuItem key={s.value} value={s.value}>{s.label}</MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>Efecto de Vapor</InputLabel>
            <Select
              value={efectoVapor || 'sin-vapor'}
              label="Efecto de Vapor"
              onChange={(e) => onParameterChange({ efectoVapor: e.target.value })}
              disabled={isGenerating}
            >
              {EFECTOS_VAPOR.map((ev) => (
                <MenuItem key={ev.value} value={ev.value}>{ev.label}</MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl fullWidth>
            <InputLabel>Efecto de Frescura</InputLabel>
            <Select
              value={efectoFrescura || 'sin-efecto'}
              label="Efecto de Frescura"
              onChange={(e) => onParameterChange({ efectoFrescura: e.target.value })}
              disabled={isGenerating}
            >
              {EFECTOS_FRESCURA.map((ef) => (
                <MenuItem key={ef.value} value={ef.value}>{ef.label}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </AccordionDetails>
      </Accordion>

      {/* Sección 4: Props & Decoración */}
      <Accordion sx={accordionStyle}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />} sx={summaryStyle}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Box sx={{ p: 0.5, borderRadius: 1, bgcolor: alpha(theme.palette.success.main, 0.1), color: 'success.main' }}>
              <TableRestaurantIcon fontSize="small" />
            </Box>
            <Typography variant="subtitle1" fontWeight="600">Props & Decoración</Typography>
          </Box>
        </AccordionSummary>
        <AccordionDetails sx={{ px: 0, pb: 2 }}>
          {/* Nuevo: Props/Accesorios */}
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>Accesorios</InputLabel>
            <Select
              value={props || 'ninguno'}
              label="Accesorios"
              onChange={(e) => onParameterChange({ props: e.target.value })}
              disabled={isGenerating}
            >
              {PROPS.map((p) => (
                <MenuItem key={p.value} value={p.value}>{p.label}</MenuItem>
              ))}
            </Select>
          </FormControl>

          <Typography variant="subtitle2" gutterBottom sx={{ mb: 1.5, mt: 1 }}>
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
        </AccordionDetails>
      </Accordion>

      <Button
        variant="contained"
        fullWidth
        size="large"
        onClick={onGenerate}
        disabled={isGenerating}
        startIcon={isGenerating ? <CircularProgress size={20} color="inherit" /> : <AutoFixHighIcon />}
        sx={{ 
          mt: 4, 
          py: 1.5,
          background: isGenerating 
            ? `linear-gradient(45deg, ${alpha(theme.palette.primary.main, 0.7)}, ${alpha(theme.palette.primary.dark, 0.7)})`
            : `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
          fontSize: '1.1rem',
          position: 'relative',
          overflow: 'hidden',
          '&.Mui-disabled': {
            color: 'white',
            opacity: 0.9
          },
          ...(isGenerating && {
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: '-100%',
              width: '200%',
              height: '100%',
              background: `linear-gradient(90deg, transparent, ${alpha('#fff', 0.2)}, transparent)`,
              animation: 'shimmer 2s infinite',
            },
            '@keyframes shimmer': {
              '0%': { transform: 'translateX(-50%)' },
              '100%': { transform: 'translateX(50%)' }
            }
          })
        }}
      >
        {isGenerating ? 'Generando tu obra maestra...' : 'Generar Gourmet'}
      </Button>
    </Paper>
  );
};

export default ParameterPanel;
