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

adb reverse tcp:8000 tcp:8000 2>$null
adb reverse tcp:8081 tcp:8081 2>$null

# LAN IP works on physical phones when adb reverse does not
powershell -ExecutionPolicy Bypass -File (Join-Path $PSScriptRoot 'sync-api-host-lan.ps1') | Out-Null
$lanLine = Get-Content (Join-Path $PSScriptRoot '..\src\config\api.local.js') -Raw
if ($lanLine -match "androidHost:\s*'([^']+)'") {
    $lanHost = $Matches[1]
    Write-Host "Device found. API: http://${lanHost}:8000 (same Wi-Fi as PC)`n" -ForegroundColor Green
}

if ($SkipBuild) {
    npx react-native start
} else {
    npx react-native run-android
}
