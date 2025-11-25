# GourmetAI

Aplicación web que transforma fotografías de platos de comida en versiones visualmente mejoradas con presentación gourmet usando Gemini 3.0 API.

## Características

- Carga de imágenes desde galería o cámara
- Identificación automática de ingredientes vía LLM
- Panel de parámetros ajustables para personalización
- Generación de 4 variantes gourmet por solicitud
- Historial de generaciones en Airtable
- Descarga individual de imágenes seleccionadas

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
   - Edita el archivo `.env` y agrega tus API keys:
```
REACT_APP_GEMINI_API_KEY=tu_api_key_de_gemini_aqui
REACT_APP_AIRTABLE_API_KEY=tu_api_key_de_airtable_aqui
REACT_APP_AIRTABLE_BASE_ID=tu_base_id_de_airtable_aqui
REACT_APP_AIRTABLE_TABLE_NAME=Generaciones
REACT_APP_PROXY_URL=http://localhost:3001
PORT=3001
```

**Nota**: El servidor proxy (`server.js`) usa las mismas variables de entorno del archivo `.env`.

## Configuración de Airtable

1. Crea una base de datos en Airtable
2. Crea una tabla llamada "Generaciones" con los siguientes campos:
   - `imagen_original` (Attachment)
   - `imagenes_generadas` (Attachment)
   - `parametros` (Long text)
   - `semilla` (Number)
   - `ingredientes_detectados` (Long text)
   - `timestamp` (Date)

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

Para crear una versión de producción:

```bash
npm run build
```

## Estructura del Proyecto

```
GourmetAI/
  src/
    components/     # Componentes React reutilizables
    services/       # Servicios de API (Gemini, Airtable)
    utils/          # Utilidades y helpers
    hooks/          # Custom React hooks
    constants/      # Constantes y configuraciones
    styles/         # Estilos globales
  server.js         # Servidor proxy Express (resuelve CORS)
  public/           # Archivos públicos
  .env              # Variables de entorno (no versionado)
```

## Arquitectura

La aplicación usa un **servidor proxy** (`server.js`) para evitar problemas de CORS:
- **Frontend (React)**: Se comunica con el servidor proxy
- **Backend Proxy (Express)**: Llama a la API de Imagen desde el servidor
- **API de Imagen**: Genera las imágenes gourmet

## Tecnologías Utilizadas

- React 18
- Material-UI (MUI) 5
- Axios
- Gemini 3.0 API
- Airtable API

## Notas Importantes

- La generación de imágenes con Gemini 3.0 puede requerir que la API esté disponible públicamente. Verifica la documentación oficial de Google para el estado actual de la API.
- El historial en Airtable es opcional. Si no configuras Airtable, la aplicación funcionará pero no guardará el historial.

## Licencia

Este proyecto es privado y de uso interno.

