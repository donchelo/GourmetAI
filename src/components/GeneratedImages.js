import React, { useState } from 'react';
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
  alpha
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import DownloadIcon from '@mui/icons-material/Download';
import ZoomInIcon from '@mui/icons-material/ZoomIn';
import { downloadImage } from '../utils/imageUtils';
import { downloadImageWithMetadata, createMetadata } from '../utils/metadataUtils';

const GeneratedImages = ({ images, isLoading, error, parameters, seed, ingredients }) => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const theme = useTheme();

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
    return (
      <Box sx={{ width: '100%' }}>
         <Box sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 2 }}>
            <Skeleton variant="circular" width={40} height={40} />
            <Skeleton variant="text" width={200} height={32} />
         </Box>
         <Skeleton 
            variant="rectangular" 
            width="100%" 
            height={400} 
            sx={{ borderRadius: 4 }}
          />
         <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center' }}>
            <Skeleton variant="text" width="60%" />
         </Box>
      </Box>
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
