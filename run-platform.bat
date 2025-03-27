@echo off
echo Starting PrimePlus+ Platform...

:: Create the database first if it doesn't exist
echo Initializing database...
cd backend
call npm run db:init

:: Start backend server in new window
echo Starting backend server...
start cmd /k "cd %~dp0\backend && npm run dev"

:: Wait for backend to start
timeout /t 5 > nul

:: Start frontend in new window
echo Starting frontend...
start cmd /k "cd %~dp0\frontend && npm run dev"

echo.
echo PrimePlus+ platform is starting up!
echo Backend server: http://localhost:5000
echo Frontend application: http://localhost:3000
echo.
echo Press any key to exit this window (services will continue running)
pause > nul