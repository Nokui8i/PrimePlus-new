@echo off
echo Starting PrimePlus+ Platform...
start cmd /k "cd %~dp0 && start-backend.bat"
timeout /t 5
start cmd /k "cd %~dp0 && start-frontend.bat"
echo Both services are starting in separate windows.