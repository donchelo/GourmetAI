// Constantes para los parámetros de generación

export const ESTILOS_PLATO = [
  { value: 'rustico', label: 'Rústico' },
  { value: 'minimalista', label: 'Minimalista' },
  { value: 'clasico-elegante', label: 'Clásico Elegante' },
  { value: 'moderno', label: 'Moderno' }
];

export const ILUMINACIONES = [
  { value: 'natural', label: 'Natural' },
  { value: 'calida', label: 'Cálida' },
  { value: 'estudio', label: 'Estudio' }
];

export const FONDOS = [
  { value: 'madera', label: 'Madera' },
  { value: 'marmol', label: 'Mármol' },
  { value: 'negro', label: 'Negro' },
  { value: 'blanco', label: 'Blanco' },
  { value: 'original', label: 'Mantener Original' }
];

export const DECORACIONES_EXTRA = [
  { value: 'microgreens', label: 'Microgreens' },
  { value: 'salsas-decorativas', label: 'Salsas Decorativas' },
  { value: 'flores-comestibles', label: 'Flores Comestibles' }
];

export const ANGULOS_CAMARA = [
  { value: 'cenital', label: 'Cenital (90°)' },
  { value: '75', label: '75° (Casi cenital)' },
  { value: '45', label: '45° (Clásico)' },
  { value: '30', label: '30° (Bajo)' },
  { value: 'lateral', label: 'Lateral (0°)' },
  { value: 'hero', label: 'Hero Shot (Frontal destacado)' },
  { value: 'diagonal', label: 'Diagonal (Esquina)' },
  { value: 'picado', label: 'Picado (Desde arriba inclinado)' }
];

export const INTENSIDAD_GOURMET_MIN = 1;
export const INTENSIDAD_GOURMET_MAX = 10;
export const INTENSIDAD_GOURMET_DEFAULT = 5;

// ============================================
// NUEVOS PARÁMETROS - Categoría 1: Vajilla y Presentación
// ============================================

export const TIPOS_VAJILLA = [
  { value: 'original', label: 'Mantener Original' },
  { value: 'redondo', label: 'Plato Redondo' },
  { value: 'cuadrado', label: 'Plato Cuadrado' },
  { value: 'rectangular', label: 'Plato Rectangular' },
  { value: 'bowl', label: 'Bowl' },
  { value: 'pizarra', label: 'Pizarra' },
  { value: 'tabla-madera', label: 'Tabla de Madera' }
];

export const COLORES_VAJILLA = [
  { value: 'original', label: 'Mantener Original' },
  { value: 'blanco', label: 'Blanco Clásico' },
  { value: 'negro', label: 'Negro Mate' },
  { value: 'terracota', label: 'Terracota' },
  { value: 'crema', label: 'Crema' }
];

// ============================================
// NUEVOS PARÁMETROS - Categoría 2: Ambiente y Contexto
// ============================================

export const AMBIENTES = [
  { value: 'sin-preferencia', label: 'Sin Preferencia' },
  { value: 'restaurante', label: 'Restaurante Elegante' },
  { value: 'cocina-casera', label: 'Cocina Casera' },
  { value: 'terraza', label: 'Terraza Exterior' },
  { value: 'buffet', label: 'Buffet' },
  { value: 'estudio', label: 'Estudio Fotográfico' }
];

export const MOMENTOS_DIA = [
  { value: 'sin-preferencia', label: 'Sin Preferencia' },
  { value: 'desayuno', label: 'Desayuno' },
  { value: 'brunch', label: 'Brunch' },
  { value: 'almuerzo', label: 'Almuerzo' },
  { value: 'cena', label: 'Cena Romántica' }
];

// ============================================
// NUEVOS PARÁMETROS - Categoría 3: Técnica Fotográfica
// ============================================

export const PROFUNDIDADES_CAMPO = [
  { value: 'moderado', label: 'Moderado' },
  { value: 'bokeh-fuerte', label: 'Bokeh Fuerte (Fondo Difuso)' },
  { value: 'todo-foco', label: 'Todo en Foco' }
];

export const ASPECT_RATIOS = [
  { value: 'original', label: 'Original' },
  { value: '1:1', label: '1:1 (Instagram)' },
  { value: '4:3', label: '4:3 (Estándar)' },
  { value: '16:9', label: '16:9 (Banner)' },
  { value: '4:5', label: '4:5 (Portrait)' }
];

// ============================================
// NUEVOS PARÁMETROS - Categoría 4: Efectos Especiales
// ============================================

export const EFECTOS_VAPOR = [
  { value: 'sin-vapor', label: 'Sin Vapor' },
  { value: 'sutil', label: 'Vapor Sutil' },
  { value: 'intenso', label: 'Vapor Intenso' }
];

export const EFECTOS_FRESCURA = [
  { value: 'sin-efecto', label: 'Sin Efecto' },
  { value: 'gotas', label: 'Gotas de Agua' },
  { value: 'escarcha', label: 'Escarcha (Postres Fríos)' }
];
