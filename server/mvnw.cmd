@echo off
REM CodeQualityBenchmarker Maven Wrapper Script
setlocal

set "USER_MVN=C:\Users\vibak\.m2\wrapper\dists\apache-maven-3.9.16-bin\5grr65jo27hi51sujmtcldfovl\apache-maven-3.9.16\bin\mvn.cmd"

if exist "%USER_MVN%" (
    call "%USER_MVN%" %*
    exit /b %ERRORLEVEL%
)

where mvn >nul 2>nul
if %ERRORLEVEL% equ 0 (
    call mvn %*
    exit /b %ERRORLEVEL%
)

echo [ERROR] Maven not found. Please verify Maven installation or run using the configured wrapper.
exit /b 1
