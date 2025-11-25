# Script para reiniciar el servidor proxy de GourmetAI

Write-Host "🔄 Buscando servidor en puerto 3001..." -ForegroundColor Cyan

# Buscar proceso en puerto 3001
$process = Get-NetTCPConnection -LocalPort 3001 -ErrorAction SilentlyContinue | Select-Object -ExpandProperty OwningProcess -Unique

if ($process) {
    Write-Host "🛑 Deteniendo servidor existente (PID: $process)..." -ForegroundColor Yellow
    Stop-Process -Id $process -Force -ErrorAction SilentlyContinue
    Start-Sleep -Seconds 2
}

Write-Host "🚀 Iniciando servidor proxy..." -ForegroundColor Green
Write-Host "📝 El servidor estará disponible en http://localhost:3001" -ForegroundColor Cyan
Write-Host ""

node server/index.js


