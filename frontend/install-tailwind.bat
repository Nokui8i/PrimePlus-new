@echo off
echo Installing Tailwind CSS and dependencies...
npm install -D tailwindcss postcss autoprefixer

echo Creating Tailwind configuration files...
npx tailwindcss init -p

echo Checking for duplicate files that may cause conflicts...
if exist src\pages\_app.tsx (
  echo Removing duplicate _app.tsx file...
  del src\pages\_app.tsx
)

if exist src\pages\index.tsx (
  echo Removing duplicate index.tsx file...
  del src\pages\index.tsx
)

if exist src\pages\login.tsx (
  echo Removing duplicate login.tsx file...
  del src\pages\login.tsx
)

echo Installing required dependencies...
npm install react-hook-form

echo Creating Tailwind CSS configuration...
echo module.exports = {
echo   content: [
echo     "./src/pages/**/*.{js,ts,jsx,tsx}",
echo     "./src/components/**/*.{js,ts,jsx,tsx}",
echo   ],
echo   theme: {
echo     extend: {},
echo   },
echo   plugins: [],
echo } > tailwind.config.js

echo module.exports = {
echo   plugins: {
echo     tailwindcss: {},
echo     autoprefixer: {},
echo   },
echo } > postcss.config.js

echo @tailwind base;
echo @tailwind components;
echo @tailwind utilities;
echo.
echo html,
echo body {
echo   padding: 0;
echo   margin: 0;
echo   font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen,
echo     Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue, sans-serif;
echo }
echo.
echo a {
echo   color: inherit;
echo   text-decoration: none;
echo }
echo.
echo * {
echo   box-sizing: border-box;
echo } > src\styles\globals.css

echo Installation complete! Run 'npm run dev' to start the development server.