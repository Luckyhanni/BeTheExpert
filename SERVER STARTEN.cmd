@echo off
setlocal EnableExtensions EnableDelayedExpansion
cd /d "%~dp0"
title Be the Expert - Expo Server

echo.
echo  ==========================================
echo       BE THE EXPERT - SERVER STARTEN
echo  ==========================================
echo.

where node >nul 2>&1
if errorlevel 1 goto :node_missing

where npm >nul 2>&1
if errorlevel 1 goto :npm_missing

for /f %%V in ('node -p "process.versions.node.split('.')[0]"') do set "BTE_NODE_MAJOR=%%V"
for /f "delims=" %%V in ('node --version') do set "BTE_NODE_VERSION=%%V"

echo  Node.js !BTE_NODE_VERSION! gefunden.

if !BTE_NODE_MAJOR! LSS 22 goto :node_version
if !BTE_NODE_MAJOR! GEQ 27 goto :node_version

if not exist "package.json" goto :wrong_folder

if not exist "node_modules\expo\package.json" (
  echo.
  echo  Die App-Pakete fehlen und werden jetzt installiert.
  echo  Dafuer wird eine Internetverbindung benoetigt.
  echo.
  call npm install
  if errorlevel 1 goto :install_failed
)

if /i "%BTE_LAUNCHER_TEST%"=="1" (
  echo.
  echo  Starttest erfolgreich.
  exit /b 0
)

echo.
echo  Server wird gestartet ...
echo.
echo  Danach:
echo    1. Expo Go auf dem Telefon oeffnen.
echo    2. Den angezeigten QR-Code scannen.
echo    3. Telefon und PC muessen im selben WLAN sein.
echo.
echo  Zum Beenden hier Strg+C druecken.
echo  Fuer die Browser-Vorschau im Serverfenster W druecken.
echo.

call npm run start:go
set "BTE_EXIT_CODE=!errorlevel!"

echo.
if not "!BTE_EXIT_CODE!"=="0" (
  echo  Der Server wurde mit einem Fehler beendet.
) else (
  echo  Der Server wurde beendet.
)
echo.
pause
exit /b !BTE_EXIT_CODE!

:node_missing
echo  FEHLER: Node.js wurde nicht gefunden.
echo  Bitte zuerst Node.js 24 LTS installieren und Windows neu starten.
goto :failed

:npm_missing
echo  FEHLER: npm wurde nicht gefunden.
echo  Bitte Node.js 24 LTS erneut installieren.
goto :failed

:node_version
echo.
echo  FEHLER: Diese App benoetigt Node.js 22 bis 26.
echo  Empfohlen ist Node.js 24 LTS.
goto :failed

:wrong_folder
echo  FEHLER: Die package.json wurde nicht gefunden.
echo  Der Start-Button muss im Hauptordner der App liegen.
goto :failed

:install_failed
echo.
echo  FEHLER: Die App-Pakete konnten nicht installiert werden.
echo  Bitte Internetverbindung pruefen und erneut versuchen.
goto :failed

:failed
echo.
pause
exit /b 1
