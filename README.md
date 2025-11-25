# GourmetAI

Aplicación web que transforma fotografías de platos de comida en versiones visualmente mejoradas con presentación gourmet usando Gemini 3.0 API.

## Características

- Carga de imágenes desde galería o cámara
- Identificación automática de ingredientes vía Gemini 3
- Panel de parámetros ajustables para personalización
- Generación de imágenes gourmet mejoradas
- Historial de generaciones en Airtable (opcional)
- Descarga de imágenes con metadata

## Requisitos Previos

- Node.js 14 o superior
- npm o yarn
- API Key de Gemini 3.0 Pro
- API Key de Airtable (opcional, para historial)

## Instalación

1. Clona el repositorio o descarga el código fuente

2. Instala las dependencias:
```bash
npm install
```

3. Configura las variables de entorno:
   - Crea un archivo `.env` en la raíz del proyecto:
```env
REACT_APP_GEMINI_API_KEY=tu_api_key_de_gemini_aqui
REACT_APP_AIRTABLE_API_KEY=tu_api_key_de_airtable_aqui
REACT_APP_AIRTABLE_BASE_ID=tu_base_id_de_airtable_aqui
REACT_APP_AIRTABLE_TABLE_NAME=Generaciones
REACT_APP_PROXY_URL=http://localhost:3001
PORT=3001
```

**Nota**: El servidor proxy (`server/index.js`) usa las mismas variables de entorno del archivo `.env`.

## Configuración de Airtable (Opcional)

Si deseas usar el historial de generaciones:

1. Crea una base de datos en Airtable
2. Crea una tabla llamada "Generaciones" con los siguientes campos:
   - `Name` (Single line text) - Requerido
   - `Imagen Original` (Attachment)
   - `Imágenes Generadas` (Attachment)
   - `Parámetros` (Long text)
   - `Resumen de Parámetros` (Single line text)
   - `Semilla` (Number)
   - `Ingredientes Detectados` (Long text)
   - `Clasificación de Ingredientes` (Single line text)
   - `Fecha de Generación` (Date)

## Ejecución

### Opción 1: Ejecutar Todo Junto (Recomendado)

Ejecuta tanto el servidor proxy como la aplicación React:

```bash
npm run dev
```

Esto iniciará:
- Servidor proxy en `http://localhost:3001`
- Aplicación React en `http://localhost:3000`

### Opción 2: Ejecutar por Separado

**Terminal 1 - Servidor Proxy:**
```bash
npm run server
```

**Terminal 2 - Aplicación React:**
```bash
npm start
```

La aplicación se abrirá automáticamente en [http://localhost:3000](http://localhost:3000)

### Construir para Producción

```bash
npm run build
```

Los archivos se generarán en la carpeta `build/`.

## Estructura del Proyecto

```
GourmetAI/
├── server/                  # Servidor backend (Express)
│   ├── index.js            # Servidor proxy principal
│   └── utils/              # Utilidades del servidor
│       └── airtableHelpers.js
├── scripts/                 # Scripts de utilidad
│   └── reiniciar-servidor.ps1
├── src/                     # Código fuente frontend
│   ├── components/         # Componentes React
│   ├── constants/          # Constantes y configuraciones
│   ├── hooks/              # Custom React hooks
│   ├── services/           # Servicios de API
│   ├── utils/              # Utilidades y helpers
│   └── __tests__/          # Tests
├── public/                 # Archivos públicos
├── package.json
└── README.md
```

## Arquitectura

La aplicación usa un **servidor proxy** (`server/index.js`) para evitar problemas de CORS:
- **Frontend (React)**: Se comunica con el servidor proxy
- **Backend Proxy (Express)**: Llama a la API de Gemini desde el servidor
- **API de Gemini**: Genera las imágenes gourmet

## Tecnologías Utilizadas

- React 18
- Material-UI (MUI) 5
- Axios
- Express
- Gemini 3.0 API
- Airtable API

## Solución de Problemas

### Error: "El servidor proxy no está ejecutándose"
**Solución**: Ejecuta `npm run server` en una terminal separada o usa `npm run dev` para ejecutar todo junto.

### Error: "API Key inválida"
**Solución**: 
- Verifica que tu `.env` tenga `REACT_APP_GEMINI_API_KEY` configurada
- Reinicia ambos servidores después de cambiar `.env`
- Verifica que la API key tenga permisos para Gemini API

### Error: "Modelo no encontrado (404)"
**Solución**:
- Verifica que tu API key tenga acceso a Gemini 3 en Google AI Studio
- Asegúrate de que la API esté habilitada en Google Cloud Console
- Algunos modelos pueden no estar disponibles en tu región

### Error: "Puerto 3001 ya está en uso"
**Solución**:
```bash
npm run restart-server
```

O mata el proceso manualmente:
```powershell
netstat -ano | findstr :3001
taskkill /F /PID <PID>
```

### Error de CORS
**Solución**: Asegúrate de que el servidor proxy esté ejecutándose en el puerto 3001.

### El historial no se carga
**Solución**: 
- Verifica que las variables de Airtable estén configuradas en `.env`
- Si no deseas usar Airtable, la aplicación funcionará pero no guardará el historial

## Notas Importantes

- La generación de imágenes con Gemini 3.0 puede requerir que la API esté disponible públicamente. Verifica la documentación oficial de Google para el estado actual de la API.
- El historial en Airtable es opcional. Si no configuras Airtable, la aplicación funcionará pero no guardará el historial.
- Después de modificar `.env`, debes reiniciar ambos servidores para que los cambios surtan efecto.

## Licencia

Este proyecto es privado y de uso interno.
