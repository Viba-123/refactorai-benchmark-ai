@echo off
title CodeQualityBenchmarker - Full Stack Launcher
echo ========================================================
echo   Launching CodeQualityBenchmarker Platform
echo   - Backend: Spring Boot (Port 8080)
echo   - Frontend: React + Vite + Tailwind (Port 5173)
echo ========================================================

start "CodeQuality Backend" cmd /c "%~dp0\run-backend.bat"
timeout /t 3 /nobreak >nul
start "CodeQuality Frontend" cmd /c "%~dp0\run-frontend.bat"

echo.
echo Both services are starting in separate windows.
echo Frontend will be accessible at: http://localhost:5173
echo Backend will be accessible at:  http://localhost:8080/api/health
echo ========================================================
