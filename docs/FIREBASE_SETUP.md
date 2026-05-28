# Firebase setup (Florynn / OVALO)

Aligned with [APPDEV_PROJ Firebase commit](https://github.com/nathantalz/APPDEV_PROJ/commit/5f802a19a6942ad01a1cfdf0d2c433d436a81b7c): Gradle `google-services` plugin + `@react-native-firebase/app`, plus **messaging** for push notifications.

## 1. Firebase Console

1. Open [Firebase Console](https://console.firebase.google.com/) → create or select a project.
2. **Add Android app**
   - Package name: **`com.helloworld`** (must match `android/app/build.gradle` `applicationId`).
3. Download **`google-services.json`**.
4. Place it at:
   ```
   ovalo/android/app/google-services.json
   ```
   (Copy from `google-services.json.example` only as a shape reference — values must come from your project.)

> Do **not** reuse the sample from APPDEV_PROJ (`com.gilberonathan_appdev`). Each app needs its own Firebase Android app entry.

## 2. Install JS dependencies

```bash
cd ovalo
npm install
```

Packages (same major as reference):

- `@react-native-firebase/app` ^24.0.0
- `@react-native-firebase/messaging` ^24.0.0

## 3. Android native (already in repo)

| File | Change (matches reference) |
|------|---------------------------|
| `android/build.gradle` | `classpath 'com.google.gms:google-services:4.4.4'` |
| `android/app/build.gradle` | `apply plugin: "com.google.gms.google-services"` |
| `AndroidManifest.xml` | `POST_NOTIFICATIONS` |

## 4. Rebuild

```bash
npm run android:clean-native
npx react-native run-android
```

## 5. Verify

- App builds without `google-services.json` missing errors.
- After login, FCM token registers with your Symfony API (`POST /api/mobile/device-tokens`) when the backend push module is deployed.

## Project files

| Path | Role |
|------|------|
| `index.js` | Background FCM handler |
| `src/config/firebase.js` | `isFirebaseReady()` helper |
| `src/services/pushNotifications.js` | Permission, token, listeners |
| `src/components/PushNotificationController.js` | Register token on login |
