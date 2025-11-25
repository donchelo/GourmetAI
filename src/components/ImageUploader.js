import React, { useCallback, useState } from 'react';
import { Box, Button, Typography, Paper, Alert } from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { imageToBase64 } from '../utils/imageUtils';
import { validateImageFile } from '../utils/validation';

const ImageUploader = ({ onImageSelect, selectedImage }) => {
  const [error, setError] = useState(null);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setError(null);
    const file = e.dataTransfer.files[0];
    if (file) {
      handleFile(file);
    }
  }, []);

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
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

  return (
    <Box>
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      <Paper
        elevation={2}
        sx={{
          p: 3,
          border: '2px dashed',
          borderColor: selectedImage ? 'primary.main' : 'grey.300',
          backgroundColor: selectedImage ? 'action.hover' : 'background.paper',
          cursor: 'pointer',
          transition: 'all 0.3s ease'
        }}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
      >
        {selectedImage ? (
        <Box sx={{ textAlign: 'center' }}>
          <img
            src={selectedImage}
            alt="Imagen seleccionada"
            style={{
              maxWidth: '100%',
              maxHeight: '300px',
              borderRadius: '8px',
              marginBottom: '16px'
            }}
          />
          <Button
            variant="outlined"
            component="label"
            startIcon={<CloudUploadIcon />}
            sx={{ mt: 1 }}
          >
            Cambiar Imagen
            <input
              type="file"
              hidden
              accept="image/jpeg,image/jpg,image/png,image/webp"
              onChange={handleFileInput}
            />
          </Button>
        </Box>
      ) : (
        <Box sx={{ textAlign: 'center', py: 4 }}>
          <CloudUploadIcon sx={{ fontSize: 64, color: 'grey.400', mb: 2 }} />
          <Typography variant="h6" gutterBottom>
            Arrastra una imagen aquí
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            o
          </Typography>
          <Button
            variant="contained"
            component="label"
            startIcon={<CloudUploadIcon />}
          >
            Seleccionar Imagen
            <input
              type="file"
              hidden
              accept="image/jpeg,image/jpg,image/png,image/webp"
              onChange={handleFileInput}
            />
          </Button>
          <Typography variant="caption" display="block" sx={{ mt: 2, color: 'text.secondary' }}>
            Formatos soportados: JPG, PNG, WEBP
          </Typography>
        </Box>
      )}
      </Paper>
    </Box>
  );
};

export default ImageUploader;

