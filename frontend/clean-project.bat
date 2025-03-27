@echo off
echo Cleaning up duplicate files...

echo Removing TypeScript duplicate files...
if exist src\pages\_app.tsx del src\pages\_app.tsx
if exist src\pages\index.tsx del src\pages\index.tsx
if exist src\pages\login.tsx del src\pages\login.tsx

echo Installing missing dependencies...
npm install react-hook-form

echo Setup complete! You can now run 'npm run dev'