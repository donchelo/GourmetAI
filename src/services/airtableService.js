import axios from 'axios';
import { CONFIG } from '../utils/config';

/**
 * Comprime una imagen base64 reduciendo su calidad y tamaño de forma agresiva
 * @param {string} imageBase64 - Imagen en base64
 * @param {number} maxWidth - Ancho máximo (default: 800)
 * @param {number} quality - Calidad JPEG (0-1, default: 0.6)
 * @returns {Promise<string>} - Imagen comprimida en base64
 */
const compressImage = async (imageBase64, maxWidth = 800, quality = 0.6) => {
  return new Promise((resolve, reject) => {
    try {
      const originalSize = imageBase64.length;
      console.log(`📏 Tamaño original: ${(originalSize / 1024).toFixed(2)} KB`);
      
      const img = new Image();
      img.onload = () => {
        // Calcular nuevas dimensiones manteniendo aspect ratio
        let width = img.width;
        let height = img.height;
        
        // Reducir más agresivamente
        if (width > maxWidth) {
          height = (height * maxWidth) / width;
          width = maxWidth;
        }
        
        // Limitar también la altura máxima
        const maxHeight = 800;
        if (height > maxHeight) {
          width = (width * maxHeight) / height;
          height = maxHeight;
        }
        
        // Crear canvas para redimensionar
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        
        const ctx = canvas.getContext('2d');
        // Mejorar calidad de renderizado
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        ctx.drawImage(img, 0, 0, width, height);
        
        // Convertir a base64 con compresión más agresiva
        const compressedBase64 = canvas.toDataURL('image/jpeg', quality);
        const compressedSize = compressedBase64.length;
        const reduction = ((1 - compressedSize / originalSize) * 100).toFixed(1);
        console.log(`📏 Tamaño comprimido: ${(compressedSize / 1024).toFixed(2)} KB (reducción: ${reduction}%)`);
        
        resolve(compressedBase64);
      };
      
      img.onerror = (error) => {
        console.warn('⚠️ Error comprimiendo imagen, usando original:', error);
        // Si falla la compresión, usar imagen original
        resolve(imageBase64);
      };
      
      img.src = imageBase64;
    } catch (error) {
      console.warn('⚠️ Error en compresión, usando imagen original:', error);
      resolve(imageBase64);
    }
  });
};

/**
 * Guarda una generación en Airtable
 * @param {Object} generationData - Datos de la generación
 * @returns {Promise<Object>} - Registro creado en Airtable
 */
export const saveGeneration = async (generationData) => {
  try {
    // Usar ruta relativa para que funcione con el proxy de React y ngrok
    // El proxy en package.json redirige /api/* al backend (puerto 3001)
    const url = '/api/save-to-airtable';
    
    console.log('📤 Guardando en Airtable a través del proxy...');
    
    // Comprimir imágenes antes de enviar para reducir el tamaño del payload
    // Usar compresión más agresiva: 800px máximo y calidad 0.6
    let compressedData = { ...generationData };
    
    if (generationData.imagenOriginal) {
      console.log('🗜️ Comprimiendo imagen original...');
      compressedData.imagenOriginal = await compressImage(generationData.imagenOriginal, 800, 0.6);
    }
    
    if (generationData.imagenesGeneradas && generationData.imagenesGeneradas.length > 0) {
      console.log('🗜️ Comprimiendo imágenes generadas...');
      compressedData.imagenesGeneradas = await Promise.all(
        generationData.imagenesGeneradas.map(img => compressImage(img, 800, 0.6))
      );
    }
    
    // Calcular tamaño total del payload después de compresión
    const payloadSize = JSON.stringify(compressedData).length;
    const payloadSizeMB = (payloadSize / 1024 / 1024).toFixed(2);
    console.log(`📊 Tamaño total del payload comprimido: ${payloadSizeMB} MB`);
    
    // Si aún es muy grande, reducir más
    if (payloadSize > 10 * 1024 * 1024) { // Más de 10MB
      console.warn('⚠️ Payload aún muy grande, aplicando compresión adicional...');
      if (compressedData.imagenOriginal) {
        compressedData.imagenOriginal = await compressImage(compressedData.imagenOriginal, 600, 0.5);
      }
      if (compressedData.imagenesGeneradas && compressedData.imagenesGeneradas.length > 0) {
        compressedData.imagenesGeneradas = await Promise.all(
          compressedData.imagenesGeneradas.map(img => compressImage(img, 600, 0.5))
        );
      }
      const finalSize = JSON.stringify(compressedData).length;
      console.log(`📊 Tamaño final después de compresión adicional: ${(finalSize / 1024 / 1024).toFixed(2)} MB`);
    }

    // Verificar tamaño final antes de enviar
    const finalPayloadSize = JSON.stringify(compressedData).length;
    const finalPayloadSizeMB = (finalPayloadSize / 1024 / 1024).toFixed(2);
    
    if (finalPayloadSize > 10 * 1024 * 1024) {
      console.error(`❌ Payload aún demasiado grande: ${finalPayloadSizeMB} MB`);
      throw new Error(`Las imágenes son demasiado grandes (${finalPayloadSizeMB} MB). Por favor, intenta con imágenes más pequeñas o contacta al soporte.`);
    }
    
    console.log(`✅ Payload listo para enviar: ${finalPayloadSizeMB} MB`);
    
    // Enviar datos comprimidos al servidor proxy que manejará Airtable
    const response = await axios.post(
      url,
      compressedData,
      {
        headers: {
          'Content-Type': 'application/json'
        },
        timeout: CONFIG.API_TIMEOUT,
        maxContentLength: 50 * 1024 * 1024, // 50MB
        maxBodyLength: 50 * 1024 * 1024, // 50MB
        // Asegurar que axios no limite el tamaño
        validateStatus: function (status) {
          return status < 500; // Resolver para cualquier código de estado menor que 500
        }
      }
    );

    if (response.data.success) {
      console.log('✅ Guardado exitosamente en Airtable');
      return response.data.data;
    } else {
      throw new Error(response.data.error || 'Error guardando en Airtable');
    }
  } catch (error) {
    console.error('Error guardando en Airtable:', error);
    
    // Log detallado del error para debugging
    if (error.response) {
      console.error('Respuesta de error de Airtable:', {
        status: error.response.status,
        data: error.response.data,
        record: error.config?.data
      });
    }
    
    // Mensaje más específico según el tipo de error
    if (error.response?.status === 413) {
      throw new Error('Las imágenes son demasiado grandes para guardar en Airtable. Se intentó comprimirlas, pero aún son muy grandes. La generación fue exitosa, pero no se pudo guardar en el historial.');
    }
    
    if (error.response?.status === 422) {
      const errorMessage = error.response.data?.error?.message || 'Los datos enviados no son válidos para Airtable';
      throw new Error(`Error de validación en Airtable: ${errorMessage}. Verifica que los campos de la tabla coincidan con los esperados.`);
    }
    
    throw new Error('No se pudo guardar la generación en el historial. Por favor, intenta de nuevo.');
  }
};

/**
 * Obtiene el historial de generaciones desde el servidor (protege API keys)
 * @param {number} maxRecords - Número máximo de registros a obtener
 * @returns {Promise<Array>} - Array de generaciones
 */
export const getHistory = async (maxRecords = 20) => {
  try {
    // Usar el endpoint del servidor que maneja Airtable de forma segura
    const response = await axios.get('/api/history', {
      params: { maxRecords },
      timeout: CONFIG.API_TIMEOUT
    });

    if (response.data.success) {
      return response.data.records || [];
    }
    return [];
  } catch (error) {
    // Si hay un error, retornar array vacío silenciosamente
    console.warn('No se pudo cargar el historial:', error.message);
    return [];
  }
};

