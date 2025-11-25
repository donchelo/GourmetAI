# Guía de Testing - GourmetAI

## Tests Automatizados

### Ejecutar Tests

```bash
npm test
```

### Tests Disponibles

1. **Tests de Utilidades** (`src/__tests__/utils.test.js`)
   - Validación de formatos de imagen
   - Validación de parámetros
   - Conversión de imágenes

2. **Tests de Servicios** (`src/__tests__/services.test.js`)
   - Análisis de imágenes con Gemini
   - Generación de variantes gourmet
   - Guardado en Airtable

3. **Tests de Componentes** (`src/__tests__/App.test.js`)
   - Renderizado de componentes principales
   - Interacción con UI

## Testing Manual

### 1. Verificación de Configuración

- [ ] Verificar que `.env` existe y contiene `REACT_APP_GEMINI_API_KEY`
- [ ] Verificar que las variables de entorno están configuradas correctamente
- [ ] Verificar que `npm install` se ejecutó sin errores

### 2. Testing de Componentes UI

#### ImageUploader
- [ ] Arrastrar y soltar una imagen funciona
- [ ] Botón de selección de archivo funciona
- [ ] Preview de imagen se muestra correctamente
- [ ] Validación de formato rechaza archivos inválidos
- [ ] Mensajes de error se muestran correctamente

#### ParameterPanel
- [ ] Slider de intensidad gourmet funciona
- [ ] Todos los selectores funcionan correctamente
- [ ] Multi-select de decoraciones funciona
- [ ] Botón "Generar Gourmet" se deshabilita durante generación

#### GeneratedImages
- [ ] Grid 2x2 muestra las 4 variantes
- [ ] Click en imagen abre modal de vista ampliada
- [ ] Botón de descarga funciona
- [ ] Estado de carga se muestra correctamente
- [ ] Errores se muestran correctamente

#### History
- [ ] Historial se carga desde Airtable
- [ ] Carrusel se desplaza correctamente
- [ ] Click en imagen del historial carga la generación

### 3. Testing de Integración API

#### Gemini API - Análisis de Imagen
```bash
# Probar análisis de imagen
1. Subir una imagen de comida
2. Verificar que se detectan ingredientes
3. Verificar mensajes de error si la API falla
```

#### Imagen API - Generación
```bash
# Probar generación de imágenes
1. Subir imagen y configurar parámetros
2. Hacer clic en "Generar Gourmet"
3. Verificar que se generan 4 variantes
4. Verificar manejo de errores de API
```

#### Airtable API - Historial
```bash
# Probar guardado en historial
1. Generar imágenes gourmet
2. Verificar que se guarda en Airtable
3. Verificar que aparece en el historial
```

### 4. Testing de Flujo Completo

1. **Flujo Básico**
   - [ ] Subir imagen → Configurar parámetros → Generar → Ver resultados → Descargar

2. **Flujo con Errores**
   - [ ] Error de API → Mensaje amigable → Opción de reintentar
   - [ ] Imagen inválida → Mensaje de error → Permitir nueva selección

3. **Flujo de Historial**
   - [ ] Generar → Guardar → Cargar desde historial → Regenerar

### 5. Testing de Validaciones

- [ ] Validación de formato de imagen (JPG, PNG, WEBP)
- [ ] Validación de tamaño de imagen (máximo 10MB)
- [ ] Validación de parámetros requeridos
- [ ] Validación de rango de intensidad (1-10)

### 6. Testing de Performance

- [ ] Tiempo de respuesta de análisis de imagen < 30s
- [ ] Tiempo de generación de imágenes < 60s
- [ ] UI responsive durante carga
- [ ] Sin bloqueos de UI durante operaciones

### 7. Testing de Edge Cases

- [ ] Imagen muy grande (>10MB)
- [ ] Imagen corrupta o inválida
- [ ] Sin conexión a internet
- [ ] API Key inválida
- [ ] Timeout de API
- [ ] Múltiples generaciones simultáneas

## Checklist de Verificación Pre-Producción

- [ ] Todos los tests automatizados pasan
- [ ] Testing manual completo realizado
- [ ] Manejo de errores verificado
- [ ] Validaciones funcionan correctamente
- [ ] UI es responsive
- [ ] Performance aceptable
- [ ] Variables de entorno configuradas
- [ ] Documentación actualizada

## Comandos Útiles

```bash
# Ejecutar tests en modo watch
npm test -- --watch

# Ejecutar tests con cobertura
npm test -- --coverage

# Ejecutar aplicación en desarrollo
npm start

# Construir para producción
npm run build
```

