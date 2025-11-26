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
 * Nueva filosofía: mantener ALIMENTOS idénticos, libertad total en presentación
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
    tipoVajilla,
    colorVajilla,
    ambiente,
    momentoDelDia,
    profundidadCampo,
    aspectRatio,
    efectoVapor,
    efectoFrescura,
    // Nuevos parámetros
    direccionLuz,
    props,
    saturacion,
    texturaFondo
  } = parameters;

  // ============================================
  // MAPEOS - Estilo
  // ============================================
  const estiloMap = {
    'rustico': 'estilo rústico y casero',
    'minimalista': 'estilo minimalista y limpio',
    'clasico-elegante': 'estilo clásico y elegante',
    'moderno': 'estilo moderno y vanguardista'
  };

  // Iluminación expandida
  const iluminacionMap = {
    'natural': 'iluminación natural suave',
    'calida': 'iluminación cálida y acogedora',
    'estudio': 'iluminación de estudio profesional',
    'dramatica': 'iluminación dramática con alto contraste',
    'suave': 'iluminación suave y difusa'
  };

  // Fondos expandidos
  const fondoMap = {
    'madera': 'superficie de madera',
    'marmol': 'superficie de mármol',
    'negro': 'fondo negro',
    'blanco': 'fondo blanco',
    'granito': 'superficie de granito',
    'concreto': 'superficie de concreto pulido',
    'tela': 'mantel o tela de lino',
    'original': 'fondo neutro elegante'
  };

  const anguloMap = {
    'cenital': 'vista cenital desde arriba (90 grados)',
    '75': 'vista casi cenital desde 75 grados',
    '45': 'vista clásica en ángulo de 45 grados',
    '30': 'vista baja desde 30 grados',
    'lateral': 'vista lateral a nivel del plato',
    'hero': 'hero shot frontal dramático',
    'diagonal': 'vista diagonal desde una esquina',
    'picado': 'vista en picado desde arriba inclinado'
  };

  // ============================================
  // MAPEOS - Vajilla (ahora se aplica libremente)
  // ============================================
  const tipoVajillaMap = {
    'original': 'plato elegante apropiado',
    'redondo': 'plato redondo de porcelana',
    'cuadrado': 'plato cuadrado minimalista',
    'rectangular': 'plato rectangular alargado',
    'bowl': 'bowl profundo elegante',
    'pizarra': 'pizarra negra natural',
    'tabla-madera': 'tabla de madera rústica'
  };

  const colorVajillaMap = {
    'original': 'color neutro elegante',
    'blanco': 'blanco clásico',
    'negro': 'negro mate',
    'terracota': 'terracota cálido',
    'crema': 'crema suave'
  };

  // ============================================
  // MAPEOS - Ambiente
  // ============================================
  const ambienteMap = {
    'sin-preferencia': '',
    'restaurante': 'ambiente de restaurante elegante',
    'cocina-casera': 'ambiente acogedor casero',
    'terraza': 'ambiente de terraza con luz natural',
    'buffet': 'ambiente de buffet profesional',
    'estudio': 'estudio fotográfico profesional'
  };

  const momentoDelDiaMap = {
    'sin-preferencia': '',
    'desayuno': 'atmósfera brillante matutina',
    'brunch': 'luz cálida de media mañana',
    'almuerzo': 'luz natural de mediodía',
    'cena': 'atmósfera íntima y cálida nocturna'
  };

  // ============================================
  // MAPEOS - Técnica Fotográfica
  // ============================================
  const profundidadCampoMap = {
    'moderado': 'profundidad de campo moderada',
    'bokeh-fuerte': 'bokeh pronunciado con fondo muy difuso',
    'todo-foco': 'todo en foco nítido'
  };

  const aspectRatioMap = {
    'original': '',
    '1:1': 'formato cuadrado',
    '4:3': 'formato 4:3',
    '16:9': 'formato panorámico 16:9',
    '4:5': 'formato vertical 4:5'
  };

  // ============================================
  // NUEVOS MAPEOS
  // ============================================
  const direccionLuzMap = {
    'natural': 'luz natural desde ventana',
    'frontal': 'luz frontal directa',
    'lateral': 'luz lateral que resalta texturas',
    'backlight': 'retroiluminación que crea siluetas y resalta vapor',
    'cenital': 'luz cenital desde arriba'
  };

  const propsMap = {
    'ninguno': '',
    'cubiertos': 'cubiertos elegantes al lado',
    'servilleta': 'servilleta de tela doblada',
    'copa': 'copa de vino a un lado',
    'ingredientes': 'ingredientes crudos decorativos de fondo',
    'hierbas': 'ramitas de hierbas frescas como decoración'
  };

  const saturacionMap = {
    'normal': 'colores naturales y balanceados',
    'bajo': 'colores suaves y desaturados',
    'vibrante': 'colores vivos y saturados que resaltan'
  };

  const texturaFondoMap = {
    'lisa': 'textura lisa y uniforme',
    'rustica': 'textura rústica con vetas naturales',
    'desgastada': 'textura vintage desgastada',
    'pulida': 'textura pulida y brillante'
  };

  // ============================================
  // MAPEOS - Efectos Especiales
  // ============================================
  const efectoVaporMap = {
    'sin-vapor': '',
    'sutil': 'vapor suave y delicado',
    'intenso': 'vapor abundante visible'
  };

  const efectoFrescuraMap = {
    'sin-efecto': '',
    'gotas': 'gotas de agua fresca en los ingredientes',
    'escarcha': 'efecto de escarcha delicada'
  };

  // Decoraciones expandidas
  const decoracionesMap = {
    'microgreens': 'microgreens frescos',
    'salsas-decorativas': 'salsas artísticas decorativas',
    'flores-comestibles': 'flores comestibles',
    'especias': 'especias esparcidas artísticamente',
    'drizzle': 'drizzle de aceite de oliva',
    'citricos': 'ralladura de cítricos'
  };

  // ============================================
  // CONSTRUCCIÓN DEL PROMPT
  // ============================================
  
  // Nivel de transformación
  const intensidadText = intensidadGourmet <= 3 
    ? 'mejora sutil manteniendo aspecto natural' 
    : intensidadGourmet <= 7 
    ? 'transformación moderada con presentación gourmet' 
    : 'transformación completa con presentación de alta cocina profesional';

  // Decoraciones extra
  let decoracionesText = '';
  if (decoracionesExtra && decoracionesExtra.length > 0) {
    const decoraciones = decoracionesExtra
      .map(d => decoracionesMap[d] || d)
      .join(', ');
    decoracionesText = decoraciones;
  }

  // Construir secciones
  const vajillaText = `${tipoVajillaMap[tipoVajilla] || 'plato elegante'} color ${colorVajillaMap[colorVajilla] || 'neutro'}`;
  const fondoCompleto = `${fondoMap[fondo] || 'fondo elegante'}${texturaFondo && texturaFondoMap[texturaFondo] ? ` con ${texturaFondoMap[texturaFondo]}` : ''}`;
  const iluminacionCompleta = `${iluminacionMap[iluminacion] || 'iluminación profesional'}${direccionLuz && direccionLuzMap[direccionLuz] ? `, ${direccionLuzMap[direccionLuz]}` : ''}`;
  const ambienteText = ambienteMap[ambiente] || '';
  const momentoText = momentoDelDiaMap[momentoDelDia] || '';
  
  // Props ahora es un array para selección múltiple
  let propsText = '';
  if (props && Array.isArray(props) && props.length > 0) {
    const propsArray = props
      .filter(p => p !== 'ninguno')
      .map(p => propsMap[p] || p)
      .filter(Boolean);
    propsText = propsArray.join(', ');
  }
  
  const saturacionText = saturacionMap[saturacion] || '';
  const efectosArray = [efectoVaporMap[efectoVapor], efectoFrescuraMap[efectoFrescura]].filter(Boolean);
  const efectosText = efectosArray.join(', ');

  // ============================================
  // PROMPT - NUEVA FILOSOFÍA: MANTENER ALIMENTOS, NO PLATO
  // ============================================
  const prompt = `Genera una fotografía gastronómica profesional gourmet basada en esta imagen de comida.

REGLA FUNDAMENTAL:
- Los ALIMENTOS e INGREDIENTES deben ser idénticos a la imagen original: ${ingredients}
- Mantén la misma comida, los mismos ingredientes, porciones y disposición general de los alimentos
- PUEDES cambiar libremente: plato, vajilla, fondo, iluminación, ángulo, decoración y presentación

ESPECIFICACIONES DE LA IMAGEN:
- Estilo: ${estiloMap[estiloPlato] || 'elegante'}, ${intensidadText}
- Vajilla: ${vajillaText}
- Fondo: ${fondoCompleto}
- Iluminación: ${iluminacionCompleta}
- Ángulo: ${anguloMap[anguloCamara] || 'ángulo profesional'}
- Enfoque: ${profundidadCampoMap[profundidadCampo] || 'profundidad moderada'}${ambienteText ? `\n- Ambiente: ${ambienteText}` : ''}${momentoText ? `\n- Atmósfera: ${momentoText}` : ''}${saturacionText ? `\n- Colores: ${saturacionText}` : ''}${propsText ? `\n- Props: ${propsText}` : ''}${decoracionesText ? `\n- Decoración: ${decoracionesText}` : ''}${efectosText ? `\n- Efectos: ${efectosText}` : ''}${aspectRatioMap[aspectRatio] ? `\n- Formato: ${aspectRatioMap[aspectRatio]}` : ''}

RESULTADO: Fotografía gastronómica profesional de nivel revista, con los mismos alimentos de la imagen original pero con presentación gourmet transformada.`;

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
      throw new Error(`Servidor proxy no responde correctamente (404). Verifica que el servidor esté ejecutándose. Detalles: ${errorDetails?.error || errorMsg}`);
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

