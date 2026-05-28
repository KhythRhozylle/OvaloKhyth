/**
 * Tests mobile API — production Railway + optional local hosts.
 */
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

function readApiLocal() {
    try {
        const file = fs.readFileSync(
            path.join(__dirname, '../src/config/api.local.js'),
            'utf8',
        );
        const prodMatch = file.match(/productionUrl:\s*['"]([^'"]+)['"]/);
        const targetMatch = file.match(/apiTarget:\s*['"]([^'"]+)['"]/);
        return {
            productionUrl: prodMatch?.[1],
            apiTarget: targetMatch?.[1] || 'local',
        };
    } catch {
        return { productionUrl: null, apiTarget: 'local' };
    }
}

function detectLanIp() {
    try {
        const out = execSync(
            'powershell -NoProfile -Command "(Get-NetIPAddress -AddressFamily IPv4 | Where-Object { $_.IPAddress -notlike \'127.*\' -and $_.PrefixOrigin -eq \'Dhcp\' } | Select-Object -First 1).IPAddress"',
            { encoding: 'utf8' },
        ).trim();
        return out || null;
    } catch {
        return null;
    }
}

const config = readApiLocal();
const port = 8000;

async function test(label, baseUrl) {
    const url = `${baseUrl.replace(/\/$/, '')}/api/mobile/products`;
    try {
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 25000);
        const res = await fetch(url, { signal: controller.signal });
        clearTimeout(timeout);
        const json = await res.json();
        const list = Array.isArray(json?.data) ? json.data : [];
        const names = list.map(p => p.name).join(', ') || '(none)';
        console.log(`OK  [${label}] ${url}`);
        console.log(`    → ${list.length} products: ${names}`);
        return true;
    } catch (e) {
        console.log(`FAIL [${label}] ${url}`);
        console.log(`    → ${e.message}`);
        return false;
    }
}

(async () => {
    console.log('Florynn mobile API test\n');
    console.log(`api.local.js → apiTarget: ${config.apiTarget}\n`);

    let anyOk = false;

    if (config.productionUrl) {
        if (await test('Railway production', config.productionUrl)) {
            anyOk = true;
        }
    }

    if (config.apiTarget === 'local') {
        const lan = detectLanIp();
        const localHosts = ['127.0.0.1', ...(lan ? [lan] : []), '10.0.2.2'];
        for (const host of localHosts) {
            if (await test(`local ${host}`, `http://${host}:${port}`)) {
                anyOk = true;
            }
        }
    }

    if (!anyOk) {
        console.log('\nNo API reachable.');
        process.exit(1);
    }

    if (config.apiTarget !== 'production') {
        console.log('\nAdmin is on Railway? Run: npm run api:use-production');
    } else {
        console.log('\nMobile is set to Railway — reload the app (start:reset).');
    }
})();
