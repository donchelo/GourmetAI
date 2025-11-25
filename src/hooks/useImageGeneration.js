import { useState, useCallback } from 'react';
import { analyzeImage, generateGourmetVariants } from '../services/geminiService';
import { saveGeneration } from '../services/airtableService';

const useImageGeneration = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState(null);
  const [generatedImages, setGeneratedImages] = useState([]);
  const [ingredients, setIngredients] = useState('');
  const [lastSeed, setLastSeed] = useState(null);
  const [lastParameters, setLastParameters] = useState(null);

  const generate = useCallback(async (imageBase64, parameters) => {
    setIsGenerating(true);
    setError(null);
    setGeneratedImages([]);

    try {
      // Paso 1: Analizar imagen y detectar ingredientes
      const detectedIngredients = await analyzeImage(imageBase64);
      setIngredients(detectedIngredients);

      // Paso 2: Generar imagen gourmet (los parámetros afectan el prompt)
      const variants = await generateGourmetVariants(
        imageBase64,
        parameters,
        detectedIngredients
      );

      if (!variants || variants.length === 0) {
        throw new Error('No se generó la imagen. Por favor, intenta de nuevo.');
      }

      setGeneratedImages(variants);
      setLastParameters(parameters);

      // Paso 3: Guardar en Airtable (opcional, no bloquear si falla)
      const seed = Date.now();
      setLastSeed(seed);
      
      try {
        await saveGeneration({
          imagenOriginal: imageBase64,
          imagenesGeneradas: variants,
          parametros: parameters,
          semilla: seed,
          ingredientesDetectados: detectedIngredients
        });
      } catch (airtableError) {
        console.warn('No se pudo guardar en historial:', airtableError);
        // No lanzar error, solo loguear
      }

      return { variants, ingredients: detectedIngredients, seed };
    } catch (err) {
      const errorMessage = err.message || 'Error al generar las imágenes gourmet';
      setError(errorMessage);
      throw err;
    } finally {
      setIsGenerating(false);
    }
  }, []);

  const reset = useCallback(() => {
    setGeneratedImages([]);
    setError(null);
    setIngredients('');
    setLastSeed(null);
    setLastParameters(null);
  }, []);

  return {
    generate,
    reset,
    isGenerating,
    error,
    generatedImages,
    ingredients,
    lastSeed,
    lastParameters
  };
};

export default useImageGeneration;

