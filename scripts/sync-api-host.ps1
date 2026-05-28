# USB mode (recommended): 127.0.0.1 + adb reverse. For Wi-Fi-only use sync-api-host-lan.ps1.
$out = @"
/**
 * USB + adb reverse (default). Wi-Fi only: npm run api:sync-host-lan
 */
export default {
    port: 8000,
    host: null,
    androidHost: '127.0.0.1',
    androidUseUsbReverse: true,
    iosHost: '127.0.0.1',
};
"@

$path = Join-Path $PSScriptRoot '..\src\config\api.local.js'
Set-Content -Path $path -Value $out -Encoding UTF8
Write-Host "USB mode: androidHost = 127.0.0.1 (requires: adb reverse tcp:8000 tcp:8000)"
