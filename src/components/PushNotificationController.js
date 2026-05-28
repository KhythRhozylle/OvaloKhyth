import { useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';

import { isFirebaseReady } from '../config/firebase';
import {
    attachPushNotificationListeners,
    removeDeviceTokenFromBackend,
    syncDeviceTokenWithBackend,
} from '../services/pushNotifications';

/**
 * Wires FCM to your existing Redux auth + Symfony token API.
 * Mount inside NavigationContainer (needs navigationRef).
 */
const PushNotificationController = ({ navigationRef }) => {
    const authUser = useSelector(state => state.auth?.data?.user);
    const isLoggedIn = !!useSelector(state => state.auth?.data?.token);
    const email = (authUser?.email || '').trim().toLowerCase();
    const fcmTokenRef = useRef(null);

    useEffect(() => {
        if (!navigationRef || !isFirebaseReady()) {
            return undefined;
        }

        return attachPushNotificationListeners(navigationRef, () => email);
    }, [navigationRef, email]);

    useEffect(() => {
        let cancelled = false;

        async function run() {
            if (!isFirebaseReady()) {
                return;
            }

            if (!isLoggedIn || !email) {
                if (fcmTokenRef.current) {
                    await removeDeviceTokenFromBackend(fcmTokenRef.current);
                    fcmTokenRef.current = null;
                }
                return;
            }

            try {
                const token = await syncDeviceTokenWithBackend(email);
                if (!cancelled) {
                    fcmTokenRef.current = token;
                }
            } catch {
                // Native Firebase not configured yet
            }
        }

        run();

        return () => {
            cancelled = true;
        };
    }, [isLoggedIn, email]);

    return null;
};

export default PushNotificationController;
