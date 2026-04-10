#!/bin/bash

# CareConnect - Quick Start Script
# This script will start both backend and frontend servers

echo ""
echo "========================================"
echo "  CareConnect - Online Health Platform"
echo "  Quick Start Script"
echo "========================================"
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "ERROR: Node.js is not installed"
    echo "Please install Node.js from https://nodejs.org/"
    exit 1
fi

echo "✓ Node.js detected"
node --version
echo ""

# Start Backend
echo "Starting Backend Server..."
echo ""

cd backend

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "Installing backend dependencies..."
    npm install
    echo ""
fi

echo ""
echo "========================================"
echo "Backend running on: http://localhost:5000"
echo "========================================"
echo ""

# Start backend server in background
npm run dev &
BACKEND_PID=$!

# Wait for backend to start
sleep 5

# Start Frontend
echo ""
echo "Starting Frontend Server..."
echo ""

cd ../frontend

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "Installing frontend dependencies..."
    npm install
    echo ""
fi

echo ""
echo "========================================"
echo "Frontend will open on: http://localhost:3000"
echo "========================================"
echo ""

# Start frontend server in background
npm start &
FRONTEND_PID=$!

echo ""
echo "✓ Both servers are starting..."
echo ""
echo "Backend:  http://localhost:5000"
echo "Frontend: http://localhost:3000"
echo ""
echo "Press Ctrl+C to stop both servers"
echo ""

# Wait for both processes
wait $BACKEND_PID $FRONTEND_PID

echo ""
echo "Servers stopped"
