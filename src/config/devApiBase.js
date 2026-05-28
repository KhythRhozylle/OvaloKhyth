import AsyncStorage from '@react-native-async-storage/async-storage';

import {
    buildLocalBaseUrl,
    getLocalCandidateHosts,
    getProductionBaseUrl,
    isProductionTarget,
} from './apiConfig';
import { logApi } from './apiLogger';

const STORAGE_KEY = '@florynn/dev_api_base';
const PROBE_MS = 12000;

let cachedBaseUrl = null;

export function defaultAndroidApiBase() {
    if (isProductionTarget()) {
        return getProductionBaseUrl();
    }
    const hosts = getLocalCandidateHosts();
    return buildLocalBaseUrl(hosts[0]);
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

function normalizeStoredBase(stored) {
    const raw = (stored || '').trim().replace(/\/$/, '');
    if (!raw) {
        return null;
    }
    if (/^https?:\/\//i.test(raw)) {
        return raw;
    }
    return buildLocalBaseUrl(raw);
}

async function probeBaseUrl(baseUrl) {
    if (!baseUrl) {
        return { ok: false, count: 0 };
    }
    const paths = ['/api/mobile/shop', '/api/mobile/products'];
    for (const path of paths) {
        const controller = new AbortController();
        const timer = setTimeout(() => controller.abort(), PROBE_MS);
        try {
            const res = await fetch(`${baseUrl}${path}`, {
                headers: { Accept: 'application/json' },
                signal: controller.signal,
            });
            if (!res.ok) {
                continue;
            }
            const json = await res.json();
            const count =
                Number(json?.productCount) ||
                Number(json?.count) ||
                (Array.isArray(json?.data) ? json.data.length : 0);
            logApi('probe OK', { baseUrl, path, count });
            return { ok: true, count };
        } catch (e) {
            logApi('probe fail', { baseUrl, path, error: e.message });
        } finally {
            clearTimeout(timer);
        }
    }
    return { ok: false, count: 0 };
}

async function pickReachableBaseUrl() {
    if (isProductionTarget()) {
        const base = getProductionBaseUrl();
        const { ok, count } = await probeBaseUrl(base);
        if (ok) {
            cachedBaseUrl = base;
            await AsyncStorage.setItem(STORAGE_KEY, base);
            logApi('using production', { base, count });
            return base;
        }
        cachedBaseUrl = base;
        logApi('production unreachable, still using', base);
        return base;
    }

    let best = { base: null, count: -1 };
    for (const host of getLocalCandidateHosts()) {
        const base = buildLocalBaseUrl(host);
        const { ok, count } = await probeBaseUrl(base);
        if (ok && count >= best.count) {
            best = { base, count };
        }
    }
    if (best.base) {
        cachedBaseUrl = best.base;
        await AsyncStorage.setItem(STORAGE_KEY, best.base);
        logApi('using local', best);
        return best.base;
    }
    cachedBaseUrl = defaultAndroidApiBase();
    return cachedBaseUrl;
}

export async function loadDevApiBaseUrl() {
    if (isProductionTarget()) {
        return pickReachableBaseUrl();
    }

    try {
        const stored = await AsyncStorage.getItem(STORAGE_KEY);
        const base = normalizeStoredBase(stored);
        if (base && !base.includes('railway.app')) {
            const { ok } = await probeBaseUrl(base);
            if (ok) {
                cachedBaseUrl = base;
                return cachedBaseUrl;
            }
            await AsyncStorage.removeItem(STORAGE_KEY);
        } else if (stored?.includes('railway.app')) {
            await AsyncStorage.removeItem(STORAGE_KEY);
        }
    } catch {
        // ignore
    }
    return pickReachableBaseUrl();
}

export async function resetDevApiBaseUrl() {
    cachedBaseUrl = null;
    try {
        await AsyncStorage.removeItem(STORAGE_KEY);
    } catch {
        // ignore
    }
    return pickReachableBaseUrl();
}

export async function saveDevApiBaseUrlFromHost(host) {
    const base = buildLocalBaseUrl(host);
    if (!base) {
        return null;
    }
    cachedBaseUrl = base;
    await AsyncStorage.setItem(STORAGE_KEY, base);
    return base;
}
