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
  DIRECCIONES_LUZ,
  PROPS,
  SATURACIONES,
  TEXTURAS_FONDO
} from '../constants/parameters';
import { generateRandomParameters, getDefaultParameters } from '../utils/randomParameters';

const ParameterPanel = ({ parameters, onParameterChange, onGenerate, isGenerating }) => {
  const theme = useTheme();
  const isLight = theme.palette.mode === 'light';
  
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

  const handlePropsChange = (value) => {
    if (value === 'ninguno') {
      onParameterChange({ props: [] });
      return;
    }
    
    const current = props || [];
    if (current.includes(value)) {
      const updated = current.filter(p => p !== value);
      onParameterChange({ props: updated });
    } else {
      const updated = [...current.filter(p => p !== 'ninguno'), value];
      onParameterChange({ props: updated });
    }
  };

  const handleRandomize = () => {
    const randomParams = generateRandomParameters();
    onParameterChange(randomParams);
  };

  const handleReset = () => {
    const defaultParams = getDefaultParameters();
    onParameterChange(defaultParams);
  };

  // Estilos de acordeón elegantes
  const accordionStyle = {
    background: 'transparent',
    boxShadow: 'none',
    border: 'none',
    '&:before': { display: 'none' },
    '&.Mui-expanded': { margin: 0 },
  };

  const summaryStyle = {
    px: 0,
    minHeight: 52,
    '& .MuiAccordionSummary-content': { margin: '12px 0' },
    '&.Mui-expanded': { minHeight: 52 },
  };

  // Estilo de sección con icono
  const SectionIcon = ({ icon: Icon, color }) => (
    <Box 
      sx={{ 
        p: 0.75, 
        borderRadius: 2, 
        bgcolor: alpha(theme.palette[color].main, isLight ? 0.08 : 0.12),
        color: `${color}.main`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Icon sx={{ fontSize: 18 }} />
    </Box>
  );

  return (
    <Paper 
      elevation={0} 
      sx={{ 
        p: { xs: 2.5, md: 3 }, 
        borderRadius: 4, 
        border: `1px solid ${theme.palette.divider}`,
        backgroundColor: 'background.paper',
      }}
    >
      {/* Header */}
      <Box sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 1.5 }}>
        <Box 
          sx={{ 
            p: 1, 
            borderRadius: 2, 
            bgcolor: alpha(theme.palette.primary.main, isLight ? 0.08 : 0.12),
            color: 'primary.main',
            display: 'flex',
          }}
        >
          <TuneIcon sx={{ fontSize: 20 }} />
        </Box>
        <Typography 
          variant="h6" 
          sx={{ 
            fontWeight: 400,
            letterSpacing: '-0.01em',
          }}
        >
          Personalización
        </Typography>
      </Box>

      {/* Intensidad Gourmet - Siempre visible */}
      <Box sx={{ mb: 3, px: 0.5 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', mb: 2 }}>
          <Typography 
            variant="subtitle2" 
            sx={{ 
              color: 'text.secondary',
              fontWeight: 500,
              letterSpacing: '0.02em',
            }}
          >
            Nivel de Transformación
          </Typography>
          <Typography 
            variant="h6" 
            sx={{ 
              color: 'secondary.main', 
              fontWeight: 500,
              fontFamily: "'Cormorant Garamond', serif",
            }}
          >
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
            color: 'secondary.main',
            '& .MuiSlider-mark': {
              backgroundColor: 'transparent',
            },
            '& .MuiSlider-markLabel': {
              fontSize: '0.7rem',
              color: 'text.secondary',
              fontWeight: 500,
            },
          }}
        />
      </Box>

      {/* Botones de Aleatorio y Restablecer */}
      <Box sx={{ display: 'flex', gap: 1.5, mb: 3 }}>
        <Button
          variant="outlined"
          startIcon={<CasinoIcon />}
          onClick={handleRandomize}
          disabled={isGenerating}
          sx={{ 
            flex: 1,
            py: 1.25,
            borderColor: theme.palette.divider,
            color: 'text.secondary',
            '&:hover': {
              borderColor: 'secondary.main',
              color: 'secondary.main',
              backgroundColor: alpha(theme.palette.secondary.main, 0.04),
            },
          }}
        >
          Aleatorio
        </Button>
        
        <Button
          variant="outlined"
          startIcon={<RestartAltIcon />}
          onClick={handleReset}
          disabled={isGenerating}
          sx={{ 
            flex: 1,
            py: 1.25,
            borderColor: theme.palette.divider,
            color: 'text.secondary',
            '&:hover': {
              borderColor: 'text.primary',
              color: 'text.primary',
              backgroundColor: alpha(theme.palette.text.primary, 0.04),
            },
          }}
        >
          Restablecer
        </Button>
      </Box>

      {/* Divisor sutil */}
      <Box 
        sx={{ 
          height: 1, 
          bgcolor: theme.palette.divider, 
          mb: 2,
          opacity: 0.5,
        }} 
      />

      {/* Sección 1: Estilo & Ambiente */}
      <Accordion defaultExpanded sx={accordionStyle}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />} sx={summaryStyle}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <SectionIcon icon={StyleIcon} color="secondary" />
            <Typography variant="subtitle1" sx={{ fontWeight: 500 }}>
              Estilo & Ambiente
            </Typography>
          </Box>
        </AccordionSummary>
        <AccordionDetails sx={{ px: 0, pb: 2, pt: 0.5 }}>
          <FormControl fullWidth sx={{ mb: 2.5 }}>
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

          <FormControl fullWidth sx={{ mb: 2.5 }}>
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

          <FormControl fullWidth sx={{ mb: 2.5 }}>
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

          <FormControl fullWidth sx={{ mb: 2.5 }}>
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

          <FormControl fullWidth sx={{ mb: 2.5 }}>
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
            <SectionIcon icon={CameraEnhanceIcon} color="info" />
            <Typography variant="subtitle1" sx={{ fontWeight: 500 }}>
              Cámara & Iluminación
            </Typography>
          </Box>
        </AccordionSummary>
        <AccordionDetails sx={{ px: 0, pb: 2, pt: 0.5 }}>
          <FormControl fullWidth sx={{ mb: 2.5 }}>
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

          <FormControl fullWidth sx={{ mb: 2.5 }}>
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

          <FormControl fullWidth sx={{ mb: 2.5 }}>
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

          <FormControl fullWidth sx={{ mb: 2.5 }}>
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
            <SectionIcon icon={AutoAwesomeIcon} color="warning" />
            <Typography variant="subtitle1" sx={{ fontWeight: 500 }}>
              Efectos Especiales
            </Typography>
          </Box>
        </AccordionSummary>
        <AccordionDetails sx={{ px: 0, pb: 2, pt: 0.5 }}>
          <FormControl fullWidth sx={{ mb: 2.5 }}>
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

          <FormControl fullWidth sx={{ mb: 2.5 }}>
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

          <FormControl fullWidth sx={{ mb: 2.5 }}>
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
            <SectionIcon icon={TableRestaurantIcon} color="success" />
            <Typography variant="subtitle1" sx={{ fontWeight: 500 }}>
              Props & Decoración
            </Typography>
          </Box>
        </AccordionSummary>
        <AccordionDetails sx={{ px: 0, pb: 2, pt: 0.5 }}>
          {/* Props/Accesorios */}
          <Typography 
            variant="caption" 
            sx={{ 
              display: 'block',
              mb: 1.5,
              color: 'text.secondary',
              fontWeight: 600,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
            }}
          >
            Accesorios
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 3 }}>
            {PROPS.map((prop) => {
              const isSelected = prop.value === 'ninguno' 
                ? (!props || props.length === 0)
                : (props || []).includes(prop.value);
              return (
                <Chip
                  key={prop.value}
                  label={prop.label}
                  onClick={() => !isGenerating && handlePropsChange(prop.value)}
                  color={isSelected ? "secondary" : "default"}
                  variant={isSelected ? "filled" : "outlined"}
                  clickable={!isGenerating}
                  size="small"
                  sx={{ 
                    borderColor: isSelected ? 'secondary.main' : theme.palette.divider,
                    fontWeight: isSelected ? 500 : 400,
                  }}
                />
              );
            })}
          </Box>

          <Typography 
            variant="caption" 
            sx={{ 
              display: 'block',
              mb: 1.5,
              color: 'text.secondary',
              fontWeight: 600,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
            }}
          >
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
                  color={isSelected ? "secondary" : "default"}
                  variant={isSelected ? "filled" : "outlined"}
                  clickable={!isGenerating}
                  size="small"
                  sx={{ 
                    borderColor: isSelected ? 'secondary.main' : theme.palette.divider,
                    fontWeight: isSelected ? 500 : 400,
                  }}
                />
              );
            })}
          </Box>
        </AccordionDetails>
      </Accordion>

      {/* Botón de Generar */}
      <Button
        variant="contained"
        fullWidth
        size="large"
        onClick={onGenerate}
        disabled={isGenerating}
        startIcon={isGenerating ? <CircularProgress size={20} color="inherit" /> : <AutoFixHighIcon />}
        sx={{ 
          mt: 4, 
          py: 1.75,
          borderRadius: 3,
          bgcolor: 'primary.main',
          fontSize: '1rem',
          fontWeight: 500,
          letterSpacing: '0.02em',
          position: 'relative',
          overflow: 'hidden',
          '&:hover': {
            bgcolor: 'primary.dark',
            transform: 'translateY(-1px)',
            boxShadow: theme.shadows[4],
          },
          '&.Mui-disabled': {
            bgcolor: alpha(theme.palette.primary.main, 0.7),
            color: 'white',
          },
          transition: 'all 0.25s ease',
          ...(isGenerating && {
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: '-100%',
              width: '200%',
              height: '100%',
              background: `linear-gradient(90deg, transparent, ${alpha('#fff', 0.15)}, transparent)`,
              animation: 'shimmer 2s infinite',
            },
            '@keyframes shimmer': {
              '0%': { transform: 'translateX(-50%)' },
              '100%': { transform: 'translateX(50%)' },
            },
          }),
        }}
      >
        {isGenerating ? 'Generando tu obra maestra...' : 'Generar Gourmet'}
      </Button>
    </Paper>
  );
};

export default ParameterPanel;
