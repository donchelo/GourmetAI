import React, { useState, useRef } from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import { Box, Grid } from '@mui/material';
import Layout from './components/Layout';
import ImageUploader from './components/ImageUploader';
import ParameterPanel from './components/ParameterPanel';
import GeneratedImages from './components/GeneratedImages';
import History from './components/History';
import Hero from './components/Hero';
import useImageGeneration from './hooks/useImageGeneration';
import { validateParameters } from './utils/validation';
import { ThemeContextProvider } from './context/ThemeContext';
import {
  ESTILOS_PLATO,
  ILUMINACIONES,
  FONDOS,
  ANGULOS_CAMARA,
  INTENSIDAD_GOURMET_DEFAULT,
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
  const historyRef = useRef(null);
  const [parameters, setParameters] = useState({
    intensidadGourmet: INTENSIDAD_GOURMET_DEFAULT,
    estiloPlato: ESTILOS_PLATO[0].value,
    iluminacion: ILUMINACIONES[0].value,
    fondo: FONDOS[0].value,
    decoracionesExtra: [],
    anguloCamara: ANGULOS_CAMARA[0].value,
    tipoVajilla: TIPOS_VAJILLA[0].value,
    colorVajilla: COLORES_VAJILLA[0].value,
    ambiente: AMBIENTES[0].value,
    momentoDelDia: MOMENTOS_DIA[0].value,
    profundidadCampo: PROFUNDIDADES_CAMPO[0].value,
    aspectRatio: ASPECT_RATIOS[0].value,
    efectoVapor: EFECTOS_VAPOR[0].value,
    efectoFrescura: EFECTOS_FRESCURA[0].value,
    props: []
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

    const paramValidation = validateParameters(parameters);
    if (!paramValidation.valid) {
      alert(paramValidation.error);
      return;
    }

    try {
      await generate(selectedImage, parameters);
      if (historyRef.current) {
        setTimeout(() => {
          historyRef.current?.refresh();
        }, 1000);
      }
    } catch (err) {
      console.error('Error en generación:', err);
    }
  };

  const handleLoadGeneration = (generationData) => {
    setSelectedImage(generationData.imagenOriginal);
    const normalizedParams = { ...generationData.parametros };
    if (normalizedParams.props && typeof normalizedParams.props === 'string') {
      if (normalizedParams.props === 'ninguno' || normalizedParams.props === '') {
        normalizedParams.props = [];
      } else {
        normalizedParams.props = [normalizedParams.props];
      }
    }
    if (!Array.isArray(normalizedParams.props)) {
      normalizedParams.props = [];
    }
    setParameters(normalizedParams);
  };

  return (
    <>
      <CssBaseline />
      <Layout>
        <Hero />
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} md={6}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, pr: { md: 1 } }}>
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

          <Grid item xs={12} md={6}>
            <Box sx={{ minHeight: '600px', height: { md: 'calc(100vh - 200px)' }, display: 'flex', flexDirection: 'column' }}>
              <GeneratedImages
                images={generatedImages}
                isLoading={isGenerating}
                error={error}
                parameters={lastParameters}
                seed={lastSeed}
                ingredients={ingredients}
              />
            </Box>
          </Grid>
        </Grid>

        <Box sx={{ mt: 4 }}>
          <History ref={historyRef} onLoadGeneration={handleLoadGeneration} />
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
