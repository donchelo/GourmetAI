import React, { useState } from 'react';
import { Box, Alert, Typography, Divider } from '@mui/material';
import ImageUploader from '../ImageUploader';
import ParameterPanel from '../ParameterPanel';
import { validateParameters } from '../../utils/validation';
import { DishParameters } from '../../types';

interface FromPhotoProps {
  parameters: DishParameters;
  onParameterChange: (newParams: Partial<DishParameters>) => void;
  onGenerate: (imageBase64: string, parameters: DishParameters) => Promise<any>;
  isGenerating: boolean;
}

const FromPhoto: React.FC<FromPhotoProps> = ({ parameters, onParameterChange, onGenerate, isGenerating }) => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedPlate, setSelectedPlate] = useState<string | null>(null);
  const [localError, setLocalError] = useState<string | null>(null);

  const handleGenerate = async () => {
    setLocalError(null);
    if (!selectedImage) {
      setLocalError('Por favor, selecciona una imagen del plato primero');
      return;
    }

    const paramValidation = validateParameters(parameters);
    if (!paramValidation.valid) {
      setLocalError(paramValidation.error || 'Error en los parámetros');
      return;
    }

    try {
      // Pasamos el plato físico en los parámetros si existe
      const paramsWithPlate = { 
        ...parameters, 
        plateImage: selectedPlate || undefined 
      };
      await onGenerate(selectedImage, paramsWithPlate);
    } catch (err) {
      console.error('Error en generación:', err);
    }
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      {localError && (
        <Alert severity="error">{localError}</Alert>
      )}
      
      <Box>
        <Typography variant="overline" sx={{ mb: 1, display: 'block', opacity: 0.7 }}>
          Paso 1: Tu Comida
        </Typography>
        <ImageUploader
          onImageSelect={setSelectedImage}
          selectedImage={selectedImage}
          label="Foto de tu Comida"
        />
      </Box>

      <Divider sx={{ my: 1, borderStyle: 'dashed', opacity: 0.5 }} />

      <Box>
        <Typography variant="overline" sx={{ mb: 1, display: 'block', opacity: 0.7 }}>
          Paso 2: Plato para Emplatar (Opcional)
        </Typography>
        <ImageUploader
          onImageSelect={setSelectedPlate}
          selectedImage={selectedPlate}
          label="Foto del Plato Físico"
        />
        <Typography variant="caption" sx={{ mt: 1, display: 'block', opacity: 0.6, fontStyle: 'italic' }}>
          * Si agregas una foto de un plato vacío, la IA intentará emplatar tu comida en él.
        </Typography>
      </Box>
      
      <Divider sx={{ my: 1, borderStyle: 'dashed', opacity: 0.5 }} />

      <Box>
        <Typography variant="overline" sx={{ mb: 1, display: 'block', opacity: 0.7 }}>
          Paso 3: Ajustes Finales
        </Typography>
        <ParameterPanel
          parameters={parameters}
          onParameterChange={onParameterChange}
          onGenerate={handleGenerate}
          isGenerating={isGenerating}
        />
      </Box>
    </Box>
  );
};

export default FromPhoto;
