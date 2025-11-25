// Utilidades para manejar metadata en imágenes

/**
 * Crea un objeto con metadata para incrustar en imágenes
 * @param {Object} parameters - Parámetros de generación
 * @param {number} seed - Semilla de generación
 * @param {string} ingredients - Ingredientes detectados
 * @returns {Object} - Objeto con metadata
 */
export const createMetadata = (parameters, seed, ingredients) => {
  return {
    parameters,
    seed,
    ingredients,
    timestamp: new Date().toISOString(),
    app: 'GourmetAI',
    version: '1.0.0'
  };
};

/**
 * Convierte metadata a string JSON para incrustar
 * @param {Object} metadata - Objeto de metadata
 * @returns {string} - JSON string
 */
export const metadataToJSON = (metadata) => {
  return JSON.stringify(metadata, null, 2);
};

/**
 * Intenta incrustar metadata en una imagen usando EXIF
 * Nota: Esta función requiere una biblioteca externa como exif-js o piexifjs
 * Por ahora, creamos un archivo de texto separado con la metadata
 * @param {string} imageUrl - URL de la imagen
 * @param {Object} metadata - Metadata a incrustar
 * @returns {Promise<string>} - Nueva URL de imagen con metadata (o original si falla)
 */
export const embedMetadataInImage = async (imageUrl, metadata) => {
  try {
    // Por ahora, retornamos la imagen original
    // En producción, se puede usar una biblioteca como piexifjs para incrustar EXIF
    // o crear un archivo JSON separado con la metadata
    
    // Opción 1: Guardar metadata en un archivo JSON separado
    const metadataBlob = new Blob([metadataToJSON(metadata)], {
      type: 'application/json'
    });
    
    // Retornamos tanto la imagen como la metadata
    return {
      imageUrl,
      metadataUrl: URL.createObjectURL(metadataBlob),
      metadata
    };
  } catch (error) {
    console.error('Error incrustando metadata:', error);
    return {
      imageUrl,
      metadataUrl: null,
      metadata
    };
  }
};

/**
 * Descarga una imagen junto con su archivo de metadata
 * @param {string} imageUrl - URL de la imagen
 * @param {Object} metadata - Metadata a guardar
 * @param {string} baseFilename - Nombre base del archivo (sin extensión)
 */
export const downloadImageWithMetadata = async (imageUrl, metadata, baseFilename = 'gourmet-image') => {
  try {
    // Descargar imagen usando método mejorado para data URIs
    let imageBlobUrl;
    
    if (imageUrl.startsWith('data:')) {
      // Convertir data URI a Blob
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      imageBlobUrl = URL.createObjectURL(blob);
    } else {
      imageBlobUrl = imageUrl;
    }
    
    const imageLink = document.createElement('a');
    imageLink.href = imageBlobUrl;
    imageLink.download = `${baseFilename}.png`;
    imageLink.style.display = 'none';
    document.body.appendChild(imageLink);
    imageLink.click();
    document.body.removeChild(imageLink);
    
    // Limpiar blob URL si se creó
    if (imageUrl.startsWith('data:')) {
      setTimeout(() => {
        URL.revokeObjectURL(imageBlobUrl);
      }, 100);
    }

    // Descargar metadata
    const metadataBlob = new Blob([metadataToJSON(metadata)], {
      type: 'application/json'
    });
    const metadataUrl = URL.createObjectURL(metadataBlob);
    const metadataLink = document.createElement('a');
    metadataLink.href = metadataUrl;
    metadataLink.download = `${baseFilename}-metadata.json`;
    metadataLink.style.display = 'none';
    document.body.appendChild(metadataLink);
    metadataLink.click();
    document.body.removeChild(metadataLink);
    
    // Limpiar URL temporal
    setTimeout(() => {
      URL.revokeObjectURL(metadataUrl);
    }, 100);
  } catch (error) {
    console.error('Error descargando imagen con metadata:', error);
    throw error;
  }
};

