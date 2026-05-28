# Start Florynn API (one server on 0.0.0.0:8000 for admin + mobile).
$florynn = "c:\Users\khyth\Documents\florynn"

Write-Host "Florynn backend for mobile dev" -ForegroundColor Cyan
Write-Host "Project: $florynn`n" -ForegroundColor DarkGray

$stopDocker = Join-Path $florynn "scripts\stop-docker-app.ps1"
if (Test-Path $stopDocker) {
    & $stopDocker
}

$startScript = Join-Path $florynn "scripts\start-dev-server.ps1"
if (Test-Path $startScript) {
    & $startScript -ProjectDir $florynn
} else {
    Write-Host "Missing $startScript — run .\serve-mobile.ps1 from florynn instead." -ForegroundColor Red
    exit 1
}

Start-Sleep -Seconds 2

try {
    $status = Invoke-RestMethod -Uri 'http://127.0.0.1:8000/api/mobile/status' -TimeoutSec 20
    Write-Host "OK  http://127.0.0.1:8000 — $($status.productCount) products" -ForegroundColor Green
} catch {
    Write-Host "WARN 127.0.0.1: $($_.Exception.Message)" -ForegroundColor Yellow
}

$ip = (
    Get-NetIPAddress -AddressFamily IPv4 |
    Where-Object { $_.IPAddress -notlike '127.*' -and $_.PrefixOrigin -eq 'Dhcp' } |
    Select-Object -First 1 -ExpandProperty IPAddress
)
if ($ip) {
    try {
        $status = Invoke-RestMethod -Uri "http://${ip}:8000/api/mobile/status" -TimeoutSec 10
        Write-Host "OK  http://${ip}:8000 — $($status.productCount) products (physical phone)" -ForegroundColor Green
    } catch {
        Write-Host "WARN LAN http://${ip}:8000 — run npm run api:firewall as Administrator" -ForegroundColor Yellow
    }
}

Write-Host "`nNext: cd ovalo && npm run dev:connect" -ForegroundColor Cyan
