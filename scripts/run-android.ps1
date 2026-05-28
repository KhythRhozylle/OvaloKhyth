# Fix ADB, forward port 8000 to Symfony, and run the Android app
param(
    [switch]$SkipBuild
)

$ErrorActionPreference = "Continue"

Write-Host "Restarting ADB..." -ForegroundColor Cyan
adb kill-server 2>$null
Start-Sleep -Seconds 2
adb start-server
Start-Sleep -Seconds 2

Write-Host "`nChecking for devices..." -ForegroundColor Cyan
$devices = adb devices
if ($devices -notmatch "device$") {
    Write-Host "`nNo emulator/device detected. Please:" -ForegroundColor Yellow
    Write-Host "  1. Open Android Studio > Device Manager" -ForegroundColor White
    Write-Host "  2. Start your emulator (Cold Boot Now recommended)" -ForegroundColor White
    Write-Host "  3. Wait until it's fully booted, then run this script again`n" -ForegroundColor White
    exit 1
}

Write-Host "Forwarding device port 8000 -> PC Symfony (127.0.0.1:8000)..." -ForegroundColor Cyan
adb reverse tcp:8000 tcp:8000
if ($LASTEXITCODE -ne 0) {
    Write-Host "adb reverse failed. Is Symfony running? Try: npm run symfony:start" -ForegroundColor Yellow
}

Write-Host "Device found. API base on Android: http://127.0.0.1:8000`n" -ForegroundColor Green

if ($SkipBuild) {
    npx react-native start
} else {
    npx react-native run-android
}
