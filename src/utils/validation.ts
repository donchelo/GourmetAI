// Utilidades de validación
import { DishParameters } from '../types';

interface ValidationResult {
  valid: boolean;
  error?: string;
}

/**
 * Valida que una imagen tenga un formato válido
 * @param {File} file - Archivo a validar
 * @returns {ValidationResult} - { valid: boolean, error?: string }
 */
export const validateImageFile = (file: File | null): ValidationResult => {
  if (!file) {
    return { valid: false, error: 'No se seleccionó ningún archivo' };
  }

  const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
  if (!validTypes.includes(file.type)) {
    return {
      valid: false,
      error: 'Formato de imagen no válido. Use JPG, PNG o WEBP'
    };
  }

  // Validar tamaño máximo (10MB)
  const maxSize = 10 * 1024 * 1024; // 10MB
  if (file.size > maxSize) {
    return {
      valid: false,
      error: 'La imagen es demasiado grande. Máximo 10MB'
    };
  }

  return { valid: true };
};

/**
 * Valida que los parámetros estén completos
 * @param {DishParameters} parameters - Parámetros a validar
 * @returns {ValidationResult} - { valid: boolean, error?: string }
 */
export const validateParameters = (parameters: DishParameters): ValidationResult => {
  // Parámetros originales requeridos
  const required: (keyof DishParameters)[] = [
    'intensidadGourmet',
    'estiloPlato',
    'iluminacion',
    'fondo',
    'anguloCamara'
  ];

  // Parámetros nuevos opcionales (con valores por defecto)
  const optionalWithDefaults: Record<string, string> = {
    tipoVajilla: 'original',
    colorVajilla: 'original',
    ambiente: 'sin-preferencia',
    momentoDelDia: 'sin-preferencia',
    profundidadCampo: 'moderado',
    aspectRatio: '1:1',
    efectoVapor: 'sin-vapor',
    efectoFrescura: 'sin-efecto'
  };

  for (const field of required) {
    if (parameters[field] === undefined || parameters[field] === null) {
      return {
        valid: false,
        error: `Parámetro requerido faltante: ${field}`
      };
    }
  }

  // Validar rango de intensidad
  if (
    parameters.intensidadGourmet < 1 ||
    parameters.intensidadGourmet > 10
  ) {
    return {
      valid: false,
      error: 'La intensidad gourmet debe estar entre 1 y 10'
    };
  }

  // Validar valores permitidos para nuevos parámetros
  const validValues: Record<string, string[]> = {
    tipoVajilla: ['original', 'redondo', 'cuadrado', 'rectangular', 'bowl', 'pizarra', 'tabla-madera'],
    colorVajilla: ['original', 'blanco', 'negro', 'terracota', 'crema'],
    ambiente: ['sin-preferencia', 'restaurante', 'cocina-casera', 'terraza', 'buffet', 'estudio'],
    momentoDelDia: ['sin-preferencia', 'desayuno', 'brunch', 'almuerzo', 'cena'],
    profundidadCampo: ['moderado', 'bokeh-fuerte', 'todo-foco'],
    aspectRatio: ['1:1', '4:3', '16:9', '4:5', '3:2', '21:9'],
    efectoVapor: ['sin-vapor', 'sutil', 'intenso'],
    efectoFrescura: ['sin-efecto', 'gotas', 'escarcha']
  };

  for (const [field, allowedValues] of Object.entries(validValues)) {
    const value = (parameters as any)[field] || optionalWithDefaults[field];
    if (value && !allowedValues.includes(value)) {
      return {
        valid: false,
        error: `Valor inválido para ${field}: ${value}`
      };
    }
  }

  return { valid: true };
};

/**
 * Valida que las variables de entorno estén configuradas
 * @returns {Object} - { valid: boolean, missing?: string[] }
 */
export const validateEnvironment = (): { valid: boolean; missing: string[] } => {
  const required = ['REACT_APP_GEMINI_API_KEY'];

  const missing = required.filter(
    key => !process.env[key] || process.env[key]?.trim() === ''
  );

  return {
    valid: missing.length === 0,
    missing
  };
};
