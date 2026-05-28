# Full clean: Metro cache, Android build, uninstall app, reinstall.
$ErrorActionPreference = "Stop"
$root = Split-Path $PSScriptRoot -Parent
Set-Location $root

Write-Host "Stopping Metro / Node on port 8081..."
Get-NetTCPConnection -LocalPort 8081 -ErrorAction SilentlyContinue |
    ForEach-Object { Stop-Process -Id $_.OwningProcess -Force -ErrorAction SilentlyContinue }

Write-Host "Clearing Metro and Gradle caches..."
Remove-Item -Recurse -Force "$env:TEMP\metro-*" -ErrorAction SilentlyContinue
Remove-Item -Recurse -Force "$env:TEMP\haste-map-*" -ErrorAction SilentlyContinue
Remove-Item -Recurse -Force "$root\node_modules\.cache" -ErrorAction SilentlyContinue
Remove-Item -Recurse -Force "$root\android\app\build" -ErrorAction SilentlyContinue
Remove-Item -Recurse -Force "$root\android\build" -ErrorAction SilentlyContinue
Remove-Item -Force "$root\android\app\src\main\assets\index.android.bundle" -ErrorAction SilentlyContinue

Write-Host "Uninstalling app from device..."
adb uninstall com.helloworld 2>$null

Write-Host "Gradle clean..."
Set-Location "$root\android"
.\gradlew clean
Set-Location $root

Write-Host "Done. Next steps:"
Write-Host "  1. npm run start:reset"
Write-Host "  2. In another terminal: npx react-native run-android"
