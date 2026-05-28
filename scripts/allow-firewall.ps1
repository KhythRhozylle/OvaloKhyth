# Allow inbound TCP 8000 for physical phone on Wi-Fi (run as Administrator if it fails).
$ruleName = 'Florynn Dev API 8000'
$existing = Get-NetFirewallRule -DisplayName $ruleName -ErrorAction SilentlyContinue
if ($existing) {
    Write-Host "Firewall rule already exists: $ruleName"
} else {
    New-NetFirewallRule -DisplayName $ruleName -Direction Inbound -Action Allow -Protocol TCP -LocalPort 8000 | Out-Null
    Write-Host "Created firewall rule: $ruleName"
}
