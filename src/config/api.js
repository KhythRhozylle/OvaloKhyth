import { Platform } from 'react-native';

const API_PORT = 8000;

/** Set your PC LAN IP when testing on a physical device (e.g. '192.168.1.42'). */
export const DEV_API_HOST_OVERRIDE = null;

export function getApiBaseUrl() {
    if (DEV_API_HOST_OVERRIDE) {
        return `http://${DEV_API_HOST_OVERRIDE}:${API_PORT}`;
    }

    if (__DEV__) {
        if (Platform.OS === 'android') {
            return `http://10.0.2.2:${API_PORT}`;
        }
        return `http://127.0.0.1:${API_PORT}`;
    }

    return 'https://your-domain.com';
}

export function getProductImageUrl(filename) {
    if (!filename) {
        return null;
    }
    return `${getApiBaseUrl()}/uploads/images/${filename}`;
}
