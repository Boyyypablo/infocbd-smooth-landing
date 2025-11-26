# Script para reiniciar o servidor backend
# Uso: .\scripts\restart-backend.ps1

Write-Host "Parando processos Node.js..." -ForegroundColor Yellow

# Parar processos Node.js relacionados ao servidor
Get-Process -Name node -ErrorAction SilentlyContinue | Where-Object {
    $_.CommandLine -like "*server.cjs*" -or $_.Path -like "*infocbd-smooth-landing*"
} | Stop-Process -Force -ErrorAction SilentlyContinue

Start-Sleep -Seconds 2

Write-Host "Iniciando servidor backend..." -ForegroundColor Green
Write-Host "Execute: npm run backend" -ForegroundColor Cyan

