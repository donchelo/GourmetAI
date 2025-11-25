# Solución de Errores - Gemini y Airtable

## Problemas Identificados y Soluciones

### 1. Error 404 con Gemini API ✅ CORREGIDO

**Problema**: Todos los modelos de Gemini devuelven error 404.

**Causas Posibles**:
- La API key puede no tener acceso a los modelos
- El endpoint puede estar incorrecto
- Puede requerir habilitación de facturación

**Soluciones Implementadas**:
1. ✅ Sistema de fallback que prueba múltiples modelos y versiones de API
2. ✅ Prueba con `/v1beta` y `/v1`
3. ✅ Logs detallados para identificar qué funciona

**Próximos Pasos si Persiste**:
1. Verificar en [Google AI Studio](https://makersuite.google.com/app/apikey) que:
   - La API key esté activa
   - Tengas acceso a Gemini API
   - La facturación esté habilitada (si es necesario)

2. Verificar que el proyecto tenga habilitada la API de Gemini:
   - Ve a [Google Cloud Console](https://console.cloud.google.com/)
   - Selecciona tu proyecto
   - Ve a "APIs & Services" > "Library"
   - Busca "Generative Language API" y habilítala

3. Si el problema persiste, puede ser que necesites usar el SDK de Google en lugar de REST:
   ```bash
   npm install @google/generative-ai
   ```

### 2. Error 422 con Airtable ✅ CORREGIDO

**Problema**: Error 422 al obtener historial debido a formato incorrecto del parámetro `sort`.

**Solución Implementada**:
- Cambiado el formato de `sort` de array a formato de query string que Airtable espera:
  - Antes: `sort: [{ field: 'timestamp', direction: 'desc' }]`
  - Ahora: `'sort[0][field]': 'timestamp', 'sort[0][direction]': 'desc'`

**Verificación**:
- El error 422 debería desaparecer
- El historial debería cargarse correctamente

## Código Actualizado

### Gemini Service
- Prueba automática con múltiples modelos y versiones de API
- Logs detallados para debugging
- Manejo mejorado de errores

### Airtable Service
- Formato correcto del parámetro sort
- Compatible con la API de Airtable

## Testing

Después de estos cambios:
1. ✅ El error 422 de Airtable debería estar resuelto
2. ⏳ El error 404 de Gemini puede requerir verificación de permisos/API key

## Si Gemini Sigue Sin Funcionar

Si después de verificar permisos sigue sin funcionar, considera:

1. **Usar el SDK oficial de Google**:
   ```bash
   npm install @google/generative-ai
   ```

2. **Verificar región/disponibilidad**: Algunos modelos pueden no estar disponibles en tu región

3. **Contactar soporte**: Si todo lo demás falla, contacta el soporte de Google AI Studio

