@echo off
title CodeQualityBenchmarker - React Vite Frontend (Port 5173)
echo ========================================================
echo   Starting CodeQualityBenchmarker Frontend (React + Vite)
echo   URL: http://localhost:5173
echo ========================================================

cd /d "%~dp0\client"
npm run dev
pause
