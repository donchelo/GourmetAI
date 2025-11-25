import React, { useEffect, useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  IconButton,
  CircularProgress,
  Alert
} from '@mui/material';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import { getHistory } from '../services/airtableService';

const History = ({ onLoadGeneration }) => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [scrollPosition, setScrollPosition] = useState(0);

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    setLoading(true);
    setError(null);
    try {
      const records = await getHistory(20);
      setHistory(records);
      // Si no hay registros, no mostrar error (puede ser que Airtable no esté configurado)
      if (records.length === 0) {
        setError(null); // No mostrar error si simplemente no hay datos
      }
    } catch (err) {
      // Solo mostrar error si es crítico, de lo contrario silenciar
      console.warn('Historial no disponible:', err.message);
      setError(null); // No mostrar error al usuario
      setHistory([]); // Asegurar que history esté vacío
    } finally {
      setLoading(false);
    }
  };

  const handleScroll = (direction) => {
    const container = document.getElementById('history-container');
    if (container) {
      const scrollAmount = 300;
      const newPosition = direction === 'left'
        ? scrollPosition - scrollAmount
        : scrollPosition + scrollAmount;
      container.scrollTo({ left: newPosition, behavior: 'smooth' });
      setScrollPosition(newPosition);
    }
  };

  const handleImageClick = (record) => {
    // Cargar la generación seleccionada
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

  // No mostrar nada si está cargando o si no hay historial (puede ser que Airtable no esté configurado)
  if (loading) {
    return null; // Ocultar mientras carga para evitar errores visuales
  }

  // Si no hay historial, simplemente no mostrar nada (no es un error)
  if (history.length === 0) {
    return null; // Ocultar si no hay datos
  }

  return (
    <Paper elevation={2} sx={{ p: 2 }}>
      <Typography variant="h6" gutterBottom>
        Historial de Generaciones
      </Typography>
      <Box sx={{ position: 'relative' }}>
        <IconButton
          onClick={() => handleScroll('left')}
          disabled={scrollPosition === 0}
          sx={{
            position: 'absolute',
            left: 0,
            top: '50%',
            transform: 'translateY(-50%)',
            zIndex: 1,
            backgroundColor: 'background.paper',
            '&:hover': { backgroundColor: 'action.hover' }
          }}
        >
          <ArrowBackIosIcon />
        </IconButton>
        <Box
          id="history-container"
          sx={{
            display: 'flex',
            gap: 2,
            overflowX: 'auto',
            scrollBehavior: 'smooth',
            px: 5,
            py: 1,
            '&::-webkit-scrollbar': {
              display: 'none'
            },
            scrollbarWidth: 'none'
          }}
        >
          {history.map((record) => {
            const firstGeneratedImage = record.fields.imagenes_generadas?.[0]?.url;
            if (!firstGeneratedImage) return null;

            return (
              <Box
                key={record.id}
                onClick={() => handleImageClick(record)}
                sx={{
                  minWidth: 150,
                  cursor: 'pointer',
                  '&:hover': {
                    transform: 'scale(1.05)',
                    transition: 'transform 0.2s'
                  }
                }}
              >
                <Paper elevation={2} sx={{ overflow: 'hidden' }}>
                  <Box
                    sx={{
                      width: 150,
                      height: 150,
                      position: 'relative',
                      backgroundColor: 'grey.200'
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
                  </Box>
                </Paper>
              </Box>
            );
          })}
        </Box>
        <IconButton
          onClick={() => handleScroll('right')}
          sx={{
            position: 'absolute',
            right: 0,
            top: '50%',
            transform: 'translateY(-50%)',
            zIndex: 1,
            backgroundColor: 'background.paper',
            '&:hover': { backgroundColor: 'action.hover' }
          }}
        >
          <ArrowForwardIosIcon />
        </IconButton>
      </Box>
    </Paper>
  );
};

export default History;

