import { Alert, Platform } from 'react-native';
import messaging from '@react-native-firebase/messaging';
import { CommonActions } from '@react-navigation/native';

import { isFirebaseReady } from '../config/firebase';
import { registerDeviceToken, unregisterDeviceToken } from '../app/api/push';
import { logApi } from '../config/apiLogger';
import { ROUTES } from '../utils/routes';

export const PUSH_TYPES = {
    ORDER_STATUS: 'order_status',
    PRODUCT: 'product',
    BROADCAST: 'broadcast',
};

/** Request OS notification permission (required on iOS and Android 13+). */
export async function requestPushPermission() {
    const authStatus = await messaging().requestPermission();
    return (
        authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
        authStatus === messaging.AuthorizationStatus.PROVISIONAL
    );
}

/** Retrieve the FCM device token from Google (not stored in Firebase DB). */
export async function getFcmDeviceToken() {
    await messaging().registerDeviceForRemoteMessages();
    return messaging().getToken();
}

/**
 * Send token to your Symfony API — saved in MySQL device_token table.
 */
export async function syncDeviceTokenWithBackend(email) {
    if (!isFirebaseReady()) {
        logApi('FCM: Firebase not ready (missing google-services.json?)');
        return null;
    }

    const normalized = (email || '').trim().toLowerCase();
    if (!normalized) {
        return null;
    }

    const allowed = await requestPushPermission();
    if (!allowed) {
        logApi('FCM: notification permission denied');
        return null;
    }

    const token = await getFcmDeviceToken();
    if (!token) {
        return null;
    }

    await registerDeviceToken({ email: normalized, token });
    logApi('FCM: token registered with backend');
    return token;
}

export async function removeDeviceTokenFromBackend(token) {
    if (!token) {
        return;
    }
    try {
        await unregisterDeviceToken({ token });
    } catch (e) {
        logApi('FCM: unregister failed', { message: e?.message });
    }
    try {
        await messaging().deleteToken();
    } catch {
        // ignore
    }
}

function navigateFromNotification(navigationRef, remoteMessage) {
    if (!navigationRef?.isReady?.()) {
        return;
    }

    const data = remoteMessage?.data || {};

    if (data.type === PUSH_TYPES.ORDER_STATUS && data.orderGroupId) {
        navigationRef.dispatch(
            CommonActions.navigate({
                name: ROUTES.ORDER_DETAIL,
                params: {
                    orderGroupId: data.orderGroupId,
                    email: data.email,
                },
            }),
        );
        return;
    }

    if (data.type === PUSH_TYPES.PRODUCT || data.type === PUSH_TYPES.BROADCAST) {
        navigationRef.dispatch(
            CommonActions.navigate({
                name: 'MainTabs',
                params: { screen: ROUTES.TAB_SHOP },
            }),
        );
    }
}

/**
 * Foreground, background-open, initial notification, and token refresh.
 */
export function attachPushNotificationListeners(navigationRef, getEmail) {
    if (!isFirebaseReady()) {
        return () => {};
    }

    // Foreground: show alert (system tray does not auto-show on Android)
    const unsubscribeForeground = messaging().onMessage(async remoteMessage => {
        const title =
            remoteMessage.notification?.title || remoteMessage.data?.title || 'Florynn';
        const body =
            remoteMessage.notification?.body || remoteMessage.data?.body || '';

        if (title || body) {
            Alert.alert(title, body, [
                {
                    text: 'View',
                    onPress: () => navigateFromNotification(navigationRef, remoteMessage),
                },
                { text: 'Dismiss', style: 'cancel' },
            ]);
        }
    });

    // App in background — user tapped notification
    const unsubscribeOpened = messaging().onNotificationOpenedApp(remoteMessage => {
        navigateFromNotification(navigationRef, remoteMessage);
    });

    // App was terminated — opened from notification
    messaging()
        .getInitialNotification()
        .then(remoteMessage => {
            if (remoteMessage) {
                navigateFromNotification(navigationRef, remoteMessage);
            }
        })
        .catch(() => {});

    // Token rotation — re-register with Symfony
    const unsubscribeTokenRefresh = messaging().onTokenRefresh(async () => {
        const email = getEmail();
        if (email) {
            await syncDeviceTokenWithBackend(email);
        }
    });

    return () => {
        unsubscribeForeground();
        unsubscribeOpened();
        unsubscribeTokenRefresh();
    };
}
