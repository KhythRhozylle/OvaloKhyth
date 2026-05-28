import { Platform } from 'react-native';

import localConfig from './api.local';

/** @typedef {'production' | 'local'} ApiTarget */

export const RAILWAY_PRODUCTION_URL =
    'https://finaldeployment-production-1b57.up.railway.app';

export function getApiTarget() {
    return localConfig?.apiTarget === 'production' ? 'production' : 'local';
}

export function isProductionTarget() {
    return getApiTarget() === 'production';
}

export function getProductionBaseUrl() {
    const url = (localConfig?.productionUrl || RAILWAY_PRODUCTION_URL).trim();
    return url.replace(/\/$/, '');
}

export function getLocalPort() {
    return localConfig?.port ?? 8000;
}

export function getHostOverride() {
    return localConfig?.host ?? null;
}

export function buildLocalBaseUrl(host) {
    const port = getLocalPort();
    const clean = (host || '').trim().replace(/^https?:\/\//, '').split('/')[0];
    if (!clean) {
        return null;
    }
    return `http://${clean}:${port}`;
}

export function getLocalCandidateHosts() {
    const hosts = [];
    if (localConfig?.androidUseUsbReverse !== false && Platform.OS === 'android') {
        hosts.push('127.0.0.1');
    }
    const lan = localConfig?.androidHost?.trim();
    if (lan && !hosts.includes(lan)) {
        hosts.push(lan);
    }
    if (!hosts.length) {
        hosts.push(Platform.OS === 'android' ? '10.0.2.2' : '127.0.0.1');
    }
    return hosts;
}

export function getIosDevHost() {
    return localConfig?.iosHost ?? '127.0.0.1';
}
