# Script de teste para webhook
# Uso: .\scripts\test-webhook.ps1

$uri = "http://localhost:3000/asaas-webhook"
$body = @{
    event = "PAYMENT_RECEIVED"
    payment = @{
        id = "pay_123456"
        externalReference = "order-uuid-aqui"
        status = "RECEIVED"
    }
} | ConvertTo-Json -Depth 10

$headers = @{
    "Content-Type" = "application/json"
    "asaas-access-token" = "seu_token_aqui"
}

Write-Host "Testando webhook..." -ForegroundColor Cyan
Write-Host "URL: $uri" -ForegroundColor Gray
Write-Host "Body: $body" -ForegroundColor Gray
Write-Host ""

Write-Host "⚠️  IMPORTANTE: Substitua 'order-uuid-aqui' por um ID de pedido real do Supabase" -ForegroundColor Yellow
Write-Host "⚠️  IMPORTANTE: Substitua 'seu_token_aqui' pelo WEBHOOK_SECRET_TOKEN do .env" -ForegroundColor Yellow
Write-Host ""

$confirm = Read-Host "Deseja continuar? (S/N)"
if ($confirm -ne "S" -and $confirm -ne "s") {
    Write-Host "Cancelado." -ForegroundColor Gray
    exit
}

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





