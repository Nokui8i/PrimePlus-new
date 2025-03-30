# Fix all issues in the frontend project
Write-Host "Starting fix-all script..." -ForegroundColor Green

# First, remove all the conflicting typescript files
Write-Host "Removing duplicate TypeScript files..." -ForegroundColor Yellow
Remove-Item -Path "src\pages\_app.tsx" -Force -ErrorAction SilentlyContinue
Remove-Item -Path "src\pages\index.tsx" -Force -ErrorAction SilentlyContinue
Remove-Item -Path "src\pages\login.tsx" -Force -ErrorAction SilentlyContinue

# Install required dependencies
Write-Host "Installing dependencies..." -ForegroundColor Yellow
npm install --save react-hook-form

# Create a components/feed folder if it doesn't exist
Write-Host "Creating missing directories..." -ForegroundColor Yellow
New-Item -ItemType Directory -Path "src\components\feed" -Force -ErrorAction SilentlyContinue

# Create a minimal ContentFeed component
Write-Host "Creating ContentFeed component..." -ForegroundColor Yellow
$contentFeed = @"
import React from 'react';

const ContentFeed = () => {
  return (
    <div className="space-y-4">
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="p-4 border-b">
          <p className="text-gray-500 text-sm">No content available yet. Subscribe to creators to see their content here.</p>
        </div>
      </div>
    </div>
  );
};

export default ContentFeed;
"@

Set-Content -Path "src\components\feed\ContentFeed.jsx" -Value $contentFeed

Write-Host "Fix complete! You can now run 'npm run dev'" -ForegroundColor Green