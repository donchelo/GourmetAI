# GourmetAI

Aplicación web que transforma fotografías de platos de comida en versiones visualmente mejoradas con presentación gourmet usando Gemini 3.0 API.

## Características

- 🖼️ Carga de imágenes desde galería o cámara
- 🔍 Identificación automática de ingredientes vía Gemini 3
- 🎛️ Panel de parámetros ajustables para personalización
- ✨ Generación de imágenes gourmet mejoradas
- 📜 Historial de generaciones persistente (LocalStorage)
- 💾 Descarga de imágenes con metadata
- 🔒 Seguridad: Helmet, Rate Limiting, CORS configurado
- 🗜️ Compresión de respuestas para mejor rendimiento

## Requisitos Previos

- Node.js 18 o superior
- npm o yarn
- API Key de Gemini 3.0 Pro (Google AI Studio)
- API Key de Anthropic (Claude 3.5/4.5)

## Instalación

1. Clona el repositorio o descarga el código fuente

2. Instala las dependencias:
```bash
npm install
```

3. Configura las variables de entorno:
   - Copia el archivo `env.example.txt` a `.env` y configura tus valores:
```env
# API de Gemini (Requerido para imágenes e ingredientes)
REACT_APP_GEMINI_API_KEY=tu_api_key_de_gemini

# API de Anthropic (Requerido para recetas)
REACT_APP_ANTHROPIC_API_KEY=tu_api_key_de_anthropic

# Entorno
NODE_ENV=development
```

## Ejecución Local

### Ejecutar Todo Junto (Recomendado)

Ejecuta tanto el servidor proxy como la aplicación React:

```bash
npm run dev
```

Esto iniciará:
- Servidor de API en `http://localhost:3001`
- Aplicación React en `http://localhost:3000`

La aplicación se abrirá automáticamente en [http://localhost:3000](http://localhost:3000)

## Despliegue en Vercel

Esta aplicación está optimizada para Vercel usando Funciones Serverless.

1. Conecta tu repositorio a Vercel.
2. Configura las variables de entorno en el panel de Vercel:
   - `REACT_APP_GEMINI_API_KEY`
   - `REACT_APP_ANTHROPIC_API_KEY`
3. Vercel detectará automáticamente el archivo `vercel.json` y configurará los rewrites necesarios.

## Estructura del Proyecto

```
GourmetAI/
├── api/                    # Serverless Functions (Backend Express)
│   └── index.js           # Endpoint principal de API
├── src/                    # Código fuente frontend (React)
│   ├── components/         # Componentes React
│   ├── hooks/              # Custom React hooks
│   ├── services/           # Servicios de API (comunicación con /api/*)
│   ├── utils/              # Utilidades, incluyendo historyService.js
│   └── __tests__/          # Tests
├── public/                 # Archivos públicos
├── vercel.json             # Configuración de despliegue
├── package.json
└── README.md
```

## Arquitectura

La aplicación usa un modelo híbrido para máxima seguridad y rendimiento:
- **Frontend (React)**: Interfaz de usuario que se comunica con `/api/*`.
- **Backend (Vercel Functions)**: Maneja las llamadas a las APIs de IA (Gemini, Claude) protegiendo las API Keys y evitando problemas de CORS.
- **Persistencia**: Las generaciones se guardan automáticamente en el `localStorage` del navegador para consulta posterior.

## Licencia

Este proyecto es privado y de uso interno.
