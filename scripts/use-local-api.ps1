$out = @"
/**
 * Local Symfony on your PC (npm run dev:connect).
 */
export default {
    apiTarget: 'local',
    productionUrl: 'https://finaldeployment-production-1b57.up.railway.app',
    port: 8000,
    host: null,
    androidHost: '127.0.0.1',
    androidUseUsbReverse: true,
    iosHost: '127.0.0.1',
};
"@
$path = Join-Path $PSScriptRoot '..\src\config\api.local.js'
Set-Content -Path $path -Value $out -Encoding UTF8
Write-Host "Mobile API → local dev (127.0.0.1:8000)" -ForegroundColor Green
Write-Host "Run: npm run dev:connect" -ForegroundColor Yellow
