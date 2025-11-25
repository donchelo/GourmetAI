# Script para iniciar la aplicacion con soporte para ngrok
# Este script configura React para aceptar conexiones desde ngrok

Write-Host "[DEV] Iniciando aplicacion con soporte para ngrok..." -ForegroundColor Cyan
Write-Host ""

# Configurar variable de entorno para que React acepte cualquier host
$env:DANGEROUSLY_DISABLE_HOST_CHECK = "true"

# Iniciar servidor y React con concurrently
Write-Host "[INFO] El servidor estara disponible en:" -ForegroundColor Green
Write-Host "  - Backend: http://localhost:3001" -ForegroundColor White
Write-Host "  - Frontend: http://localhost:3000" -ForegroundColor White
Write-Host ""
Write-Host "[INFO] Despues de iniciar, ejecuta 'npm run ngrok' en otra terminal" -ForegroundColor Yellow
Write-Host ""

# Ejecutar concurrently
& npm run dev

