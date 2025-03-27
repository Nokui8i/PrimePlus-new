@echo off
REM Kill any existing processes on ports 5000
for /f "tokens=5" %%a in ('netstat -ano ^| findstr :5000') do (
    taskkill /F /PID %%a 2>nul
)

echo Starting PrimePlus+ Backend Server...
cd /d %~dp0
npm run dev