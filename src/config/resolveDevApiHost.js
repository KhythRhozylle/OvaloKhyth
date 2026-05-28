import { NativeModules, Platform } from 'react-native';

import localConfig from './api.local';

/**
 * Use the same host as the Metro bundler (works on physical phones over Wi‑Fi).
 */
export function getMetroBundlerHost() {
    try {
        const constants = NativeModules.SourceCode?.getConstants?.();
        const scriptURL = constants?.scriptURL ?? '';
        const match = scriptURL.match(/^https?:\/\/([^:/]+)/i);
        const host = match?.[1];
        if (!host) {
            return null;
        }
        if (host === 'localhost' || host === '127.0.0.1') {
            return null;
        }
        return host;
    } catch {
        return null;
    }
}

/** Candidate hosts to try in dev (Android), in order. */
export function getDevApiHostCandidates() {
    const fromLocal = localConfig?.androidHost?.trim();
    const fromMetro = getMetroBundlerHost();
    const port = localConfig?.port ?? 8000;

    const hosts = [];
    const add = h => {
        if (h && !hosts.includes(h)) {
            hosts.push(h);
        }
    };

    add(fromMetro);
    add(fromLocal);
    if (Platform.OS === 'android') {
        add('10.0.2.2');
        add('127.0.0.1');
    } else {
        add('127.0.0.1');
    }

    return hosts.map(host => `http://${host}:${port}`);
}

export function getPrimaryDevApiBaseUrl() {
    const port = localConfig?.port ?? 8000;
    const metro = getMetroBundlerHost();
    if (metro) {
        return `http://${metro}:${port}`;
    }
    const host =
        Platform.OS === 'android'
            ? localConfig?.androidHost ?? '10.0.2.2'
            : localConfig?.iosHost ?? '127.0.0.1';
    return `http://${host}:${port}`;
}
