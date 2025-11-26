@echo off
echo ========================================
echo   Iniciando ngrok para Webhook Asaas
echo ========================================
echo.

REM Verificar se ngrok esta instalado
where ngrok >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo [ERRO] ngrok nao encontrado!
    echo.
    echo Por favor, instale o ngrok primeiro:
    echo   1. Via npm: npm install -g ngrok
    echo   2. Ou baixe em: https://ngrok.com/download
    echo.
    pause
    exit /b 1
)

echo [OK] ngrok encontrado!
echo.

REM Verificar se ja existe um processo ngrok rodando
tasklist | findstr /I "ngrok.exe" >nul 2>&1
if %ERRORLEVEL% EQU 0 (
    echo [AVISO] ngrok ja esta rodando!
    echo.
    echo Opcoes:
    echo   1. Parar o ngrok existente e iniciar um novo
    echo   2. Cancelar e usar o ngrok existente
    echo.
    choice /C 12 /N /M "Escolha uma opcao (1 ou 2): "
    
    if errorlevel 2 goto :cancel
    if errorlevel 1 goto :kill_ngrok
)

:start_ngrok
echo.
echo Certifique-se de que o backend esta rodando na porta 3000
echo.
echo Pressione qualquer tecla para iniciar o ngrok...
pause > nul
echo.
echo ========================================
echo   Iniciando ngrok na porta 3000...
echo ========================================
echo.
echo IMPORTANTE:
echo - Mantenha esta janela aberta
echo - Copie a URL HTTPS que aparecer abaixo
echo - Use essa URL no Asaas: https://xxxxx.ngrok.io/api/asaas/webhook
echo.
echo Pressione Ctrl+C para parar o ngrok
echo.
echo ========================================
echo.

ngrok http 3000

REM Se o ngrok fechar, mostrar mensagem
echo.
echo ========================================
echo   ngrok foi encerrado
echo ========================================
echo.
pause
exit /b 0

:kill_ngrok
echo.
echo [INFO] Parando processos ngrok existentes...
taskkill /F /IM ngrok.exe >nul 2>&1
timeout /t 2 /nobreak >nul
echo [OK] Processos ngrok parados.
goto :start_ngrok

:cancel
echo.
echo [INFO] Operacao cancelada. Usando ngrok existente.
echo.
echo Para ver a URL do ngrok, acesse: http://127.0.0.1:4040
echo.
pause
exit /b 0


echo   Iniciando ngrok para Webhook Asaas
echo ========================================
echo.

REM Verificar se ngrok esta instalado
where ngrok >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo [ERRO] ngrok nao encontrado!
    echo.
    echo Por favor, instale o ngrok primeiro:
    echo   1. Via npm: npm install -g ngrok
    echo   2. Ou baixe em: https://ngrok.com/download
    echo.
    pause
    exit /b 1
)

echo [OK] ngrok encontrado!
echo.

REM Verificar se ja existe um processo ngrok rodando
tasklist | findstr /I "ngrok.exe" >nul 2>&1
if %ERRORLEVEL% EQU 0 (
    echo [AVISO] ngrok ja esta rodando!
    echo.
    echo Opcoes:
    echo   1. Parar o ngrok existente e iniciar um novo
    echo   2. Cancelar e usar o ngrok existente
    echo.
    choice /C 12 /N /M "Escolha uma opcao (1 ou 2): "
    
    if errorlevel 2 goto :cancel
    if errorlevel 1 goto :kill_ngrok
)

:start_ngrok
echo.
echo Certifique-se de que o backend esta rodando na porta 3000
echo.
echo Pressione qualquer tecla para iniciar o ngrok...
pause > nul
echo.
echo ========================================
echo   Iniciando ngrok na porta 3000...
echo ========================================
echo.
echo IMPORTANTE:
echo - Mantenha esta janela aberta
echo - Copie a URL HTTPS que aparecer abaixo
echo - Use essa URL no Asaas: https://xxxxx.ngrok.io/api/asaas/webhook
echo.
echo Pressione Ctrl+C para parar o ngrok
echo.
echo ========================================
echo.

ngrok http 3000

REM Se o ngrok fechar, mostrar mensagem
echo.
echo ========================================
echo   ngrok foi encerrado
echo ========================================
echo.
pause
exit /b 0

:kill_ngrok
echo.
echo [INFO] Parando processos ngrok existentes...
taskkill /F /IM ngrok.exe >nul 2>&1
timeout /t 2 /nobreak >nul
echo [OK] Processos ngrok parados.
goto :start_ngrok

:cancel
echo.
echo [INFO] Operacao cancelada. Usando ngrok existente.
echo.
echo Para ver a URL do ngrok, acesse: http://127.0.0.1:4040
echo.
pause
exit /b 0


echo   Iniciando ngrok para Webhook Asaas
echo ========================================
echo.

REM Verificar se ngrok esta instalado
where ngrok >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo [ERRO] ngrok nao encontrado!
    echo.
    echo Por favor, instale o ngrok primeiro:
    echo   1. Via npm: npm install -g ngrok
    echo   2. Ou baixe em: https://ngrok.com/download
    echo.
    pause
    exit /b 1
)

echo [OK] ngrok encontrado!
echo.

REM Verificar se ja existe um processo ngrok rodando
tasklist | findstr /I "ngrok.exe" >nul 2>&1
if %ERRORLEVEL% EQU 0 (
    echo [AVISO] ngrok ja esta rodando!
    echo.
    echo Opcoes:
    echo   1. Parar o ngrok existente e iniciar um novo
    echo   2. Cancelar e usar o ngrok existente
    echo.
    choice /C 12 /N /M "Escolha uma opcao (1 ou 2): "
    
    if errorlevel 2 goto :cancel
    if errorlevel 1 goto :kill_ngrok
)

:start_ngrok
echo.
echo Certifique-se de que o backend esta rodando na porta 3000
echo.
echo Pressione qualquer tecla para iniciar o ngrok...
pause > nul
echo.
echo ========================================
echo   Iniciando ngrok na porta 3000...
echo ========================================
echo.
echo IMPORTANTE:
echo - Mantenha esta janela aberta
echo - Copie a URL HTTPS que aparecer abaixo
echo - Use essa URL no Asaas: https://xxxxx.ngrok.io/api/asaas/webhook
echo.
echo Pressione Ctrl+C para parar o ngrok
echo.
echo ========================================
echo.

ngrok http 3000

REM Se o ngrok fechar, mostrar mensagem
echo.
echo ========================================
echo   ngrok foi encerrado
echo ========================================
echo.
pause
exit /b 0

:kill_ngrok
echo.
echo [INFO] Parando processos ngrok existentes...
taskkill /F /IM ngrok.exe >nul 2>&1
timeout /t 2 /nobreak >nul
echo [OK] Processos ngrok parados.
goto :start_ngrok

:cancel
echo.
echo [INFO] Operacao cancelada. Usando ngrok existente.
echo.
echo Para ver a URL do ngrok, acesse: http://127.0.0.1:4040
echo.
pause
exit /b 0

