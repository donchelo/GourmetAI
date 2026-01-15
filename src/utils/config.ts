// Configuración de la aplicación

export const CONFIG = {
  // Timeout para llamadas API (en milisegundos)
  API_TIMEOUT: 60000, // 60 segundos
  
  // Tamaño máximo de imagen (en bytes)
  MAX_IMAGE_SIZE: 10 * 1024 * 1024, // 10MB
  
  // Número de imágenes a generar (1 según requerimiento)
  VARIANTS_COUNT: 1,
  
  // Resolución de imágenes generadas
  GENERATED_IMAGE_SIZE: {
    width: 1024,
    height: 1024
  }
};
