import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Button,
  Typography,
  Dialog,
  DialogContent,
  IconButton,
  Alert,
  useTheme,
  alpha,
  CircularProgress,
  LinearProgress,
  useMediaQuery
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import DownloadIcon from '@mui/icons-material/Download';
import ZoomInIcon from '@mui/icons-material/ZoomIn';
import { downloadImage } from '../utils/imageUtils';
import { downloadImageWithMetadata, createMetadata } from '../utils/metadataUtils';

const LOADING_MESSAGES = [
  // Fase 1: Análisis inicial
  { text: 'Analizando tu imagen...', icon: '🔍' },
  { text: 'Detectando ingredientes con ojo de chef...', icon: '🥗' },
  { text: 'Escaneando texturas y colores...', icon: '🎨' },
  
  // Fase 2: Preparación culinaria
  { text: 'Preparando la transformación gourmet...', icon: '👨‍🍳' },
  { text: 'Consultando con chefs de tres estrellas Michelin...', icon: '⭐' },
  { text: 'Seleccionando la vajilla perfecta...', icon: '🍽️' },
  { text: 'Aplicando técnicas culinarias de élite...', icon: '✨' },
  
  // Fase 3: Fotografía profesional
  { text: 'Ajustando iluminación profesional...', icon: '💡' },
  { text: 'Configurando ángulos cinematográficos...', icon: '🎬' },
  { text: 'Calibrando la profundidad de campo...', icon: '📷' },
  { text: 'Buscando la luz dorada perfecta...', icon: '🌅' },
  
  // Fase 4: Emplatado artístico
  { text: 'Emplatando con precisión artística...', icon: '🎯' },
  { text: 'Colocando cada elemento como un artista...', icon: '🖌️' },
  { text: 'Aplicando la regla de los tercios...', icon: '📐' },
  { text: 'Creando balance visual en el plato...', icon: '⚖️' },
  
  // Fase 5: Toques mágicos
  { text: 'Añadiendo toques finales de chef...', icon: '👨‍🍳' },
  { text: 'Espolvoreando un poco de magia culinaria...', icon: '🪄' },
  { text: 'Susurrando secretos de cocina ancestral...', icon: '🔮' },
  { text: 'Invocando el espíritu de Auguste Escoffier...', icon: '👻' },
  
  // Fase 6: Detalles gourmet
  { text: 'Perfeccionando microdetalles gourmet...', icon: '🔬' },
  { text: 'Ajustando sombras y reflejos...', icon: '🌓' },
  { text: 'Realzando colores naturales...', icon: '🌈' },
  { text: 'Añadiendo ese brillo irresistible...', icon: '✨' },
  
  // Fase 7: Mensajes de espera creativos
  { text: 'La perfección toma su tiempo...', icon: '⏳' },
  { text: 'Los mejores platos se cocinan despacio...', icon: '🍲' },
  { text: 'Como un buen vino, esto mejora con paciencia...', icon: '🍷' },
  { text: 'Dejando reposar los sabores visuales...', icon: '😌' },
  
  // Fase 8: Fotografía final
  { text: 'Capturando la esencia gourmet...', icon: '📸' },
  { text: 'Enfocando el momento perfecto...', icon: '🎯' },
  { text: 'Componiendo la toma de revista...', icon: '📰' },
  { text: 'Creando una imagen digna de portada...', icon: '🏆' },
  
  // Fase 9: Frases inspiradoras
  { text: '"La cocina es el arte de transformar"...', icon: '💭' },
  { text: '"Primero comemos con los ojos"...', icon: '👁️' },
  { text: '"Cada plato cuenta una historia"...', icon: '📖' },
  { text: '"La presentación es poesía visual"...', icon: '✍️' },
  
  // Fase 10: Mensajes finales
  { text: 'Dando los últimos retoques maestros...', icon: '🎨' },
  { text: 'Verificando que todo esté perfecto...', icon: '✅' },
  { text: 'Preparando tu obra maestra...', icon: '🖼️' },
  { text: 'Casi listo... Un poco más de magia...', icon: '🪄' },
  { text: '¡Tu plato gourmet está casi listo!', icon: '🎉' },
];

const GeneratedImages = ({ images, isLoading, error, parameters, seed, ingredients }) => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [loadingMessageIndex, setLoadingMessageIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [startTime, setStartTime] = useState(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isLight = theme.palette.mode === 'light';

  // Función para calcular progreso basado en tiempo transcurrido
  const calculateProgress = (elapsedSeconds) => {
    const totalEstimatedSeconds = 120;
    const progressRatio = Math.min(elapsedSeconds / totalEstimatedSeconds, 0.95);
    
    if (progressRatio <= 0.167) {
      return progressRatio * 1.8;
    } else if (progressRatio <= 0.667) {
      return 0.3 + (progressRatio - 0.167) * 0.8;
    } else {
      return 0.7 + (progressRatio - 0.667) * 0.75;
    }
  };

  useEffect(() => {
    if (!isLoading && startTime !== null) {
      setProgress(100);
      const timer = setTimeout(() => {
        setLoadingMessageIndex(0);
        setProgress(0);
        setStartTime(null);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [isLoading, startTime]);

  useEffect(() => {
    if (!isLoading) {
      return;
    }

    if (startTime === null) {
      setStartTime(Date.now());
      setProgress(0);
    }

    const lastMessagesStart = LOADING_MESSAGES.length - 8;
    const messageInterval = setInterval(() => {
      setLoadingMessageIndex(prev => {
        if (prev < LOADING_MESSAGES.length - 1) {
          return prev + 1;
        } else {
          return lastMessagesStart;
        }
      });
    }, 3000);

    const progressInterval = setInterval(() => {
      if (startTime !== null) {
        const elapsedSeconds = (Date.now() - startTime) / 1000;
        const calculatedProgress = calculateProgress(elapsedSeconds);
        setProgress(Math.min(calculatedProgress * 100, 95));
      }
    }, 1000);

    return () => {
      clearInterval(messageInterval);
      clearInterval(progressInterval);
    };
  }, [isLoading, startTime]);

  const handleImageClick = (imageUrl) => {
    setSelectedImage(imageUrl);
    setOpenDialog(true);
  };

  const handleDownload = async (imageUrl, index = 0) => {
    const filename = `gourmet_variante_${index + 1}`;
    
    if (parameters && seed && ingredients) {
      try {
        const metadata = createMetadata(parameters, seed, ingredients);
        await downloadImageWithMetadata(imageUrl, metadata, filename);
      } catch (error) {
        console.error('Error descargando con metadata, usando descarga simple:', error);
        await downloadImage(imageUrl, `${filename}.png`);
      }
    } else {
      await downloadImage(imageUrl, `${filename}.png`);
    }
  };

  if (error) {
    return (
      <Alert 
        severity="error" 
        sx={{ 
          mb: 2, 
          borderRadius: 3,
          border: `1px solid ${alpha(theme.palette.error.main, 0.2)}`,
        }}
      >
        {error}
      </Alert>
    );
  }

  if (isLoading) {
    const currentMessage = LOADING_MESSAGES[loadingMessageIndex];
    
    return (
      <Paper
        elevation={0}
        sx={{
          p: { xs: 3, md: 5 },
          borderRadius: 4,
          background: isLight
            ? `linear-gradient(145deg, ${alpha(theme.palette.secondary.main, 0.03)} 0%, ${alpha(theme.palette.background.paper, 0.8)} 100%)`
            : `linear-gradient(145deg, ${alpha(theme.palette.secondary.main, 0.06)} 0%, ${theme.palette.background.paper} 100%)`,
          border: `1px solid ${theme.palette.divider}`,
          minHeight: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Fondo decorativo sutil */}
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '120%',
            height: '120%',
            opacity: 0.03,
            background: `radial-gradient(circle, ${theme.palette.secondary.main} 0%, transparent 70%)`,
            animation: 'pulse 4s ease-in-out infinite',
            '@keyframes pulse': {
              '0%, 100%': { opacity: 0.03, transform: 'translate(-50%, -50%) scale(1)' },
              '50%': { opacity: 0.06, transform: 'translate(-50%, -50%) scale(1.1)' },
            },
          }}
        />

        {/* Indicador principal */}
        <Box
          sx={{
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            mb: 4,
          }}
        >
          <CircularProgress
            size={90}
            thickness={1.5}
            sx={{
              color: alpha(theme.palette.secondary.main, 0.15),
              position: 'absolute',
            }}
            variant="determinate"
            value={100}
          />
          <CircularProgress
            size={90}
            thickness={1.5}
            sx={{
              color: 'secondary.main',
              animationDuration: '2s',
            }}
          />
          <Box
            sx={{
              position: 'absolute',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '2rem',
              animation: 'float 2s ease-in-out infinite',
              '@keyframes float': {
                '0%, 100%': { transform: 'translateY(0)' },
                '50%': { transform: 'translateY(-6px)' },
              },
            }}
          >
            {currentMessage.icon}
          </Box>
        </Box>

        {/* Mensaje de estado */}
        <Typography
          variant="h6"
          sx={{
            mb: 1,
            textAlign: 'center',
            fontWeight: 400,
            color: 'text.primary',
            animation: 'fadeIn 0.4s ease-out',
            '@keyframes fadeIn': {
              '0%': { opacity: 0, transform: 'translateY(8px)' },
              '100%': { opacity: 1, transform: 'translateY(0)' },
            },
          }}
          key={loadingMessageIndex}
        >
          {currentMessage.text}
        </Typography>

        <Typography
          variant="caption"
          color="text.secondary"
          sx={{ 
            mb: 4, 
            textAlign: 'center',
            letterSpacing: '0.05em',
          }}
        >
          Tiempo estimado: ~2 minutos
        </Typography>

        {/* Barra de progreso elegante */}
        <Box sx={{ width: '70%', maxWidth: 280 }}>
          <LinearProgress
            variant="determinate"
            value={progress}
            sx={{
              height: 4,
              borderRadius: 2,
              backgroundColor: alpha(theme.palette.secondary.main, 0.1),
              '& .MuiLinearProgress-bar': {
                borderRadius: 2,
                backgroundColor: 'secondary.main',
              },
            }}
          />
          <Typography
            variant="caption"
            color="text.secondary"
            sx={{ 
              display: 'block', 
              textAlign: 'center', 
              mt: 1.5,
              fontWeight: 500,
            }}
          >
            {Math.round(progress)}%
          </Typography>
        </Box>

        {/* Tip sutil */}
        <Box
          sx={{
            mt: 5,
            p: 2.5,
            borderRadius: 3,
            backgroundColor: alpha(theme.palette.background.paper, 0.6),
            border: `1px solid ${theme.palette.divider}`,
            maxWidth: 320,
          }}
        >
          <Typography
            variant="caption"
            color="text.secondary"
            sx={{ 
              display: 'flex', 
              alignItems: 'flex-start', 
              gap: 1.5,
              lineHeight: 1.6,
            }}
          >
            <span style={{ fontSize: '1rem' }}>💡</span>
            <span>
              <strong style={{ fontWeight: 600 }}>Tip:</strong> Cuanto mayor sea el nivel de transformación, más dramático será el resultado gourmet.
            </span>
          </Typography>
        </Box>
      </Paper>
    );
  }

  if (!images || images.length === 0) {
    return (
      <Paper
        elevation={0}
        sx={{
          p: { xs: 6, md: 8 },
          textAlign: 'center',
          backgroundColor: 'transparent',
          minHeight: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: 4,
          border: `2px dashed ${alpha(theme.palette.divider, 0.5)}`,
        }}
      >
        <Box sx={{ maxWidth: 360 }}>
          {/* Icono decorativo */}
          <Box
            sx={{
              width: 80,
              height: 80,
              borderRadius: '50%',
              bgcolor: alpha(theme.palette.text.secondary, 0.06),
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              mx: 'auto',
              mb: 3,
            }}
          >
            <Typography sx={{ fontSize: '2rem', opacity: 0.6 }}>🍽️</Typography>
          </Box>
          
          <Typography 
            variant="h5" 
            sx={{ 
              fontWeight: 300,
              color: 'text.secondary',
              mb: 1.5,
              letterSpacing: '-0.01em',
            }}
          >
            Tu Lienzo Culinario
          </Typography>
          <Typography 
            variant="body2" 
            color="text.secondary"
            sx={{ lineHeight: 1.7 }}
          >
            Las imágenes generadas por nuestra IA aparecerán aquí con calidad de estudio profesional.
          </Typography>
        </Box>
      </Paper>
    );
  }

  const imageUrl = images[0];

  return (
    <>
      <Box 
        sx={{ 
          animation: 'fadeIn 0.5s ease-out', 
          height: '100%', 
          display: 'flex', 
          flexDirection: 'column',
          '@keyframes fadeIn': {
            '0%': { opacity: 0, transform: 'translateY(8px)' },
            '100%': { opacity: 1, transform: 'translateY(0)' },
          },
        }}
      >
        {/* Etiqueta elegante */}
        <Typography
          variant="overline"
          sx={{
            mb: 2,
            color: 'text.secondary',
            letterSpacing: '0.1em',
          }}
        >
          Resultado Gourmet
        </Typography>
        
        <Paper
          elevation={0}
          sx={{
            position: 'relative',
            overflow: 'hidden',
            borderRadius: 4,
            cursor: 'zoom-in',
            width: '100%',
            flex: 1,
            minHeight: 0,
            bgcolor: isLight ? 'rgba(0,0,0,0.02)' : 'rgba(255,255,255,0.02)',
            border: `1px solid ${theme.palette.divider}`,
            display: 'flex',
            transition: 'all 0.3s ease',
            '&:hover': {
              boxShadow: theme.shadows[8],
            },
            '&:hover .overlay': {
              opacity: 1,
            },
            '&:hover img': {
              transform: 'scale(1.02)',
            },
            [theme.breakpoints.down('sm')]: {
              '& .overlay': {
                opacity: 1,
              },
              aspectRatio: '1',
            },
          }}
          onClick={() => handleImageClick(imageUrl)}
        >
          <img
            src={imageUrl}
            alt="Imagen gourmet generada"
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'contain',
              transition: 'transform 0.6s cubic-bezier(0.25, 0.1, 0.25, 1)',
            }}
          />
          
          <Box
            className="overlay"
            sx={{
              position: 'absolute',
              top: 0, 
              left: 0, 
              right: 0, 
              bottom: 0,
              background: 'linear-gradient(to top, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0) 40%, rgba(0,0,0,0) 60%, rgba(0,0,0,0.3) 100%)',
              opacity: 0,
              transition: 'opacity 0.3s ease',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              p: { xs: 2, sm: 3 },
            }}
          >
            <Box sx={{ alignSelf: 'flex-end' }}>
              <IconButton 
                sx={{ 
                  color: 'white', 
                  bgcolor: 'rgba(255,255,255,0.15)',
                  backdropFilter: 'blur(8px)',
                  '&:hover': { 
                    bgcolor: 'rgba(255,255,255,0.25)',
                    transform: 'scale(1.1)',
                  },
                  transition: 'all 0.2s ease',
                  padding: { xs: 1, sm: 1.5 },
                }}
              >
                <ZoomInIcon sx={{ fontSize: { xs: 20, sm: 24 } }} />
              </IconButton>
            </Box>
            
            <Button
              variant="contained"
              size={isMobile ? "medium" : "large"}
              startIcon={<DownloadIcon />}
              onClick={async (e) => {
                e.stopPropagation();
                await handleDownload(imageUrl, 0);
              }}
              sx={{ 
                bgcolor: 'rgba(255,255,255,0.95)', 
                color: 'text.primary', 
                fontWeight: 500,
                alignSelf: 'center',
                minWidth: { xs: 'auto', sm: '180px' },
                px: { xs: 3, sm: 4 },
                py: { xs: 1, sm: 1.5 },
                borderRadius: 'full',
                letterSpacing: '0.02em',
                '&:hover': { 
                  bgcolor: 'white',
                  transform: 'translateY(-2px)',
                  boxShadow: '0 8px 24px rgba(0,0,0,0.2)',
                },
                transition: 'all 0.25s ease',
              }}
            >
              {isMobile ? 'Descargar' : 'Descargar'}
            </Button>
          </Box>
        </Paper>
        
        {/* Botón móvil adicional */}
        {isMobile && (
          <Button
            variant="outlined"
            fullWidth
            size="large"
            startIcon={<DownloadIcon />}
            onClick={async () => {
              await handleDownload(imageUrl, 0);
            }}
            sx={{ 
              mt: 2,
              py: 1.5,
              borderRadius: 3,
              borderColor: 'secondary.main',
              color: 'secondary.main',
              fontWeight: 500,
              '&:hover': { 
                borderColor: 'secondary.dark',
                backgroundColor: alpha(theme.palette.secondary.main, 0.04),
              },
            }}
          >
            Descargar Imagen
          </Button>
        )}
      </Box>

      {/* Dialog para vista ampliada */}
      <Dialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        maxWidth="lg"
        fullWidth
        PaperProps={{
          sx: { 
            bgcolor: 'transparent', 
            boxShadow: 'none',
            overflow: 'hidden',
          },
        }}
      >
        <DialogContent sx={{ p: 0, position: 'relative', display: 'flex', justifyContent: 'center' }}>
          <IconButton
            onClick={() => setOpenDialog(false)}
            sx={{
              position: 'absolute',
              right: 16,
              top: 16,
              color: 'white',
              bgcolor: 'rgba(0,0,0,0.5)',
              backdropFilter: 'blur(8px)',
              '&:hover': { 
                bgcolor: 'rgba(0,0,0,0.7)',
                transform: 'scale(1.1)',
              },
              transition: 'all 0.2s ease',
              zIndex: 10,
            }}
          >
            <CloseIcon />
          </IconButton>
          {selectedImage && (
            <img
              src={selectedImage}
              alt="Vista ampliada"
              style={{
                maxWidth: '100%',
                maxHeight: '90vh',
                borderRadius: '16px',
                boxShadow: '0 24px 80px rgba(0,0,0,0.5)',
              }}
            />
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default GeneratedImages;
