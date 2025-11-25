import React, { useCallback, useState } from 'react';
import { Box, Button, Typography, Paper, Alert, useTheme, alpha, IconButton } from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import DeleteIcon from '@mui/icons-material/Delete';
import PhotoIcon from '@mui/icons-material/Photo';
import { imageToBase64 } from '../utils/imageUtils';
import { validateImageFile } from '../utils/validation';

const ImageUploader = ({ onImageSelect, selectedImage }) => {
  const [error, setError] = useState(null);
  const [isDragActive, setIsDragActive] = useState(false);
  const theme = useTheme();

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
        <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }}>
          {error}
        </Alert>
      )}
      
      {!selectedImage ? (
        <Paper
          elevation={isDragActive ? 3 : 0}
          sx={{
            p: 6,
            border: '2px dashed',
            borderColor: isDragActive ? 'primary.main' : 'divider',
            backgroundColor: isDragActive 
              ? alpha(theme.palette.primary.main, 0.05) 
              : alpha(theme.palette.background.paper, 0.6),
            borderRadius: 4,
            cursor: 'pointer',
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            textAlign: 'center',
            '&:hover': {
              borderColor: 'primary.main',
              backgroundColor: alpha(theme.palette.primary.main, 0.02),
            }
          }}
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onClick={() => document.getElementById('image-upload-input').click()}
        >
          <Box 
            sx={{ 
              width: 80, 
              height: 80, 
              borderRadius: '50%', 
              bgcolor: alpha(theme.palette.primary.main, 0.1),
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              mx: 'auto',
              mb: 2
            }}
          >
            <CloudUploadIcon sx={{ fontSize: 40, color: 'primary.main' }} />
          </Box>
          <Typography variant="h6" gutterBottom fontWeight="600">
            Sube tu plato aquí
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Arrastra una imagen o haz clic para explorar <br/>
            (JPG, PNG, WEBP)
          </Typography>
          <Button
            variant="contained"
            startIcon={<PhotoIcon />}
            sx={{ px: 4, py: 1.5, borderRadius: '50px' }}
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
          elevation={2}
          sx={{
            p: 2,
            position: 'relative',
            borderRadius: 4,
            overflow: 'hidden',
            border: `1px solid ${theme.palette.divider}`
          }}
        >
          <Box sx={{ position: 'relative', borderRadius: 3, overflow: 'hidden', aspectRatio: '16/9' }}>
            <img
              src={selectedImage}
              alt="Imagen seleccionada"
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
                bgcolor: 'rgba(0,0,0,0.3)', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                opacity: 0,
                transition: 'opacity 0.2s',
                '&:hover': { opacity: 1 }
              }}
            >
              <Button
                variant="contained"
                color="info"
                onClick={() => document.getElementById('image-change-input').click()}
                sx={{ mr: 2 }}
              >
                Cambiar
              </Button>
              <IconButton 
                color="error" 
                variant="contained" 
                sx={{ bgcolor: 'white', '&:hover': { bgcolor: '#ffebee' } }}
                onClick={clearImage}
              >
                <DeleteIcon />
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
