# Start API + configure phone (USB adb reverse or Wi-Fi LAN).
$ErrorActionPreference = "Continue"

Write-Host "=== OVALO dev connect ===" -ForegroundColor Cyan

$florynn = "c:\Users\khyth\Documents\florynn"
$stopDocker = Join-Path $florynn "scripts\stop-docker-app.ps1"
if (Test-Path $stopDocker) {
    & $stopDocker
}

& (Join-Path $PSScriptRoot 'start-backend.ps1')

$useUsb = $false
if (Get-Command adb -ErrorAction SilentlyContinue) {
    $devices = adb devices 2>$null | Select-String "device$"
    if ($devices) {
        $useUsb = $true
        & (Join-Path $PSScriptRoot 'sync-api-host.ps1')
        adb reverse tcp:8000 tcp:8000 2>$null
        adb reverse tcp:8081 tcp:8081 2>$null
        Write-Host "USB device detected — adb reverse enabled (127.0.0.1:8000)" -ForegroundColor Green
    }
}

if (-not $useUsb) {
    Write-Host "No USB device — using Wi-Fi LAN IP..." -ForegroundColor Cyan
    & (Join-Path $PSScriptRoot 'sync-api-host-lan.ps1')
    try {
        & (Join-Path $PSScriptRoot 'allow-firewall.ps1')
    } catch {
        Write-Host "Firewall: run 'npm run api:firewall' as Administrator if Wi-Fi fails." -ForegroundColor Yellow
    }
}

Set-Location (Join-Path $PSScriptRoot '..')
node scripts/test-api-connection.js

Write-Host ""
Write-Host "Reload the app:" -ForegroundColor Yellow
Write-Host "  npm run start:reset" -ForegroundColor White
Write-Host "  then press R on the phone/emulator" -ForegroundColor White
