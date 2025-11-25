# Migración Completa a Gemini 3

## Resumen

La aplicación ha sido completamente migrada para usar **SOLO Gemini 3** según la documentación oficial de Google.

## Cambios Implementados

### 1. Análisis de Imágenes ✅
- **Modelo:** `gemini-3-pro-preview`
- **Uso:** Detección de ingredientes en imágenes de comida
- **Configuración:**
  - `thinking_level`: "high" (por defecto, máximo razonamiento)
  - `media_resolution`: "high" (1120 tokens para mejor calidad)
  - `temperature`: 1.0 (por defecto, no configurado explícitamente)

### 2. Generación de Imágenes ✅
- **Modelo:** `gemini-3-pro-image-preview`
- **Uso:** Generación de imágenes gourmet desde texto
- **Características:**
  - Generación directa desde texto con razonamiento avanzado
  - Soporta hasta 4K de resolución
  - Puede usar herramientas como Google Search para información en tiempo real

### 3. Eliminación de Modelos Legacy ❌
- ❌ Eliminados modelos de Imagen (imagen-3.0, imagen-4.0)
- ❌ Eliminados modelos legacy de Gemini (gemini-pro, gemini-1.5-*)
- ✅ Solo se usan modelos Gemini 3

## Archivos Modificados

### `src/services/geminiService.js`
- `analyzeImage()`: Usa `gemini-3-pro-preview`
- `generateGourmetVariants()`: Usa `gemini-3-pro-image-preview` directamente
- Eliminado fallback a modelos de Imagen

### `server.js`
- Endpoint `/api/generate-image`: Ahora usa `gemini-3-pro-image-preview` directamente
- Eliminado código para modelos de Imagen

## Configuración Requerida

### Variables de Entorno
```env
REACT_APP_GEMINI_API_KEY=tu_api_key_aqui
REACT_APP_PROXY_URL=http://localhost:3001  # Opcional
PORT=3001  # Opcional
```

### Dependencias
```json
{
  "@google/generative-ai": "^0.24.1"
}
```

## Uso

### Análisis de Imágenes
```javascript
import { analyzeImage } from './services/geminiService';

const ingredients = await analyzeImage(imageBase64);
// Usa gemini-3-pro-preview automáticamente
```

### Generación de Imágenes
```javascript
import { generateGourmetVariants } from './services/geminiService';

const images = await generateGourmetVariants(imageBase64, parameters, ingredients);
// Usa gemini-3-pro-image-preview automáticamente
```

## Características de Gemini 3

### Thinking Level
- **high** (default): Máximo razonamiento, mejor calidad
- **low**: Menor latencia, para tareas simples

### Media Resolution
- **Images**: `media_resolution_high` (1120 tokens) - Recomendado
- **PDFs**: `media_resolution_medium` (560 tokens)
- **Video**: `media_resolution_low` (70 tokens por frame)

### Temperature
- **Default**: 1.0 (no configurar explícitamente)
- ⚠️ Cambiar temperatura puede causar comportamiento inesperado

## Troubleshooting

### Error: "gemini-3-pro-image-preview no está disponible"
- Verifica que tu API key tenga acceso a Gemini 3 en Google AI Studio
- Asegúrate de que la API esté habilitada en Google Cloud Console

### Error: "No se pudo extraer imagen de la respuesta"
- El SDK puede requerir actualización para soportar completamente la generación de imágenes
- Verifica la estructura de la respuesta en los logs

### Error: "Endpoint no encontrado (404)"
- Asegúrate de que el servidor proxy esté ejecutándose
- Verifica que el endpoint `/api/generate-image` esté configurado

## Próximos Pasos

1. ✅ Probar análisis de imágenes con `gemini-3-pro-preview`
2. ✅ Probar generación de imágenes con `gemini-3-pro-image-preview`
3. ⏳ Monitorear costos (Gemini 3 tiene precios diferentes según tokens)
4. ⏳ Actualizar SDK cuando haya soporte completo para `imageConfig`

## Referencias

- [Documentación Oficial de Gemini 3](https://ai.google.dev/docs/gemini_api_overview)
- [Guía de Desarrollador de Gemini 3](https://ai.google.dev/docs/gemini_api_overview#gemini-3)
- SDK: `@google/generative-ai` v0.24.1

