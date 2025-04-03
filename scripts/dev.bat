@echo off
echo Starting development environment...

:: Start MongoDB (if not running)
docker ps | findstr mongodb >nul
if errorlevel 1 (
    echo Starting MongoDB...
    docker run --name mongodb -p 27017:27017 -d mongo
)

:: Start backend server
echo Starting backend server...
start cmd /k "cd backend && npm run dev"

:: Start frontend server
echo Starting frontend server...
start cmd /k "cd frontend && npm run dev"

echo Development environment started!
echo Press Ctrl+C to stop all services...

:: Keep the window open
pause 