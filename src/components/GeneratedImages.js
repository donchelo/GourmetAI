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
  LinearProgress
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import DownloadIcon from '@mui/icons-material/Download';
import ZoomInIcon from '@mui/icons-material/ZoomIn';
import { downloadImage } from '../utils/imageUtils';
import { downloadImageWithMetadata, createMetadata } from '../utils/metadataUtils';

const LOADING_MESSAGES = [
  { text: 'Analizando tu imagen...', icon: '🔍' },
  { text: 'Detectando ingredientes...', icon: '🥗' },
  { text: 'Preparando la transformación gourmet...', icon: '👨‍🍳' },
  { text: 'Aplicando técnicas culinarias de élite...', icon: '✨' },
  { text: 'Ajustando iluminación profesional...', icon: '💡' },
  { text: 'Emplatando con precisión artística...', icon: '🍽️' },
  { text: 'Añadiendo toques finales de chef...', icon: '🎨' },
  { text: 'Capturando la esencia gourmet...', icon: '📸' },
  { text: 'Casi listo... Un poco más de magia...', icon: '🪄' },
];

const GeneratedImages = ({ images, isLoading, error, parameters, seed, ingredients }) => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [loadingMessageIndex, setLoadingMessageIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const theme = useTheme();

  // Ciclar entre mensajes de carga y simular progreso
  useEffect(() => {
    if (!isLoading) {
      setLoadingMessageIndex(0);
      setProgress(0);
      return;
    }

    // Cambiar mensaje cada 3 segundos
    const messageInterval = setInterval(() => {
      setLoadingMessageIndex(prev => 
        prev < LOADING_MESSAGES.length - 1 ? prev + 1 : prev
      );
    }, 3000);

    // Simular progreso gradual (no llega a 100% hasta que termine)
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 90) return prev; // Se detiene en 90% hasta que termine
        return prev + Math.random() * 8;
      });
    }, 500);

    return () => {
      clearInterval(messageInterval);
      clearInterval(progressInterval);
    };
  }, [isLoading]);

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
          minHeight: '450px',
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
          Esto puede tomar entre 15-30 segundos
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
          minHeight: '400px',
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
      <Box sx={{ animation: 'fadeIn 0.5s ease-in' }}>
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
            aspectRatio: '1',
            bgcolor: 'background.paper',
            '&:hover .overlay': {
              opacity: 1
            },
            '&:hover img': {
               transform: 'scale(1.03)'
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
                objectFit: 'cover',
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
                p: 3
              }}
            >
               <Box sx={{ alignSelf: 'flex-end' }}>
                 <IconButton sx={{ color: 'white', bgcolor: 'rgba(255,255,255,0.2)' }}>
                    <ZoomInIcon />
                 </IconButton>
               </Box>
               
               <Button
                variant="contained"
                size="large"
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
                   '&:hover': { bgcolor: '#f5f5f5' }
                }}
              >
                Descargar Obra
              </Button>
            </Box>
        </Paper>
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
