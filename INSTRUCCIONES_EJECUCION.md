# Instrucciones de Ejecución - GourmetAI

## 🚀 Inicio Rápido

### Paso 1: Instalar Dependencias
```bash
npm install
```

### Paso 2: Configurar Variables de Entorno
Asegúrate de que tu archivo `.env` tenga:
```
REACT_APP_GEMINI_API_KEY=tu_api_key_aqui
REACT_APP_PROXY_URL=http://localhost:3001
PORT=3001
```

### Paso 3: Ejecutar la Aplicación

**Opción A: Todo Junto (Recomendado)**
```bash
npm run dev
```
Esto ejecuta:
- ✅ Servidor proxy en `http://localhost:3001`
- ✅ Aplicación React en `http://localhost:3000`

**Opción B: Por Separado**

Terminal 1 (Servidor Proxy):
```bash
npm run server
```

Terminal 2 (Aplicación React):
```bash
npm start
```

## ✅ Verificación

1. Abre `http://localhost:3000` en tu navegador
2. Deberías ver la aplicación GourmetAI
3. El servidor proxy debería mostrar: `🚀 Servidor proxy ejecutándose en http://localhost:3001`

## 🔧 Solución de Problemas

### Error: "El servidor proxy no está ejecutándose"
**Solución**: Ejecuta `npm run server` en una terminal separada o usa `npm run dev`

### Error: "API Key inválida"
**Solución**: Verifica que tu `.env` tenga la API key correcta y reinicia ambos servidores

### Error: CORS
**Solución**: Asegúrate de que el servidor proxy esté ejecutándose en el puerto 3001

## 📝 Notas

- El servidor proxy es necesario para evitar problemas de CORS con la API de Imagen
- La API key se lee desde `.env` tanto en el frontend como en el backend
- El servidor proxy mantiene la API key segura en el servidor

