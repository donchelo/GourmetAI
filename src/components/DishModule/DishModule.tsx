import React, { useState } from 'react';
import { Box, Grid, Tab, Tabs, Paper, Alert, AlertTitle, Link, Container, alpha } from '@mui/material';
import FromScratch from './FromScratch';
import FromPhoto from './FromPhoto';
import DishPreview from './DishPreview';
import History from '../History';
import useImageGeneration from '../../hooks/useImageGeneration';
import { useApi } from '../../context/ApiContext';
import { 
  INTENSIDAD_GOURMET_DEFAULT, 
  ESTILOS_PLATO, 
  ILUMINACIONES, 
  FONDOS, 
  ANGULOS_CAMARA, 
  TIPOS_VAJILLA, 
  COLORES_VAJILLA, 
  AMBIENTES, 
  MOMENTOS_DIA, 
  PROFUNDIDADES_CAMPO, 
  ASPECT_RATIOS, 
  EFECTOS_VAPOR, 
  EFECTOS_FRESCURA 
} from '../../constants/parameters';
import { DishParameters } from '../../types';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

const TabPanel: React.FC<TabPanelProps> = (props) => {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ py: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
};

const DishModule: React.FC = () => {
  const [tabValue, setTabValue] = useState<number>(0);
  const { isApiKeySet } = useApi();
  
  const [parameters, setParameters] = useState<DishParameters>({
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
    props: [],
    cuisineType: [],
    dishCategory: [],
    cookingTechnique: [],
    culinaryTags: [],
    plateImage: ''
  });

  const {
    generate,
    generateFromScratch,
    fetchRecipe,
    isGenerating,
    isRecipeGenerating,
    error,
    generatedImages,
    ingredients,
    recipe,
    lastSeed,
    lastParameters
  } = useImageGeneration();

  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleParameterChange = (newParams: Partial<DishParameters>) => {
    setParameters(prev => ({ ...prev, ...newParams }));
  };

  return (
    <Box>
      {!isApiKeySet && (
        <Alert 
          severity="info" 
          variant="outlined"
          sx={{ 
            mb: 4, 
            borderRadius: '16px',
            borderWidth: '2px',
            bgcolor: (theme) => alpha(theme.palette.info.main, 0.05),
            borderColor: (theme) => alpha(theme.palette.info.main, 0.2),
            '& .MuiAlert-icon': { color: 'info.main' },
            '& .MuiAlert-message': { width: '100%' }
          }}
        >
          <AlertTitle sx={{ fontWeight: 800, color: 'info.main', fontSize: '1.1rem' }}>Paso 1: Configura tu acceso</AlertTitle>
          Para comenzar a diseñar, ingresa tu <strong>API Key de Gemini</strong> en el campo superior derecho. 
          Si no tienes una, obtenla gratis en <Link href="https://aistudio.google.com/" target="_blank" rel="noopener" sx={{ fontWeight: 700, color: 'info.main' }}>Google AI Studio</Link>.
        </Alert>
      )}

      {/* Sección de Parámetros */}
      <Paper elevation={0} sx={{ bgcolor: 'transparent', mb: 6 }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs 
            value={tabValue} 
            onChange={handleTabChange} 
            aria-label="dish creation modes"
            variant="fullWidth"
            textColor="primary"
            indicatorColor="primary"
            sx={{
              borderBottom: 1,
              borderColor: 'divider',
              '& .MuiTab-root': {
                textTransform: 'uppercase',
                fontWeight: 700,
                letterSpacing: '0.1em',
                fontSize: '0.8rem',
                py: 2
              }
            }}
          >
            <Tab label="Diseñar" />
            <Tab label="Fotografía" />
            <Tab label="Historial" />
          </Tabs>
        </Box>

        <TabPanel value={tabValue} index={0}>
          <FromScratch 
            parameters={parameters}
            onParameterChange={handleParameterChange}
            onGenerate={generateFromScratch}
            isGenerating={isGenerating}
          />
        </TabPanel>

        <TabPanel value={tabValue} index={1}>
          <FromPhoto 
            parameters={parameters}
            onParameterChange={handleParameterChange}
            onGenerate={generate}
            isGenerating={isGenerating}
          />
        </TabPanel>

        <TabPanel value={tabValue} index={2}>
          <History />
        </TabPanel>
      </Paper>

      {/* Sección de Generaciones */}
      <Box 
        sx={{ 
          display: 'flex', 
          flexDirection: 'column',
          mt: 4
        }}
      >
        <DishPreview
          images={generatedImages}
          isLoading={isGenerating}
          error={error}
          parameters={lastParameters}
          seed={lastSeed}
          ingredients={ingredients}
          recipe={recipe}
          onGenerateRecipe={fetchRecipe}
          isRecipeLoading={isRecipeGenerating}
        />
      </Box>
    </Box>
  );
};

export default DishModule;
