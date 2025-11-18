# MongoDB Connection Fix - Permanent Solution
# This script helps you fix MongoDB connection timeouts permanently

Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "   MONGODB CONNECTION FIX" -ForegroundColor Cyan
Write-Host "========================================`n" -ForegroundColor Cyan

# Get current IP
Write-Host "🔍 Finding your IP address..." -ForegroundColor Yellow
try {
    $yourIP = Invoke-RestMethod -Uri "https://api.ipify.org"
    Write-Host "✅ Your IP Address: $yourIP`n" -ForegroundColor Green
} catch {
    Write-Host "❌ Could not get IP address. Please get it manually from https://whatismyip.com`n" -ForegroundColor Red
    $yourIP = Read-Host "Enter your IP address manually"
}

Write-Host "📝 INSTRUCTIONS TO FIX MONGODB:`n" -ForegroundColor Yellow
Write-Host "1. Go to: https://cloud.mongodb.com" -ForegroundColor White
Write-Host "2. Login with your MongoDB account" -ForegroundColor White
Write-Host "3. Select 'Cluster0' (your cluster)" -ForegroundColor White
Write-Host "4. Click 'Network Access' in the left sidebar" -ForegroundColor White
Write-Host "5. Click 'ADD IP ADDRESS' button" -ForegroundColor White
Write-Host "6. Option A (Secure): Enter: $yourIP" -ForegroundColor Green
Write-Host "   Option B (ALL IPs - Development only): Enter: 0.0.0.0/0" -ForegroundColor Yellow
Write-Host "7. Click 'Confirm'`n" -ForegroundColor White

Write-Host "⏱️  Wait 1-2 minutes for MongoDB to update...`n" -ForegroundColor Cyan

# Ask if they've done it
$done = Read-Host "Have you added your IP to MongoDB Atlas? (yes/no)"
if ($done -eq "yes" -or $done -eq "y") {
    Write-Host "`n✅ Great! Now restarting servers with MongoDB connection...`n" -ForegroundColor Green
    
    # Stop old processes
    Write-Host "🛑 Stopping old processes..." -ForegroundColor Yellow
    Stop-Process -Name node -Force -ErrorAction SilentlyContinue
    Start-Sleep -Seconds 2
    
    # Set MongoDB URI
    $env:MONGODB_URI = "mongodb+srv://madudamian25_db_user:sopuluchukwu@cluster0.t1jvgmx.mongodb.net/my_elearning?retryWrites=true&w=majority&appName=Cluster0"
    
    Write-Host "🚀 Starting servers...`n" -ForegroundColor Green
    npm run dev:all
} else {
    Write-Host "`n⚠️  Please complete the MongoDB Atlas whitelist steps above first." -ForegroundColor Yellow
    Write-Host "Then run this script again." -ForegroundColor Yellow
}

