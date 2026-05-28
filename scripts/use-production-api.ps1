$out = @"
/**
 * Railway production — same database as admin dashboard.
 */
export default {
    apiTarget: 'production',
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
Write-Host "Mobile API → Railway production (admin dashboard)" -ForegroundColor Green
Write-Host "  https://finaldeployment-production-1b57.up.railway.app" -ForegroundColor Cyan
Write-Host "Reload the app (npm run start:reset) to apply." -ForegroundColor Yellow
