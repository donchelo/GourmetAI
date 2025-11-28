import { useState, useCallback } from 'react';
import { analyzeImage, generateGourmetVariants, generateImageFromPrompt } from '../services/geminiService';

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
      
      const seed = Date.now();
      setLastSeed(seed);

      return { variants, ingredients: detectedIngredients, seed };
    } catch (err) {
      const errorMessage = err.message || 'Error al generar las imágenes gourmet';
      setError(errorMessage);
      throw err;
    } finally {
      setIsGenerating(false);
    }
  }, []);

  const generateFromScratch = useCallback(async (ingredientsList, idea, parameters) => {
    setIsGenerating(true);
    setError(null);
    setGeneratedImages([]);

    try {
      // Construir input para el prompt
      let input = '';
      if (idea) input += `Concepto: ${idea}. `;
      
      // Agregar contexto culinario si existe
      if (parameters.cuisineType && parameters.cuisineType !== 'sin-preferencia') {
        input += `Tipo de cocina: ${parameters.cuisineType}. `;
      }
      if (parameters.dishCategory && parameters.dishCategory !== 'sin-preferencia') {
        input += `Categoría de plato: ${parameters.dishCategory}. `;
      }
      if (parameters.cookingTechnique && parameters.cookingTechnique !== 'sin-preferencia') {
        input += `Técnica principal: ${parameters.cookingTechnique}. `;
      }

      if (ingredientsList && ingredientsList.length > 0) {
        input += `Ingredientes: ${ingredientsList.join(', ')}.`;
      }

      // Guardar ingredientes en el estado para consistencia
      setIngredients(ingredientsList.join(', '));

      // Generar imagen
      const variants = await generateImageFromPrompt(input, parameters);

      if (!variants || variants.length === 0) {
        throw new Error('No se generó la imagen. Por favor, intenta de nuevo.');
      }

      setGeneratedImages(variants);
      setLastParameters(parameters);
      
      const seed = Date.now();
      setLastSeed(seed);

      return { variants, seed };
    } catch (err) {
      const errorMessage = err.message || 'Error al generar la imagen desde cero';
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
    generateFromScratch,
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
