// Utilidades para manejo de imágenes

/**
 * Convierte una imagen a base64
 * @param {File} file - Archivo de imagen
 * @returns {Promise<string>} - Imagen en base64
 */
export const imageToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
    reader.readAsDataURL(file);
  });
};

/**
 * Descarga una imagen (soporta data URIs y URLs normales)
 * @param {string} imageUrl - URL de la imagen (data URI o URL normal)
 * @param {string} filename - Nombre del archivo
 */
export const downloadImage = async (imageUrl, filename = 'gourmet-image.png') => {
  try {
    console.log('📥 Iniciando descarga:', filename);
    
    // Si es un data URI, convertir a Blob para mejor compatibilidad
    if (imageUrl.startsWith('data:')) {
      try {
        // Método 1: Usar fetch para convertir data URI a Blob (más confiable)
        const response = await fetch(imageUrl);
        const blob = await response.blob();
        const blobUrl = URL.createObjectURL(blob);
        
        // Crear link de descarga
        const link = document.createElement('a');
        link.href = blobUrl;
        link.download = filename;
        link.style.display = 'none';
        link.setAttribute('download', filename); // Asegurar atributo download
        
        // Agregar al DOM
        document.body.appendChild(link);
        
        // Forzar el click
        link.click();
        
        // Esperar antes de limpiar
        setTimeout(() => {
          if (document.body.contains(link)) {
            document.body.removeChild(link);
          }
          URL.revokeObjectURL(blobUrl);
          console.log('✅ Descarga completada');
        }, 200);
        
        return;
      } catch (fetchError) {
        console.warn('⚠️ Método fetch falló, intentando método alternativo:', fetchError);
        
        // Método 2: Conversión manual de base64 a Blob
        const base64Data = imageUrl.includes(',') ? imageUrl.split(',')[1] : imageUrl;
        const mimeType = imageUrl.match(/data:([^;]+)/)?.[1] || 'image/png';
        
        try {
          const byteCharacters = atob(base64Data);
          const byteNumbers = new Array(byteCharacters.length);
          for (let i = 0; i < byteCharacters.length; i++) {
            byteNumbers[i] = byteCharacters.charCodeAt(i);
          }
          const byteArray = new Uint8Array(byteNumbers);
          const blob = new Blob([byteArray], { type: mimeType });
          const blobUrl = URL.createObjectURL(blob);
          
          const link = document.createElement('a');
          link.href = blobUrl;
          link.download = filename;
          link.style.display = 'none';
          document.body.appendChild(link);
          link.click();
          
          setTimeout(() => {
            if (document.body.contains(link)) {
              document.body.removeChild(link);
            }
            URL.revokeObjectURL(blobUrl);
            console.log('✅ Descarga completada (método alternativo)');
          }, 200);
        } catch (manualError) {
          throw manualError;
        }
      }
    } else {
      // Para URLs normales, usar método directo
      const link = document.createElement('a');
      link.href = imageUrl;
      link.download = filename;
      link.target = '_blank';
      link.style.display = 'none';
      link.setAttribute('download', filename);
      
      document.body.appendChild(link);
      link.click();
      
      setTimeout(() => {
        if (document.body.contains(link)) {
          document.body.removeChild(link);
        }
        console.log('✅ Descarga completada');
      }, 200);
    }
  } catch (error) {
    console.error('❌ Error descargando imagen:', error);
    
    // Fallback: mostrar opciones al usuario
    const userChoice = window.confirm(
      'No se pudo iniciar la descarga automática. ¿Deseas abrir la imagen en una nueva pestaña para descargarla manualmente?'
    );
    
    if (userChoice) {
      try {
        window.open(imageUrl, '_blank');
      } catch (fallbackError) {
        console.error('Error en fallback:', fallbackError);
        alert('Por favor, haz clic derecho en la imagen y selecciona "Guardar imagen como..."');
      }
    }
  }
};

