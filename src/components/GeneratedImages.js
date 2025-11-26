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
  Skeleton,
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

  // Función para calcular progreso basado en tiempo transcurrido
  // Tiempo estimado: 120 segundos (2 minutos)
  const calculateProgress = (elapsedSeconds) => {
    const totalEstimatedSeconds = 120; // 2 minutos
    const progressRatio = Math.min(elapsedSeconds / totalEstimatedSeconds, 0.95); // Máximo 95%
    
    // Curva de progreso más realista:
    // - Inicio rápido (0-30%): primeros 20 segundos
    // - Medio más lento (30-70%): siguientes 60 segundos  
    // - Final acelerado (70-95%): últimos 40 segundos
    
    if (progressRatio <= 0.167) { // Primeros 20 segundos (0-30%)
      return progressRatio * 1.8; // Acelera rápido al inicio
    } else if (progressRatio <= 0.667) { // Siguientes 60 segundos (30-70%)
      return 0.3 + (progressRatio - 0.167) * 0.8; // Progreso más lento
    } else { // Últimos 40 segundos (70-95%)
      return 0.7 + (progressRatio - 0.667) * 0.75; // Acelera hacia el final
    }
  };

  // Completar progreso al 100% cuando termine la carga
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

  // Ciclar entre mensajes de carga y simular progreso basado en tiempo
  useEffect(() => {
    if (!isLoading) {
      return;
    }

    // Inicializar tiempo de inicio cuando comienza la carga
    if (startTime === null) {
      setStartTime(Date.now());
      setProgress(0);
    }

    // Cambiar mensaje cada 3 segundos
    // Cuando llegue al final, cicla entre los últimos 8 mensajes para dar variedad
    const lastMessagesStart = LOADING_MESSAGES.length - 8;
    const messageInterval = setInterval(() => {
      setLoadingMessageIndex(prev => {
        if (prev < LOADING_MESSAGES.length - 1) {
          return prev + 1;
        } else {
          // Ciclar entre los últimos 8 mensajes cuando llegue al final
          return lastMessagesStart;
        }
      });
    }, 3000);

    // Actualizar progreso basado en tiempo transcurrido (cada segundo)
    const progressInterval = setInterval(() => {
      if (startTime !== null) {
        const elapsedSeconds = (Date.now() - startTime) / 1000;
        const calculatedProgress = calculateProgress(elapsedSeconds);
        setProgress(Math.min(calculatedProgress * 100, 95)); // Máximo 95% hasta que termine
      }
    }, 1000); // Actualizar cada segundo para mayor precisión

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
    
    // Si tenemos metadata, descargar con metadata
    if (parameters && seed && ingredients) {
      try {
        const metadata = createMetadata(parameters, seed, ingredients);
        await downloadImageWithMetadata(imageUrl, metadata, filename);
      } catch (error) {
        console.error('Error descargando con metadata, usando descarga simple:', error);
        await downloadImage(imageUrl, `${filename}.png`);
      }
    } else {
      // Descarga simple sin metadata
      await downloadImage(imageUrl, `${filename}.png`);
    }
  };

  if (error) {
    return (
      <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }}>
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
          p: 4,
          borderRadius: 4,
          background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.05)} 0%, ${alpha(theme.palette.secondary.main, 0.08)} 100%)`,
          border: `1px solid ${alpha(theme.palette.primary.main, 0.15)}`,
          minHeight: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        {/* Fondo animado con ondas */}
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            opacity: 0.1,
            background: `
              radial-gradient(circle at 20% 80%, ${theme.palette.primary.main} 0%, transparent 50%),
              radial-gradient(circle at 80% 20%, ${theme.palette.secondary.main} 0%, transparent 50%)
            `,
            animation: 'pulse 4s ease-in-out infinite',
            '@keyframes pulse': {
              '0%, 100%': { opacity: 0.1, transform: 'scale(1)' },
              '50%': { opacity: 0.2, transform: 'scale(1.05)' }
            }
          }}
        />

        {/* Indicador principal con spinner */}
        <Box
          sx={{
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            mb: 4
          }}
        >
          <CircularProgress
            size={100}
            thickness={2}
            sx={{
              color: alpha(theme.palette.primary.main, 0.2),
              position: 'absolute'
            }}
            variant="determinate"
            value={100}
          />
          <CircularProgress
            size={100}
            thickness={2}
            sx={{
              color: theme.palette.primary.main,
              animationDuration: '1.5s'
            }}
          />
          <Box
            sx={{
              position: 'absolute',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '2.5rem',
              animation: 'bounce 1s ease-in-out infinite',
              '@keyframes bounce': {
                '0%, 100%': { transform: 'translateY(0)' },
                '50%': { transform: 'translateY(-5px)' }
              }
            }}
          >
            {currentMessage.icon}
          </Box>
        </Box>

        {/* Mensaje de estado */}
        <Typography
          variant="h6"
          fontWeight="600"
          color="text.primary"
          sx={{
            mb: 1,
            textAlign: 'center',
            animation: 'fadeIn 0.5s ease-in',
            '@keyframes fadeIn': {
              '0%': { opacity: 0, transform: 'translateY(10px)' },
              '100%': { opacity: 1, transform: 'translateY(0)' }
            }
          }}
          key={loadingMessageIndex} // Key para forzar re-render y animación
        >
          {currentMessage.text}
        </Typography>

        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ mb: 3, textAlign: 'center' }}
        >
          Tiempo estimado: ~2 minutos
        </Typography>

        {/* Barra de progreso */}
        <Box sx={{ width: '80%', maxWidth: 300 }}>
          <LinearProgress
            variant="determinate"
            value={progress}
            sx={{
              height: 8,
              borderRadius: 4,
              backgroundColor: alpha(theme.palette.primary.main, 0.1),
              '& .MuiLinearProgress-bar': {
                borderRadius: 4,
                background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
              }
            }}
          />
          <Typography
            variant="caption"
            color="text.secondary"
            sx={{ display: 'block', textAlign: 'center', mt: 1 }}
          >
            {Math.round(progress)}% completado
          </Typography>
        </Box>

        {/* Tips mientras espera */}
        <Box
          sx={{
            mt: 4,
            p: 2,
            borderRadius: 2,
            backgroundColor: alpha(theme.palette.info.main, 0.08),
            maxWidth: 350
          }}
        >
          <Typography
            variant="caption"
            color="text.secondary"
            sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
          >
            💡 <strong>Tip:</strong> Cuanto mayor sea el nivel de transformación, más dramático será el resultado gourmet.
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
          p: 8,
          textAlign: 'center',
          backgroundColor: alpha(theme.palette.text.primary, 0.03),
          minHeight: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: 4,
          border: `2px dashed ${theme.palette.divider}`
        }}
      >
        <Box sx={{ maxWidth: 400 }}>
          <Typography variant="h5" fontWeight="600" color="text.secondary" gutterBottom>
            Tu Lienzo Culinario
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Las imágenes generadas por nuestra IA aparecerán aquí con calidad de estudio.
          </Typography>
        </Box>
      </Paper>
    );
  }

  // Solo mostrar la primera imagen (única imagen generada)
  const imageUrl = images[0];

  return (
    <>
      <Box sx={{ animation: 'fadeIn 0.5s ease-in', height: '100%', display: 'flex', flexDirection: 'column' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
           <Typography variant="h6" fontWeight="700">
             Resultado Gourmet
           </Typography>
        </Box>
        
        <Paper
          elevation={4}
          sx={{
            position: 'relative',
            overflow: 'hidden',
            borderRadius: 4,
            cursor: 'zoom-in',
            width: '100%',
            flex: 1,
            minHeight: 0,
            bgcolor: 'background.paper',
            display: 'flex',
            '&:hover .overlay': {
              opacity: 1
            },
            '&:hover img': {
               transform: 'scale(1.03)'
            },
            [theme.breakpoints.down('sm')]: {
              '& .overlay': {
                opacity: 1
              },
              aspectRatio: '1'
            }
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
                transition: 'transform 0.5s ease'
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
                background: 'linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0) 50%, rgba(0,0,0,0.3) 100%)',
                opacity: 0,
                transition: 'opacity 0.3s ease',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                p: { xs: 2, sm: 3 }
              }}
            >
               <Box sx={{ alignSelf: 'flex-end' }}>
                 <IconButton 
                   sx={{ 
                     color: 'white', 
                     bgcolor: 'rgba(255,255,255,0.2)',
                     '&:hover': { bgcolor: 'rgba(255,255,255,0.3)' },
                     padding: { xs: 1, sm: 1.5 }
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
                   bgcolor: 'white', 
                   color: 'black', 
                   fontWeight: 'bold',
                   alignSelf: 'center',
                   minWidth: { xs: 'auto', sm: '200px' },
                   px: { xs: 2, sm: 3 },
                   py: { xs: 1, sm: 1.5 },
                   fontSize: { xs: '0.875rem', sm: '1rem' },
                   '&:hover': { bgcolor: '#f5f5f5' },
                   '& .MuiButton-startIcon': {
                     marginRight: { xs: 0.5, sm: 1 }
                   }
                }}
              >
                {isMobile ? 'Descargar' : 'Descargar Obra'}
              </Button>
            </Box>
        </Paper>
        
        {/* Botón de descarga adicional para móviles (fuera del overlay) */}
        {isMobile && (
          <Button
            variant="contained"
            fullWidth
            size="large"
            startIcon={<DownloadIcon />}
            onClick={async () => {
              await handleDownload(imageUrl, 0);
            }}
            sx={{ 
              mt: 2,
              bgcolor: theme.palette.primary.main,
              color: 'white',
              fontWeight: 'bold',
              py: 1.5,
              '&:hover': { 
                bgcolor: theme.palette.primary.dark 
              }
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
            overflow: 'hidden'
          }
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
              '&:hover': { bgcolor: 'rgba(0,0,0,0.8)' },
              zIndex: 10
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
                borderRadius: '8px',
                boxShadow: '0 8px 32px rgba(0,0,0,0.5)'
              }}
            />
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default GeneratedImages;
