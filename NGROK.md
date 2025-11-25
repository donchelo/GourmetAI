# Guía de uso de ngrok para GourmetAI

## Configuración completada ✅

- ✅ ngrok instalado y autenticado
- ✅ Proxy configurado en `package.json` para redirigir `/api/*` al backend
- ✅ URLs cambiadas a rutas relativas para funcionar con ngrok

## ⚠️ IMPORTANTE: Solución al error "Invalid Host header"

Si ves el error **"Invalid Host header"** al acceder a través de ngrok, necesitas crear un archivo `.env.local` en la raíz del proyecto con el siguiente contenido:

```env
DANGEROUSLY_DISABLE_HOST_CHECK=true
```

**Pasos:**
1. Crea un archivo llamado `.env.local` en la raíz del proyecto (mismo nivel que `package.json`)
2. Agrega la línea: `DANGEROUSLY_DISABLE_HOST_CHECK=true`
3. Reinicia tu servidor de desarrollo (`npm run dev`)

## Cómo usar ngrok

### Paso 1: Crear archivo .env.local (solo la primera vez)

Crea un archivo `.env.local` en la raíz del proyecto con:

```env
DANGEROUSLY_DISABLE_HOST_CHECK=true
```

### Paso 2: Iniciar la aplicación

En una terminal, ejecuta:

```bash
npm run dev
```

Esto iniciará:
- Backend en `http://localhost:3001`
- Frontend en `http://localhost:3000`

### Paso 3: Iniciar ngrok

En **otra terminal**, ejecuta:

```bash
npm run ngrok
```

O directamente:

```bash
ngrok http 3000
```

### Paso 4: Obtener tu URL pública

Una vez que ngrok esté corriendo, verás algo como:

```
Forwarding   https://abc123.ngrok-free.app -> http://localhost:3000
```

**Esa URL (`https://abc123.ngrok-free.app`) es la que puedes compartir.**

### Paso 5: Verificar que funciona

1. Abre la URL de ngrok en tu navegador
2. Deberías ver la aplicación GourmetAI funcionando
3. Prueba subir una imagen y generar una variante gourmet

## Solución de problemas

### Error: "No se puede conectar al servidor"

**Causa:** El servidor backend no está corriendo o ngrok no está activo.

**Solución:**
1. Verifica que `npm run dev` esté ejecutándose
2. Verifica que ngrok esté corriendo y apuntando al puerto 3000
3. Revisa la consola del navegador para ver errores específicos

### Error: "Invalid Host header"

**Causa:** React rechaza conexiones que no sean desde localhost por seguridad.

**Solución:**
1. El archivo `.env.local` ya está creado con `DANGEROUSLY_DISABLE_HOST_CHECK=true`
2. Reinicia el servidor de desarrollo (`npm run dev`)
3. Vuelve a acceder a través de la URL de ngrok

### Error: "CORS policy"

**Causa:** Ya está solucionado. El proxy en `package.json` maneja esto automáticamente.

### La URL cambia cada vez

**Causa:** En el plan gratuito de ngrok, las URLs son temporales.

**Solución:** 
- Comparte la nueva URL cada vez que reinicies ngrok
- O considera el plan de pago de ngrok para URLs fijas

### Límites del plan gratuito

- 40 conexiones por minuto
- URLs temporales (cambian al reiniciar)
- Sin autenticación personalizada

## Notas técnicas

- El proxy en `package.json` redirige automáticamente `/api/*` al backend (puerto 3001)
- Las URLs ahora son relativas (`/api/...`) en lugar de absolutas (`http://localhost:3001/api/...`)
- Esto permite que funcione tanto localmente como a través de ngrok

