import React, { useState } from 'react';
import { Box, Alert } from '@mui/material';
import ImageUploader from '../ImageUploader';
import ParameterPanel from '../ParameterPanel';
import { validateParameters } from '../../utils/validation';

const FromPhoto = ({ parameters, onParameterChange, onGenerate, isGenerating }) => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [localError, setLocalError] = useState(null);

  const handleGenerate = async () => {
    setLocalError(null);
    if (!selectedImage) {
      setLocalError('Por favor, selecciona una imagen primero');
      return;
    }

    const paramValidation = validateParameters(parameters);
    if (!paramValidation.valid) {
      setLocalError(paramValidation.error);
      return;
    }

    try {
      await onGenerate(selectedImage, parameters);
    } catch (err) {
      // Error is handled by the parent/hook
      console.error('Error en generación:', err);
    }
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      {localError && (
        <Alert severity="error">{localError}</Alert>
      )}
      
      <ImageUploader
        onImageSelect={setSelectedImage}
        selectedImage={selectedImage}
      />
      
      <ParameterPanel
        parameters={parameters}
        onParameterChange={onParameterChange}
        onGenerate={handleGenerate}
        isGenerating={isGenerating}
      />
    </Box>
  );
};

export default FromPhoto;

