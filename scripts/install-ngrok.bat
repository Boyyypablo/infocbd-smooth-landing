@echo off
echo ========================================
echo   Instalador do ngrok
echo ========================================
echo.

REM Verificar se ngrok ja esta instalado
where ngrok >nul 2>&1
if %ERRORLEVEL% EQU 0 (
    echo [OK] ngrok ja esta instalado!
    ngrok version
    echo.
    pause
    exit /b 0
)

echo ngrok nao encontrado. Instalando...
echo.

REM Verificar se npm esta instalado
where npm >nul 2>&1
if %ERRORLEVEL% EQU 0 (
    echo [INFO] npm encontrado. Instalando via npm...
    echo.
    npm install -g ngrok
    if %ERRORLEVEL% EQU 0 (
        echo.
        echo [SUCESSO] ngrok instalado com sucesso!
        echo.
        ngrok version
        echo.
        pause
        exit /b 0
    ) else (
        echo.
        echo [ERRO] Falha ao instalar via npm
        echo.
    )
) else (
    echo [INFO] npm nao encontrado
    echo.
)

echo ========================================
echo   Instalacao Manual Necessaria
echo ========================================
echo.
echo Por favor, instale o ngrok manualmente:
echo.
echo Opcao 1 - Download Direto:
echo   1. Acesse: https://ngrok.com/download
echo   2. Baixe para Windows
echo   3. Extraia o ngrok.exe
echo   4. Adicione ao PATH ou coloque na pasta do projeto
echo.
echo Opcao 2 - Via Chocolatey (se tiver instalado):
echo   choco install ngrok
echo.
echo Opcao 3 - Via npm (se tiver Node.js):
echo   npm install -g ngrok
echo.
pause

echo ========================================
echo   Instalador do ngrok
echo ========================================
echo.

REM Verificar se ngrok ja esta instalado
where ngrok >nul 2>&1
if %ERRORLEVEL% EQU 0 (
    echo [OK] ngrok ja esta instalado!
    ngrok version
    echo.
    pause
    exit /b 0
)

echo ngrok nao encontrado. Instalando...
echo.

REM Verificar se npm esta instalado
where npm >nul 2>&1
if %ERRORLEVEL% EQU 0 (
    echo [INFO] npm encontrado. Instalando via npm...
    echo.
    npm install -g ngrok
    if %ERRORLEVEL% EQU 0 (
        echo.
        echo [SUCESSO] ngrok instalado com sucesso!
        echo.
        ngrok version
        echo.
        pause
        exit /b 0
    ) else (
        echo.
        echo [ERRO] Falha ao instalar via npm
        echo.
    )
) else (
    echo [INFO] npm nao encontrado
    echo.
)

echo ========================================
echo   Instalacao Manual Necessaria
echo ========================================
echo.
echo Por favor, instale o ngrok manualmente:
echo.
echo Opcao 1 - Download Direto:
echo   1. Acesse: https://ngrok.com/download
echo   2. Baixe para Windows
echo   3. Extraia o ngrok.exe
echo   4. Adicione ao PATH ou coloque na pasta do projeto
echo.
echo Opcao 2 - Via Chocolatey (se tiver instalado):
echo   choco install ngrok
echo.
echo Opcao 3 - Via npm (se tiver Node.js):
echo   npm install -g ngrok
echo.
pause

echo ========================================
echo   Instalador do ngrok
echo ========================================
echo.

REM Verificar se ngrok ja esta instalado
where ngrok >nul 2>&1
if %ERRORLEVEL% EQU 0 (
    echo [OK] ngrok ja esta instalado!
    ngrok version
    echo.
    pause
    exit /b 0
)

echo ngrok nao encontrado. Instalando...
echo.

REM Verificar se npm esta instalado
where npm >nul 2>&1
if %ERRORLEVEL% EQU 0 (
    echo [INFO] npm encontrado. Instalando via npm...
    echo.
    npm install -g ngrok
    if %ERRORLEVEL% EQU 0 (
        echo.
        echo [SUCESSO] ngrok instalado com sucesso!
        echo.
        ngrok version
        echo.
        pause
        exit /b 0
    ) else (
        echo.
        echo [ERRO] Falha ao instalar via npm
        echo.
    )
) else (
    echo [INFO] npm nao encontrado
    echo.
)

echo ========================================
echo   Instalacao Manual Necessaria
echo ========================================
echo.
echo Por favor, instale o ngrok manualmente:
echo.
echo Opcao 1 - Download Direto:
echo   1. Acesse: https://ngrok.com/download
echo   2. Baixe para Windows
echo   3. Extraia o ngrok.exe
echo   4. Adicione ao PATH ou coloque na pasta do projeto
echo.
echo Opcao 2 - Via Chocolatey (se tiver instalado):
echo   choco install ngrok
echo.
echo Opcao 3 - Via npm (se tiver Node.js):
echo   npm install -g ngrok
echo.
pause




