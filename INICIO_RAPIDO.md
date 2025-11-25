# 🚀 Inicio Rápido - GourmetAI

## ⚡ Ejecución en 3 Pasos

### 1. Abre una Terminal y ejecuta:

```bash
npm run dev
```

Esto iniciará **automáticamente**:
- ✅ Servidor proxy en `http://localhost:3001`
- ✅ Aplicación React en `http://localhost:3000`

### 2. Espera a ver estos mensajes:

```
🚀 Servidor proxy ejecutándose en http://localhost:3001
📝 Endpoint de generación: http://localhost:3001/api/generate-image

Compiled successfully!
```

### 3. Abre tu navegador:

La aplicación se abrirá automáticamente en `http://localhost:3000`

## ✅ Verificación

Si ves el error **"El servidor proxy no está ejecutándose"**:

1. Verifica que el comando `npm run dev` esté corriendo
2. Verifica que veas el mensaje `🚀 Servidor proxy ejecutándose...`
3. Si no aparece, ejecuta manualmente:
   ```bash
   npm run server
   ```
   En una terminal separada

## 🔧 Solución de Problemas

### El servidor no inicia (EADDRINUSE)
El puerto 3001 ya está en uso. Soluciones:

**Opción 1: Reiniciar el servidor**
```bash
npm run restart-server
```

**Opción 2: Matar el proceso manualmente**
```powershell
# Encontrar el proceso
netstat -ano | findstr :3001

# Matar el proceso (reemplaza PID con el número que encuentres)
taskkill /F /PID <PID>
```

**Opción 3: Usar otro puerto**
Edita `server.js` y cambia `const PORT = 3001` a otro puerto (ej: 3002)

### Error 404 en /api/generate-image
**Si el servidor está corriendo pero obtienes 404:**
- El modelo de Imagen no está disponible con tu API key
- Verifica que tu API key tenga acceso a la API de Imagen de Google
- Revisa los logs del servidor para ver qué modelo está fallando

**Si el servidor no está corriendo:**
- Ejecuta `npm run server` en una terminal separada
- O usa `npm run dev` para ejecutar todo junto

### Error de API Key
- Verifica que tu `.env` tenga `REACT_APP_GEMINI_API_KEY` configurada
- Reinicia ambos servidores después de cambiar `.env`
- Verifica que la API key tenga permisos para:
  - Gemini API (para análisis de imágenes)
  - Imagen API (para generación de imágenes)

### Error "Modelo no encontrado"
- Tu API key puede no tener acceso a los modelos de Imagen
- Verifica en Google Cloud Console que tengas habilitada la API de Imagen
- Algunos modelos pueden no estar disponibles en tu región

