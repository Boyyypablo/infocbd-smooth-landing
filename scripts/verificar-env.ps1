# Script PowerShell para verificar variáveis de ambiente do .env
# Uso: .\scripts\verificar-env.ps1

Write-Host "Verificando arquivo .env..." -ForegroundColor Cyan

if (Test-Path ".env") {
    Write-Host "[OK] Arquivo .env encontrado" -ForegroundColor Green
    
    $envContent = Get-Content ".env" -Raw
    
    # Verificar variáveis do Supabase
    if ($envContent -match "VITE_SUPABASE_URL") {
        $urlLine = ($envContent -split "`n" | Where-Object { $_ -match "VITE_SUPABASE_URL" })[0]
        if ($urlLine -match "https?://") {
            Write-Host "[OK] VITE_SUPABASE_URL configurada" -ForegroundColor Green
            Write-Host "   $($urlLine.Substring(0, [Math]::Min(50, $urlLine.Length)))..." -ForegroundColor Gray
        } else {
            Write-Host "[AVISO] VITE_SUPABASE_URL encontrada mas parece estar vazia ou invalida" -ForegroundColor Yellow
        }
    } else {
        Write-Host "[ERRO] VITE_SUPABASE_URL NAO encontrada no .env" -ForegroundColor Red
        Write-Host "   Adicione: VITE_SUPABASE_URL=https://seu-projeto.supabase.co" -ForegroundColor Yellow
    }
    
    if ($envContent -match "VITE_SUPABASE_ANON_KEY") {
        $keyLine = ($envContent -split "`n" | Where-Object { $_ -match "VITE_SUPABASE_ANON_KEY" })[0]
        if ($keyLine -match "eyJ") {
            Write-Host "[OK] VITE_SUPABASE_ANON_KEY configurada" -ForegroundColor Green
            Write-Host "   $($keyLine.Substring(0, [Math]::Min(50, $keyLine.Length)))..." -ForegroundColor Gray
        } else {
            Write-Host "[AVISO] VITE_SUPABASE_ANON_KEY encontrada mas parece estar vazia ou invalida" -ForegroundColor Yellow
        }
    } else {
        Write-Host "[ERRO] VITE_SUPABASE_ANON_KEY NAO encontrada no .env" -ForegroundColor Red
        Write-Host "   Adicione: VITE_SUPABASE_ANON_KEY=sua_anon_key_aqui" -ForegroundColor Yellow
    }
    
    # Verificar se tem variaveis sem prefixo VITE_
    if ($envContent -match "SUPABASE_URL" -and $envContent -notmatch "VITE_SUPABASE_URL") {
        Write-Host "[AVISO] ATENCAO: Encontrada variavel SUPABASE_URL sem prefixo VITE_" -ForegroundColor Yellow
        Write-Host "   O Vite so carrega variaveis que comecam com VITE_" -ForegroundColor Yellow
        Write-Host "   Renomeie para: VITE_SUPABASE_URL" -ForegroundColor Yellow
    }
    
    if ($envContent -match "SUPABASE_ANON_KEY" -and $envContent -notmatch "VITE_SUPABASE_ANON_KEY") {
        Write-Host "[AVISO] ATENCAO: Encontrada variavel SUPABASE_ANON_KEY sem prefixo VITE_" -ForegroundColor Yellow
        Write-Host "   O Vite so carrega variaveis que comecam com VITE_" -ForegroundColor Yellow
        Write-Host "   Renomeie para: VITE_SUPABASE_ANON_KEY" -ForegroundColor Yellow
    }
    
    Write-Host ""
    Write-Host "Lembre-se:" -ForegroundColor Cyan
    Write-Host "   1. As variaveis do frontend DEVEM comecar com VITE_" -ForegroundColor White
    Write-Host "   2. Reinicie o servidor apos alterar o .env (npm run dev)" -ForegroundColor White
    Write-Host "   3. Verifique o console do navegador para mensagens de debug" -ForegroundColor White
    
} else {
    Write-Host "[ERRO] Arquivo .env NAO encontrado na raiz do projeto" -ForegroundColor Red
    Write-Host "   Crie um arquivo .env na raiz com:" -ForegroundColor Yellow
    Write-Host "   VITE_SUPABASE_URL=https://seu-projeto.supabase.co" -ForegroundColor Yellow
    Write-Host "   VITE_SUPABASE_ANON_KEY=sua_anon_key_aqui" -ForegroundColor Yellow
}

