@echo off
echo Running fix-all script to resolve project issues...
cd %~dp0
powershell -ExecutionPolicy Bypass -File fix-all.ps1
echo.
echo If successful, now run: npm run dev
pause