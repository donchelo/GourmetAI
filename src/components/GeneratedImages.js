import React, { useState } from 'react';
import {
  Box,
  Grid,
  Paper,
  Button,
  Typography,
  CircularProgress,
  Dialog,
  DialogContent,
  IconButton,
  Alert
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import DownloadIcon from '@mui/icons-material/Download';
import { downloadImage } from '../utils/imageUtils';
import { downloadImageWithMetadata, createMetadata } from '../utils/metadataUtils';

const GeneratedImages = ({ images, isLoading, error, parameters, seed, ingredients }) => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);

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
      <Alert severity="error" sx={{ mb: 2 }}>
        {error}
      </Alert>
    );
  }

  if (isLoading) {
    return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '400px',
          gap: 2
        }}
      >
        <CircularProgress size={60} />
        <Typography variant="h6" color="text.secondary">
          Creando tu versión gourmet...
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Esto puede tomar unos momentos
        </Typography>
      </Box>
    );
  }

  if (!images || images.length === 0) {
    return (
      <Paper
        elevation={2}
        sx={{
          p: 6,
          textAlign: 'center',
          backgroundColor: 'grey.50',
          minHeight: '400px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        <Box>
          <Typography variant="h6" color="text.secondary" gutterBottom>
            La imagen generada aparecerá aquí
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Sube una imagen y ajusta los parámetros para comenzar
          </Typography>
        </Box>
      </Paper>
    );
  }

  // Solo mostrar la primera imagen (única imagen generada)
  const imageUrl = images[0];

  return (
    <>
      <Box>
        <Typography variant="h6" gutterBottom sx={{ mb: 2 }}>
          Imagen Gourmet Generada
        </Typography>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
          }}
        >
          <Paper
            elevation={3}
            sx={{
              position: 'relative',
              overflow: 'hidden',
              cursor: 'pointer',
              maxWidth: '600px',
              width: '100%',
              '&:hover': {
                transform: 'scale(1.01)',
                transition: 'transform 0.2s'
              }
            }}
            onClick={() => handleImageClick(imageUrl)}
          >
            <Box
              sx={{
                width: '100%',
                paddingTop: '100%',
                position: 'relative',
                backgroundColor: 'grey.200'
              }}
            >
              <img
                src={imageUrl}
                alt="Imagen gourmet generada"
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover'
                }}
              />
            </Box>
            <Box
              sx={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                backgroundColor: 'rgba(0, 0, 0, 0.6)',
                p: 1,
                display: 'flex',
                justifyContent: 'center'
              }}
            >
              <Button
                variant="contained"
                size="small"
                startIcon={<DownloadIcon />}
                onClick={async (e) => {
                  e.stopPropagation();
                  await handleDownload(imageUrl, 0);
                }}
                sx={{ backgroundColor: 'rgba(255, 255, 255, 0.9)', color: 'black' }}
              >
                Descargar
              </Button>
            </Box>
          </Paper>
        </Box>
      </Box>

      {/* Dialog para vista ampliada */}
      <Dialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogContent sx={{ p: 0, position: 'relative' }}>
          <IconButton
            aria-label="close"
            onClick={() => setOpenDialog(false)}
            sx={{
              position: 'absolute',
              right: 8,
              top: 8,
              zIndex: 1,
              backgroundColor: 'rgba(255, 255, 255, 0.9)'
            }}
          >
            <CloseIcon />
          </IconButton>
          {selectedImage && (
            <img
              src={selectedImage}
              alt="Vista ampliada"
              style={{
                width: '100%',
                height: 'auto',
                display: 'block'
              }}
            />
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default GeneratedImages;

