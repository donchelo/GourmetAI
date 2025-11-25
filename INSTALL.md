# Instrucciones de Instalación - GourmetAI

## Pasos para Configurar el Proyecto

### 1. Instalar Dependencias

Ejecuta el siguiente comando en la raíz del proyecto:

```bash
npm install
```

Esto instalará todas las dependencias necesarias:
- React 18
- Material-UI (MUI) 5
- Axios
- React Scripts

### 2. Configurar Variables de Entorno

1. Copia el archivo `.env.example` a `.env`:
   ```bash
   cp .env.example .env
   ```
   
   O en Windows PowerShell:
   ```powershell
   Copy-Item .env.example .env
   ```

2. Edita el archivo `.env` y agrega tus credenciales:

```
REACT_APP_GEMINI_API_KEY=tu_api_key_de_gemini_3.0_pro_aqui
REACT_APP_AIRTABLE_API_KEY=tu_api_key_de_airtable_aqui
REACT_APP_AIRTABLE_BASE_ID=tu_base_id_de_airtable_aqui
REACT_APP_AIRTABLE_TABLE_NAME=Generaciones
```

### 3. Obtener API Key de Gemini 3.0 Pro

1. Ve a [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Crea una nueva API key
3. Asegúrate de que tengas acceso a Gemini 3.0 Pro (puede requerir acceso beta)
4. Copia la API key al archivo `.env`

**Nota Importante**: La generación de imágenes con Gemini 3.0 puede requerir que la API esté disponible públicamente. Verifica la documentación oficial de Google para el estado actual de la API de generación de imágenes.

### 4. Configurar Airtable (Opcional)

Si deseas usar el historial de generaciones:

1. Crea una cuenta en [Airtable](https://airtable.com)
2. Crea una nueva base de datos
3. Crea una tabla llamada "Generaciones" con los siguientes campos:
   - `imagen_original` (Attachment)
   - `imagenes_generadas` (Attachment)
   - `parametros` (Long text)
   - `semilla` (Number)
   - `ingredientes_detectados` (Long text)
   - `timestamp` (Date)
4. Obtén tu API Key desde [Airtable Account](https://airtable.com/account)
5. Obtén tu Base ID desde la URL de tu base (después de `/base/`)
6. Agrega las credenciales al archivo `.env`

### 5. Ejecutar la Aplicación

Para iniciar el servidor de desarrollo:

```bash
npm start
```

La aplicación se abrirá automáticamente en [http://localhost:3000](http://localhost:3000)

### 6. Construir para Producción

Para crear una versión optimizada para producción:

```bash
npm run build
```

Los archivos se generarán en la carpeta `build/`.

## Solución de Problemas

### Error: "API Key de Gemini no configurada"
- Verifica que el archivo `.env` existe y contiene `REACT_APP_GEMINI_API_KEY`
- Asegúrate de reiniciar el servidor de desarrollo después de modificar `.env`

### Error: "Configuración de Airtable incompleta"
- Si no deseas usar Airtable, la aplicación funcionará pero no guardará el historial
- Si deseas usarlo, verifica que todas las variables de Airtable estén configuradas

### La generación de imágenes no funciona
- Verifica que tengas acceso a Gemini 3.0 Pro con capacidad de generación de imágenes
- Consulta la documentación oficial de Google para verificar el estado de la API

## Estructura del Proyecto

```
GourmetAI/
├── public/           # Archivos públicos
├── src/
│   ├── components/   # Componentes React
│   ├── services/     # Servicios de API
│   ├── utils/        # Utilidades
│   ├── hooks/        # Custom hooks
│   ├── constants/    # Constantes
│   └── styles/       # Estilos
├── .env              # Variables de entorno (no versionado)
├── .env.example      # Plantilla de variables de entorno
├── package.json      # Dependencias del proyecto
└── README.md         # Documentación principal
```

