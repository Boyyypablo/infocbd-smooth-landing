# Script de teste para criar checkout
# Uso: .\scripts\test-create-checkout.ps1

$uri = "http://localhost:3000/api/create-checkout"
$body = @{
    user_id = "user-123"
    amount = 150.00
} | ConvertTo-Json

$headers = @{
    "Content-Type" = "application/json"
}

Write-Host "Testando criação de checkout..." -ForegroundColor Cyan
Write-Host "URL: $uri" -ForegroundColor Gray
Write-Host "Body: $body" -ForegroundColor Gray
Write-Host ""

try {
    $response = Invoke-RestMethod -Uri $uri -Method Post -Headers $headers -Body $body
    Write-Host "✅ Sucesso!" -ForegroundColor Green
    Write-Host ($response | ConvertTo-Json -Depth 10) -ForegroundColor White
} catch {
    Write-Host "❌ Erro:" -ForegroundColor Red
    Write-Host $_.Exception.Message -ForegroundColor Red
    if ($_.ErrorDetails.Message) {
        Write-Host $_.ErrorDetails.Message -ForegroundColor Yellow
    }
}

