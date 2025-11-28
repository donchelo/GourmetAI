const express = require('express');
const cors = require('cors');
const axios = require('axios');
const helmet = require('helmet');
const compression = require('compression');
const rateLimit = require('express-rate-limit');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const FormData = require('form-data');
const fs = require('fs');
const path = require('path');
const { formatParameters, generateParametersSummary, classifyIngredients } = require('./utils/airtableHelpers');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;
const isProduction = process.env.NODE_ENV === 'production';

// Variable para almacenar la URL de ngrok (se puede actualizar dinámicamente)
let ngrokUrl = process.env.NGROK_URL || process.env.REACT_APP_PROXY_URL || null;

// Confiar en el proxy (necesario para rate-limit cuando se usa detrás de un proxy/ngrok)
app.set('trust proxy', 1);

// === Seguridad ===
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" },
  contentSecurityPolicy: false // Desactivar para permitir imágenes base64
}));
app.use(compression());

// Rate limiting - 100 requests por minuto por IP
const limiter = rateLimit({
  windowMs: 60 * 1000,
  max: isProduction ? 30 : 100,
  message: { error: 'Demasiadas solicitudes. Por favor, espera un momento.' },
  standardHeaders: true,
  legacyHeaders: false,
  // Validar que no hay problemas con X-Forwarded-For
  validate: { xForwardedForHeader: false }
});
app.use('/api/', limiter);

// CORS configurado
const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:3000'];
app.use(cors({
  origin: (origin, callback) => {
    // Permitir requests sin origin (como mobile apps o Postman)
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else if (!isProduction) {
      callback(null, true); // Permisivo en desarrollo
    } else {
      callback(new Error('CORS no permitido'));
    }
  },
  credentials: true
}));

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
 * Obtiene la URL de ngrok automáticamente desde la API local de ngrok
 * ngrok expone una API local en http://localhost:4040/api/tunnels
 */
const getNgrokUrl = async () => {
  // Si ya tenemos una URL configurada, usarla
  if (ngrokUrl && !ngrokUrl.includes('localhost')) {
    return ngrokUrl;
  }
  
  // Intentar obtener la URL automáticamente desde la API de ngrok
  try {
    const ngrokApiResponse = await axios.get('http://localhost:4040/api/tunnels', {
      timeout: 2000
    });
    
    if (ngrokApiResponse.data && ngrokApiResponse.data.tunnels && ngrokApiResponse.data.tunnels.length > 0) {
      // Buscar el túnel HTTPS (preferido) o HTTP
      const httpsTunnel = ngrokApiResponse.data.tunnels.find(t => t.proto === 'https');
      const tunnel = httpsTunnel || ngrokApiResponse.data.tunnels[0];
      
      if (tunnel && tunnel.public_url) {
        ngrokUrl = tunnel.public_url;
        console.log(`✅ URL de ngrok detectada automáticamente: ${ngrokUrl}`);
        return ngrokUrl;
      }
    }
  } catch (error) {
    // Si ngrok no está corriendo o no está disponible, continuar con la URL configurada
    // No mostrar error aquí, solo intentar usar la URL de variables de entorno
  }
  
  // Si no se pudo obtener automáticamente, usar la URL de las variables de entorno
  const envUrl = process.env.NGROK_URL || process.env.REACT_APP_PROXY_URL;
  if (envUrl && !envUrl.includes('localhost')) {
    ngrokUrl = envUrl;
    return ngrokUrl;
  }
  
  return null;
};

/**
 * Convierte una imagen base64 a Buffer y la guarda localmente
 * Usa ngrok para exponer el servidor públicamente y crear URLs accesibles para Airtable
 */
const uploadImageToTempStorage = async (base64Image, filename, apiKey) => {
  try {
    // Obtener la URL de ngrok (automáticamente o desde variables de entorno)
    const currentNgrokUrl = await getNgrokUrl();
    
    if (!currentNgrokUrl || currentNgrokUrl.includes('localhost')) {
      if (process.env.VERCEL) {
        console.warn('⚠️ En entorno Vercel: La subida de imágenes a Airtable no está soportada actualmente (requiere almacenamiento persistente y URL pública).');
        throw new Error('Subida de imágenes no disponible en Vercel (requiere almacenamiento externo).');
      }
      console.error('❌ ERROR: No se encontró URL de ngrok válida.');
      console.error('   Opciones para solucionarlo:');
      console.error('   1. Ejecuta ngrok: ngrok http 3000');
      console.error('   2. O configura NGROK_URL en tu archivo .env');
      console.error('   3. O actualiza la URL usando: POST /api/update-ngrok-url con {"url": "https://tu-url.ngrok.io"}');
      throw new Error('NGROK_URL no disponible. Por favor, ejecuta ngrok o configura NGROK_URL en tu archivo .env');
    }
    
    // Extraer el base64 sin el prefijo data:image/...
    const base64Data = base64Image.replace(/^data:image\/\w+;base64,/, '');
    const imageBuffer = Buffer.from(base64Data, 'base64');
    
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
    
    // Construir URL pública usando ngrok
    const publicUrl = `${currentNgrokUrl.replace(/\/$/, '')}/uploads/${uniqueFilename}`;
    
    console.log(`📁 Imagen guardada localmente: ${uniqueFilename}`);
    console.log(`🌐 URL pública (ngrok): ${publicUrl}`);
    
    return publicUrl;
  } catch (error) {
    console.error('❌ Error guardando imagen:', error);
    throw new Error(`No se pudo guardar la imagen: ${error.message}`);
  }
};

// Servir archivos estáticos desde la carpeta public
app.use('/uploads', express.static(path.join(__dirname, 'public', 'uploads')));

// Endpoint para actualizar la URL de ngrok dinámicamente (útil cuando cambia)
app.post('/api/update-ngrok-url', (req, res) => {
  const { url } = req.body;
  
  if (!url || typeof url !== 'string') {
    return res.status(400).json({ 
      success: false, 
      error: 'URL requerida en el body: { "url": "https://tu-url.ngrok.io" }' 
    });
  }
  
  if (!url.startsWith('http')) {
    return res.status(400).json({ 
      success: false, 
      error: 'La URL debe comenzar con http:// o https://' 
    });
  }
  
  ngrokUrl = url.replace(/\/$/, ''); // Remover trailing slash
  console.log(`✅ URL de ngrok actualizada: ${ngrokUrl}`);
  
  return res.json({ 
    success: true, 
    message: 'URL de ngrok actualizada correctamente',
    url: ngrokUrl 
  });
});

// Endpoint para obtener la URL de ngrok actual
app.get('/api/ngrok-url', async (req, res) => {
  try {
    const currentUrl = await getNgrokUrl();
    return res.json({ 
      success: true, 
      url: currentUrl,
      source: currentUrl === ngrokUrl ? 'cached' : 'auto-detected'
    });
  } catch (error) {
    return res.json({ 
      success: false, 
      url: null,
      error: error.message 
    });
  }
});

// Endpoint para guardar en Airtable (evita problemas de CORS)
app.post('/api/save-to-airtable', async (req, res) => {
  let record = null; // Declarar fuera del try para acceso en catch
  
  try {
    console.log('📝 Recibida solicitud para guardar en Airtable');
    const generationData = req.body;
    const apiKey = process.env.AIRTABLE_API_KEY || process.env.REACT_APP_AIRTABLE_API_KEY;
    const baseId = process.env.AIRTABLE_BASE_ID || process.env.REACT_APP_AIRTABLE_BASE_ID;
    const tableName = process.env.AIRTABLE_TABLE_NAME || process.env.REACT_APP_AIRTABLE_TABLE_NAME || 'Generaciones';

    if (!apiKey || !baseId) {
      return res.status(500).json({ error: 'Configuración de Airtable incompleta en el servidor' });
    }

    if (!generationData) {
      return res.status(400).json({ error: 'Datos de generación requeridos' });
    }

    const url = `https://api.airtable.com/v0/${baseId}/${tableName}`;

    // Convertir imágenes base64 a URLs públicas para Airtable
    // Airtable requiere URLs HTTP/HTTPS públicas, no data URLs
    let imagenOriginalAttachment = [];
    if (generationData.imagenOriginal) {
      console.log('📤 Guardando imagen original localmente para ngrok...');
      try {
        const imageUrl = await uploadImageToTempStorage(
          generationData.imagenOriginal,
          'imagen_original.jpg',
          apiKey
        );
        
        if (imageUrl && imageUrl.startsWith('http')) {
          imagenOriginalAttachment = [{
            url: imageUrl,
            filename: 'imagen_original.jpg'
          }];
          console.log('✅ Imagen original guardada y disponible vía ngrok:', imageUrl);
        } else {
          console.warn('⚠️ URL de imagen original no es válida:', imageUrl);
        }
      } catch (error) {
        console.error('❌ Error guardando imagen original:', error.message);
        console.warn('⚠️ Continuando sin imagen original. Las imágenes no se guardarán en Airtable.');
        console.warn('   Para solucionarlo, asegúrate de que ngrok esté corriendo y configura NGROK_URL en tu archivo .env');
        // Continuar sin la imagen original si falla
      }
    }

    let imagenesGeneradasAttachments = [];
    if (generationData.imagenesGeneradas && generationData.imagenesGeneradas.length > 0) {
      console.log(`📤 Guardando ${generationData.imagenesGeneradas.length} imagen(es) generada(s) localmente para ngrok...`);
      try {
        const uploadPromises = generationData.imagenesGeneradas.map(async (img, index) => {
          try {
            const imageBase64 = typeof img === 'string' ? img : (img.url || img);
            const imageUrl = await uploadImageToTempStorage(
              imageBase64,
              `gourmet_image${index > 0 ? `_${index + 1}` : ''}.png`,
              apiKey
            );
            
            if (imageUrl && imageUrl.startsWith('http')) {
              return {
                url: imageUrl,
                filename: `gourmet_image${index > 0 ? `_${index + 1}` : ''}.png`
              };
            } else {
              console.warn(`⚠️ URL de imagen ${index + 1} no es válida:`, imageUrl);
              return null;
            }
          } catch (imgError) {
            console.warn(`⚠️ Error guardando imagen ${index + 1}:`, imgError.message);
            return null;
          }
        });
        
        const results = await Promise.all(uploadPromises);
        imagenesGeneradasAttachments = results.filter(item => item !== null);
        
        if (imagenesGeneradasAttachments.length > 0) {
          console.log(`✅ ${imagenesGeneradasAttachments.length} de ${generationData.imagenesGeneradas.length} imagen(es) guardada(s) y disponible(s) vía ngrok`);
        } else {
          console.warn('⚠️ No se pudo guardar ninguna imagen generada. Las imágenes no se guardarán en Airtable.');
          console.warn('   Para solucionarlo, asegúrate de que ngrok esté corriendo y configura NGROK_URL en tu archivo .env');
        }
      } catch (error) {
        console.error('❌ Error guardando imágenes generadas:', error.message);
        console.warn('⚠️ Continuando sin imágenes generadas. Las imágenes no se guardarán en Airtable.');
        console.warn('   Para solucionarlo, asegúrate de que ngrok esté corriendo y configura NGROK_URL en tu archivo .env');
        // Continuar sin las imágenes generadas si falla
      }
    }

    // Construir record - usar solo campos que existan en Airtable
    record = {
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
    
    // Campo Parámetros (Long text)
    if (generationData.parametros) {
      const parametrosTexto = formatParameters(generationData.parametros);
      record.fields['Parámetros'] = parametrosTexto;
    }
    
    // Campo Semilla (Number)
    if (generationData.semilla) {
      record.fields['Semilla'] = generationData.semilla;
    }
    
    // Campo Ingredientes Detectados (Long text)
    if (generationData.ingredientesDetectados) {
      record.fields['Ingredientes Detectados'] = generationData.ingredientesDetectados;
    }

    console.log('📤 Enviando a Airtable:', Object.keys(record.fields));
    
    // Log detallado de campos críticos antes de enviar
    console.log('📋 Campos a enviar:');
    Object.keys(record.fields).forEach(key => {
      const value = record.fields[key];
      if (typeof value === 'string') {
        console.log(`  - ${key}: "${value}" (${value.length} caracteres)`);
      } else if (Array.isArray(value)) {
        console.log(`  - ${key}: [${value.length} elementos]`);
      } else {
        console.log(`  - ${key}: ${typeof value}`);
      }
    });
    
    // Validación de campos antes de enviar
    // Asegurar que todos los campos requeridos estén presentes
    if (!record.fields['Name']) {
      record.fields['Name'] = 'Generación Gourmet';
    }
    
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
      console.error('❌ Error 422 - Detalles completos:', JSON.stringify(errorData, null, 2));
      
      // Intentar extraer información específica del campo problemático
      if (errorData.error && errorData.error.message) {
        const message = errorData.error.message;
        console.error(`❌ Mensaje de error de Airtable: ${message}`);
        
        // Loggear información sobre campos problemáticos
        if (message.includes('cannot accept')) {
          console.error(`❌ Campo rechazado por Airtable. Verifica que el campo exista y sea del tipo correcto.`);
          console.error(`❌ Campos enviados: ${Object.keys(record?.fields || {}).join(', ')}`);
        }
        
        errorMessage = `Error de validación en Airtable: ${message}`;
      } else {
        errorMessage = 'Error de validación en Airtable. Verifica que los campos de la tabla coincidan con los esperados.';
      }
      
      // Loggear el record completo para debugging
      if (record && record.fields) {
        console.error('❌ Record que causó el error:', JSON.stringify(record, null, 2));
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

// Endpoint para obtener historial de Airtable (protege las API keys del cliente)
app.get('/api/history', async (req, res) => {
  try {
    const apiKey = process.env.AIRTABLE_API_KEY || process.env.REACT_APP_AIRTABLE_API_KEY;
    const baseId = process.env.AIRTABLE_BASE_ID || process.env.REACT_APP_AIRTABLE_BASE_ID;
    const tableName = process.env.AIRTABLE_TABLE_NAME || process.env.REACT_APP_AIRTABLE_TABLE_NAME || 'Generaciones';
    const maxRecords = parseInt(req.query.maxRecords) || 20;

    if (!apiKey || !baseId) {
      return res.json({ success: true, records: [], message: 'Airtable no configurado' });
    }

    const url = `https://api.airtable.com/v0/${baseId}/${tableName}`;
    const response = await axios.get(url, {
      headers: { 'Authorization': `Bearer ${apiKey}` },
      params: { maxRecords },
      timeout: 30000
    });

    const records = response.data.records || [];
    // Ordenar por fecha de creación descendente
    records.sort((a, b) => new Date(b.createdTime) - new Date(a.createdTime));

    return res.json({ success: true, records });
  } catch (error) {
    console.error('❌ Error obteniendo historial:', error.message);
    return res.json({ success: true, records: [], error: error.message });
  }
});

// Health check
app.get('/api/health', (req, res) => {
  const hasGemini = !!(process.env.REACT_APP_GEMINI_API_KEY);
  const hasAirtable = !!(process.env.AIRTABLE_API_KEY || process.env.REACT_APP_AIRTABLE_API_KEY);
  res.json({ 
    status: 'ok', 
    message: 'Servidor funcionando correctamente',
    env: process.env.NODE_ENV || 'development',
    services: { gemini: hasGemini, airtable: hasAirtable }
  });
});

// Manejo de rutas no encontradas
app.use((req, res) => {
  console.error(`❌ Ruta no encontrada: ${req.method} ${req.path}`);
  res.status(404).json({ 
    error: 'Endpoint no encontrado',
    path: req.path,
    method: req.method,
    availableEndpoints: ['/api/generate-image', '/api/save-to-airtable', '/api/history', '/api/health']
  });
});


// Exportar app para Vercel
module.exports = app;

// Solo escuchar si se ejecuta directamente (no importado como módulo)
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`🚀 Servidor proxy ejecutándose en http://localhost:${PORT}`);
    console.log(`📝 Endpoint de generación: http://localhost:${PORT}/api/generate-image`);
    console.log(`💾 Endpoint de Airtable: http://localhost:${PORT}/api/save-to-airtable`);
    console.log(`🏥 Health check: http://localhost:${PORT}/api/health`);
  });
}

