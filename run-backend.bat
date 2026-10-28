@echo off
title CodeQualityBenchmarker - Spring Boot Backend (Port 8080)
echo ========================================================
echo   Starting CodeQualityBenchmarker Spring Boot Backend
echo   Port: 8080
echo   Health: http://localhost:8080/api/health
echo   Database: PostgreSQL (with embedded H2 resilience profile)
echo ========================================================

cd /d "%~dp0\server"
call mvnw.cmd spring-boot:run
pause
