import AsyncStorage from '@react-native-async-storage/async-storage';

import localConfig from './api.local';

const STORAGE_KEY = '@florynn/dev_api_base';
const PROBE_PATH = '/api/mobile/products';
const PROBE_MS = 4000;

let cachedBaseUrl = null;

function buildBaseUrl(host) {
    const port = localConfig?.port ?? 8000;
    const clean = (host || '').trim().replace(/^https?:\/\//, '').split('/')[0];
    if (!clean) {
        return null;
    }
    return `http://${clean}:${port}`;
}

function candidateHosts() {
    const hosts = [];
    if (localConfig?.androidUseUsbReverse) {
        hosts.push('127.0.0.1');
    }
    const lan = localConfig?.androidHost?.trim();
    if (lan && !hosts.includes(lan)) {
        hosts.push(lan);
    }
    if (!hosts.length) {
        hosts.push('10.0.2.2');
    }
    return hosts;
}

export function defaultAndroidApiBase() {
    const hosts = candidateHosts();
    return buildBaseUrl(hosts[0]);
}

export function setDevApiBaseUrl(baseUrl) {
    cachedBaseUrl = baseUrl ? baseUrl.replace(/\/$/, '') : null;
}

export function getDevApiBaseUrlSync() {
    if (cachedBaseUrl) {
        return cachedBaseUrl;
    }
    return defaultAndroidApiBase();
}

async function probeHost(host) {
    const base = buildBaseUrl(host);
    if (!base) {
        return false;
    }
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), PROBE_MS);
    try {
        const res = await fetch(`${base}${PROBE_PATH}`, {
            headers: { Accept: 'application/json' },
            signal: controller.signal,
        });
        return res.ok;
    } catch {
        return false;
    } finally {
        clearTimeout(timer);
    }
}

async function pickReachableBaseUrl() {
    for (const host of candidateHosts()) {
        if (await probeHost(host)) {
            const base = buildBaseUrl(host);
            cachedBaseUrl = base;
            await AsyncStorage.setItem(STORAGE_KEY, base);
            return base;
        }
    }
    cachedBaseUrl = defaultAndroidApiBase();
    return cachedBaseUrl;
}

export async function loadDevApiBaseUrl() {
    try {
        const stored = await AsyncStorage.getItem(STORAGE_KEY);
        if (stored) {
            const base = stored.replace(/\/$/, '');
            if (await probeHost(base.replace(/^https?:\/\//, '').split(':')[0])) {
                cachedBaseUrl = base;
                return cachedBaseUrl;
            }
            await AsyncStorage.removeItem(STORAGE_KEY);
        }
    } catch {
        // ignore
    }
    return pickReachableBaseUrl();
}

export async function saveDevApiBaseUrlFromHost(host) {
    const base = buildBaseUrl(host);
    if (!base) {
        return null;
    }
    cachedBaseUrl = base;
    await AsyncStorage.setItem(STORAGE_KEY, base);
    return base;
}
