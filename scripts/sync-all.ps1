# Full stack: MySQL + single API + mobile host config + firewall + API test
$ErrorActionPreference = "Continue"
$florynn = "c:\Users\khyth\Documents\florynn"
$ovalo = Split-Path $PSScriptRoot -Parent

Write-Host "=== Florynn + OVALO full sync ===" -ForegroundColor Cyan

if (Test-Path (Join-Path $florynn "scripts\stop-docker-app.ps1")) {
    & (Join-Path $florynn "scripts\stop-docker-app.ps1")
}

if (Get-Command docker -ErrorAction SilentlyContinue) {
    Push-Location $florynn
    $mysqlRunning = docker compose ps mysql 2>$null | Select-String -Pattern 'running'
    if (-not $mysqlRunning) {
        docker compose up -d mysql
        Start-Sleep -Seconds 8
    }
    Pop-Location
}

& (Join-Path $PSScriptRoot "start-backend.ps1")

$adb = Get-Command adb -ErrorAction SilentlyContinue
if ($adb) {
    $devices = adb devices 2>$null | Select-String "device$"
    if ($devices) {
        & (Join-Path $PSScriptRoot "sync-api-host.ps1")
        adb reverse tcp:8000 tcp:8000 2>$null
        Write-Host "USB device: adb reverse enabled" -ForegroundColor Green
    } else {
        & (Join-Path $PSScriptRoot "sync-api-host-lan.ps1")
        try {
            & (Join-Path $PSScriptRoot "allow-firewall.ps1")
        } catch {
            Write-Host "Run allow-firewall.ps1 as Administrator if Wi-Fi fails." -ForegroundColor Yellow
        }
    }
} else {
    & (Join-Path $PSScriptRoot "sync-api-host-lan.ps1")
}

Set-Location $ovalo
node scripts/test-api-connection.js

Write-Host "`nReload app: npm run start:reset then R on device" -ForegroundColor Cyan
