# Clean TypeScript files that are duplicating JSX files
Write-Host "Cleaning up duplicate TypeScript files..."

# Remove the TypeScript versions of pages that we've already created in JSX
$filesToDelete = @(
    "src\pages\_app.tsx",
    "src\pages\index.tsx",
    "src\pages\login.tsx"
)

foreach ($file in $filesToDelete) {
    $path = Join-Path -Path (Get-Location) -ChildPath $file
    if (Test-Path $path) {
        Write-Host "Removing $file"
        Remove-Item $path -Force
    } else {
        Write-Host "$file not found, skipping"
    }
}

# Fix import path issues by creating a jsconfig.json file for path mapping
$jsConfig = @"
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
"@

$jsConfigPath = Join-Path -Path (Get-Location) -ChildPath "jsconfig.json"
Write-Host "Creating jsconfig.json for path mapping"
Set-Content -Path $jsConfigPath -Value $jsConfig

Write-Host "Installing required packages..."
npm install react-hook-form

Write-Host "Clean-up complete!"