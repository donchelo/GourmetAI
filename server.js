const express = require('express');
const cors = require('cors');
const axios = require('axios');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const FormData = require('form-data');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
// Aumentar límite de tamaño del body para manejar imágenes grandes en base64
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Middleware para logging de requests (después de express.json para tener acceso al body)
app.use((req, res, next) => {
  console.log(`📥 ${req.method} ${req.path}`);
  if (req.body && Object.keys(req.body).length > 0) {
    console.log(`   Body:`, Object.keys(req.body));
  }
  next();
});

// Endpoint para generar imágenes usando SOLO Gemini 3 Pro Image
app.post('/api/generate-image', async (req, res) => {
  try {
    console.log('📝 Recibida solicitud de generación de imagen con Gemini 3');
    const { prompt } = req.body;
    const apiKey = process.env.REACT_APP_GEMINI_API_KEY;

    if (!apiKey) {
      console.error('❌ API Key no configurada');
      return res.status(500).json({ error: 'API Key de Gemini no configurada en el servidor' });
    }

    if (!prompt) {
      console.error('❌ Prompt faltante');
      return res.status(400).json({ error: 'Prompt es requerido' });
    }

    console.log(`✅ Prompt recibido: ${prompt.substring(0, 100)}...`);

    // Usar SOLO Gemini 3 Pro Image según requerimiento
    // Este endpoint ahora solo usa gemini-3-pro-image-preview
    const genAI = new GoogleGenerativeAI(apiKey);
    
    console.log('🎨 Generando imagen con gemini-3-pro-image-preview...');
    
    const model = genAI.getGenerativeModel({ 
      model: 'gemini-3-pro-image-preview'
    });
    
    // Generar imagen con Gemini 3 Pro Image
    const result = await model.generateContent(prompt);
    const response = await result.response;
    
    // Extraer imagen de la respuesta
    let imageData = null;
    
    // Estructura estándar: candidates[0].content.parts con inlineData
    if (response.candidates && response.candidates[0]) {
      const parts = response.candidates[0].content?.parts || [];
      const imagePart = parts.find(part => part.inlineData);
      if (imagePart?.inlineData?.data) {
        imageData = imagePart.inlineData.data;
      }
    }
    
    // Alternativa: buscar en response.parts directamente
    if (!imageData && result.response?.parts) {
      const imagePart = result.response.parts.find(part => part.inlineData);
      if (imagePart?.inlineData?.data) {
        imageData = imagePart.inlineData.data;
      }
    }
    
    if (imageData) {
      console.log('✅ Imagen generada exitosamente con gemini-3-pro-image-preview');
      return res.json({
        success: true,
        image: `data:image/png;base64,${imageData}`
      });
    } else {
      console.error('❌ No se pudo extraer imagen de la respuesta');
      throw new Error('No se pudo extraer la imagen de la respuesta de Gemini 3 Pro Image');
    }

  } catch (error) {
    console.error('❌ Error generando imagen:', error);
    
    const status = error.response?.status || 500;
    let errorMessage = error.response?.data?.error?.message || error.message || 'Error desconocido';
    
    // Mensajes más amigables para errores comunes
    if (status === 404) {
      errorMessage = 'El modelo de Imagen no está disponible con tu API key. Verifica que tengas acceso a la API de Imagen de Google.';
    } else if (status === 403 || status === 401) {
      errorMessage = 'API Key inválida o sin permisos para generar imágenes. Verifica tu configuración.';
    } else if (errorMessage.includes('quota') || status === 429) {
      errorMessage = 'Límite de cuota excedido. Por favor, intenta más tarde.';
    }
    
    return res.status(status).json({
      success: false,
      error: errorMessage,
      details: process.env.NODE_ENV === 'development' ? {
        originalError: error.message,
        status: status,
        responseData: error.response?.data
      } : undefined
    });
  }
});

/**
 * Convierte una imagen base64 a Buffer y la sube a un servicio público
 * Para Airtable, necesitamos URLs públicas accesibles desde internet, no data URLs
 * Intenta usar Imgur primero (público y gratuito), si falla usa almacenamiento local
 */
const uploadImageToTempStorage = async (base64Image, filename, apiKey) => {
  try {
    // Extraer el base64 sin el prefijo data:image/...
    const base64Data = base64Image.replace(/^data:image\/\w+;base64,/, '');
    const imageBuffer = Buffer.from(base64Data, 'base64');
    
    // Intentar subir a Imgur primero (servicio público gratuito)
    // Nota: Para producción, deberías usar tu propio Client ID de Imgur
    const imgurClientId = process.env.IMGUR_CLIENT_ID || '546c25a59c58ad7'; // Client ID público (limitado)
    
    try {
      // Imgur acepta base64 directamente como string en formato form-urlencoded
      const imgurResponse = await axios.post(
        'https://api.imgur.com/3/image',
        `image=${encodeURIComponent(base64Data)}`,
        {
          headers: {
            'Authorization': `Client-ID ${imgurClientId}`,
            'Content-Type': 'application/x-www-form-urlencoded'
          },
          timeout: 15000,
          maxContentLength: Infinity,
          maxBodyLength: Infinity
        }
      );
      
      if (imgurResponse.data && imgurResponse.data.data && imgurResponse.data.data.link) {
        console.log(`✅ Imagen subida a Imgur: ${imgurResponse.data.data.link}`);
        return imgurResponse.data.data.link;
      }
    } catch (imgurError) {
      console.warn('⚠️ No se pudo subir a Imgur, usando almacenamiento local:', imgurError.message);
      if (imgurError.response) {
        console.warn('   Detalles del error de Imgur:', imgurError.response.data);
      }
      // Continuar con almacenamiento local
    }
    
    // Método alternativo: almacenamiento local (solo funciona si el servidor está expuesto públicamente)
    // Determinar la extensión del archivo basado en el tipo MIME
    let extension = 'jpg';
    if (base64Image.includes('image/png')) {
      extension = 'png';
    } else if (base64Image.includes('image/jpeg') || base64Image.includes('image/jpg')) {
      extension = 'jpg';
    } else if (base64Image.includes('image/webp')) {
      extension = 'webp';
    }
    
    // Crear carpeta de uploads si no existe
    const uploadsDir = path.join(__dirname, 'public', 'uploads');
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }
    
    // Generar nombre único para el archivo
    const uniqueFilename = `${Date.now()}_${Math.random().toString(36).substring(7)}.${extension}`;
    const filePath = path.join(uploadsDir, uniqueFilename);
    
    // Guardar el archivo
    fs.writeFileSync(filePath, imageBuffer);
    
    // Retornar URL pública que Airtable puede acceder
    // IMPORTANTE: Esta URL solo funcionará si el servidor está expuesto públicamente
    // Para desarrollo local, considera usar ngrok o un servicio similar
    const baseUrl = process.env.REACT_APP_PROXY_URL || 'http://localhost:3001';
    const publicUrl = `${baseUrl}/uploads/${uniqueFilename}`;
    
    console.log(`📁 Imagen guardada localmente: ${uniqueFilename}`);
    console.warn(`⚠️ NOTA: La URL local (${publicUrl}) solo funcionará si el servidor está expuesto públicamente.`);
    console.warn(`   Para desarrollo local, considera usar ngrok o configurar Imgur Client ID.`);
    
    return publicUrl;
  } catch (error) {
    console.error('❌ Error guardando imagen:', error);
    throw new Error(`No se pudo subir la imagen: ${error.message}`);
  }
};

// Servir archivos estáticos desde la carpeta public
app.use('/uploads', express.static(path.join(__dirname, 'public', 'uploads')));

// Endpoint para guardar en Airtable (evita problemas de CORS)
app.post('/api/save-to-airtable', async (req, res) => {
  try {
    console.log('📝 Recibida solicitud para guardar en Airtable');
    const generationData = req.body;
    const apiKey = process.env.REACT_APP_AIRTABLE_API_KEY;
    const baseId = process.env.REACT_APP_AIRTABLE_BASE_ID;
    const tableName = process.env.REACT_APP_AIRTABLE_TABLE_NAME || 'Generaciones';

    if (!apiKey || !baseId) {
      return res.status(500).json({ error: 'Configuración de Airtable incompleta en el servidor' });
    }

    if (!generationData) {
      return res.status(400).json({ error: 'Datos de generación requeridos' });
    }

    const url = `https://api.airtable.com/v0/${baseId}/${tableName}`;

    // Convertir imágenes base64 a URLs públicas antes de crear attachments
    let imagenOriginalAttachment = [];
    if (generationData.imagenOriginal) {
      console.log('📤 Subiendo imagen original a almacenamiento temporal...');
      try {
        const imageUrl = await uploadImageToTempStorage(
          generationData.imagenOriginal,
          'imagen_original.jpg',
          apiKey
        );
        imagenOriginalAttachment = [{
          url: imageUrl,
          filename: 'imagen_original.jpg'
        }];
        console.log('✅ Imagen original subida:', imageUrl);
      } catch (error) {
        console.error('❌ Error subiendo imagen original:', error);
        // Continuar sin la imagen original si falla
      }
    }

    let imagenesGeneradasAttachments = [];
    if (generationData.imagenesGeneradas && generationData.imagenesGeneradas.length > 0) {
      console.log(`📤 Subiendo ${generationData.imagenesGeneradas.length} imagen(es) generada(s)...`);
      try {
        const uploadPromises = generationData.imagenesGeneradas.map(async (img, index) => {
          const imageBase64 = typeof img === 'string' ? img : (img.url || img);
          const imageUrl = await uploadImageToTempStorage(
            imageBase64,
            `gourmet_image${index > 0 ? `_${index + 1}` : ''}.png`,
            apiKey
          );
          return {
            url: imageUrl,
            filename: `gourmet_image${index > 0 ? `_${index + 1}` : ''}.png`
          };
        });
        imagenesGeneradasAttachments = await Promise.all(uploadPromises);
        console.log(`✅ ${imagenesGeneradasAttachments.length} imagen(es) generada(s) subida(s)`);
      } catch (error) {
        console.error('❌ Error subiendo imágenes generadas:', error);
        // Continuar sin las imágenes generadas si falla
      }
    }

    // Construir record - usar solo campos que existan en Airtable
    const record = {
      fields: {}
    };

    // Campo Name (requerido) - generar nombre basado en ingredientes o usar nombre genérico
    let name = 'Generación Gourmet';
    if (generationData.ingredientesDetectados) {
      const ingredientes = generationData.ingredientesDetectados.split(',').slice(0, 3).map(i => i.trim());
      if (ingredientes.length > 0) {
        // Capitalizar primera letra de cada ingrediente
        const ingredientesCapitalizados = ingredientes.map(ing => 
          ing.charAt(0).toUpperCase() + ing.slice(1).toLowerCase()
        );
        name = ingredientesCapitalizados.join(' y ');
      }
    }
    record.fields['Name'] = name;

    // Campos básicos (usar nombres exactos de Airtable)
    if (imagenOriginalAttachment.length > 0) {
      record.fields['Imagen Original'] = imagenOriginalAttachment;
    }
    
    if (imagenesGeneradasAttachments.length > 0) {
      record.fields['Imágenes Generadas'] = imagenesGeneradasAttachments;
      // Nota: "Cantidad de Imágenes Generadas" es un campo calculado en Airtable,
      // se calcula automáticamente basándose en el número de elementos en "Imágenes Generadas"
    }
    
    if (generationData.parametros) {
      const parametrosTexto = formatParameters(generationData.parametros);
      record.fields['Parámetros'] = parametrosTexto;
      record.fields['Resumen de Parámetros'] = generateParametersSummary(generationData.parametros);
    }
    
    if (generationData.semilla) {
      record.fields['Semilla'] = generationData.semilla;
    }
    
    if (generationData.ingredientesDetectados) {
      record.fields['Ingredientes Detectados'] = generationData.ingredientesDetectados;
      record.fields['Clasificación de Ingredientes'] = classifyIngredients(generationData.ingredientesDetectados);
    }
    
    // Fecha de Generación
    const fechaGeneracion = new Date();
    const fechaFormateada = `${fechaGeneracion.getDate().toString().padStart(2, '0')}/${(fechaGeneracion.getMonth() + 1).toString().padStart(2, '0')}/${fechaGeneracion.getFullYear()}`;
    record.fields['Fecha de Generación'] = fechaFormateada;

    console.log('📤 Enviando a Airtable:', Object.keys(record.fields));
    
    // Calcular tamaño aproximado del payload para logging
    const payloadSize = JSON.stringify(record).length;
    const payloadSizeMB = (payloadSize / 1024 / 1024).toFixed(2);
    console.log(`📊 Tamaño del payload: ${payloadSizeMB} MB`);
    
    // Si el payload es muy grande, advertir
    if (payloadSize > 10 * 1024 * 1024) {
      console.warn(`⚠️ ADVERTENCIA: Payload muy grande (${payloadSizeMB} MB). Airtable puede rechazarlo.`);
    }

    const response = await axios.post(
      url,
      record,
      {
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        },
        timeout: 60000, // Aumentar timeout para payloads grandes
        maxContentLength: 50 * 1024 * 1024, // 50MB
        maxBodyLength: 50 * 1024 * 1024 // 50MB
      }
    );

    console.log('✅ Guardado exitosamente en Airtable');
    return res.json({ success: true, data: response.data });
  } catch (error) {
    console.error('❌ Error guardando en Airtable:', error);
    
    if (error.response) {
      console.error('Detalles del error:', {
        status: error.response.status,
        data: error.response.data,
        headers: error.response.headers
      });
      
      // Log detallado del error de validación
      if (error.response.status === 422) {
        const errorData = error.response.data;
        console.error('Error de validación 422:', JSON.stringify(errorData, null, 2));
        
        // Intentar extraer información más específica del error
        if (errorData.error && errorData.error.message) {
          console.error('Mensaje de error de Airtable:', errorData.error.message);
        }
        if (errorData.error && errorData.error.details) {
          console.error('Detalles del error:', errorData.error.details);
        }
      }
    }
    
    const status = error.response?.status || 500;
    let errorMessage = error.message || 'Error desconocido';
    
    // Mensajes más específicos según el tipo de error
    if (error.response?.status === 422) {
      const errorData = error.response.data;
      if (errorData.error && errorData.error.message) {
        errorMessage = `Error de validación en Airtable: ${errorData.error.message}`;
      } else {
        errorMessage = 'Error de validación en Airtable. Verifica que los campos de la tabla coincidan con los esperados.';
      }
    } else if (error.response?.status === 401 || error.response?.status === 403) {
      errorMessage = 'Error de autenticación con Airtable. Verifica tu API Key.';
    } else if (error.response?.status === 404) {
      errorMessage = 'Tabla o Base de Airtable no encontrada. Verifica la configuración.';
    } else if (error.response?.status === 413) {
      errorMessage = 'Las imágenes son demasiado grandes para Airtable.';
    }
    
    return res.status(status).json({
      success: false,
      error: errorMessage,
      details: process.env.NODE_ENV === 'development' ? {
        originalError: error.message,
        responseData: error.response?.data,
        status: status
      } : undefined
    });
  }
});

// Funciones auxiliares para formatear datos (duplicadas del cliente)
const formatParameters = (parametros) => {
  if (!parametros || typeof parametros !== 'object') return '';
  const partes = [];
  if (parametros.intensidadGourmet !== undefined) {
    partes.push(`Intensidad: ${parametros.intensidadGourmet}/10`);
  }
  if (parametros.estiloPlato) {
    const estiloMap = { 'rustico': 'Rústico', 'minimalista': 'Minimalista', 'clasico-elegante': 'Clásico Elegante', 'moderno': 'Moderno' };
    partes.push(`Estilo: ${estiloMap[parametros.estiloPlato] || parametros.estiloPlato}`);
  }
  if (parametros.iluminacion) {
    const iluminacionMap = { 'natural': 'Natural', 'calida': 'Cálida', 'estudio': 'Estudio' };
    partes.push(`Iluminación: ${iluminacionMap[parametros.iluminacion] || parametros.iluminacion}`);
  }
  if (parametros.fondo) {
    const fondoMap = { 'madera': 'Madera', 'marmol': 'Mármol', 'negro': 'Negro', 'blanco': 'Blanco', 'original': 'Original' };
    partes.push(`Fondo: ${fondoMap[parametros.fondo] || parametros.fondo}`);
  }
  if (parametros.anguloCamara) {
    const anguloMap = { 'cenital': 'Cenital (90°)', '45': '45 grados', 'lateral': 'Lateral' };
    partes.push(`Ángulo: ${anguloMap[parametros.anguloCamara] || parametros.anguloCamara}`);
  }
  if (parametros.decoracionesExtra && parametros.decoracionesExtra.length > 0) {
    partes.push(`Decoraciones: ${parametros.decoracionesExtra.join(', ')}`);
  }
  return partes.join(', ') || JSON.stringify(parametros);
};

const generateParametersSummary = (parametros) => {
  if (!parametros || typeof parametros !== 'object') return '';
  const partes = [];
  if (parametros.estiloPlato) {
    const estiloMap = { 'rustico': 'Rústico', 'minimalista': 'Minimalista', 'clasico-elegante': 'Clásico', 'moderno': 'Moderno' };
    partes.push(estiloMap[parametros.estiloPlato] || parametros.estiloPlato);
  }
  if (parametros.intensidadGourmet !== undefined) {
    const intensidad = parametros.intensidadGourmet <= 3 ? 'sutil' : parametros.intensidadGourmet <= 7 ? 'moderado' : 'extremo';
    partes.push(intensidad);
  }
  return partes.join(', ') || 'Sin parámetros';
};

const classifyIngredients = (ingredientesTexto) => {
  if (!ingredientesTexto || typeof ingredientesTexto !== 'string') return '';
  const ingredientes = ingredientesTexto.toLowerCase().split(',').map(i => i.trim());
  const categorias = [];
  const vegetales = ['tomate', 'lechuga', 'cebolla', 'pepino', 'pimiento', 'ajo', 'albahaca', 'perejil', 'espinaca', 'zanahoria'];
  const lacteos = ['queso', 'mozzarella', 'parmesano', 'mantequilla', 'leche', 'nata', 'yogur'];
  const carnes = ['pollo', 'carne', 'cerdo', 'res', 'jamón', 'bacon', 'salchicha'];
  const pescados = ['salmón', 'atún', 'pescado', 'marisco', 'camarón', 'langosta'];
  const cereales = ['arroz', 'pasta', 'pan', 'harina', 'trigo', 'avena'];
  const frutas = ['manzana', 'plátano', 'fresa', 'naranja', 'limón', 'uva'];
  const legumbres = ['judía', 'garbanzo', 'lenteja', 'frijol', 'alubia'];
  const tieneCategoria = (ingredientes, categoria) => ingredientes.some(ing => categoria.some(cat => ing.includes(cat)));
  if (tieneCategoria(ingredientes, vegetales)) categorias.push('vegetales');
  if (tieneCategoria(ingredientes, lacteos)) categorias.push('lácteos');
  if (tieneCategoria(ingredientes, carnes)) categorias.push('carne');
  if (tieneCategoria(ingredientes, pescados)) categorias.push('pescado');
  if (tieneCategoria(ingredientes, cereales)) categorias.push('cereales');
  if (tieneCategoria(ingredientes, frutas)) categorias.push('frutas');
  if (tieneCategoria(ingredientes, legumbres)) categorias.push('legumbres');
  return categorias.join(', ') || 'otros';
};

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Servidor funcionando correctamente' });
});

// Manejo de rutas no encontradas
app.use((req, res) => {
  console.error(`❌ Ruta no encontrada: ${req.method} ${req.path}`);
  res.status(404).json({ 
    error: 'Endpoint no encontrado',
    path: req.path,
    method: req.method,
    availableEndpoints: ['/api/generate-image', '/api/save-to-airtable', '/api/health']
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Servidor proxy ejecutándose en http://localhost:${PORT}`);
  console.log(`📝 Endpoint de generación: http://localhost:${PORT}/api/generate-image`);
  console.log(`💾 Endpoint de Airtable: http://localhost:${PORT}/api/save-to-airtable`);
  console.log(`🏥 Health check: http://localhost:${PORT}/api/health`);
});

