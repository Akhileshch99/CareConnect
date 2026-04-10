@echo off
REM CareConnect - Quick Start Script
REM This script will start both backend and frontend servers

echo.
echo ========================================
echo   CareConnect - Online Health Platform
echo   Quick Start Script
echo ========================================
echo.

REM Check if Node.js is installed
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Node.js is not installed or not in PATH
    echo Please install Node.js from https://nodejs.org/
    pause
    exit /b 1
)

echo ✓ Node.js detected
echo.

REM Start Backend
echo Starting Backend Server...
echo.
cd backend

REM Check if node_modules exists
if not exist "node_modules" (
    echo Installing backend dependencies...
    call npm install
    echo.
)

echo.
echo ========================================
echo Backend running on: http://localhost:5000
echo Press Ctrl+C to stop
echo ========================================
echo.

REM Start backend server in new window
start cmd /k "npm run dev"

REM Wait for backend to start
timeout /t 5 /nobreak

REM Start Frontend
echo.
echo Starting Frontend Server...
echo.
cd ..\frontend

REM Check if node_modules exists
if not exist "node_modules" (
    echo Installing frontend dependencies...
    call npm install
    echo.
)

echo.
echo ========================================
echo Frontend will open on: http://localhost:3000
echo Press Ctrl+C to stop
echo ========================================
echo.

REM Start frontend server in new window
start cmd /k "npm start"

echo.
echo ✓ Both servers are starting...
echo.
echo Backend:  http://localhost:5000
echo Frontend: http://localhost:3000
echo.
echo Press any key to continue or close this window...
pause

exit /b 0
