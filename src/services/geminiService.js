import axios from 'axios';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { CONFIG } from '../utils/config';

// URLs de las APIs
const IMAGEN_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/imagen-3.0-generate-002:generateImages';

// Modelos a probar - Priorizando Gemini 3, con fallback a modelos anteriores
// Gemini 3 Pro es el modelo más avanzado con capacidades de razonamiento mejoradas
const GEMINI_MODELS = [
  'gemini-3-pro-preview', // Gemini 3 Pro - Modelo más avanzado (recomendado)
  'gemini-1.5-pro',        // Fallback: Gemini 1.5 Pro
  'gemini-1.5-flash',      // Fallback: Gemini 1.5 Flash (más rápido)
  'gemini-pro-vision',     // Fallback: Modelo legacy con visión
  'gemini-pro'             // Fallback: Modelo legacy básico
];

/**
 * Analiza una imagen y detecta ingredientes usando Gemini
 * @param {string} imageBase64 - Imagen en base64
 * @returns {Promise<string>} - Lista de ingredientes detectados
 */
/**
 * Lista los modelos disponibles usando la API REST
 */
const listAvailableModels = async (apiKey) => {
  try {
    const response = await axios.get(
      'https://generativelanguage.googleapis.com/v1beta/models',
      {
        headers: {
          'x-goog-api-key': apiKey
        },
        timeout: 10000
      }
    );
    
    const models = response.data.models || [];
    // Filtrar solo modelos que soporten generateContent
    const availableModels = models
      .filter(model => 
        model.supportedGenerationMethods && 
        model.supportedGenerationMethods.includes('generateContent')
      )
      .map(model => model.name.replace('models/', ''));
    
    console.log('Modelos disponibles:', availableModels);
    return availableModels;
  } catch (error) {
    console.warn('No se pudieron listar modelos disponibles:', error.message);
    return null;
  }
};

export const analyzeImage = async (imageBase64) => {
  try {
    const apiKey = process.env.REACT_APP_GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error('API Key de Gemini no configurada');
    }

    // Inicializar el SDK de Google Generative AI
    const genAI = new GoogleGenerativeAI(apiKey);

    // Remover el prefijo data:image/...;base64, si existe
    const base64Data = imageBase64.includes(',') 
      ? imageBase64.split(',')[1] 
      : imageBase64;

    // Detectar el tipo MIME de la imagen
    let mimeType = "image/jpeg";
    if (imageBase64.includes('data:image/png')) {
      mimeType = "image/png";
    } else if (imageBase64.includes('data:image/webp')) {
      mimeType = "image/webp";
    }

    // Preparar la imagen para el modelo
    const imagePart = {
      inlineData: {
        data: base64Data,
        mimeType: mimeType
      }
    };

    // Prompt optimizado para Gemini 3 - más conciso y directo según mejores prácticas
    // Gemini 3 responde mejor a instrucciones precisas y directas
    const prompt = "Lista todos los ingredientes que identificas en esta imagen de comida. Responde solo con ingredientes separados por comas, sin explicaciones.";

    // Intentar listar modelos disponibles primero
    let modelsToTry = GEMINI_MODELS;
    const availableModels = await listAvailableModels(apiKey);
    if (availableModels && availableModels.length > 0) {
      // Priorizar Gemini 3 si está disponible, luego otros modelos con visión
      const gemini3Models = availableModels.filter(m => m.includes('gemini-3'));
      const visionModels = availableModels.filter(m => 
        m.includes('vision') || m.includes('flash') || m.includes('pro')
      );
      
      if (gemini3Models.length > 0) {
        modelsToTry = [...gemini3Models, ...visionModels.filter(m => !m.includes('gemini-3'))];
      } else {
        modelsToTry = visionModels.length > 0 ? visionModels : availableModels;
      }
      console.log('Usando modelos disponibles:', modelsToTry);
    }

    // Intentar con diferentes modelos hasta encontrar uno que funcione
    let lastError;
    
    for (const modelName of modelsToTry) {
      try {
        console.log(`Intentando con modelo: ${modelName}`);
        
        // Configuración para Gemini 3
        const isGemini3 = modelName.includes('gemini-3');
        
        // Configuración del modelo según versión
        // Para Gemini 3: 
        // - thinking_level: "high" por defecto (maximiza razonamiento)
        // - temperature: 1.0 por defecto (no configurar explícitamente según recomendación)
        // - media_resolution: "high" recomendado para imágenes (1120 tokens)
        const modelConfig = {
          model: modelName,
          // Nota: thinking_level puede requerir configuración adicional según versión del SDK
          // Si el SDK soporta thinking_level, descomentar la siguiente línea:
          // generationConfig: isGemini3 ? { thinkingLevel: 'high' } : {}
        };
        
        const model = genAI.getGenerativeModel(modelConfig);
        
        // Preparar contenido con imagen
        // Para Gemini 3, el modelo usa media_resolution "high" por defecto para imágenes
        const contents = [prompt, imagePart];
        
        const result = await model.generateContent(contents);
        const response = await result.response;
        const ingredients = response.text();

        if (!ingredients || ingredients.trim() === '') {
          throw new Error('No se pudieron detectar ingredientes en la respuesta');
        }

        console.log(`Modelo ${modelName} funcionó correctamente`);
        return ingredients.trim();
        
      } catch (error) {
        lastError = error;
        const errorMsg = error.message || error.toString();
        console.warn(`Error con modelo ${modelName}:`, errorMsg);
        
        // Si es un error 404 o modelo no encontrado, intentar siguiente
        if (errorMsg.includes('404') || 
            errorMsg.includes('not found') ||
            errorMsg.includes('Model not found') ||
            errorMsg.includes('is not found for API version')) {
          console.warn(`Modelo ${modelName} no encontrado, intentando siguiente...`);
          continue;
        }
        
        // Si es otro tipo de error (no 404), puede ser un problema diferente
        // Intentar con el siguiente modelo de todos modos
        if (!errorMsg.includes('401') && !errorMsg.includes('403')) {
          continue;
        }
        
        // Si es error de autenticación, lanzar inmediatamente
        throw error;
      }
    }

    // Si ningún modelo funcionó, proporcionar mensaje útil
    if (lastError) {
      const errorMsg = lastError.message || lastError.toString();
      if (errorMsg.includes('404') || errorMsg.includes('not found')) {
        throw new Error('Ninguno de los modelos de Gemini está disponible con tu API key. Verifica que tengas acceso a la API de Gemini en Google AI Studio y que la API esté habilitada.');
      }
      throw lastError;
    }
    
    throw new Error('No se pudo conectar con ningún modelo de Gemini. Verifica tu API key y permisos.');
    
  } catch (error) {
    console.error('Error analizando imagen:', error);
    
    // Proporcionar mensajes de error más específicos
    const errorMsg = error.message || error.toString();
    
    if (errorMsg.includes('API_KEY_INVALID') || errorMsg.includes('401') || errorMsg.includes('403')) {
      throw new Error('API Key inválida o no autorizada. Por favor, verifica tu configuración en Google AI Studio.');
    } else if (errorMsg.includes('429') || errorMsg.includes('quota')) {
      throw new Error('Límite de solicitudes excedido. Por favor, intenta más tarde.');
    } else if (errorMsg.includes('404') || errorMsg.includes('not found')) {
      throw new Error('Los modelos de Gemini no están disponibles. Verifica que:\n1. Tu API key tenga acceso a Gemini API\n2. La API esté habilitada en Google Cloud Console\n3. Tu plan incluya acceso a estos modelos');
    }
    
    throw new Error(errorMsg || 'No se pudo analizar la imagen. Por favor, intenta de nuevo.');
  }
};

/**
 * Construye el prompt dinámico basado en los parámetros
 * @param {Object} parameters - Parámetros de generación
 * @param {string} ingredients - Ingredientes detectados
 * @returns {string} - Prompt completo
 */
const buildPrompt = (parameters, ingredients) => {
  const {
    intensidadGourmet,
    estiloPlato,
    iluminacion,
    fondo,
    decoracionesExtra,
    anguloCamara,
    // Nuevos parámetros
    tipoVajilla,
    colorVajilla,
    ambiente,
    momentoDelDia,
    profundidadCampo,
    aspectRatio,
    efectoVapor,
    efectoFrescura
  } = parameters;

  // ============================================
  // MAPEOS ORIGINALES
  // ============================================
  const estiloMap = {
    'rustico': 'estilo rústico y casero',
    'minimalista': 'estilo minimalista y limpio',
    'clasico-elegante': 'estilo clásico y elegante',
    'moderno': 'estilo moderno y vanguardista'
  };

  const iluminacionMap = {
    'natural': 'iluminación natural y suave',
    'calida': 'iluminación cálida y acogedora',
    'estudio': 'iluminación de estudio profesional'
  };

  const fondoMap = {
    'madera': 'fondo de madera natural',
    'marmol': 'fondo de mármol elegante',
    'negro': 'fondo negro minimalista',
    'blanco': 'fondo blanco limpio',
    'original': 'mantener el fondo original'
  };

  const anguloMap = {
    'cenital': 'vista cenital desde arriba (90 grados), perfecta para mostrar todos los elementos',
    '75': 'vista casi cenital desde 75 grados, mostrando textura y profundidad',
    '45': 'vista clásica en ángulo de 45 grados, el estándar de food photography',
    '30': 'vista baja desde 30 grados, destacando altura y volumen del plato',
    'lateral': 'vista lateral a nivel del plato (0 grados), ideal para mostrar capas',
    'hero': 'hero shot frontal destacado, ángulo dramático que hace protagonista al plato',
    'diagonal': 'vista diagonal desde una esquina, añade dinamismo y perspectiva',
    'picado': 'vista en picado desde arriba con inclinación, combina cenital con perspectiva'
  };

  // ============================================
  // NUEVOS MAPEOS - Categoría 1: Vajilla
  // ============================================
  const tipoVajillaMap = {
    'original': '', // No agregar texto si es original
    'redondo': 'plato redondo de porcelana',
    'cuadrado': 'plato cuadrado minimalista',
    'rectangular': 'plato rectangular alargado',
    'bowl': 'bowl profundo elegante',
    'pizarra': 'sobre pizarra negra natural',
    'tabla-madera': 'sobre tabla de madera rústica'
  };

  const colorVajillaMap = {
    'original': '', // No agregar texto si es original
    'blanco': 'vajilla blanca clásica',
    'negro': 'vajilla negra mate',
    'terracota': 'vajilla color terracota',
    'crema': 'vajilla color crema'
  };

  // ============================================
  // NUEVOS MAPEOS - Categoría 2: Ambiente
  // ============================================
  const ambienteMap = {
    'sin-preferencia': '',
    'restaurante': 'ambiente de restaurante elegante',
    'cocina-casera': 'ambiente de cocina casera acogedora',
    'terraza': 'ambiente de terraza exterior con luz natural',
    'buffet': 'ambiente de buffet profesional',
    'estudio': 'ambiente de estudio fotográfico profesional'
  };

  const momentoDelDiaMap = {
    'sin-preferencia': '',
    'desayuno': 'iluminación matutina de desayuno',
    'brunch': 'luz brillante de media mañana estilo brunch',
    'almuerzo': 'iluminación de mediodía',
    'cena': 'iluminación íntima y cálida de cena romántica'
  };

  // ============================================
  // NUEVOS MAPEOS - Categoría 3: Técnica Fotográfica
  // ============================================
  const profundidadCampoMap = {
    'moderado': 'profundidad de campo moderada',
    'bokeh-fuerte': 'bokeh pronunciado con fondo muy difuso',
    'todo-foco': 'todo el plato y entorno en foco nítido'
  };

  const aspectRatioMap = {
    'original': '',
    '1:1': 'formato cuadrado 1:1 (ideal para Instagram)',
    '4:3': 'formato 4:3 estándar',
    '16:9': 'formato panorámico 16:9 (ideal para banners)',
    '4:5': 'formato vertical 4:5 (ideal para portrait)'
  };

  // ============================================
  // NUEVOS MAPEOS - Categoría 4: Efectos Especiales
  // ============================================
  const efectoVaporMap = {
    'sin-vapor': '',
    'sutil': 'vapor suave y delicado saliendo del plato',
    'intenso': 'vapor abundante que transmite calor y frescura del plato'
  };

  const efectoFrescuraMap = {
    'sin-efecto': '',
    'gotas': 'gotas de agua fresca en los ingredientes que transmiten frescura',
    'escarcha': 'efecto de escarcha delicada (ideal para postres fríos)'
  };

  // ============================================
  // CONSTRUCCIÓN DEL PROMPT
  // ============================================
  const intensidadText = intensidadGourmet <= 3 
    ? 'sutilmente mejorado' 
    : intensidadGourmet <= 7 
    ? 'moderadamente mejorado' 
    : 'extremadamente mejorado con presentación gourmet profesional';

  // Decoraciones extra (chips multi-select)
  let decoracionesText = '';
  if (decoracionesExtra && decoracionesExtra.length > 0) {
    const decoraciones = decoracionesExtra.map(d => {
      if (d === 'microgreens') return 'microgreens frescos';
      if (d === 'salsas-decorativas') return 'salsas decorativas artísticas';
      if (d === 'flores-comestibles') return 'flores comestibles';
      return d;
    }).join(', ');
    decoracionesText = `Incluye decoración con: ${decoraciones}.`;
  }

  // Construir secciones de vajilla
  const vajillaText = tipoVajillaMap[tipoVajilla] || '';
  const colorVajillaText = colorVajillaMap[colorVajilla] || '';
  const vajillaCompleta = [vajillaText, colorVajillaText].filter(Boolean).join(', ');

  // Construir sección de ambiente
  const ambienteText = ambienteMap[ambiente] || '';
  const momentoText = momentoDelDiaMap[momentoDelDia] || '';

  // Construir sección de técnica fotográfica
  const profundidadText = profundidadCampoMap[profundidadCampo] || 'profundidad de campo moderada';
  const aspectText = aspectRatioMap[aspectRatio] || '';

  // Construir sección de efectos especiales
  const vaporText = efectoVaporMap[efectoVapor] || '';
  const frescuraText = efectoFrescuraMap[efectoFrescura] || '';
  const efectosText = [vaporText, frescuraText].filter(Boolean).join('. ');

  // Construir prompt optimizado para mejorar la imagen original
  const prompt = `Mejora profesionalmente esta fotografía de comida manteniendo el plato original exactamente como está.

INSTRUCCIONES CRÍTICAS:
- Mantén el mismo plato, los mismos ingredientes y la misma disposición
- NO cambies los ingredientes: ${ingredients}
- NO agregues ni quites ingredientes
- Solo mejora: iluminación, presentación visual, estilo fotográfico y fondo

MEJORAS A APLICAR:
- Estilo fotográfico: ${estiloMap[estiloPlato] || 'elegante'}, ${intensidadText}
- Iluminación: ${iluminacionMap[iluminacion] || 'natural y profesional'}
- Fondo: ${fondoMap[fondo] || 'elegante'}
- Ángulo de cámara: ${anguloMap[anguloCamara] || 'profesional'}
- Técnica: ${profundidadText}${vajillaCompleta ? `\n- Vajilla: ${vajillaCompleta}` : ''}${ambienteText ? `\n- Ambiente: ${ambienteText}` : ''}${momentoText ? `\n- Momento del día: ${momentoText}` : ''}${aspectText ? `\n- Formato de imagen: ${aspectText}` : ''}${efectosText ? `\n- Efectos especiales: ${efectosText}` : ''}${decoracionesText ? `\n- ${decoracionesText}` : ''}

RESULTADO ESPERADO: La misma comida de la imagen original, pero con calidad fotográfica profesional gourmet, mejor iluminación y presentación visual mejorada.`;

  return prompt;
};

/**
 * Genera 1 imagen gourmet mejorando la imagen original usando Gemini 3 Pro Image
 * @param {string} imageBase64 - Imagen original en base64 (se usa como referencia para mejorar)
 * @param {Object} parameters - Parámetros de generación
 * @param {string} ingredients - Ingredientes detectados
 * @returns {Promise<Array>} - Array con 1 imagen mejorada en base64
 */
export const generateGourmetVariants = async (imageBase64, parameters, ingredients) => {
  try {
    const apiKey = process.env.REACT_APP_GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error('API Key de Gemini no configurada');
    }

    // Inicializar el SDK de Google Generative AI
    const genAI = new GoogleGenerativeAI(apiKey);

    // Construir prompt dinámico basado en los parámetros
    // El prompt ahora se enfoca en mejorar la imagen original
    const prompt = buildPrompt(parameters, ingredients);
    
    // Usar SOLO Gemini 3 Pro Image según documentación oficial
    console.log('🎨 Mejorando imagen original con gemini-3-pro-image-preview (Gemini 3)...');
    
    // Verificar que el modelo esté disponible
    const availableModels = await listAvailableModels(apiKey);
    const hasGemini3Image = availableModels && availableModels.includes('gemini-3-pro-image-preview');
    
    if (!hasGemini3Image) {
      throw new Error('gemini-3-pro-image-preview no está disponible con tu API key. Verifica que tengas acceso a Gemini 3 en Google AI Studio.');
    }
    
    // Usar Gemini 3 Pro Image para edición conversacional
    // Según documentación: puede mejorar/editar imágenes existentes
    const model = genAI.getGenerativeModel({ 
      model: 'gemini-3-pro-image-preview'
    });
    
    // Preparar la imagen original para enviarla junto con el prompt
    // Remover el prefijo data:image/...;base64, si existe
    const base64Data = imageBase64.includes(',') 
      ? imageBase64.split(',')[1] 
      : imageBase64;
    
    // Detectar el tipo MIME de la imagen
    let mimeType = "image/jpeg";
    if (imageBase64.includes('data:image/png')) {
      mimeType = "image/png";
    } else if (imageBase64.includes('data:image/webp')) {
      mimeType = "image/webp";
    }
    
    // Preparar contenido con imagen original + prompt de mejora
    // Gemini 3 Pro Image puede usar la imagen como referencia para mejorarla
    const imagePart = {
      inlineData: {
        data: base64Data,
        mimeType: mimeType
      }
    };
    
    // Enviar imagen original + prompt de mejora
    // El modelo mejorará la imagen manteniendo el plato original
    // Estructura: [prompt, imagePart] - igual que en analyzeImage
    const contents = [prompt, imagePart];
    
    console.log('📤 Enviando imagen original para mejora profesional...');
    console.log('📝 Prompt de mejora:', prompt.substring(0, 150) + '...');
    const result = await model.generateContent(contents);
    
    const response = await result.response;
    
    // Extraer imagen de la respuesta según estructura de Gemini 3
    let imageData = null;
    
    // Estructura estándar: candidates[0].content.parts con inlineData
    if (response.candidates && response.candidates[0]) {
      const parts = response.candidates[0].content?.parts || [];
      const imagePart = parts.find(part => part.inlineData);
      if (imagePart?.inlineData?.data) {
        imageData = imagePart.inlineData.data;
      }
    }
    
    // Alternativa: buscar en response.parts directamente (estructura alternativa)
    if (!imageData && result.response?.parts) {
      const imagePart = result.response.parts.find(part => part.inlineData);
      if (imagePart?.inlineData?.data) {
        imageData = imagePart.inlineData.data;
      }
    }
    
    // Alternativa: buscar en el texto si contiene base64
    if (!imageData && response.text) {
      const base64Match = response.text.match(/data:image\/[^;]+;base64,([^\s"']+)/);
      if (base64Match) {
        imageData = base64Match[1];
      }
    }
    
    if (imageData) {
      console.log('✅ Imagen generada exitosamente con gemini-3-pro-image-preview');
      return [`data:image/png;base64,${imageData}`];
    } else {
      // Log detallado para debugging
      console.error('❌ No se pudo extraer imagen de la respuesta');
      console.error('Estructura de respuesta:', JSON.stringify(response, null, 2));
      throw new Error('No se pudo extraer la imagen de la respuesta de Gemini 3. La estructura de la respuesta puede haber cambiado.');
    }
    
  } catch (error) {
    console.error('❌ Error generando variantes gourmet:', error);
    
    const errorMsg = error.message || error.toString();
    
    // Si el proxy no está disponible, mostrar mensaje claro
    if (error.code === 'ECONNREFUSED' || errorMsg.includes('Network Error') || errorMsg.includes('ECONNREFUSED')) {
      throw new Error('El servidor proxy no está ejecutándose. Por favor, ejecuta "npm run server" en una terminal separada o usa "npm run dev" para ejecutar todo junto.');
    }
    
    // Manejo específico de error 404
    if (error.response?.status === 404) {
      const errorDetails = error.response?.data;
      console.error('❌ Error 404 detalles:', errorDetails);
      throw new Error(`Servidor proxy no responde correctamente (404). Verifica que el servidor esté ejecutándose en ${process.env.REACT_APP_PROXY_URL || 'http://localhost:3001'}. Detalles: ${errorDetails?.error || errorMsg}`);
    }
    
    if (error.response?.data?.error) {
      throw new Error(error.response.data.error);
    }
    
    if (errorMsg.includes('API_KEY_INVALID') || errorMsg.includes('401') || errorMsg.includes('403')) {
      throw new Error('API Key inválida o no autorizada. Por favor, verifica tu configuración.');
    } else if (errorMsg.includes('429') || errorMsg.includes('quota')) {
      throw new Error('Límite de solicitudes excedido. Por favor, intenta más tarde.');
    }
    
    throw new Error(errorMsg || 'No se pudieron generar las variantes gourmet. Por favor, intenta de nuevo.');
  }
};

