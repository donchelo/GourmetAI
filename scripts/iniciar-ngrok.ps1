# Script para iniciar ngrok y exponer GourmetAI publicamente

# Agregar ngrok al PATH si no esta disponible
$ngrokPath = "C:\Users\EQUIPO\AppData\Local\Microsoft\WinGet\Packages\Ngrok.Ngrok_Microsoft.Winget.Source_8wekyb3d8bbwe"
if (Test-Path "$ngrokPath\ngrok.exe") {
    $env:Path = "$ngrokPath;$env:Path"
}

# Verificar que el puerto 3000 este activo
$port3000 = Get-NetTCPConnection -LocalPort 3000 -ErrorAction SilentlyContinue
if (-not $port3000) {
    Write-Host "[ADVERTENCIA] No se detecta actividad en el puerto 3000" -ForegroundColor Yellow
    Write-Host "   Asegurate de ejecutar 'npm run dev' primero" -ForegroundColor Yellow
    Write-Host ""
}

Write-Host "[NGROK] Iniciando ngrok para GourmetAI..." -ForegroundColor Cyan
Write-Host "[INFO] La URL publica estara disponible en http://localhost:4040" -ForegroundColor Green
Write-Host ""

# Iniciar ngrok
& ngrok http 3000
