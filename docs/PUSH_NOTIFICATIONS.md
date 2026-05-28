# Push notifications (FCM)

Server-triggered pushes when admins change **order status** or **products** in the Symfony admin.

## 1. Firebase project

1. Create a project at [Firebase Console](https://console.firebase.google.com/).
2. Add an **Android** app with package name `com.helloworld` (see `android/app/build.gradle` `applicationId`).
3. Download `google-services.json` → `ovalo/android/app/google-services.json`.
4. (Optional iOS) Add iOS app, download `GoogleService-Info.plist` into `ios/HelloWorld/`, enable Push Notifications capability.

## 2. Backend (Symfony / florynn)

1. Service account JSON → `florynn/config/firebase/service-account.json` (see `config/firebase/README.md`).
2. Set environment variables:
   ```env
   FIREBASE_CREDENTIALS=%kernel.project_dir%/config/firebase/service-account.json
   FIREBASE_PROJECT_ID=your-project-id
   ```
3. Run migration: `php bin/console doctrine:migrations:migrate`
4. On production, run a **Messenger worker** so pushes send asynchronously:
   ```bash
   php bin/console messenger:consume async -vv
   ```

### API (mobile)

| Method | Path | Body |
|--------|------|------|
| POST | `/api/mobile/device-tokens` | `{ "email", "token", "platform": "android"\|"ios" }` |
| DELETE | `/api/mobile/device-tokens` | `{ "token" }` |

### When pushes fire

| Admin action | Recipients | Payload `type` |
|--------------|------------|------------------|
| Order status change (approve/reject/edit) | Customer email devices | `order_status` |
| Product create/update/delete | All registered devices | `product` |

## 3. Mobile app (React Native)

```bash
cd ovalo
npm install
cd android && ./gradlew clean   # after adding google-services.json
npm run android
```

The app registers the FCM token after login (`PushNotificationController`). Tapping a notification opens **Order tracking** or the **Shop** tab.

### Key files

- `src/services/pushNotifications.js` — permission, token, listeners
- `src/components/PushNotificationController.js` — register on login
- `src/app/api/push.js` — backend registration
- `index.js` — background message handler

## 4. Testing

1. Log in on the device/emulator with a customer account.
2. In admin, change that customer’s order status to **Preparing** or **Out for delivery**.
3. Confirm push arrives; tap opens order detail.

If nothing arrives, check Symfony logs and that `FIREBASE_*` env vars are set and the async consumer is running.
