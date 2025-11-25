// Funciones auxiliares compartidas para formatear datos de Airtable (CommonJS)

/**
 * Formatea los parámetros como texto legible
 * @param {Object} parametros - Parámetros de generación
 * @returns {string} - Texto formateado
 */
const formatParameters = (parametros) => {
  if (!parametros || typeof parametros !== 'object') {
    return '';
  }
  
  const partes = [];
  
  if (parametros.intensidadGourmet !== undefined) {
    partes.push(`Intensidad: ${parametros.intensidadGourmet}/10`);
  }
  
  if (parametros.estiloPlato) {
    const estiloMap = {
      'rustico': 'Rústico',
      'minimalista': 'Minimalista',
      'clasico-elegante': 'Clásico Elegante',
      'moderno': 'Moderno'
    };
    partes.push(`Estilo: ${estiloMap[parametros.estiloPlato] || parametros.estiloPlato}`);
  }
  
  if (parametros.iluminacion) {
    const iluminacionMap = {
      'natural': 'Natural',
      'calida': 'Cálida',
      'estudio': 'Estudio'
    };
    partes.push(`Iluminación: ${iluminacionMap[parametros.iluminacion] || parametros.iluminacion}`);
  }
  
  if (parametros.fondo) {
    const fondoMap = {
      'madera': 'Madera',
      'marmol': 'Mármol',
      'negro': 'Negro',
      'blanco': 'Blanco',
      'original': 'Original'
    };
    partes.push(`Fondo: ${fondoMap[parametros.fondo] || parametros.fondo}`);
  }
  
  if (parametros.anguloCamara) {
    const anguloMap = {
      'cenital': 'Cenital (90°)',
      '45': '45 grados',
      'lateral': 'Lateral'
    };
    partes.push(`Ángulo: ${anguloMap[parametros.anguloCamara] || parametros.anguloCamara}`);
  }
  
  if (parametros.decoracionesExtra && parametros.decoracionesExtra.length > 0) {
    partes.push(`Decoraciones: ${parametros.decoracionesExtra.join(', ')}`);
  }
  
  return partes.join(', ') || JSON.stringify(parametros);
};

/**
 * Sanitiza un string para Airtable removiendo caracteres problemáticos
 * @param {string} str - String a sanitizar
 * @returns {string} - String sanitizado
 */
const sanitizeForAirtable = (str) => {
  if (!str || typeof str !== 'string') {
    return '';
  }
  
  // Remover caracteres de control y normalizar espacios
  return str
    .replace(/[\x00-\x1F\x7F]/g, '') // Remover caracteres de control
    .replace(/\s+/g, ' ') // Normalizar espacios múltiples
    .trim();
};

/**
 * Genera un resumen corto de los parámetros
 * Limitado a 200 caracteres para cumplir con Single line text de Airtable (255 max)
 * Usa valores sin acentos para evitar problemas de encoding
 * @param {Object} parametros - Parámetros de generación
 * @returns {string} - Resumen corto (máximo 200 caracteres)
 */
const generateParametersSummary = (parametros) => {
  if (!parametros || typeof parametros !== 'object') {
    return 'Sin parametros';
  }
  
  const partes = [];
  
  // Mapeo de estilos (sin acentos para evitar problemas)
  if (parametros.estiloPlato) {
    const estiloMap = {
      'rustico': 'Rustico',
      'minimalista': 'Minimalista',
      'clasico-elegante': 'Clasico',
      'moderno': 'Moderno'
    };
    const estilo = estiloMap[parametros.estiloPlato] || parametros.estiloPlato;
    if (estilo) {
      partes.push(estilo);
    }
  }
  
  // Intensidad gourmet
  if (parametros.intensidadGourmet !== undefined) {
    const intensidad = parametros.intensidadGourmet <= 3 ? 'sutil' : 
                      parametros.intensidadGourmet <= 7 ? 'moderado' : 'extremo';
    partes.push(intensidad);
  }
  
  // Generar resumen
  let resumen = partes.join(', ') || 'Sin parametros';
  
  // Sanitizar el resumen
  resumen = sanitizeForAirtable(resumen);
  
  // Limitar a 200 caracteres para estar seguro del límite de Single line text (255)
  if (resumen.length > 200) {
    resumen = resumen.substring(0, 197) + '...';
  }
  
  // Asegurar que no sea null o undefined y tenga al menos un valor válido
  if (!resumen || resumen.length === 0) {
    resumen = 'Sin parametros';
  }
  
  return resumen;
};

/**
 * Clasifica ingredientes por categorías
 * @param {string} ingredientesTexto - Texto con ingredientes separados por comas
 * @returns {string} - Categorías separadas por comas
 */
const classifyIngredients = (ingredientesTexto) => {
  if (!ingredientesTexto || typeof ingredientesTexto !== 'string') {
    return '';
  }
  
  const ingredientes = ingredientesTexto.toLowerCase().split(',').map(i => i.trim());
  const categorias = [];
  
  // Categorías comunes
  const vegetales = ['tomate', 'lechuga', 'cebolla', 'pepino', 'pimiento', 'ajo', 'albahaca', 'perejil', 'espinaca', 'zanahoria'];
  const lacteos = ['queso', 'mozzarella', 'parmesano', 'mantequilla', 'leche', 'nata', 'yogur'];
  const carnes = ['pollo', 'carne', 'cerdo', 'res', 'jamón', 'bacon', 'salchicha'];
  const pescados = ['salmón', 'atún', 'pescado', 'marisco', 'camarón', 'langosta'];
  const cereales = ['arroz', 'pasta', 'pan', 'harina', 'trigo', 'avena'];
  const frutas = ['manzana', 'plátano', 'fresa', 'naranja', 'limón', 'uva'];
  const legumbres = ['judía', 'garbanzo', 'lenteja', 'frijol', 'alubia'];
  
  const tieneCategoria = (ingredientes, categoria) => {
    return ingredientes.some(ing => categoria.some(cat => ing.includes(cat)));
  };
  
  if (tieneCategoria(ingredientes, vegetales)) categorias.push('vegetales');
  if (tieneCategoria(ingredientes, lacteos)) categorias.push('lácteos');
  if (tieneCategoria(ingredientes, carnes)) categorias.push('carne');
  if (tieneCategoria(ingredientes, pescados)) categorias.push('pescado');
  if (tieneCategoria(ingredientes, cereales)) categorias.push('cereales');
  if (tieneCategoria(ingredientes, frutas)) categorias.push('frutas');
  if (tieneCategoria(ingredientes, legumbres)) categorias.push('legumbres');
  
  return categorias.join(', ') || 'otros';
};

module.exports = {
  formatParameters,
  generateParametersSummary,
  classifyIngredients
};

