# Skyriting Dev Server Restart Script
Write-Host "🔄 Restarting Skyriting Development Server..." -ForegroundColor Cyan
Write-Host ""

# Stop any running Node processes (optional - be careful)
# Get-Process | Where-Object {$_.ProcessName -eq "node"} | Stop-Process -Force -ErrorAction SilentlyContinue

# Clear Vite cache
if (Test-Path ".vite") {
    Remove-Item -Recurse -Force .vite
    Write-Host "✅ Cleared Vite cache" -ForegroundColor Green
}

# Clear dist folder if exists
if (Test-Path "dist") {
    Remove-Item -Recurse -Force dist
    Write-Host "✅ Cleared dist folder" -ForegroundColor Green
}

Write-Host ""
Write-Host "🚀 Starting development server..." -ForegroundColor Yellow
Write-Host "📝 After server starts:" -ForegroundColor Cyan
Write-Host "   1. Open http://localhost:5173" -ForegroundColor White
Write-Host "   2. Press Ctrl+Shift+R to hard refresh" -ForegroundColor White
Write-Host "   3. Check browser console (F12) for errors" -ForegroundColor White
Write-Host ""

# Start the dev server
npm run dev
