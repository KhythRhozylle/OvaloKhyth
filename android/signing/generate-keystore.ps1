# Regenerates ovalo/android/app/debug.keystore using issuer.properties (CN / O / C).
$ErrorActionPreference = 'Stop'

$propsPath = Join-Path $PSScriptRoot 'issuer.properties'
$props = @{}
Get-Content $propsPath | ForEach-Object {
    if ($_ -match '^\s*([^#=]+)=(.*)$') {
        $props[$matches[1].Trim()] = $matches[2].Trim()
    }
}

$name = $props['issuer.name']
$org = $props['issuer.organization']
$country = $props['issuer.country']

if (-not $name -or -not $org -or -not $country) {
    throw "issuer.properties must define issuer.name, issuer.organization, and issuer.country"
}

$dname = "CN=$name, OU=Android, O=$org, C=$country"
$keystore = Join-Path $PSScriptRoot '..\app\debug.keystore'

if (Test-Path $keystore) {
    $backup = "$keystore.bak-$(Get-Date -Format 'yyyyMMdd-HHmmss')"
    Copy-Item $keystore $backup
    Write-Host "Backed up existing keystore to $backup"
    Remove-Item $keystore
}

$keytool = Get-Command keytool -ErrorAction SilentlyContinue
if (-not $keytool) {
    throw "keytool not found. Install a JDK and ensure keytool is on PATH."
}

& keytool -genkeypair -v `
    -storetype PKCS12 `
    -keystore $keystore `
    -alias androiddebugkey `
    -keyalg RSA `
    -keysize 2048 `
    -validity 10000 `
    -storepass android `
    -keypass android `
    -dname $dname

Write-Host "Created $keystore" -ForegroundColor Green
Write-Host "  Owner/Issuer: $dname" -ForegroundColor Cyan
Write-Host "If you use Google Sign-In, update the Android OAuth client SHA-1:" -ForegroundColor Yellow
Write-Host "  cd ovalo/android; .\gradlew signingReport" -ForegroundColor Yellow
