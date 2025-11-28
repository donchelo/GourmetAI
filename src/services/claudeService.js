import axios from 'axios';

// Base URL del backend - detectar automáticamente el entorno
// En desarrollo: usar localhost:3001
// En producción (Vercel): usar rutas relativas (el rewrite de vercel.json maneja /api/*)
const getApiBaseUrl = () => {
  // Si hay una variable de entorno explícita, usarla
  if (process.env.REACT_APP_API_URL) {
    return process.env.REACT_APP_API_URL;
  }
  
  // En desarrollo, usar localhost:3001
  if (process.env.NODE_ENV === 'development') {
    return 'http://localhost:3001';
  }
  
  // En producción (Vercel), usar ruta relativa
  // El vercel.json rewrite mapea /api/* a /api/index.js
  return '';
};

const API_BASE_URL = getApiBaseUrl();

// Mapeos para convertir valores de parámetros a descripciones legibles
const estiloMap = {
  'rustico': 'rústico y casero',
  'minimalista': 'minimalista y limpio',
  'clasico-elegante': 'clásico y elegante',
  'moderno': 'moderno y vanguardista'
};

const ambienteMap = {
  'sin-preferencia': '',
  'restaurante': 'restaurante elegante',
  'cocina-casera': 'cocina casera acogedora',
  'terraza': 'terraza exterior',
  'buffet': 'buffet profesional',
  'estudio': 'estudio fotográfico'
};

const momentoDelDiaMap = {
  'sin-preferencia': '',
  'desayuno': 'desayuno matutino',
  'brunch': 'brunch de media mañana',
  'almuerzo': 'almuerzo de mediodía',
  'cena': 'cena romántica nocturna'
};

/**
 * Genera una receta usando la API de Claude a través del backend
 * @param {string} input - Descripción o idea principal del plato
 * @param {Object} parameters - TODOS los parámetros usados para generar la imagen
 * @param {string} ingredientsString - Ingredientes detectados o ingresados (opcional)
 * @returns {Promise<string>} - Receta generada en formato Markdown
 */
export const generateRecipeClaude = async (input, parameters, ingredientsString = '') => {
    try {
        // Extraer parámetros culinarios
        const {
            cuisineType,
            dishCategory,
            cookingTechnique,
            culinaryTags,
            // Parámetros visuales relevantes para la receta
            estiloPlato,
            ambiente,
            momentoDelDia,
            intensidadGourmet
        } = parameters;

        // Convertir arrays a strings
        const getParamValue = (param) => {
          if (!param) return '';
          return Array.isArray(param) ? param.join(', ') : param;
        };

        const cuisine = getParamValue(cuisineType);
        const category = getParamValue(dishCategory);
        const technique = getParamValue(cookingTechnique);
        const tags = getParamValue(culinaryTags);
        
        // Usar ingredientes del parámetro o del string pasado
        const finalIngredients = ingredientsString || getParamValue(parameters.ingredients) || '';
        
        // Mapear parámetros visuales a descripciones
        const estilo = estiloPlato ? estiloMap[estiloPlato] || estiloPlato : '';
        const ambienteText = ambiente && ambiente !== 'sin-preferencia' ? ambienteMap[ambiente] || ambiente : '';
        const momentoText = momentoDelDia && momentoDelDia !== 'sin-preferencia' ? momentoDelDiaMap[momentoDelDia] || momentoDelDia : '';
        
        // Construir nivel de gourmet
        const nivelGourmet = intensidadGourmet <= 3 
          ? 'presentación casera y natural' 
          : intensidadGourmet <= 7 
          ? 'presentación gourmet moderada' 
          : 'presentación de alta cocina profesional';

        // Construir prompt completo y detallado
        const prompt = `Eres un chef profesional experto. Tu tarea es crear una receta detallada pero fácil de seguir que coincida EXACTAMENTE con el plato que se muestra en la fotografía generada.

**INFORMACIÓN DEL PLATO GENERADO:**

**Descripción / Idea Principal:**
"${input}"

**CONTEXTO CULINARIO (Estos parámetros definen el plato):**
${cuisine ? `- Tipo de Cocina: ${cuisine}` : ''}
${category ? `- Categoría del Plato: ${category}` : ''}
${technique ? `- Técnica de Cocción Principal: ${technique}` : ''}
${tags ? `- Características / Etiquetas Culinarias: ${tags}` : ''}
${finalIngredients ? `- Ingredientes Clave: ${finalIngredients}` : ''}

**CONTEXTO VISUAL Y PRESENTACIÓN (Estos parámetros afectan cómo se ve el plato):**
${estilo ? `- Estilo de Presentación: ${estilo}` : ''}
${ambienteText ? `- Ambiente: ${ambienteText}` : ''}
${momentoText ? `- Momento del Día: ${momentoText}` : ''}
${intensidadGourmet ? `- Nivel de Presentación: ${nivelGourmet}` : ''}

**INSTRUCCIONES CRÍTICAS:**

1. La receta DEBE coincidir exactamente con lo que se ve en la fotografía generada
2. Usa los ingredientes especificados y las técnicas de cocción mencionadas
3. El estilo de presentación debe reflejar el contexto visual (${estilo || 'elegante'})
4. La receta debe ser apropiada para el momento del día (${momentoText || 'cualquier momento'})
5. Si hay múltiples tipos de cocina o categorías, integra sus características de manera coherente
6. La receta debe ser práctica, clara y deliciosa

**FORMATO REQUERIDO (Markdown):**

### [Nombre Creativo y Apetitoso del Plato que Refleje los Parámetros]

**Descripción:**
Una breve descripción (2-3 frases) que evoque el estilo culinario, los ingredientes principales y el contexto del plato. Debe sonar apetitoso y profesional.

**Ingredientes:**
- [Lista completa de ingredientes con cantidades específicas]
- [Incluir todos los ingredientes mencionados y los necesarios para la técnica de cocción]
- [Cantidades deben ser precisas y prácticas]

**Instrucciones Paso a Paso:**
1. [Paso detallado que refleje la técnica de cocción especificada]
2. [Continuar con pasos claros y secuenciales]
3. [Incluir detalles sobre presentación si es relevante]
...

**Consejo del Chef:**
Un tip práctico y breve relacionado con la técnica de cocción, los ingredientes o la presentación del plato.

**Notas:**
- Asegúrate de que la receta sea coherente con el tipo de cocina y categoría especificados
- La presentación debe reflejar el estilo visual elegido
- Los ingredientes deben coincidir con los especificados

Mantén un tono profesional, inspirador pero accesible. La receta debe ser clara y fácil de seguir para cualquier cocinero casero.`;

        // Construir la URL: si API_BASE_URL está vacío (producción), usar ruta relativa
        const url = API_BASE_URL 
            ? `${API_BASE_URL}/api/generate-recipe-claude`
            : '/api/generate-recipe-claude';

        // Llamada al endpoint del backend
        const response = await axios.post(url, {
            prompt: prompt
        });

        if (response.data && response.data.success) {
            return response.data.recipe;
        } else {
            throw new Error(response.data.error || 'Error desconocido al generar receta');
        }

    } catch (error) {
        console.error("Error generando receta con Claude:", error);
        if (error.response) {
            console.error("Response error:", error.response.status, error.response.data);
        } else if (error.request) {
            console.error("Request error:", error.request);
        }
        return "No se pudo generar la receta con Claude. Verifica tu API Key o intenta más tarde.";
    }
};
