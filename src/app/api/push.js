import { Platform } from 'react-native';

import { apiRequest } from './client';

/** Register FCM token with Symfony (stored in device_token table). */
export async function registerDeviceToken({ email, token }) {
    return apiRequest('/api/mobile/device-tokens', {
        method: 'POST',
        body: {
            email,
            token,
            platform: Platform.OS === 'ios' ? 'ios' : 'android',
        },
    });
}

/** Remove token on logout. */
export async function unregisterDeviceToken({ token }) {
    return apiRequest('/api/mobile/device-tokens', {
        method: 'DELETE',
        body: { token },
    });
}
