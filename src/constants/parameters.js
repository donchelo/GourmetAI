// Constantes para los parámetros de generación

export const ESTILOS_PLATO = [
  { value: 'rustico', label: 'Rústico' },
  { value: 'minimalista', label: 'Minimalista' },
  { value: 'clasico-elegante', label: 'Clásico Elegante' },
  { value: 'moderno', label: 'Moderno' }
];

// Iluminación expandida con nuevas opciones
export const ILUMINACIONES = [
  { value: 'natural', label: 'Natural' },
  { value: 'calida', label: 'Cálida' },
  { value: 'estudio', label: 'Estudio' },
  { value: 'dramatica', label: 'Dramática' },
  { value: 'suave', label: 'Suave/Difusa' }
];

// Fondos expandidos con nuevas opciones
export const FONDOS = [
  { value: 'madera', label: 'Madera' },
  { value: 'marmol', label: 'Mármol' },
  { value: 'negro', label: 'Negro' },
  { value: 'blanco', label: 'Blanco' },
  { value: 'granito', label: 'Granito' },
  { value: 'concreto', label: 'Concreto' },
  { value: 'tela', label: 'Tela/Lino' },
  { value: 'original', label: 'Elegante (auto)' }
];

// Decoraciones extra expandidas
export const DECORACIONES_EXTRA = [
  { value: 'microgreens', label: 'Microgreens' },
  { value: 'salsas-decorativas', label: 'Salsas Decorativas' },
  { value: 'flores-comestibles', label: 'Flores Comestibles' },
  { value: 'especias', label: 'Especias Esparcidas' },
  { value: 'drizzle', label: 'Drizzle de Aceite' },
  { value: 'citricos', label: 'Ralladura de Cítricos' }
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
// Categoría 1: Vajilla y Presentación
// ============================================

export const TIPOS_VAJILLA = [
  { value: 'original', label: 'Elegante (auto)' },
  { value: 'redondo', label: 'Plato Redondo' },
  { value: 'cuadrado', label: 'Plato Cuadrado' },
  { value: 'rectangular', label: 'Plato Rectangular' },
  { value: 'bowl', label: 'Bowl' },
  { value: 'pizarra', label: 'Pizarra' },
  { value: 'tabla-madera', label: 'Tabla de Madera' }
];

export const COLORES_VAJILLA = [
  { value: 'original', label: 'Neutro (auto)' },
  { value: 'blanco', label: 'Blanco Clásico' },
  { value: 'negro', label: 'Negro Mate' },
  { value: 'terracota', label: 'Terracota' },
  { value: 'crema', label: 'Crema' }
];

// ============================================
// Categoría 2: Ambiente y Contexto
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
// Categoría 3: Técnica Fotográfica
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

export const IMAGE_SIZES = [
  { value: '1K', label: '1K (Estándar)' },
  { value: '2K', label: '2K (Alta Calidad)' },
  { value: '4K', label: '4K (Ultra HD)' }
];

export const NUMBER_OF_IMAGES = [
  { value: 1, label: '1 Imagen' },
  { value: 2, label: '2 Imágenes' },
  { value: 3, label: '3 Imágenes' },
  { value: 4, label: '4 Imágenes' }
];

// NUEVO: Dirección de luz
export const DIRECCIONES_LUZ = [
  { value: 'natural', label: 'Natural (ventana)' },
  { value: 'frontal', label: 'Frontal' },
  { value: 'lateral', label: 'Lateral (resalta texturas)' },
  { value: 'backlight', label: 'Retroiluminación' },
  { value: 'cenital', label: 'Cenital (desde arriba)' }
];

// ============================================
// Categoría 4: Efectos Especiales
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

// NUEVO: Saturación de colores
export const SATURACIONES = [
  { value: 'normal', label: 'Normal' },
  { value: 'bajo', label: 'Desaturado (suave)' },
  { value: 'vibrante', label: 'Vibrante (vivo)' }
];

// ============================================
// Categoría 5: Props y Decoración de Escena
// ============================================

// NUEVO: Props/Accesorios
export const PROPS = [
  { value: 'ninguno', label: 'Sin props' },
  { value: 'cubiertos', label: 'Cubiertos elegantes' },
  { value: 'servilleta', label: 'Servilleta de tela' },
  { value: 'copa', label: 'Copa de vino' },
  { value: 'ingredientes', label: 'Ingredientes crudos de fondo' },
  { value: 'hierbas', label: 'Hierbas frescas' }
];

// NUEVO: Textura de fondo
export const TEXTURAS_FONDO = [
  { value: 'lisa', label: 'Lisa' },
  { value: 'rustica', label: 'Rústica' },
  { value: 'desgastada', label: 'Vintage/Desgastada' },
  { value: 'pulida', label: 'Pulida/Brillante' }
];

// ============================================
// NUEVO: Parámetros Culinarios
// ============================================

export const TIPOS_COCINA = [
  { value: 'sin-preferencia', label: 'Sin Preferencia' },
  { value: 'italiana', label: 'Italiana' },
  { value: 'francesa', label: 'Francesa' },
  { value: 'mexicana', label: 'Mexicana' },
  { value: 'japonesa', label: 'Japonesa' },
  { value: 'china', label: 'China' },
  { value: 'española', label: 'Española' },
  { value: 'peruana', label: 'Peruana' },
  { value: 'india', label: 'India' },
  { value: 'mediterranea', label: 'Mediterránea' },
  { value: 'fusion', label: 'Fusión' },
  { value: 'americana', label: 'Americana' },
  { value: 'arabe', label: 'Árabe' },
  { value: 'tailandesa', label: 'Tailandesa' }
];

export const CATEGORIAS_PLATO = [
  { value: 'sin-preferencia', label: 'Sin Preferencia' },
  { value: 'entrada', label: 'Entrada / Aperitivo' },
  { value: 'plato-fuerte', label: 'Plato Fuerte' },
  { value: 'postre', label: 'Postre' },
  { value: 'desayuno', label: 'Desayuno' },
  { value: 'bebida', label: 'Bebida / Coctel' },
  { value: 'ensalada', label: 'Ensalada' },
  { value: 'sopa', label: 'Sopa / Crema' },
  { value: 'sandwich', label: 'Sándwich / Burger' },
  { value: 'pasta', label: 'Pasta' },
  { value: 'pizza', label: 'Pizza' }
];

export const TECNICAS_COCCION = [
  { value: 'sin-preferencia', label: 'Sin Preferencia' },
  { value: 'parrilla', label: 'A la Parrilla / Grill' },
  { value: 'horno', label: 'Al Horno' },
  { value: 'sarten', label: 'Salteado / Sartén' },
  { value: 'frito', label: 'Frito' },
  { value: 'crudo', label: 'Crudo / Fresco' },
  { value: 'vapor', label: 'Al Vapor' },
  { value: 'sous-vide', label: 'Sous-vide' },
  { value: 'ahumado', label: 'Ahumado' },
  { value: 'estofado', label: 'Estofado' }
];

export const TAGS_CULINARIOS = [
  { value: 'picante', label: 'Picante' },
  { value: 'vegano', label: 'Vegano' },
  { value: 'vegetariano', label: 'Vegetariano' },
  { value: 'sin-gluten', label: 'Sin Gluten' },
  { value: 'gourmet', label: 'Gourmet' },
  { value: 'callejero', label: 'Street Food' },
  { value: 'saludable', label: 'Saludable' },
  { value: 'dulce', label: 'Dulce' },
  { value: 'salado', label: 'Salado' },
  { value: 'agridulce', label: 'Agridulce' },
  { value: 'crujiente', label: 'Crujiente' },
  { value: 'cremoso', label: 'Cremoso' }
];
