# FCM push notifications (messaging only)

**Stack:** React Native 0.83 (`ovalo`) + Symfony 7 (`florynn`) + MySQL  
**Not used:** Firebase Auth, Firestore, Realtime Database

Firebase is only the **delivery channel**. Users, orders, JWT login, and device tokens live in your existing Symfony/MySQL stack.

---

## Architecture

```
Mobile app                    Symfony API                    Google FCM
──────────                    ───────────                    ──────────
get FCM token  ──POST──►  /api/mobile/device-tokens  ──►  device_token table
                                    │
Admin changes order  ──►  PushNotificationService  ──►  Messenger async
                                    │
                                    └──►  FcmClient (HTTP v1)  ──►  device
```

---

## 1. Firebase Console (one-time)

1. [Firebase Console](https://console.firebase.google.com/) → create/select project  
2. **Add Android app** → package `com.helloworld`  
3. Download `google-services.json` → `ovalo/android/app/google-services.json`  
4. **Cloud Messaging** → enable (default on new projects)  
5. **Project settings → Service accounts** → **Generate new private key**  
6. Save JSON as `florynn/config/firebase/service-account.json`  
7. Set env on server:
   ```env
   FIREBASE_CREDENTIALS=%kernel.project_dir%/config/firebase/service-account.json
   FIREBASE_PROJECT_ID=your-project-id
   ```

### iOS (optional)

1. Add iOS app in Firebase, download `GoogleService-Info.plist` into `ios/HelloWorld/`  
2. Xcode → **Signing & Capabilities** → Push Notifications + Background Modes → Remote notifications  
3. Upload APNs key in Firebase Console → Cloud Messaging  

---

## 2. Mobile installation

```bash
cd ovalo
npm install
```

Dependencies (already in `package.json`):

- `@react-native-firebase/app`
- `@react-native-firebase/messaging`

Android (`android/build.gradle` + `android/app/build.gradle`):

- `classpath 'com.google.gms:google-services:4.4.4'`
- `apply plugin: "com.google.gms.google-services"`

```bash
npm run android:clean-native
npx react-native run-android
```

---

## 3. Database migration (Symfony)

```bash
cd florynn
php bin/console doctrine:migrations:migrate
```

### Schema: `device_token`

| Column      | Type         | Notes                          |
|-------------|--------------|--------------------------------|
| id          | INT PK       |                                |
| email       | VARCHAR(180) | Customer email (indexed)       |
| token       | VARCHAR(512) | FCM token (unique)             |
| platform    | VARCHAR(16)  | `android` \| `ios`               |
| updated_at  | DATETIME     | Last registration              |

---

## 4. API routes

### Mobile (public — same as other `/api/mobile` routes)

| Method | Path | Body |
|--------|------|------|
| POST | `/api/mobile/device-tokens` | `{ "email", "token", "platform" }` |
| DELETE | `/api/mobile/device-tokens` | `{ "token" }` |

### Staff (JWT required — `ROLE_STAFF`)

| Method | Path | Body |
|--------|------|------|
| POST | `/api/admin/notifications/user` | `{ "email", "title", "body", "data": {} }` |
| POST | `/api/admin/notifications/broadcast` | `{ "title", "body", "data": {} }` |

### Automatic triggers (no extra API call)

| Admin action | Notification |
|--------------|--------------|
| Order status change (approve/reject/edit) | Customer devices for that order email |
| Product create/update/delete | All registered devices |

---

## 5. Example payloads

### Register token (mobile → Symfony)

```json
POST /api/mobile/device-tokens
{
  "email": "customer@example.com",
  "token": "fcm-device-token-string...",
  "platform": "android"
}
```

### Send to one user (staff JWT)

```json
POST /api/admin/notifications/user
Authorization: Bearer <jwt>
{
  "email": "customer@example.com",
  "title": "Hello",
  "body": "Your bouquet is ready.",
  "data": {
    "type": "order_status",
    "orderGroupId": "uuid-here",
    "email": "customer@example.com"
  }
}
```

### Broadcast

```json
POST /api/admin/notifications/broadcast
{
  "title": "Shop update",
  "body": "New bouquets are available!",
  "data": { "type": "broadcast" }
}
```

### FCM HTTP v1 message (sent by `FcmClient`)

```json
{
  "message": {
    "token": "<device-token>",
    "notification": { "title": "Order update", "body": "Your order is now: Preparing" },
    "data": {
      "type": "order_status",
      "orderGroupId": "...",
      "status": "preparing",
      "email": "customer@example.com"
    }
  }
}
```

---

## 6. Mobile files (what each does)

| File | Role |
|------|------|
| `index.js` | Background FCM handler (required at entry) |
| `src/config/firebase.js` | `isFirebaseReady()` helper |
| `src/app/api/push.js` | POST/DELETE device token to Symfony |
| `src/services/pushNotifications.js` | Permission, token, listeners, navigation |
| `src/components/PushNotificationController.js` | Register on login, listeners, token refresh |

---

## 7. Backend files

| File | Role |
|------|------|
| `Entity/DeviceToken.php` | ORM entity |
| `Repository/DeviceTokenRepository.php` | Lookup by email/token |
| `Service/FcmClient.php` | OAuth + FCM HTTP v1 |
| `Service/PushNotificationService.php` | Queue sends, order/product hooks |
| `Message/SendPushNotificationMessage.php` | Async message |
| `MessageHandler/SendPushNotificationMessageHandler.php` | Calls FcmClient |
| `Controller/ApiMobileDeviceController.php` | Token register/unregister |
| `Controller/ApiAdminNotificationController.php` | Manual user/broadcast send |
| `migrations/Version20260528140000.php` | Creates `device_token` table |

---

## 8. Production

1. Deploy Symfony with `FIREBASE_*` env vars  
2. Run migration on Railway/production DB  
3. Run Messenger worker:
   ```bash
   php bin/console messenger:consume async -vv
   ```
4. Ship mobile app with correct `google-services.json`

---

## 9. Testing

1. Install app, **sign in** as a customer  
2. Check Symfony DB: `SELECT * FROM device_token WHERE email = '...'`  
3. In admin, change that customer’s **order status** → push should arrive  
4. Or call staff API with Postman + JWT:
   ```bash
   curl -X POST https://your-api/api/admin/notifications/user \
     -H "Authorization: Bearer TOKEN" \
     -H "Content-Type: application/json" \
     -d '{"email":"customer@example.com","title":"Test","body":"Hello"}'
   ```
5. **Foreground:** in-app Alert  
6. **Background:** system tray; tap → Order detail or Shop  
7. **Terminated:** cold start via `getInitialNotification`

### Troubleshooting

| Issue | Fix |
|-------|-----|
| Build: missing `google-services.json` | Add file from Firebase Console |
| No push, no error | `FIREBASE_*` unset or messenger worker not running |
| Token not in DB | User not logged in; permission denied |
| FCM 404/403 | Wrong `FIREBASE_PROJECT_ID` or service account |

---

## 10. Security notes

- Device registration uses **customer email** (matches your existing mobile order API).  
- Staff send endpoints require **JWT + ROLE_STAFF**.  
- Service account JSON must **never** be committed (see `config/firebase/.gitignore`).  
- FCM tokens are not passwords but should be treated as device identifiers.
