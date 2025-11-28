import { useState, useCallback } from 'react';
import { analyzeImage, generateGourmetVariants, generateImageFromPrompt } from '../services/geminiService';
import { generateRecipeClaude } from '../services/claudeService';

const useImageGeneration = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [isRecipeGenerating, setIsRecipeGenerating] = useState(false);
  const [error, setError] = useState(null);
  const [generatedImages, setGeneratedImages] = useState([]);
  const [ingredients, setIngredients] = useState('');
  const [recipe, setRecipe] = useState(null);
  const [lastSeed, setLastSeed] = useState(null);
  const [lastParameters, setLastParameters] = useState(null);

  const generate = useCallback(async (imageBase64, parameters) => {
    setIsGenerating(true);
    setError(null);
    setGeneratedImages([]);
    setRecipe(null);

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
    setRecipe(null);

    try {
      // Construir input para el prompt
      let input = '';
      if (idea) input += `Concepto: ${idea}. `;
      
      // Manejar arrays para multi-selección o strings antiguos
      const getParamValue = (param) => Array.isArray(param) ? param.join(', ') : param;

      if (parameters.cuisineType && parameters.cuisineType !== 'sin-preferencia') {
        input += `Tipo de cocina: ${getParamValue(parameters.cuisineType)}. `;
      }
      if (parameters.dishCategory && parameters.dishCategory !== 'sin-preferencia') {
        input += `Categoría de plato: ${getParamValue(parameters.dishCategory)}. `;
      }
      if (parameters.cookingTechnique && parameters.cookingTechnique !== 'sin-preferencia') {
        input += `Técnica principal: ${getParamValue(parameters.cookingTechnique)}. `;
      }
      if (parameters.culinaryTags && parameters.culinaryTags.length > 0) {
        input += `Tags: ${parameters.culinaryTags.join(', ')}. `;
      }

      if (ingredientsList && ingredientsList.length > 0) {
        input += `Ingredientes: ${ingredientsList.join(', ')}.`;
      }

      // Guardar ingredientes en el estado para consistencia
      setIngredients(ingredientsList.join(', '));

      // Generar SOLO imagen
      const variants = await generateImageFromPrompt(input, parameters);

      if (!variants || variants.length === 0) {
        throw new Error('No se generó la imagen. Por favor, intenta de nuevo.');
      }

      setGeneratedImages(variants);
      // setRecipe(generatedRecipe); // Receta se genera después bajo demanda
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

  const fetchRecipe = useCallback(async () => {
      if (!lastParameters || !generatedImages.length) return;
      
      setIsRecipeGenerating(true);
      try {
        // Reconstruir el input básico (podríamos haberlo guardado en estado también, pero lastParameters ayuda)
        // Simplificación: usaremos los parámetros guardados + ingredientes si están disponibles
        let input = '';
        // Nota: 'idea' original se pierde si no la guardamos, pero para la receta podemos usar
        // los ingredientes y parámetros que sí tenemos.
        
        const getParamValue = (param) => Array.isArray(param) ? param.join(', ') : param;
        
        if (lastParameters.cuisineType) input += `Cocina: ${getParamValue(lastParameters.cuisineType)}. `;
        if (lastParameters.dishCategory) input += `Plato: ${getParamValue(lastParameters.dishCategory)}. `;
        if (ingredients) input += `Ingredientes: ${ingredients}. `;
        
        // Usar el nuevo servicio de Claude
        const generatedRecipe = await generateRecipeClaude(input, lastParameters);
        setRecipe(generatedRecipe);
      } catch (err) {
          console.error("Error fetching recipe:", err);
          setError("No se pudo generar la receta.");
      } finally {
          setIsRecipeGenerating(false);
      }
  }, [lastParameters, generatedImages, ingredients]);

  const reset = useCallback(() => {
    setGeneratedImages([]);
    setError(null);
    setIngredients('');
    setRecipe(null);
    setLastSeed(null);
    setLastParameters(null);
  }, []);

  return {
    generate,
    generateFromScratch,
    fetchRecipe,
    reset,
    isGenerating,
    isRecipeGenerating,
    error,
    generatedImages,
    ingredients,
    recipe,
    lastSeed,
    lastParameters
  };
};

export default useImageGeneration;
