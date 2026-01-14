import express, { Request, Response, NextFunction } from 'express';
/**
 * SERVER VERSION: 1.0.3
 * MODELS: gemini-3-pro-image-preview only
 */
import cors from 'cors';
import axios from 'axios';
import helmet from 'helmet';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import { GoogleGenerativeAI } from '@google/generative-ai';
import Anthropic from '@anthropic-ai/sdk';
import * as dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.SERVER_PORT || 3001;
const isProduction = process.env.NODE_ENV === 'production';

// Confiar en el proxy (necesario para rate-limit en Vercel)
app.set('trust proxy', 1);

// === Seguridad ===
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" },
  contentSecurityPolicy: false
}));
app.use(compression());

// Rate limiting
const limiter = rateLimit({
  windowMs: 60 * 1000,
  max: isProduction ? 30 : 100,
  message: { error: 'Demasiadas solicitudes. Por favor, espera un momento.' },
  standardHeaders: true,
  legacyHeaders: false,
  validate: { xForwardedForHeader: false }
});
app.use('/api/', limiter);

// CORS
const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:3000'];
app.use(cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin) || (isProduction && origin.includes('vercel.app'))) {
      return callback(null, true);
    }
    callback(null, true); // Permisivo en dev
  },
  credentials: true
}));

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Logging
app.use((req: Request, res: Response, next: NextFunction) => {
  console.log(`📥 ${req.method} ${req.path}`);
  next();
});

// Types for requests
interface AnalyzeImageRequest {
  image: string;
}

interface GenerateImageRequest {
  prompt: string;
  image?: string;
  plateImage?: string;
  aspectRatio?: string;
  imageSize?: string;
}

interface GenerateRecipeRequest {
  prompt: string;
}

// Endpoints
app.post('/api/analyze-image', async (req: Request<{}, any, AnalyzeImageRequest>, res: Response) => {
  try {
    const { image } = req.body;
    console.log('🔍 ANALYZE IMAGE - Using model: gemini-3-pro-image-preview (v1beta)');
    const apiKey = process.env.REACT_APP_GEMINI_API_KEY;

    if (!apiKey) return res.status(500).json({ error: 'API Key de Gemini no configurada' });
    if (!image) return res.status(400).json({ error: 'Imagen es requerida' });

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ 
      model: 'gemini-3-pro-image-preview' 
    }, { apiVersion: 'v1beta' });

    const base64Data = image.includes(',') ? image.split(',')[1] : image;
    let mimeType = "image/jpeg";
    if (image.includes('data:image/png')) mimeType = "image/png";
    if (image.includes('data:image/webp')) mimeType = "image/webp";

    const prompt = "Lista todos los ingredientes que identificas en esta imagen de comida. Responde solo con ingredientes separados por comas, sin explicaciones.";
    
    const result = await model.generateContent([
      prompt,
      { inlineData: { data: base64Data, mimeType } }
    ]);
    
    const response = await result.response;
    
    // Extraction for text
    let ingredients = '';
    if (response.candidates?.[0]?.content?.parts) {
      for (const part of response.candidates[0].content.parts) {
        if (part.text) {
          ingredients += part.text;
        }
      }
    }
    
    return res.json({ success: true, ingredients: ingredients.trim() || response.text().trim() });
  } catch (error: any) {
    console.error('❌ Error in /api/analyze-image:', error);
    return res.status(500).json({ error: error.message || 'Error analizando imagen' });
  }
});

  app.post('/api/generate-image', async (req: Request<{}, any, GenerateImageRequest>, res: Response) => {
  try {
    const { prompt, image, plateImage, aspectRatio, imageSize } = req.body;
    
    // Gemini 3 Pro requirement: Valid numeric aspect ratios only
    const validAspectRatios = ['1:1', '2:3', '3:2', '3:4', '4:3', '4:5', '5:4', '9:16', '16:9', '21:9'];
    const finalAspectRatio = validAspectRatios.includes(aspectRatio || '') ? aspectRatio : "1:1";
    
    console.log(`🎨 GENERATE IMAGE - Using model: gemini-3-pro-image-preview (v1beta) [${finalAspectRatio}, ${imageSize || '1K'}]`);
    const apiKey = process.env.REACT_APP_GEMINI_API_KEY;

    if (!apiKey) return res.status(500).json({ error: 'API Key de Gemini no configurada' });
    if (!prompt) return res.status(400).json({ error: 'Prompt es requerido' });

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ 
      model: 'gemini-3-pro-image-preview',
      generationConfig: {
        responseModalities: ["IMAGE"] as any,
        imageConfig: {
          aspectRatio: finalAspectRatio as any,
          imageSize: imageSize || "1K"
        } as any
      }
    }, { apiVersion: 'v1beta' });
    
    let contents: any[] = [prompt];

    // Imagen principal (comida)
    if (image) {
      const base64Data = image.includes(',') ? image.split(',')[1] : image;
      let mimeType = "image/jpeg";
      if (image.includes('data:image/png')) mimeType = "image/png";
      if (image.includes('data:image/webp')) mimeType = "image/webp";
      contents.push({ inlineData: { data: base64Data, mimeType } });
    }

    // Imagen secundaria (plato físico opcional)
    if (plateImage) {
      console.log('🍽️ Adding physical plate image to request');
      const base64Data = plateImage.includes(',') ? plateImage.split(',')[1] : plateImage;
      let mimeType = "image/jpeg";
      if (plateImage.includes('data:image/png')) mimeType = "image/png";
      if (plateImage.includes('data:image/webp')) mimeType = "image/webp";
      contents.push({ inlineData: { data: base64Data, mimeType } });
    }
    
    const result = await model.generateContent(contents);
    const response = await result.response;
    
    let imageData = null;
    
    // Improved extraction: Thinking models return multiple parts, we want the final image
    if (response.candidates?.[0]?.content?.parts) {
      const parts = response.candidates[0].content.parts;
      // We look through all parts for inlineData
      for (const part of parts) {
        if ((part as any).inlineData?.data) {
          imageData = (part as any).inlineData.data;
          // In thinking models, there might be multiple images, the last one is typically the final result
        }
      }
    }
    
    if (imageData) {
      return res.json({ success: true, image: `data:image/png;base64,${imageData}` });
    } else {
      console.log('⚠️ No image data found in response parts. Full response:', JSON.stringify(response, null, 2));
      throw new Error('No se pudo extraer la imagen de la respuesta de la IA');
    }
  } catch (error: any) {
    console.error('❌ Error in /api/generate-image:', error);
    return res.status(500).json({ success: false, error: error.message || 'Error generando imagen' });
  }
});

app.post('/api/generate-recipe-claude', async (req: Request<{}, any, GenerateRecipeRequest>, res: Response) => {
  try {
    const { prompt } = req.body;
    const apiKey = process.env.REACT_APP_ANTHROPIC_API_KEY || process.env.ANTHROPIC_API_KEY;

    if (!apiKey) return res.status(500).json({ error: 'API Key de Anthropic no configurada' });
    if (!prompt) return res.status(400).json({ error: 'Prompt es requerido' });

    const anthropic = new Anthropic({ apiKey, timeout: 60000 });
    const modelName = process.env.CLAUDE_MODEL || "claude-haiku-4-5";
    
    const msg = await anthropic.messages.create({
      model: modelName,
      max_tokens: 8192,
      messages: [{ role: "user", content: prompt }],
    });

    const text = (msg.content[0] as any).text;
    return res.json({ success: true, recipe: text });
  } catch (error: any) {
    return res.status(500).json({ success: false, error: error.message || 'Error generando receta' });
  }
});

app.get('/api/health', (req: Request, res: Response) => {
  res.json({ 
    status: 'ok',
    version: '1.0.3-gemini3-only',
    services: { 
      gemini: !!process.env.REACT_APP_GEMINI_API_KEY, 
      claude: !!(process.env.REACT_APP_ANTHROPIC_API_KEY || process.env.ANTHROPIC_API_KEY) 
    } 
  });
});

// Error handling
app.use((error: any, req: Request, res: Response, next: NextFunction) => {
  console.error('❌ ERROR:', error.message);
  res.status(error.status || 500).json({ success: false, error: error.message || 'Error interno' });
});

export default app;

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`🚀 API: http://localhost:${PORT}`);
  });
}
