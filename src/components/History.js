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
  const isLight = theme.palette.mode === 'light';

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
      <Box sx={{ mt: 6, mb: 4 }}>
        <Skeleton 
          variant="text" 
          width={180} 
          height={28} 
          sx={{ mb: 2.5, borderRadius: 1 }} 
        />
        <Box sx={{ display: 'flex', gap: 2.5, overflow: 'hidden' }}>
          {[1, 2, 3, 4, 5].map((item) => (
            <Skeleton 
              key={item} 
              variant="rectangular" 
              width={150} 
              height={150} 
              sx={{ borderRadius: 3, flexShrink: 0 }} 
            />
          ))}
        </Box>
      </Box>
    );
  }

  if (!history || history.length === 0) {
    return null;
  }

  return (
    <Box sx={{ mt: 6, mb: 4 }}>
      {/* Header elegante */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3 }}>
        <Box 
          sx={{ 
            p: 0.75, 
            borderRadius: 2, 
            bgcolor: alpha(theme.palette.text.secondary, isLight ? 0.06 : 0.1),
            color: 'text.secondary',
            display: 'flex',
          }}
        >
          <HistoryIcon sx={{ fontSize: 18 }} />
        </Box>
        <Typography 
          variant="h6" 
          sx={{ 
            fontWeight: 400,
            letterSpacing: '-0.01em',
            color: 'text.primary',
          }}
        >
          Inspiración Reciente
        </Typography>
      </Box>
      
      <Box sx={{ position: 'relative' }}>
        {/* Botón izquierdo */}
        <IconButton
          onClick={() => handleScroll('left')}
          sx={{
            position: 'absolute',
            left: -16,
            top: '50%',
            transform: 'translateY(-50%)',
            zIndex: 2,
            bgcolor: 'background.paper',
            border: `1px solid ${theme.palette.divider}`,
            boxShadow: theme.shadows[2],
            width: 36,
            height: 36,
            '&:hover': { 
              bgcolor: 'background.paper',
              borderColor: 'text.secondary',
              transform: 'translateY(-50%) scale(1.05)',
            },
            transition: 'all 0.2s ease',
            display: { xs: 'none', md: 'flex' },
          }}
        >
          <ArrowBackIosIcon sx={{ fontSize: 14, ml: 0.5 }} />
        </IconButton>

        {/* Contenedor de historial */}
        <Box
          id="history-container"
          sx={{
            display: 'flex',
            gap: 2,
            overflowX: 'auto',
            scrollBehavior: 'smooth',
            py: 2,
            px: 0.5,
            '&::-webkit-scrollbar': { display: 'none' },
            scrollbarWidth: 'none',
            maskImage: 'linear-gradient(to right, transparent, black 3%, black 97%, transparent)',
          }}
        >
          {history.map((record) => {
            const firstGeneratedImage = record.fields.imagenes_generadas?.[0]?.url;
            if (!firstGeneratedImage) return null;

            return (
              <Paper
                key={record.id}
                elevation={0}
                onClick={() => handleImageClick(record)}
                sx={{
                  minWidth: 140,
                  width: 140,
                  height: 140,
                  borderRadius: 3,
                  overflow: 'hidden',
                  cursor: 'pointer',
                  transition: 'all 0.3s cubic-bezier(0.25, 0.1, 0.25, 1)',
                  border: `1px solid ${theme.palette.divider}`,
                  flexShrink: 0,
                  position: 'relative',
                  '&:hover': {
                    transform: 'translateY(-6px)',
                    boxShadow: theme.shadows[8],
                    borderColor: 'secondary.main',
                    '& img': {
                      transform: 'scale(1.08)',
                    },
                    '&::after': {
                      opacity: 1,
                    },
                  },
                  '&::after': {
                    content: '""',
                    position: 'absolute',
                    inset: 0,
                    background: 'linear-gradient(180deg, transparent 50%, rgba(0,0,0,0.4) 100%)',
                    opacity: 0,
                    transition: 'opacity 0.3s ease',
                    pointerEvents: 'none',
                  },
                }}
              >
                <img
                  src={firstGeneratedImage}
                  alt="Historial"
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    transition: 'transform 0.4s ease',
                  }}
                />
              </Paper>
            );
          })}
        </Box>

        {/* Botón derecho */}
        <IconButton
          onClick={() => handleScroll('right')}
          sx={{
            position: 'absolute',
            right: -16,
            top: '50%',
            transform: 'translateY(-50%)',
            zIndex: 2,
            bgcolor: 'background.paper',
            border: `1px solid ${theme.palette.divider}`,
            boxShadow: theme.shadows[2],
            width: 36,
            height: 36,
            '&:hover': { 
              bgcolor: 'background.paper',
              borderColor: 'text.secondary',
              transform: 'translateY(-50%) scale(1.05)',
            },
            transition: 'all 0.2s ease',
            display: { xs: 'none', md: 'flex' },
          }}
        >
          <ArrowForwardIosIcon sx={{ fontSize: 14 }} />
        </IconButton>
      </Box>
    </Box>
  );
});

History.displayName = 'History';

export default History;
