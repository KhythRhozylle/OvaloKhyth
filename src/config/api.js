import { Platform } from 'react-native';

import {
    buildLocalBaseUrl,
    getApiTarget,
    getHostOverride,
    getIosDevHost,
    getLocalCandidateHosts,
    getLocalPort,
    getProductionBaseUrl,
    isProductionTarget,
} from './apiConfig';
import { getDevApiBaseUrlSync } from './devApiBase';

export const SYMFONY_PROJECT_PATH = 'c:\\Users\\khyth\\Documents\\florynn';

export function getApiBaseUrl() {
    const hostOverride = getHostOverride();
    if (hostOverride) {
        return `http://${hostOverride}:${getLocalPort()}`;
    }

    if (isProductionTarget()) {
        return getProductionBaseUrl();
    }

    if (typeof __DEV__ !== 'undefined' && __DEV__) {
        if (Platform.OS === 'android') {
            return getDevApiBaseUrlSync();
        }
        return buildLocalBaseUrl(getIosDevHost());
    }

    return getProductionBaseUrl();
}

export function getApiTargetLabel() {
    return getApiTarget() === 'production' ? 'Railway (production)' : 'Local dev';
}

export function getProductImageUrl(filename) {
    if (!filename) {
        return null;
    }
    if (/^https?:\/\//i.test(filename)) {
        return filename;
    }
    return `${getApiBaseUrl()}/uploads/images/${filename}`;
}

export { getLocalCandidateHosts, getProductionBaseUrl, isProductionTarget };
export { defaultAndroidApiBase } from './devApiBase';
