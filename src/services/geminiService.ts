import axios from 'axios';
import { DishParameters } from '../types';

// Base URL del backend - detectar automáticamente el entorno
const getApiBaseUrl = (): string => {
  if (process.env.REACT_APP_API_URL) return process.env.REACT_APP_API_URL;
  if (process.env.NODE_ENV === 'development') return 'http://localhost:3001';
  return ''; // En producción usa rutas relativas
};

const API_BASE_URL = getApiBaseUrl();

/**
 * Analiza una imagen y detecta ingredientes usando el backend
 * @param {string} imageBase64 - Imagen en base64
 * @returns {Promise<string>} - Lista de ingredientes detectados
 */
export const analyzeImage = async (imageBase64: string): Promise<string> => {
  try {
    const url = `${API_BASE_URL}/api/analyze-image`;
    const response = await axios.post(url, { image: imageBase64 });
    
    if (response.data && response.data.success) {
      return response.data.ingredients;
    } else {
      throw new Error(response.data.error || 'Error analizando imagen');
    }
  } catch (error: any) {
    console.error('Error analizando imagen via backend:', error);
    throw new Error(error.response?.data?.error || error.message || 'Error al analizar la imagen');
  }
};

/**
 * Construye el prompt dinámico basado en los parámetros
 */
const buildPrompt = (parameters: DishParameters, input: string, isFromScratch: boolean = false): string => {
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
    direccionLuz,
    props,
    saturacion,
    texturaFondo,
    cuisineType,
    dishCategory,
    cookingTechnique,
    culinaryTags
  } = parameters;

  const estiloMap: Record<string, string> = {
    'rustico': 'estilo rústico y casero',
    'minimalista': 'estilo minimalista y limpio',
    'clasico-elegante': 'estilo clásico y elegante',
    'moderno': 'estilo moderno y vanguardista'
  };

  const iluminacionMap: Record<string, string> = {
    'natural': 'iluminación natural suave',
    'calida': 'iluminación cálida y acogedora',
    'estudio': 'iluminación de estudio profesional',
    'dramatica': 'iluminación dramática con alto contraste',
    'suave': 'iluminación suave y difusa'
  };

  const fondoMap: Record<string, string> = {
    'madera': 'superficie de madera',
    'marmol': 'superficie de mármol',
    'negro': 'fondo negro',
    'blanco': 'fondo blanco',
    'granito': 'superficie de granito',
    'concreto': 'superficie de concreto pulido',
    'tela': 'mantel o tela de lino',
    'original': 'fondo neutro elegante'
  };

  const anguloMap: Record<string, string> = {
    'cenital': 'vista cenital desde arriba (90 grados)',
    '75': 'vista casi cenital desde 75 grados',
    '45': 'vista clásica en ángulo de 45 grados',
    '30': 'vista baja desde 30 grados',
    'lateral': 'vista lateral a nivel del plato',
    'hero': 'hero shot frontal dramático',
    'diagonal': 'vista diagonal desde una esquina',
    'picado': 'vista en picado desde arriba inclinado'
  };

  const tipoVajillaMap: Record<string, string> = {
    'original': 'plato elegante apropiado',
    'redondo': 'plato redondo de porcelana',
    'cuadrado': 'plato cuadrado minimalista',
    'rectangular': 'plato rectangular alargado',
    'bowl': 'bowl profundo elegante',
    'pizarra': 'pizarra negra natural',
    'tabla-madera': 'tabla de madera rústica'
  };

  const colorVajillaMap: Record<string, string> = {
    'original': 'color neutro elegante',
    'blanco': 'blanco clásico',
    'negro': 'negro mate',
    'terracota': 'terracota cálido',
    'crema': 'crema suave'
  };

  const ambienteMap: Record<string, string> = {
    'sin-preferencia': '',
    'restaurante': 'ambiente de restaurante elegante',
    'cocina-casera': 'ambiente acogedor casero',
    'terraza': 'ambiente de terraza con luz natural',
    'buffet': 'ambiente de buffet profesional',
    'estudio': 'estudio fotográfico profesional'
  };

  const momentoDelDiaMap: Record<string, string> = {
    'sin-preferencia': '',
    'desayuno': 'atmósfera brillante matutina',
    'brunch': 'luz cálida de media mañana',
    'almuerzo': 'luz natural de mediodía',
    'cena': 'atmósfera íntima y cálida nocturna'
  };

  const profundidadCampoMap: Record<string, string> = {
    'moderado': 'profundidad de campo moderada',
    'bokeh-fuerte': 'bokeh pronunciado con fondo muy difuso',
    'todo-foco': 'todo en foco nítido'
  };

  const aspectRatioMap: Record<string, string> = {
    'original': '',
    '1:1': 'formato cuadrado',
    '4:3': 'formato 4:3',
    '16:9': 'formato panorámico 16:9',
    '4:5': 'formato vertical 4:5'
  };

  const direccionLuzMap: Record<string, string> = {
    'natural': 'luz natural desde ventana',
    'frontal': 'luz frontal directa',
    'lateral': 'luz lateral que resalta texturas',
    'backlight': 'retroiluminación que crea siluetas y resalta vapor',
    'cenital': 'luz cenital desde arriba'
  };

  const propsMap: Record<string, string> = {
    'ninguno': '',
    'cubiertos': 'cubiertos elegantes al lado',
    'servilleta': 'servilleta de tela doblada',
    'copa': 'copa de vino a un lado',
    'ingredientes': 'ingredientes crudos decorativos de fondo',
    'hierbas': 'ramitas de hierbas frescas como decoración'
  };

  const saturacionMap: Record<string, string> = {
    'normal': 'colores naturales y balanceados',
    'bajo': 'colores suaves y desaturados',
    'vibrante': 'colores vivos y saturados que resaltan'
  };

  const texturaFondoMap: Record<string, string> = {
    'lisa': 'textura lisa y uniforme',
    'rustica': 'textura rústica con vetas naturales',
    'desgastada': 'textura vintage desgastada',
    'pulida': 'textura pulida y brillante'
  };

  const efectoVaporMap: Record<string, string> = {
    'sin-vapor': '',
    'sutil': 'vapor suave y delicado',
    'intenso': 'vapor abundante visible'
  };

  const efectoFrescuraMap: Record<string, string> = {
    'sin-efecto': '',
    'gotas': 'gotas de agua fresca en los ingredientes',
    'escarcha': 'efecto de escarcha delicada'
  };

  const decoracionesMap: Record<string, string> = {
    'microgreens': 'microgreens frescos',
    'salsas-decorativas': 'salsas artísticas decorativas',
    'flores-comestibles': 'flores comestibles',
    'especias': 'especias esparcidas artísticamente',
    'drizzle': 'drizzle de aceite de oliva',
    'citricos': 'ralladura de cítricos'
  };

  const intensidadText = intensidadGourmet <= 3 
    ? 'mejora sutil manteniendo aspecto natural' 
    : intensidadGourmet <= 7 
    ? 'transformación moderada con presentación gourmet' 
    : 'transformación completa con presentación de alta cocina profesional';

  let decoracionesText = '';
  if (decoracionesExtra && decoracionesExtra.length > 0) {
    decoracionesText = decoracionesExtra.map(d => (d && decoracionesMap[d]) || d).join(', ');
  }

  const vajillaText = `${(tipoVajilla ? tipoVajillaMap[tipoVajilla] : '') || 'plato elegante'} color ${(colorVajilla ? colorVajillaMap[colorVajilla] : '') || 'neutro'}`;
  const fondoCompleto = `${(fondo ? fondoMap[fondo] : '') || 'fondo elegante'}${texturaFondo && texturaFondoMap[texturaFondo] ? ` con ${texturaFondoMap[texturaFondo]}` : ''}`;
  const iluminacionCompleta = `${(iluminacion ? iluminacionMap[iluminacion] : '') || 'iluminación profesional'}${direccionLuz && direccionLuzMap[direccionLuz] ? `, ${direccionLuzMap[direccionLuz]}` : ''}`;
  const ambienteText = (ambiente ? ambienteMap[ambiente] : '') || '';
  const momentoText = (momentoDelDia ? momentoDelDiaMap[momentoDelDia] : '') || '';
  
  let propsText = '';
  if (props && Array.isArray(props) && props.length > 0) {
    propsText = props.filter(p => p !== 'ninguno').map(p => (p && propsMap[p]) || p).filter(Boolean).join(', ');
  }
  
  const saturacionText = saturacion ? (saturacionMap[saturacion] || '') : '';
  const efectosText = [
    efectoVapor ? efectoVaporMap[efectoVapor] : '', 
    efectoFrescura ? efectoFrescuraMap[efectoFrescura] : ''
  ].filter(Boolean).join(', ');

  let prompt = '';
  if (isFromScratch) {
    prompt = `Genera una fotografía gastronómica profesional de alta resolución basada en la siguiente descripción: "${input}".
    
    INFORMACIÓN CULINARIA ADICIONAL:
    ${Array.isArray(cuisineType) && cuisineType.length ? `- Tipo de cocina: ${cuisineType.join(', ')}` : ''}
    ${Array.isArray(dishCategory) && dishCategory.length ? `- Categoría: ${dishCategory.join(', ')}` : ''}
    ${Array.isArray(cookingTechnique) && cookingTechnique.length ? `- Técnica: ${cookingTechnique.join(', ')}` : ''}
    ${Array.isArray(culinaryTags) && culinaryTags.length ? `- Características: ${culinaryTags.join(', ')}` : ''}

ESPECIFICACIONES DE LA IMAGEN:
- Estilo: ${(estiloPlato ? estiloMap[estiloPlato] : '') || 'elegante'}
- Vajilla: ${vajillaText}
- Fondo: ${fondoCompleto}
- Iluminación: ${iluminacionCompleta}
- Ángulo: ${(anguloCamara ? anguloMap[anguloCamara] : '') || 'ángulo profesional'}
- Enfoque: ${(profundidadCampo ? profundidadCampoMap[profundidadCampo] : '') || 'profundidad moderada'}${ambienteText ? `\n- Ambiente: ${ambienteText}` : ''}${momentoText ? `\n- Atmósfera: ${momentoText}` : ''}${saturacionText ? `\n- Colores: ${saturacionText}` : ''}${propsText ? `\n- Props: ${propsText}` : ''}${decoracionesText ? `\n- Decoración: ${decoracionesText}` : ''}${efectosText ? `\n- Efectos: ${efectosText}` : ''}${aspectRatio && aspectRatioMap[aspectRatio] ? `\n- Formato: ${aspectRatioMap[aspectRatio]}` : ''}

RESULTADO: Una imagen fotorrealista de calidad de revista culinaria. La comida debe verse deliciosa, fresca y perfectamente iluminada.`;
  } else {
    const usePhysicalPlate = parameters.plateImage ? '\n- PLATO FÍSICO: Se ha proporcionado una imagen del plato físico donde DEBE servirse la comida. Utiliza exactamente este plato para la presentación final.' : '';
    
    prompt = `Genera una fotografía gastronómica profesional gourmet basada en esta imagen de comida.

REGLA FUNDAMENTAL DE INTEGRIDAD ABSOLUTA:
- Los ALIMENTOS e INGREDIENTES deben ser EXACTAMENTE los mismos que en la imagen original: ${input}.
- No añadas, quites ni modifiques los componentes principales de la comida.
- El objetivo es realizar un RE-ESTILISMO FOTOGRÁFICO profesional, manteniendo la ESENCIA y APARIENCIA de la comida original lo más fielmente posible.
- Mantén la disposición, porciones y texturas naturales de los ingredientes originales.

MEJORA FOTOGRÁFICA Y DE PRESENTACIÓN:
- Transforma la iluminación a una calidad de estudio profesional (luz suave lateral, realce de texturas).
- Mejora la nitidez y el detalle técnico de la captura.
- El balance de blancos y la colorimetría deben ser perfectos, resaltando la frescura natural.
- Puedes mejorar el emplatado y el entorno (plato, fondo, decoración lateral) para que parezca una fotografía de nivel editorial o estrella Michelin.${usePhysicalPlate}

ESPECIFICACIONES DE LA IMAGEN:
- Estilo: ${(estiloPlato ? estiloMap[estiloPlato] : '') || 'elegante'}, ${intensidadText}
- Vajilla: ${parameters.plateImage ? 'Usa el plato proporcionado en la segunda imagen' : vajillaText}
- Fondo: ${fondoCompleto}
- Iluminación: ${iluminacionCompleta}
- Ángulo: ${(anguloCamara ? anguloMap[anguloCamara] : '') || 'ángulo profesional'}
- Enfoque: ${(profundidadCampo ? profundidadCampoMap[profundidadCampo] : '') || 'profundidad moderada'}${ambienteText ? `\n- Ambiente: ${ambienteText}` : ''}${momentoText ? `\n- Atmósfera: ${momentoText}` : ''}${saturacionText ? `\n- Colores: ${saturacionText}` : ''}${propsText ? `\n- Props: ${propsText}` : ''}${decoracionesText ? `\n- Decoración: ${decoracionesText}` : ''}${efectosText ? `\n- Efectos: ${efectosText}` : ''}${aspectRatio && aspectRatioMap[aspectRatio] ? `\n- Formato: ${aspectRatioMap[aspectRatio]}` : ''}

RESULTADO: Fotografía gastronómica de nivel revista internacional (tipo Michelin Guide o Bon Appétit), manteniendo la comida original pero con una ejecución técnica fotográfica perfecta y presentación gourmet.`;
  }

  return prompt;
};

/**
 * Genera variantes gourmet a través del backend
 */
export const generateGourmetVariants = async (imageBase64: string, parameters: DishParameters, ingredients: string): Promise<string[]> => {
  try {
    const prompt = buildPrompt(parameters, ingredients, false);
    const url = `${API_BASE_URL}/api/generate-image`;
    
    const response = await axios.post(url, {
      prompt,
      image: imageBase64,
      plateImage: parameters.plateImage,
      aspectRatio: parameters.aspectRatio,
      imageSize: parameters.imageSize
    });
    
    if (response.data && response.data.success) {
      return [response.data.image];
    } else {
      throw new Error(response.data.error || 'Error generando variantes gourmet');
    }
  } catch (error: any) {
    console.error('Error generando variantes via backend:', error);
    throw new Error(error.response?.data?.error || error.message || 'Error al generar las variantes gourmet');
  }
};

/**
 * Genera imagen desde cero a través del backend
 */
export const generateImageFromPrompt = async (input: string, parameters: DishParameters): Promise<string[]> => {
  try {
    const prompt = buildPrompt(parameters, input, true);
    const url = `${API_BASE_URL}/api/generate-image`;
    
    const response = await axios.post(url, { 
      prompt,
      aspectRatio: parameters.aspectRatio,
      imageSize: parameters.imageSize
    });
    
    if (response.data && response.data.success) {
      return [response.data.image];
    } else {
      throw new Error(response.data.error || 'Error generando imagen');
    }
  } catch (error: any) {
    console.error('Error generando imagen desde cero via backend:', error);
    throw new Error(error.response?.data?.error || error.message || 'Error al generar la imagen');
  }
};

/**
 * Genera una receta usando la API de Gemini a través del backend
 * @param {string} input - Descripción o idea principal del plato
 * @param {DishParameters} parameters - TODOS los parámetros usados para generar la imagen
 * @param {string} ingredientsString - Ingredientes detectados o ingresados (opcional)
 * @returns {Promise<string>} - Receta generada en formato Markdown
 */
export const generateRecipe = async (input: string, parameters: DishParameters, ingredientsString: string = ''): Promise<string> => {
    try {
        const {
            cuisineType,
            dishCategory,
            cookingTechnique,
            culinaryTags,
            estiloPlato,
            ambiente,
            momentoDelDia,
            intensidadGourmet
        } = parameters;

        const getParamValue = (param: string | string[] | undefined): string => {
          if (!param) return '';
          return Array.isArray(param) ? param.join(', ') : param;
        };

        const cuisine = getParamValue(cuisineType);
        const category = getParamValue(dishCategory);
        const technique = getParamValue(cookingTechnique);
        const tags = getParamValue(culinaryTags);
        
        const finalIngredients = ingredientsString || getParamValue(parameters.ingredients) || '';
        
        const ambienteMap: Record<string, string> = {
          'sin-preferencia': '',
          'restaurante': 'restaurante elegante',
          'cocina-casera': 'cocina casera acogedora',
          'terraza': 'terraza exterior',
          'buffet': 'buffet profesional',
          'estudio': 'estudio fotográfico'
        };

        const momentoDelDiaMap: Record<string, string> = {
          'sin-preferencia': '',
          'desayuno': 'desayuno matutino',
          'brunch': 'brunch de media mañana',
          'almuerzo': 'almuerzo de mediodía',
          'cena': 'cena romántica nocturna'
        };

        const estiloMap: Record<string, string> = {
          'rustico': 'rústico y casero',
          'minimalista': 'minimalista y limpio',
          'clasico-elegante': 'clásico y elegante',
          'moderno': 'moderno y vanguardista'
        };
        
        const estilo = estiloPlato ? estiloMap[estiloPlato] || estiloPlato : '';
        const ambienteText = ambiente && ambiente !== 'sin-preferencia' ? ambienteMap[ambiente] || ambiente : '';
        const momentoText = momentoDelDia && momentoDelDia !== 'sin-preferencia' ? momentoDelDiaMap[momentoDelDia] || momentoDelDia : '';
        
        const nivelGourmet = intensidadGourmet <= 3 
          ? 'presentación casera y natural' 
          : intensidadGourmet <= 7 
          ? 'presentación gourmet moderada' 
          : 'presentación de alta cocina profesional';

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

        const url = `${API_BASE_URL}/api/generate-recipe`;

        const response = await axios.post(url, {
            prompt: prompt
        });

        if (response.data && response.data.success) {
            return response.data.recipe;
        } else {
            throw new Error(response.data.error || 'Error desconocido al generar receta');
        }

    } catch (error: any) {
        console.error("Error generando receta con Gemini:", error);
        return "No se pudo generar la receta con Gemini. Verifica la conexión con el servidor o intenta más tarde.";
    }
};
