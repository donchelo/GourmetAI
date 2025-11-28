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
  const [lastIdea, setLastIdea] = useState(null); // Guardar la idea original

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
      setLastIdea(idea); // Guardar la idea original para la receta
      
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
      console.log('🔍 fetchRecipe called');
      console.log('🔍 lastParameters:', lastParameters);
      console.log('🔍 generatedImages.length:', generatedImages.length);
      
      if (!lastParameters || !generatedImages.length) {
        console.warn('⚠️ No se puede generar receta: faltan parámetros o imágenes');
        return;
      }
      
      setIsRecipeGenerating(true);
      setError(null); // Limpiar errores previos
      
      try {
        // Reconstruir el input con la idea original si existe
        let input = '';
        
        if (lastIdea && lastIdea.trim()) {
          input = lastIdea;
        } else {
          // Si no hay idea, construir descripción básica
          const getParamValue = (param) => Array.isArray(param) ? param.join(', ') : param;
          
          if (lastParameters.cuisineType && lastParameters.cuisineType.length > 0) {
            input += `Tipo de cocina: ${getParamValue(lastParameters.cuisineType)}. `;
          }
          if (lastParameters.dishCategory && lastParameters.dishCategory.length > 0) {
            input += `Categoría de plato: ${getParamValue(lastParameters.dishCategory)}. `;
          }
          if (ingredients && ingredients.trim()) {
            input += `Ingredientes: ${ingredients}. `;
          }
          
          // Si aún no hay input, usar placeholder
          if (!input.trim()) {
            input = 'Plato gourmet personalizado';
          }
        }
        
        console.log('🔍 Input para receta:', input);
        console.log('🔍 Llamando a generateRecipeClaude con TODOS los parámetros...');
        
        // Pasar TODOS los parámetros para que la receta coincida exactamente con la imagen
        const generatedRecipe = await generateRecipeClaude(input, lastParameters, ingredients);
        
        console.log('🔍 Receta generada:', generatedRecipe ? 'Sí' : 'No');
        console.log('🔍 Longitud de receta:', generatedRecipe?.length);
        
        if (generatedRecipe && generatedRecipe.trim().length > 0) {
          setRecipe(generatedRecipe);
          console.log('✅ Receta guardada en estado');
        } else {
          console.warn('⚠️ Receta vacía o inválida');
          setRecipe(null);
          setError('La receta generada está vacía. Por favor, intenta de nuevo.');
        }
      } catch (err) {
          console.error("❌ Error fetching recipe:", err);
          setError("No se pudo generar la receta: " + (err.message || 'Error desconocido'));
          setRecipe(null);
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
    setLastIdea(null);
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
