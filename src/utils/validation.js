// Utilidades de validación

/**
 * Valida que una imagen tenga un formato válido
 * @param {File} file - Archivo a validar
 * @returns {Object} - { valid: boolean, error?: string }
 */
export const validateImageFile = (file) => {
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

  // Validar tamaño máximo (opcional, 10MB)
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
 * @param {Object} parameters - Parámetros a validar
 * @returns {Object} - { valid: boolean, error?: string }
 */
export const validateParameters = (parameters) => {
  const required = [
    'intensidadGourmet',
    'estiloPlato',
    'iluminacion',
    'fondo',
    'anguloCamara'
  ];

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

  return { valid: true };
};

/**
 * Valida que las variables de entorno estén configuradas
 * @returns {Object} - { valid: boolean, missing?: string[] }
 */
export const validateEnvironment = () => {
  const required = ['REACT_APP_GEMINI_API_KEY'];
  const optional = [
    'REACT_APP_AIRTABLE_API_KEY',
    'REACT_APP_AIRTABLE_BASE_ID'
  ];

  const missing = required.filter(
    key => !process.env[key] || process.env[key].trim() === ''
  );

  const missingOptional = optional.filter(
    key => !process.env[key] || process.env[key].trim() === ''
  );

  return {
    valid: missing.length === 0,
    missing,
    missingOptional,
    hasAirtable: missingOptional.length === 0
  };
};

