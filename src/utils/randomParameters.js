// Utilidades para randomización de parámetros

import {
  ESTILOS_PLATO,
  ILUMINACIONES,
  FONDOS,
  DECORACIONES_EXTRA,
  ANGULOS_CAMARA,
  TIPOS_VAJILLA,
  COLORES_VAJILLA,
  AMBIENTES,
  MOMENTOS_DIA,
  PROFUNDIDADES_CAMPO,
  ASPECT_RATIOS,
  EFECTOS_VAPOR,
  EFECTOS_FRESCURA,
  DIRECCIONES_LUZ,
  PROPS,
  SATURACIONES,
  TEXTURAS_FONDO,
  INTENSIDAD_GOURMET_MIN,
  INTENSIDAD_GOURMET_MAX,
  INTENSIDAD_GOURMET_DEFAULT,
  TIPOS_COCINA,
  CATEGORIAS_PLATO,
  TECNICAS_COCCION,
  TAGS_CULINARIOS
} from '../constants/parameters';

/**
 * Selecciona un valor aleatorio de un array de opciones
 * @param {Array} options - Array de objetos con propiedad 'value'
 * @returns {string} - Valor seleccionado
 */
const randomFrom = (options) => {
  const index = Math.floor(Math.random() * options.length);
  return options[index].value;
};

/**
 * Selecciona múltiples valores aleatorios (para multi-select como decoraciones)
 * @param {Array} options - Array de opciones
 * @param {number} min - Mínimo de selecciones (default 0)
 * @param {number} max - Máximo de selecciones (default 2)
 * @returns {Array} - Array de valores seleccionados
 */
const randomMultipleFrom = (options, min = 0, max = 2) => {
  const count = Math.floor(Math.random() * (max - min + 1)) + min;
  const shuffled = [...options].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count).map(opt => opt.value);
};

/**
 * Genera un número aleatorio entre min y max (inclusive)
 * @param {number} min 
 * @param {number} max 
 * @returns {number}
 */
const randomInt = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

/**
 * Genera un set completo de parámetros aleatorios
 * @returns {Object} - Objeto con todos los parámetros randomizados
 */
export const generateRandomParameters = () => {
  return {
    // Control principal
    intensidadGourmet: randomInt(INTENSIDAD_GOURMET_MIN, INTENSIDAD_GOURMET_MAX),
    
    // Estilo & Ambiente
    estiloPlato: randomFrom(ESTILOS_PLATO),
    fondo: randomFrom(FONDOS),
    texturaFondo: randomFrom(TEXTURAS_FONDO),
    tipoVajilla: randomFrom(TIPOS_VAJILLA),
    colorVajilla: randomFrom(COLORES_VAJILLA),
    ambiente: randomFrom(AMBIENTES),
    
    // Cámara & Iluminación
    iluminacion: randomFrom(ILUMINACIONES),
    direccionLuz: randomFrom(DIRECCIONES_LUZ),
    anguloCamara: randomFrom(ANGULOS_CAMARA),
    profundidadCampo: randomFrom(PROFUNDIDADES_CAMPO),
    aspectRatio: randomFrom(ASPECT_RATIOS),
    imageSize: '1K',
    numberOfImages: 1,
    
    // Efectos Especiales
    momentoDelDia: randomFrom(MOMENTOS_DIA),
    efectoVapor: randomFrom(EFECTOS_VAPOR),
    efectoFrescura: randomFrom(EFECTOS_FRESCURA),
    saturacion: randomFrom(SATURACIONES),
    
    // Props y Decoración
    props: randomMultipleFrom(PROPS.filter(p => p.value !== 'ninguno'), 0, 3),
    decoracionesExtra: randomMultipleFrom(DECORACIONES_EXTRA, 0, 2),

    // Contexto Culinario (NUEVO)
    // Seleccionamos 1 aleatorio para tipos principales, pero lo devolvemos como array ya que ahora son multi-select
    cuisineType: [randomFrom(TIPOS_COCINA.filter(t => t.value !== 'sin-preferencia'))],
    dishCategory: [randomFrom(CATEGORIAS_PLATO.filter(c => c.value !== 'sin-preferencia'))],
    cookingTechnique: [randomFrom(TECNICAS_COCCION.filter(t => t.value !== 'sin-preferencia'))],
    culinaryTags: randomMultipleFrom(TAGS_CULINARIOS, 0, 3)
  };
};

/**
 * Retorna los valores por defecto para restablecer los parámetros
 * @returns {Object} - Objeto con todos los parámetros en sus valores por defecto
 */
export const getDefaultParameters = () => {
  return {
    // Control principal
    intensidadGourmet: INTENSIDAD_GOURMET_DEFAULT,
    
    // Estilo & Ambiente
    estiloPlato: 'moderno',
    fondo: 'original',
    texturaFondo: 'lisa',
    tipoVajilla: 'original',
    colorVajilla: 'original',
    ambiente: 'sin-preferencia',
    
    // Cámara & Iluminación
    iluminacion: 'natural',
    direccionLuz: 'natural',
    anguloCamara: '45',
    profundidadCampo: 'moderado',
    aspectRatio: 'original',
    imageSize: '1K',
    numberOfImages: 1,
    
    // Efectos Especiales
    momentoDelDia: 'sin-preferencia',
    efectoVapor: 'sin-vapor',
    efectoFrescura: 'sin-efecto',
    saturacion: 'normal',
    
    // Props y Decoración
    props: [],
    decoracionesExtra: [],

    // Contexto Culinario
    cuisineType: [],
    dishCategory: [],
    cookingTechnique: [],
    culinaryTags: []
  };
};
