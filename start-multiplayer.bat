@echo off
echo Checking if Node.js is installed...
where node >nul 2>nul
if %ERRORLEVEL% neq 0 (
    echo Node.js is not installed. Please install it from https://nodejs.org/
    exit /b 1
)

echo Checking if npm is installed...
where npm >nul 2>nul
if %ERRORLEVEL% neq 0 (
    echo npm is not installed. Please install it from https://nodejs.org/
    exit /b 1
)

if not exist node_modules (
    echo Installing dependencies...
    call npm install
)

echo Starting the server...
start /b cmd /c "node server.js"

echo Waiting for server to start...
timeout /t 2 /nobreak >nul

echo Opening multiplayer.html in your browser...
start multiplayer.html

echo Server is running. Press Ctrl+C to stop.
echo To close the server, close this window.
pause >nul