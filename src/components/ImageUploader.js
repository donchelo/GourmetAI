import React, { useCallback, useState } from 'react';
import { Box, Button, Typography, Paper, Alert, useTheme, alpha, IconButton } from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import DeleteIcon from '@mui/icons-material/Delete';
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';
import { imageToBase64 } from '../utils/imageUtils';
import { validateImageFile } from '../utils/validation';

const ImageUploader = ({ onImageSelect, selectedImage }) => {
  const [error, setError] = useState(null);
  const [isDragActive, setIsDragActive] = useState(false);
  const theme = useTheme();
  const isLight = theme.palette.mode === 'light';

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleFile = async (file) => {
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
      console.error('Error procesando imagen:', error);
      setError('Error al procesar la imagen. Por favor, intenta con otra imagen.');
    }
  };

  const clearImage = () => {
    onImageSelect(null);
    setError(null);
  };

  return (
    <Box>
      {error && (
        <Alert 
          severity="error" 
          sx={{ 
            mb: 3, 
            borderRadius: 3,
            border: `1px solid ${alpha(theme.palette.error.main, 0.2)}`,
          }}
        >
          {error}
        </Alert>
      )}
      
      {!selectedImage ? (
        <Paper
          elevation={0}
          sx={{
            p: { xs: 4, md: 6 },
            border: '2px dashed',
            borderColor: isDragActive 
              ? 'secondary.main' 
              : isLight ? 'divider' : alpha(theme.palette.divider, 0.3),
            backgroundColor: isDragActive 
              ? alpha(theme.palette.secondary.main, 0.04) 
              : 'transparent',
            borderRadius: 4,
            cursor: 'pointer',
            transition: 'all 0.3s cubic-bezier(0.25, 0.1, 0.25, 1)',
            textAlign: 'center',
            position: 'relative',
            overflow: 'hidden',
            '&:hover': {
              borderColor: 'secondary.main',
              backgroundColor: alpha(theme.palette.secondary.main, 0.02),
              transform: 'translateY(-2px)',
            },
            '&::before': isDragActive ? {
              content: '""',
              position: 'absolute',
              inset: 0,
              background: `radial-gradient(circle at center, ${alpha(theme.palette.secondary.main, 0.08)} 0%, transparent 70%)`,
              pointerEvents: 'none',
            } : {},
          }}
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onClick={() => document.getElementById('image-upload-input').click()}
        >
          {/* Icono decorativo */}
          <Box 
            sx={{ 
              width: { xs: 64, md: 80 }, 
              height: { xs: 64, md: 80 }, 
              borderRadius: '50%', 
              bgcolor: alpha(theme.palette.secondary.main, isLight ? 0.08 : 0.12),
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              mx: 'auto',
              mb: 3,
              transition: 'all 0.3s ease',
              ...(isDragActive && {
                transform: 'scale(1.1)',
                bgcolor: alpha(theme.palette.secondary.main, 0.15),
              }),
            }}
          >
            <CloudUploadIcon 
              sx={{ 
                fontSize: { xs: 28, md: 36 }, 
                color: 'secondary.main',
                transition: 'transform 0.3s ease',
                ...(isDragActive && { transform: 'translateY(-4px)' }),
              }} 
            />
          </Box>
          
          {/* Título elegante */}
          <Typography 
            variant="h5" 
            sx={{ 
              mb: 1.5,
              fontWeight: 300,
              color: 'text.primary',
              letterSpacing: '-0.01em',
            }}
          >
            Sube tu plato
          </Typography>
          
          {/* Subtítulo */}
          <Typography 
            variant="body2" 
            color="text.secondary" 
            sx={{ 
              mb: 4,
              maxWidth: 280,
              mx: 'auto',
              lineHeight: 1.6,
            }}
          >
            Arrastra una imagen aquí o haz clic para explorar
            <Box 
              component="span" 
              sx={{ 
                display: 'block', 
                mt: 0.5,
                fontSize: '0.75rem',
                letterSpacing: '0.05em',
                textTransform: 'uppercase',
                opacity: 0.7,
              }}
            >
              JPG, PNG, WEBP
            </Box>
          </Typography>
          
          {/* Botón de acción */}
          <Button
            variant="outlined"
            startIcon={<PhotoCameraIcon />}
            sx={{ 
              px: 4, 
              py: 1.5, 
              borderRadius: 'full',
              borderColor: 'secondary.main',
              color: 'secondary.main',
              fontWeight: 500,
              letterSpacing: '0.02em',
              '&:hover': {
                borderColor: 'secondary.dark',
                backgroundColor: alpha(theme.palette.secondary.main, 0.04),
              },
            }}
          >
            Seleccionar Archivo
          </Button>
          
          <input
            id="image-upload-input"
            type="file"
            hidden
            accept="image/jpeg,image/jpg,image/png,image/webp"
            onChange={handleFileInput}
          />
        </Paper>
      ) : (
        <Paper
          elevation={0}
          sx={{
            p: 2,
            position: 'relative',
            borderRadius: 4,
            overflow: 'hidden',
            border: `1px solid ${theme.palette.divider}`,
            backgroundColor: 'background.paper',
            transition: 'all 0.3s ease',
            '&:hover': {
              boxShadow: theme.shadows[4],
            },
          }}
        >
          {/* Etiqueta elegante */}
          <Typography
            variant="overline"
            sx={{
              display: 'block',
              mb: 1.5,
              color: 'text.secondary',
              letterSpacing: '0.1em',
            }}
          >
            Imagen Original
          </Typography>
          
          <Box 
            sx={{ 
              position: 'relative', 
              borderRadius: 3, 
              overflow: 'hidden', 
              aspectRatio: '16/10',
              backgroundColor: isLight ? 'rgba(0,0,0,0.02)' : 'rgba(255,255,255,0.02)',
            }}
          >
            <img
              src={selectedImage}
              alt="Imagen seleccionada"
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                transition: 'transform 0.5s ease',
              }}
            />
            
            {/* Overlay con acciones */}
            <Box 
              sx={{ 
                position: 'absolute', 
                top: 0, 
                left: 0, 
                right: 0, 
                bottom: 0, 
                background: 'linear-gradient(180deg, rgba(0,0,0,0.4) 0%, transparent 30%, transparent 70%, rgba(0,0,0,0.5) 100%)',
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
                  bgcolor: 'rgba(255,255,255,0.95)',
                  color: 'text.primary',
                  fontWeight: 500,
                  px: 3,
                  '&:hover': { 
                    bgcolor: 'white',
                    transform: 'scale(1.02)',
                  },
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
                  bgcolor: 'rgba(255,255,255,0.95)', 
                  color: 'error.main',
                  '&:hover': { 
                    bgcolor: 'white',
                    transform: 'scale(1.1)',
                  },
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
      )}
    </Box>
  );
};

export default ImageUploader;
