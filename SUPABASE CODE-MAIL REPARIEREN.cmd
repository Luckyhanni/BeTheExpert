@echo off
setlocal
cd /d "%~dp0"
title Be the Expert - Code-Mail reparieren
node scripts\repair-login-email.mjs --apply
echo.
pause
