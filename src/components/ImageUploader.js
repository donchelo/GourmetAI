import React, { useCallback, useState, useRef, useEffect } from 'react';
import { Box, Button, Typography, Paper, Alert, useTheme, alpha, IconButton, Fade, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import DeleteIcon from '@mui/icons-material/Delete';
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import CloseIcon from '@mui/icons-material/Close';
import { imageToBase64 } from '../utils/imageUtils';
import { validateImageFile } from '../utils/validation';

const ImageUploader = ({ onImageSelect, selectedImage }) => {
  const [error, setError] = useState(null);
  const [isDragActive, setIsDragActive] = useState(false);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [stream, setStream] = useState(null);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const theme = useTheme();

  const handleFile = useCallback(async (file) => {
    const validation = validateImageFile(file);
    if (!validation.valid) {
      setError(validation.error);
      return;
    }

    try {
      const base64 = await imageToBase64(file);
      onImageSelect(base64);
      setError(null);
    } catch (error) {
      console.error('Error processing image:', error);
      setError('Error al procesar la imagen. Por favor, intenta con otro archivo.');
    }
  }, [onImageSelect]);

  const handleDragEnter = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(true);
  }, []);

  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);
    setError(null);
    const file = e.dataTransfer.files[0];
    if (file) {
      handleFile(file);
    }
  }, [handleFile]);

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleFileInput = useCallback((e) => {
    setError(null);
    const file = e.target.files[0];
    if (file) {
      handleFile(file);
    }
  }, [handleFile]);

  const clearImage = () => {
    onImageSelect(null);
    setError(null);
  };

  // Iniciar cámara
  const startCamera = useCallback(async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { 
          facingMode: 'environment', // Cámara trasera en móviles
          width: { ideal: 1920 },
          height: { ideal: 1080 }
        }
      });
      setStream(mediaStream);
      setIsCameraOpen(true);
      setError(null);
      
      // Establecer el stream en el video cuando el componente esté montado
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (err) {
      console.error('Error accediendo a la cámara:', err);
      if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
        setError('Permiso de cámara denegado. Por favor, permite el acceso a la cámara en la configuración del navegador.');
      } else if (err.name === 'NotFoundError' || err.name === 'DevicesNotFoundError') {
        setError('No se encontró ninguna cámara disponible.');
      } else {
        setError('Error al acceder a la cámara. Por favor, intenta de nuevo.');
      }
    }
  }, []);

  // Detener cámara
  const stopCamera = useCallback(() => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
    setIsCameraOpen(false);
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  }, [stream]);

  // Capturar foto
  const capturePhoto = useCallback(() => {
    if (!videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');

    // Ajustar dimensiones del canvas al video
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    // Dibujar el frame actual del video en el canvas
    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    // Convertir canvas a blob y luego a base64
    canvas.toBlob(async (blob) => {
      if (blob) {
        try {
          const file = new File([blob], 'camera-photo.jpg', { type: 'image/jpeg' });
          const base64 = await imageToBase64(file);
          onImageSelect(base64);
          stopCamera();
          setError(null);
        } catch (err) {
          console.error('Error procesando foto:', err);
          setError('Error al procesar la foto. Por favor, intenta de nuevo.');
        }
      }
    }, 'image/jpeg', 0.95);
  }, [onImageSelect, stopCamera]);

  // Actualizar video cuando el stream cambie
  useEffect(() => {
    if (stream && videoRef.current) {
      videoRef.current.srcObject = stream;
    }
  }, [stream]);

  // Limpiar stream al desmontar
  useEffect(() => {
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [stream]);

  return (
    <Box>
      {error && (
        <Alert 
          severity="error" 
          sx={{ 
            mb: 3, 
            borderRadius: 0,
            border: `1px solid ${theme.palette.error.main}`,
            backgroundColor: alpha(theme.palette.error.main, 0.05),
          }}
        >
          {error}
        </Alert>
      )}
      
      {!selectedImage ? (
        <Paper
          elevation={0}
          sx={{
            p: { xs: 4, md: 8 },
            border: '1px dashed',
            borderColor: isDragActive 
              ? 'secondary.main' 
              : theme.palette.divider,
            backgroundColor: isDragActive 
              ? alpha(theme.palette.secondary.main, 0.02) 
              : 'transparent',
            borderRadius: 0,
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            textAlign: 'center',
            position: 'relative',
            '&:hover': {
              borderColor: 'text.primary',
              backgroundColor: alpha(theme.palette.text.primary, 0.01),
            },
          }}
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onClick={() => document.getElementById('image-upload-input').click()}
        >
          <Box 
            sx={{ 
              mb: 3,
              display: 'flex',
              justifyContent: 'center',
              opacity: 0.5,
            }}
          >
            <CloudUploadIcon sx={{ fontSize: 48 }} />
          </Box>
          
          <Typography 
            variant="h5" 
            sx={{ 
              mb: 2,
              fontWeight: 300,
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
            }}
          >
            Subir Imagen
          </Typography>
          
          <Typography 
            variant="body2" 
            color="text.secondary" 
            sx={{ 
              mb: 4,
              maxWidth: 300,
              mx: 'auto',
              opacity: 0.7,
            }}
          >
            Arrastra y suelta o haz clic para buscar
            <br />
            <Box component="span" sx={{ fontSize: '0.7rem', mt: 1, display: 'inline-block', opacity: 0.5 }}>
              JPG, PNG, WEBP
            </Box>
          </Typography>
          
          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Button
              variant="outlined"
              startIcon={<PhotoCameraIcon />}
              onClick={(e) => {
                e.stopPropagation();
                document.getElementById('image-upload-input').click();
              }}
              sx={{ 
                borderRadius: 0,
                borderWidth: '1px',
                px: 4,
                py: 1.5,
                borderColor: 'text.primary',
                color: 'text.primary',
                '&:hover': {
                  borderWidth: '1px',
                  bgcolor: 'text.primary',
                  color: 'background.paper',
                }
              }}
            >
              Seleccionar Archivo
            </Button>
            
            <Button
              variant="outlined"
              startIcon={<CameraAltIcon />}
              onClick={(e) => {
                e.stopPropagation();
                startCamera();
              }}
              sx={{ 
                borderRadius: 0,
                borderWidth: '1px',
                px: 4,
                py: 1.5,
                borderColor: 'secondary.main',
                color: 'secondary.main',
                '&:hover': {
                  borderWidth: '1px',
                  bgcolor: 'secondary.main',
                  color: 'background.paper',
                }
              }}
            >
              Tomar Foto
            </Button>
          </Box>
          
          <input
            id="image-upload-input"
            type="file"
            hidden
            accept="image/jpeg,image/jpg,image/png,image/webp"
            onChange={handleFileInput}
          />
        </Paper>
      ) : (
        <Fade in={true}>
          <Paper
            elevation={0}
            sx={{
              position: 'relative',
              borderRadius: 0,
              overflow: 'hidden',
              border: `1px solid ${theme.palette.divider}`,
              backgroundColor: 'background.paper',
            }}
          >
            <Box 
              sx={{ 
                position: 'relative', 
                borderRadius: 0, 
                overflow: 'hidden', 
                aspectRatio: '16/10',
                bgcolor: 'background.default',
              }}
            >
              <img
                src={selectedImage}
                alt="Selected"
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover', // Or contain depending on preference
                }}
              />
              
              <Box 
                sx={{ 
                  position: 'absolute', 
                  top: 0, 
                  left: 0, 
                  right: 0, 
                  bottom: 0, 
                  background: 'rgba(0,0,0,0.4)',
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  gap: 2,
                  opacity: 0,
                  transition: 'opacity 0.25s ease',
                  '&:hover': { opacity: 1 },
                }}
              >
                <Button
                  variant="contained"
                  size="small"
                  onClick={(e) => {
                    e.stopPropagation();
                    document.getElementById('image-change-input').click();
                  }}
                  sx={{ 
                    bgcolor: 'white',
                    color: 'black',
                    borderRadius: 0,
                    fontWeight: 600,
                    '&:hover': { bgcolor: '#f0f0f0' },
                  }}
                >
                  Cambiar
                </Button>
                
                <IconButton 
                  size="small"
                  onClick={(e) => {
                    e.stopPropagation();
                    clearImage();
                  }}
                  sx={{ 
                    bgcolor: 'white', 
                    color: 'black',
                    borderRadius: 0,
                    p: 1,
                    '&:hover': { bgcolor: '#f0f0f0' },
                  }}
                >
                  <DeleteIcon fontSize="small" />
                </IconButton>
              </Box>
            </Box>
            
            <input
              id="image-change-input"
              type="file"
              hidden
              accept="image/jpeg,image/jpg,image/png,image/webp"
              onChange={handleFileInput}
            />
          </Paper>
        </Fade>
      )}

      {/* Diálogo de cámara */}
      <Dialog
        open={isCameraOpen}
        onClose={stopCamera}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 0,
            bgcolor: 'background.paper',
          }
        }}
      >
        <DialogTitle
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            borderBottom: `1px solid ${theme.palette.divider}`,
            pb: 2,
          }}
        >
          <Typography variant="h6" sx={{ fontWeight: 300, textTransform: 'uppercase' }}>
            Tomar Foto
          </Typography>
          <IconButton
            onClick={stopCamera}
            sx={{
              color: 'text.primary',
              '&:hover': {
                bgcolor: alpha(theme.palette.text.primary, 0.1),
              }
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        
        <DialogContent sx={{ p: 0, position: 'relative' }}>
          <Box
            sx={{
              position: 'relative',
              width: '100%',
              bgcolor: 'black',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              minHeight: '400px',
            }}
          >
            <video
              ref={videoRef}
              autoPlay
              playsInline
              style={{
                width: '100%',
                maxHeight: '70vh',
                objectFit: 'contain',
              }}
            />
            <canvas ref={canvasRef} style={{ display: 'none' }} />
          </Box>
        </DialogContent>
        
        <DialogActions
          sx={{
            p: 3,
            borderTop: `1px solid ${theme.palette.divider}`,
            justifyContent: 'center',
            gap: 2,
          }}
        >
          <Button
            onClick={stopCamera}
            variant="outlined"
            sx={{
              borderRadius: 0,
              borderWidth: '1px',
              px: 4,
              py: 1.5,
            }}
          >
            Cancelar
          </Button>
          <Button
            onClick={capturePhoto}
            variant="contained"
            startIcon={<CameraAltIcon />}
            sx={{
              borderRadius: 0,
              px: 4,
              py: 1.5,
              bgcolor: 'secondary.main',
              '&:hover': {
                bgcolor: 'secondary.dark',
              }
            }}
          >
            Capturar
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ImageUploader;
