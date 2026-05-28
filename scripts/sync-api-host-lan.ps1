# Use when phone is on Wi-Fi only (no USB / no adb reverse).
$ip = (
    Get-NetIPAddress -AddressFamily IPv4 |
    Where-Object {
        $_.IPAddress -notlike '127.*' -and
        $_.IPAddress -notlike '169.254.*' -and
        $_.PrefixOrigin -eq 'Dhcp'
    } |
    Select-Object -First 1 -ExpandProperty IPAddress
)
if (-not $ip) { $ip = '192.168.1.16' }

$out = @"
export default {
    port: 8000,
    host: null,
    androidHost: '$ip',
    /** Wi-Fi phone: do not probe 127.0.0.1 first (that is the phone, not your PC) */
    androidUseUsbReverse: false,
    iosHost: '127.0.0.1',
};
"@
$path = Join-Path $PSScriptRoot '..\src\config\api.local.js'
Set-Content -Path $path -Value $out -Encoding UTF8
Write-Host "LAN mode: androidHost = $ip (phone must be on same Wi-Fi; allow firewall port 8000)"
