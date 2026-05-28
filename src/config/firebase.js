import { getApp, getApps } from '@react-native-firebase/app';

/** Native Firebase initialized from google-services.json (messaging only). */
export function isFirebaseReady() {
    return getApps().length > 0;
}

export function getFirebaseApp() {
    return getApp();
}
