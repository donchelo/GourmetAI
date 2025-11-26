import React, { useEffect, useState, useImperativeHandle, forwardRef } from 'react';
import {
  Box,
  Paper,
  Typography,
  IconButton,
  Skeleton,
  useTheme,
  alpha
} from '@mui/material';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import HistoryIcon from '@mui/icons-material/History';
import { getHistory } from '../services/airtableService';

const History = forwardRef(({ onLoadGeneration }, ref) => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const theme = useTheme();

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    setLoading(true);
    try {
      const records = await getHistory(20);
      setHistory(records);
    } catch (err) {
      console.warn('Historial no disponible:', err.message);
      setHistory([]);
    } finally {
      setLoading(false);
    }
  };

  // Exponer método para refrescar desde el componente padre
  useImperativeHandle(ref, () => ({
    refresh: loadHistory
  }));

  const handleScroll = (direction) => {
    const container = document.getElementById('history-container');
    if (container) {
      const scrollAmount = 300;
      const currentScroll = container.scrollLeft;
      const newPosition = direction === 'left'
        ? currentScroll - scrollAmount
        : currentScroll + scrollAmount;
      container.scrollTo({ left: newPosition, behavior: 'smooth' });
    }
  };

  const handleImageClick = (record) => {
    if (onLoadGeneration) {
      const fields = record.fields;
      onLoadGeneration({
        imagenOriginal: fields.imagen_original?.[0]?.url,
        imagenesGeneradas: fields.imagenes_generadas?.map(img => img.url) || [],
        parametros: JSON.parse(fields.parametros || '{}'),
        ingredientesDetectados: fields.ingredientes_detectados
      });
    }
  };

  if (loading) {
    return (
      <Paper elevation={0} sx={{ p: 2, bgcolor: 'transparent' }}>
        <Skeleton variant="text" width={200} height={32} sx={{ mb: 2 }} />
        <Box sx={{ display: 'flex', gap: 2, overflow: 'hidden' }}>
          {[1, 2, 3, 4, 5].map((item) => (
             <Skeleton key={item} variant="rectangular" width={160} height={160} sx={{ borderRadius: 3 }} />
          ))}
        </Box>
      </Paper>
    );
  }

  if (!history || history.length === 0) {
    return null;
  }

  return (
    <Box sx={{ mt: 6, mb: 4 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
        <HistoryIcon color="action" />
        <Typography variant="h6" fontWeight="600">
          Inspiración Reciente
        </Typography>
      </Box>
      
      <Box sx={{ position: 'relative' }}>
        <IconButton
          onClick={() => handleScroll('left')}
          sx={{
            position: 'absolute',
            left: -20,
            top: '50%',
            transform: 'translateY(-50%)',
            zIndex: 2,
            bgcolor: theme.palette.background.paper,
            boxShadow: theme.shadows[3],
            '&:hover': { bgcolor: theme.palette.background.default },
            display: { xs: 'none', md: 'flex' }
          }}
        >
          <ArrowBackIosIcon fontSize="small" />
        </IconButton>

        <Box
          id="history-container"
          sx={{
            display: 'flex',
            gap: 2,
            overflowX: 'auto',
            scrollBehavior: 'smooth',
            py: 2,
            px: 1,
            '&::-webkit-scrollbar': { display: 'none' },
            scrollbarWidth: 'none',
            maskImage: 'linear-gradient(to right, transparent, black 5%, black 95%, transparent)'
          }}
        >
          {history.map((record) => {
            const firstGeneratedImage = record.fields.imagenes_generadas?.[0]?.url;
            if (!firstGeneratedImage) return null;

            return (
              <Paper
                key={record.id}
                elevation={2}
                onClick={() => handleImageClick(record)}
                sx={{
                  minWidth: 160,
                  width: 160,
                  height: 160,
                  borderRadius: 3,
                  overflow: 'hidden',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  border: '2px solid transparent',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: theme.shadows[8],
                    borderColor: theme.palette.primary.main
                  }
                }}
              >
                <img
                  src={firstGeneratedImage}
                  alt="Historial"
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover'
                  }}
                />
              </Paper>
            );
          })}
        </Box>

        <IconButton
          onClick={() => handleScroll('right')}
          sx={{
            position: 'absolute',
            right: -20,
            top: '50%',
            transform: 'translateY(-50%)',
            zIndex: 2,
            bgcolor: theme.palette.background.paper,
            boxShadow: theme.shadows[3],
            '&:hover': { bgcolor: theme.palette.background.default },
            display: { xs: 'none', md: 'flex' }
          }}
        >
          <ArrowForwardIosIcon fontSize="small" />
        </IconButton>
      </Box>
    </Box>
  );
});

History.displayName = 'History';

export default History;
