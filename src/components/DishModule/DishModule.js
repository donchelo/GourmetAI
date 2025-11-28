import React, { useState } from 'react';
import { Box, Grid, Tab, Tabs, Typography, useTheme, Paper } from '@mui/material';
import FromScratch from './FromScratch';
import FromPhoto from './FromPhoto';
import DishPreview from './DishPreview';
import useImageGeneration from '../../hooks/useImageGeneration';
import { INTENSIDAD_GOURMET_DEFAULT, ESTILOS_PLATO, ILUMINACIONES, FONDOS, ANGULOS_CAMARA, TIPOS_VAJILLA, COLORES_VAJILLA, AMBIENTES, MOMENTOS_DIA, PROFUNDIDADES_CAMPO, ASPECT_RATIOS, EFECTOS_VAPOR, EFECTOS_FRESCURA, TIPOS_COCINA, CATEGORIAS_PLATO, TECNICAS_COCCION } from '../../constants/parameters';

const TabPanel = (props) => {
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

const DishModule = () => {
  const theme = useTheme();
  const [tabValue, setTabValue] = useState(0);
  
  // Shared parameters state
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
    props: [],
    cuisineType: [],
    dishCategory: [],
    cookingTechnique: [],
    culinaryTags: []
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

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleParameterChange = (newParams) => {
    setParameters(prev => ({ ...prev, ...newParams }));
  };

  return (
    <Grid container spacing={3} sx={{ mb: 4 }}>
      <Grid item xs={12} md={6}>
        <Paper elevation={0} sx={{ bgcolor: 'transparent' }}>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs 
                value={tabValue} 
                onChange={handleTabChange} 
                aria-label="dish creation modes"
                variant="fullWidth"
                textColor="primary"
                indicatorColor="primary"
                sx={{
                    '& .MuiTab-root': {
                        textTransform: 'uppercase',
                        fontWeight: 600,
                        letterSpacing: '0.05em'
                    }
                }}
            >
                <Tab label="Crear Plato" />
                <Tab label="Fotografía de Producto" />
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
        </Paper>
      </Grid>

      <Grid item xs={12} md={6}>
        <Box sx={{ minHeight: '600px', height: { md: 'calc(100vh - 200px)' }, display: 'flex', flexDirection: 'column' }}>
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
      </Grid>
    </Grid>
  );
};

export default DishModule;
