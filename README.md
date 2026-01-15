# GourmetAI

Aplicación web que transforma fotografías de platos de comida en versiones visualmente mejoradas con presentación gourmet usando Gemini 3.0 API.

## Características

- 🖼️ Carga de imágenes desde galería o cámara
- 🔍 Identificación automática de ingredientes vía Gemini 3
- 🎛️ Panel de parámetros ajustables para personalización
- ✨ Generación de imágenes gourmet mejoradas
- 📜 Historial de generaciones persistente (LocalStorage)
- 💾 Descarga de imágenes con metadata
- 📜 Generación de recetas creativas vía Gemini 3
- 🔒 Seguridad: Helmet, Rate Limiting, CORS configurado
- 🗜️ Compresión de respuestas para mejor rendimiento

## Requisitos Previos

- Node.js 18 o superior
- npm o yarn
- API Key de Gemini 3.0 Pro (Google AI Studio)

## Instalación

1. Clona el repositorio o descarga el código fuente

2. Instala las dependencias:
```bash
npm install
```

3. Configura las variables de entorno:
   - Copia el archivo `env.example.txt` a `.env` y configura tus valores:
```env
# API de Gemini (Requerido para imágenes, ingredientes y recetas)
REACT_APP_GEMINI_API_KEY=tu_api_key_de_gemini

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

## Estructura del Proyecto

```
GourmetAI/
├── api/                    # Backend Express
│   └── index.ts           # Endpoint principal de API
├── src/                    # Código fuente frontend (React)
│   ├── components/         # Componentes React
│   ├── hooks/              # Custom React hooks
│   ├── services/           # Servicios de API (comunicación con /api/*)
│   ├── utils/              # Utilidades
│   └── __tests__/          # Tests
├── public/                 # Archivos públicos
├── package.json
└── README.md
```

## Arquitectura

La aplicación usa un modelo híbrido para máxima seguridad y rendimiento:
- **Frontend (React)**: Interfaz de usuario que se comunica con `/api/*`.
- **Backend (Express)**: Maneja las llamadas a las APIs de IA (Gemini) protegiendo las API Keys y evitando problemas de CORS.
- **Persistencia**: Las generaciones se guardan automáticamente en el `localStorage` del navegador para consulta posterior.

## Licencia

Este proyecto es privado y de uso interno.
