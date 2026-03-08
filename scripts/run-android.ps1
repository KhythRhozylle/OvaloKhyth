# Fix ADB and run React Native Android app
# Use this when you get "device offline" errors

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

Write-Host "Device found. Running app...`n" -ForegroundColor Green
npx react-native run-android
