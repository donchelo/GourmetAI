import React, { useState } from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import { Box, Grid } from '@mui/material';
import Layout from './components/Layout';
import ImageUploader from './components/ImageUploader';
import ParameterPanel from './components/ParameterPanel';
import GeneratedImages from './components/GeneratedImages';
import History from './components/History';
import useImageGeneration from './hooks/useImageGeneration';
import { validateParameters } from './utils/validation';
import { ThemeContextProvider } from './context/ThemeContext';
import {
  ESTILOS_PLATO,
  ILUMINACIONES,
  FONDOS,
  ANGULOS_CAMARA,
  INTENSIDAD_GOURMET_DEFAULT,
  // Nuevos parámetros
  TIPOS_VAJILLA,
  COLORES_VAJILLA,
  AMBIENTES,
  MOMENTOS_DIA,
  PROFUNDIDADES_CAMPO,
  ASPECT_RATIOS,
  EFECTOS_VAPOR,
  EFECTOS_FRESCURA
} from './constants/parameters';

function AppContent() {
  const [selectedImage, setSelectedImage] = useState(null);
  const [parameters, setParameters] = useState({
    // Parámetros originales
    intensidadGourmet: INTENSIDAD_GOURMET_DEFAULT,
    estiloPlato: ESTILOS_PLATO[0].value,
    iluminacion: ILUMINACIONES[0].value,
    fondo: FONDOS[0].value,
    decoracionesExtra: [],
    anguloCamara: ANGULOS_CAMARA[0].value,
    // Nuevos parámetros - Categoría 1: Vajilla
    tipoVajilla: TIPOS_VAJILLA[0].value,
    colorVajilla: COLORES_VAJILLA[0].value,
    // Nuevos parámetros - Categoría 2: Ambiente
    ambiente: AMBIENTES[0].value,
    momentoDelDia: MOMENTOS_DIA[0].value,
    // Nuevos parámetros - Categoría 3: Técnica Fotográfica
    profundidadCampo: PROFUNDIDADES_CAMPO[0].value,
    aspectRatio: ASPECT_RATIOS[0].value,
    // Nuevos parámetros - Categoría 4: Efectos Especiales
    efectoVapor: EFECTOS_VAPOR[0].value,
    efectoFrescura: EFECTOS_FRESCURA[0].value
  });

  const {
    generate,
    isGenerating,
    error,
    generatedImages,
    ingredients,
    lastSeed,
    lastParameters
  } = useImageGeneration();

  const handleParameterChange = (newParams) => {
    setParameters(prev => ({ ...prev, ...newParams }));
  };

  const handleGenerate = async () => {
    if (!selectedImage) {
      alert('Por favor, selecciona una imagen primero');
      return;
    }

    // Validar parámetros
    const paramValidation = validateParameters(parameters);
    if (!paramValidation.valid) {
      alert(paramValidation.error);
      return;
    }

    try {
      await generate(selectedImage, parameters);
    } catch (err) {
      // El error ya está manejado en el hook
      console.error('Error en generación:', err);
    }
  };

  const handleLoadGeneration = (generationData) => {
    setSelectedImage(generationData.imagenOriginal);
    setParameters(generationData.parametros);
  };

  return (
    <>
      <CssBaseline />
      <Layout>
        <Grid container spacing={3}>
          {/* Columna Izquierda: Input y Parámetros */}
          <Grid item xs={12} md={5}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              <ImageUploader
                onImageSelect={setSelectedImage}
                selectedImage={selectedImage}
              />
              <ParameterPanel
                parameters={parameters}
                onParameterChange={handleParameterChange}
                onGenerate={handleGenerate}
                isGenerating={isGenerating}
              />
            </Box>
          </Grid>

          {/* Columna Derecha: Output */}
          <Grid item xs={12} md={7}>
            <GeneratedImages
              images={generatedImages}
              isLoading={isGenerating}
              error={error}
              parameters={lastParameters}
              seed={lastSeed}
              ingredients={ingredients}
            />
          </Grid>
        </Grid>

        {/* Historial en la parte inferior */}
        <Box sx={{ mt: 4 }}>
          <History onLoadGeneration={handleLoadGeneration} />
        </Box>
      </Layout>
    </>
  );
}

function App() {
  return (
    <ThemeContextProvider>
      <AppContent />
    </ThemeContextProvider>
  );
}

export default App;
