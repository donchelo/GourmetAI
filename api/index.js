const express = require('express');
const cors = require('cors');
const axios = require('axios');
const helmet = require('helmet');
const compression = require('compression');
const rateLimit = require('express-rate-limit');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const Anthropic = require('@anthropic-ai/sdk');
const FormData = require('form-data');
require('dotenv').config();

const app = express();
const PORT = process.env.SERVER_PORT || 3001;
const isProduction = process.env.NODE_ENV === 'production';

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

// Endpoint para generar recetas usando Claude (Anthropic)
app.post('/api/generate-recipe-claude', async (req, res) => {
    try {
        console.log('📝 Recibida solicitud de generación de receta con Claude');
        const { prompt } = req.body;
        
        // Leer la API key - verificar tanto REACT_APP_ANTHROPIC_API_KEY como ANTHROPIC_API_KEY
        const apiKey = process.env.REACT_APP_ANTHROPIC_API_KEY || process.env.ANTHROPIC_API_KEY;

        if (!apiKey) {
            console.error('❌ API Key de Anthropic no configurada');
            console.error('Variables de entorno disponibles:', Object.keys(process.env).filter(k => k.includes('ANTHROPIC')));
            return res.status(500).json({ error: 'API Key de Anthropic no configurada en el servidor. Verifica que REACT_APP_ANTHROPIC_API_KEY esté en tu archivo .env' });
        }

        // Validar formato básico de la API key (debe empezar con sk-ant-)
        if (!apiKey.startsWith('sk-ant-')) {
            console.error('❌ Formato de API Key inválido. Debe empezar con "sk-ant-"');
            return res.status(500).json({ error: 'Formato de API Key inválido. La API key de Anthropic debe empezar con "sk-ant-"' });
        }

        if (!prompt) {
            return res.status(400).json({ error: 'Prompt es requerido' });
        }

        console.log('✅ API Key encontrada, inicializando cliente de Anthropic...');
        const anthropic = new Anthropic({
            apiKey: apiKey,
            timeout: 60000, // 60 segundos de timeout para Vercel
        });

        // Usar Claude Haiku 4.5 - el modelo más rápido y eficiente
        // Opciones disponibles: claude-haiku-4-5, claude-3-5-haiku-latest, claude-3-5-haiku-20241022
        // Nota: Si usas AWS Bedrock, el formato sería anthropic.claude-haiku-4-5-20251001-v1:0
        const modelName = process.env.CLAUDE_MODEL || "claude-haiku-4-5";
        console.log(`📤 Enviando solicitud a Claude con modelo ${modelName}...`);
        const msg = await anthropic.messages.create({
            model: modelName,
            max_tokens: 8192, // Límite suficiente para recetas detalladas completas
            messages: [{ role: "user", content: prompt }],
        });

        // Validar que la respuesta tenga contenido
        if (!msg || !msg.content || !Array.isArray(msg.content) || msg.content.length === 0) {
            console.error('❌ Respuesta de Claude sin contenido válido:', msg);
            throw new Error('La respuesta de Claude no contiene contenido válido');
        }

        const text = msg.content[0].text;
        if (!text || typeof text !== 'string') {
            console.error('❌ El texto de la receta no es válido:', text);
            throw new Error('La receta generada no tiene un formato válido');
        }

        // Verificar si la respuesta se cortó por límite de tokens
        const stopReason = msg.stop_reason || msg.content[0]?.stop_reason;
        let finalText = text;
        
        if (stopReason === 'max_tokens') {
            console.warn('⚠️ ADVERTENCIA: La receta se cortó por alcanzar el límite de tokens');
            console.warn('   Tokens usados:', msg.usage?.output_tokens, 'de', 8192);
            // Agregar nota al final del texto para informar al usuario
            finalText = text + '\n\n*[Nota: Esta receta puede estar incompleta debido al límite de tokens]*';
        } else {
            console.log('✅ Receta generada completamente (stop_reason:', stopReason || 'end_turn', ')');
        }

        console.log('✅ Receta generada exitosamente (longitud:', finalText.length, 'caracteres)');
        console.log('   Tokens usados:', msg.usage?.output_tokens || 'N/A', 'de 8192');
        
        return res.json({ success: true, recipe: finalText });

    } catch (error) {
        console.error('❌ Error generando receta con Claude:', error);
        console.error('❌ Detalles del error:', {
            message: error.message,
            status: error.status,
            statusCode: error.statusCode,
            code: error.code,
            response: error.response?.data,
            stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
        });
        
        // Mensajes de error más específicos
        let errorMessage = error.message || 'Error generando receta con Claude';
        let statusCode = 500;
        
        // Manejo de errores específicos de Anthropic
        if (error.status === 401 || error.statusCode === 401 || 
            error.message?.includes('authentication') || 
            error.message?.includes('invalid x-api-key') ||
            error.message?.includes('401')) {
            errorMessage = 'API Key de Anthropic inválida. Por favor, verifica que tu API key sea correcta y esté configurada en Vercel como ANTHROPIC_API_KEY o REACT_APP_ANTHROPIC_API_KEY';
            statusCode = 401;
        } else if (error.status === 429 || error.statusCode === 429 || error.message?.includes('429')) {
            errorMessage = 'Límite de solicitudes excedido. Por favor, intenta más tarde.';
            statusCode = 429;
        } else if (error.status === 400 || error.statusCode === 400 || error.message?.includes('400')) {
            errorMessage = error.message || 'Solicitud inválida a la API de Claude. Verifica el formato del prompt.';
            statusCode = 400;
        } else if (error.message?.includes('model') || error.message?.includes('not found') || error.message?.includes('404')) {
            errorMessage = 'Modelo de Claude no encontrado o no disponible. Verifica que el modelo anthropic.claude-haiku-4-5-20251001-v1:0 esté disponible en tu cuenta.';
            statusCode = 404;
        } else if (error.message?.includes('timeout') || error.code === 'ETIMEDOUT') {
            errorMessage = 'Tiempo de espera agotado al comunicarse con la API de Claude. Por favor, intenta de nuevo.';
            statusCode = 504;
        }
        
        return res.status(statusCode).json({ 
            error: errorMessage,
            details: process.env.NODE_ENV === 'development' ? {
                originalError: error.message,
                status: error.status || error.statusCode,
                code: error.code,
                responseData: error.response?.data
            } : undefined
        });
    }
});

// Health check
app.get('/api/health', (req, res) => {
  const hasGemini = !!(process.env.REACT_APP_GEMINI_API_KEY);
  const hasClaude = !!(process.env.REACT_APP_ANTHROPIC_API_KEY);
  res.json({ 
    status: 'ok', 
    message: 'Servidor funcionando correctamente',
    env: process.env.NODE_ENV || 'development',
    services: { gemini: hasGemini, claude: hasClaude }
  });
});

// Manejo de rutas no encontradas
app.use((req, res) => {
  console.error(`❌ Ruta no encontrada: ${req.method} ${req.path}`);
  res.status(404).json({ 
    error: 'Endpoint no encontrado',
    path: req.path,
    method: req.method,
    availableEndpoints: ['/api/generate-image', '/api/generate-recipe-claude', '/api/health']
  });
});


// Exportar app para Vercel
module.exports = app;

// Solo escuchar si se ejecuta directamente (no importado como módulo)
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`🚀 Servidor proxy ejecutándose en http://localhost:${PORT}`);
    console.log(`📝 Endpoint de generación: http://localhost:${PORT}/api/generate-image`);
    console.log(`📝 Endpoint de recetas: http://localhost:${PORT}/api/generate-recipe-claude`);
    console.log(`🏥 Health check: http://localhost:${PORT}/api/health`);
  });
}
