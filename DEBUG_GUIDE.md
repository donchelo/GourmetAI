# Guía de Debugging - Error de Análisis de Imagen

## Error: "No se pudo analizar la imagen. Por favor, intenta de nuevo."

Este error ocurre en la función `analyzeImage` cuando se intenta analizar una imagen con la API de Gemini.

## Pasos para Debugging

### 1. Verificar la Consola del Navegador

Abre las herramientas de desarrollador (F12) y revisa la consola. Deberías ver logs detallados del error que incluyen:
- Status code de la respuesta
- Mensaje de error de la API
- Estructura de la respuesta recibida

### 2. Verificar la API Key

Asegúrate de que tu API key esté correctamente configurada en el archivo `.env`:
```
REACT_APP_GEMINI_API_KEY=tu_api_key_aqui
```

**Importante**: Después de modificar `.env`, debes reiniciar el servidor de desarrollo (`npm start`).

### 3. Verificar el Formato de la Imagen

La imagen debe ser:
- Formato: JPG, PNG o WEBP
- Tamaño máximo: 10MB
- Base64 válido

### 4. Verificar el Modelo de Gemini

El código usa `gemini-1.5-flash` que es el modelo más reciente. Si tienes problemas, puedes intentar cambiar a:
- `gemini-1.5-pro` (más preciso pero más lento)
- `gemini-pro-vision` (modelo anterior, puede estar deprecado)

Para cambiar el modelo, edita `src/services/geminiService.js` línea 6:
```javascript
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro:generateContent';
```

### 5. Errores Comunes y Soluciones

#### Error 401 (Unauthorized)
- **Causa**: API Key inválida o no configurada
- **Solución**: Verifica que la API key sea correcta y esté en `.env`

#### Error 400 (Bad Request)
- **Causa**: Formato de imagen inválido o estructura de petición incorrecta
- **Solución**: Verifica que la imagen sea válida y el formato base64 correcto

#### Error 429 (Too Many Requests)
- **Causa**: Límite de solicitudes excedido
- **Solución**: Espera unos minutos antes de intentar de nuevo

#### Error 404 (Not Found)
- **Causa**: Modelo no encontrado o endpoint incorrecto
- **Solución**: Verifica que el modelo esté disponible en tu región/plan

### 6. Probar con una Imagen Simple

Intenta con una imagen pequeña y simple primero para verificar que la conexión funciona:
- Imagen pequeña (< 1MB)
- Formato JPG
- Contenido claro (no borroso)

### 7. Verificar Permisos de la API Key

Asegúrate de que tu API key tenga permisos para:
- Gemini API
- Análisis de imágenes
- Generación de contenido

### 8. Logs Detallados

El código ahora incluye logs detallados en la consola. Revisa:
- `console.error('Error analizando imagen:', error)` - Error completo
- `console.error('Detalles del error:', {...})` - Detalles específicos de la respuesta

## Solución Rápida

1. Abre la consola del navegador (F12)
2. Intenta generar una imagen gourmet
3. Copia el error completo de la consola
4. Busca el código de estado HTTP (401, 400, 429, etc.)
5. Sigue las soluciones específicas arriba según el código de error

## Contacto

Si el problema persiste después de seguir estos pasos, verifica:
- La documentación oficial de Gemini API
- Los límites de tu plan de API
- Que la API key tenga los permisos necesarios

