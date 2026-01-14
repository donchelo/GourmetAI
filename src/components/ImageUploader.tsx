import React, { useCallback, useState, useRef, useEffect } from 'react';
import { Box, Button, Typography, Paper, Alert, useTheme, alpha, IconButton, Fade, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import DeleteIcon from '@mui/icons-material/Delete';
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import CloseIcon from '@mui/icons-material/Close';
import { imageToBase64 } from '../utils/imageUtils';
import { validateImageFile } from '../utils/validation';

interface ImageUploaderProps {
  onImageSelect: (base64: string | null) => void;
  selectedImage: string | null;
  label?: string;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ onImageSelect, selectedImage, label = "Subir Imagen" }) => {
  const [error, setError] = useState<string | null>(null);
  const [isDragActive, setIsDragActive] = useState<boolean>(false);
  const [isCameraOpen, setIsCameraOpen] = useState<boolean>(false);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const theme = useTheme();

  const handleFile = useCallback(async (file: File) => {
    const validation = validateImageFile(file);
    if (!validation.valid) {
      setError(validation.error || 'Archivo invรกlido');
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

  const handleDragEnter = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);
    setError(null);
    const file = e.dataTransfer.files[0];
    if (file) {
      handleFile(file);
    }
  }, [handleFile]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setError(null);
    const file = e.target.files?.[0];
    if (file) {
      handleFile(file);
    }
  }, [handleFile]);

  const clearImage = () => {
    onImageSelect(null);
    setError(null);
  };

  const startCamera = useCallback(async () => {
    try {
      setError(null);
      setIsCameraOpen(true);
      
      await new Promise<void>(resolve => {
        const checkVideo = () => {
          if (videoRef.current) {
            resolve();
          } else {
            setTimeout(checkVideo, 50);
          }
        };
        checkVideo();
      });
      
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { 
          facingMode: 'environment',
          width: { ideal: 1920 },
          height: { ideal: 1080 }
        }
      });
      
      setStream(mediaStream);
      
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        try {
          await videoRef.current.play();
        } catch (playErr) {
          console.error('Error reproduciendo video:', playErr);
        }
      }
    } catch (err: any) {
      console.error('Error accediendo a la cรกmara:', err);
      setIsCameraOpen(false);
      if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
        setError('Permiso de cรกmara denegado. Por favor, permite el acceso a la cรกmara en la configuraciรณn del navegador.');
      } else if (err.name === 'NotFoundError' || err.name === 'DevicesNotFoundError') {
        setError('No se encontrรณ ninguna cรกmara disponible.');
      } else {
        setError('Error al acceder a la cรกmara. Por favor, intenta de nuevo.');
      }
    }
  }, []);

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

  const capturePhoto = useCallback(() => {
    if (!videoRef.current || !canvasRef.current) {
      setError('El video no estรก listo. Por favor, espera un momento.');
      return;
    }

    const video = videoRef.current;
    const canvas = canvasRef.current;
    
    if (!video.videoWidth || !video.videoHeight || video.videoWidth === 0 || video.videoHeight === 0) {
      setError('El video no estรก listo. Por favor, espera un momento.');
      return;
    }

    const context = canvas.getContext('2d');
    if (!context) return;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    context.drawImage(video, 0, 0, canvas.width, canvas.height);

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
      } else {
        setError('Error al capturar la foto. Por favor, intenta de nuevo.');
      }
    }, 'image/jpeg', 0.95);
  }, [onImageSelect, stopCamera]);

  useEffect(() => {
    if (stream && videoRef.current && isCameraOpen) {
      const video = videoRef.current;
      video.srcObject = stream;
      
      const playVideo = async () => {
        try {
          await video.play();
        } catch (err) {
          console.error('Error reproduciendo video:', err);
          setError('Error al reproducir el video de la cรกmara. Por favor, intenta de nuevo.');
        }
      };
      
      playVideo();
      
      const handleCanPlay = () => {
        video.play().catch(err => {
          console.error('Error en play despuรฉs de canplay:', err);
        });
      };
      
      video.addEventListener('canplay', handleCanPlay);
      
      return () => {
        video.removeEventListener('canplay', handleCanPlay);
      };
    }
  }, [stream, isCameraOpen]);

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
          onClick={() => document.getElementById('image-upload-input')?.click()}
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
            {label}
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
                document.getElementById('image-upload-input')?.click();
              }}
              sx={{ 
                borderRadius: 0,
                px: 4,
                py: 1.5,
                borderColor: 'text.primary',
                color: 'text.primary',
                '&:hover': {
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
                px: 4,
                py: 1.5,
                borderColor: 'secondary.main',
                color: 'secondary.main',
                '&:hover': {
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
                  objectFit: 'cover',
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
                    document.getElementById('image-change-input')?.click();
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
              muted
              style={{
                width: '100%',
                height: 'auto',
                maxHeight: '70vh',
                minHeight: '400px',
                objectFit: 'contain',
                backgroundColor: 'black',
              }}
            />
            {!stream && (
              <Box
                sx={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  bgcolor: 'rgba(0, 0, 0, 0.7)',
                }}
              >
                <Typography 
                  variant="body1" 
                  sx={{ 
                    color: 'white', 
                    textAlign: 'center',
                    p: 3
                  }}
                >
                  Iniciando cรกmara...
                </Typography>
              </Box>
            )}
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
