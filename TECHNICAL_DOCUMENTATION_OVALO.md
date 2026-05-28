# 4. Technical Documentation

## System Overview

**OVALO (FLORYNN)** is a React Native mobile application for a handmade bouquet shop. Customers browse the catalog, view product details, add items to a cart, submit inquiries or orders, and contact the shop. The app connects to a **Symfony** backend through REST API endpoints. It uses **JWT authentication**, **MySQL** database storage through the backend (hosted on Railway or a local server), and **Redux** with **redux-persist** for client-side session and cart state. Product lists refresh automatically in the background while the app is active.

The **FLORYNN** admin web dashboard and the mobile app share the same backend database so product and order data stay synchronized.

---

## Technology Stack

- **Frontend:** React Native
- **Language:** JavaScript (ES6+)
- **State Management:** Redux, Redux Saga, redux-persist
- **Navigation:** React Navigation (stack + bottom tabs)
- **Backend:** Symfony (REST API for mobile and admin)
- **Database:** MySQL
- **Authentication:** JWT Bearer Token
- **API Hosting:** Railway or local Symfony server
- **Package Manager:** npm
- **Local Storage:** AsyncStorage (auth token, cart, customer profile)

---

## Installation Requirements

Install the following before running the project:

- Node.js version 22 or higher (package.json requires Node >= 20)
- npm
- Android Studio
- Java Development Kit (JDK)
- React Native development environment
- Git
- Symfony backend API (**florynn** project)
- MySQL database
- ADB (Android Debug Bridge) for physical device testing

---

## Project Installation

1. Clone or open the project folder.

```bash
cd ovalo
```

2. Install dependencies.

```bash
npm install
```

3. Configure API target (copy example config if needed).

```bash
copy src\config\api.local.example.js src\config\api.local.js
```

Use production (Railway) or local backend:

```bash
npm run api:use-production
```

or

```bash
npm run api:use-local
npm run dev:connect
```

4. Start Metro Bundler.

```bash
npm start
```

or with cache reset:

```bash
npm run start:reset
```

5. Run the Android app.

```bash
npm run android
```

For a full dev setup (API host sync + backend hint):

```bash
npm run sync:all
```

---

## Backend Setup

The Symfony backend (**florynn**) must provide the following API endpoints used by the mobile app:

**Authentication**

- `POST /api/register` — create customer account
- `POST /api/login` — login and receive JWT

**Mobile catalog and shop**

- `GET /api/mobile/shop` — shop metadata and sync info
- `GET /api/mobile/products` — product list (optional `categoryId` query)
- `GET /api/mobile/products/{id}` — single product detail
- `GET /api/mobile/categories` — category list
- `GET /api/mobile/status` — health / product count (development)

**Contact and orders**

- `POST /api/mobile/contact` — submit contact / inquiry message
- `POST /api/mobile/orders` — place order from cart
- `GET /api/mobile/orders?email={email}` — list orders by customer email
- `GET /api/mobile/orders/{orderGroupId}?email={email}` — order detail

**Optional (if enabled on backend)**

- `POST /api/mobile/auth/google` — Google Sign-In (when configured)

The backend should be connected to a **MySQL** database and hosted locally or on **Railway**. Product images are served from `/uploads/images/...` on the same API host.

---

## Local Backend Setup

Start the Symfony backend on all network interfaces (from the **florynn** folder):

```powershell
php -S 0.0.0.0:8000 -t public
```

Or using Symfony CLI:

```powershell
symfony server:start --port=8000 --no-tls --allow-all-ip
```

Or use the project helper script from **ovalo**:

```powershell
npm run symfony:start
```

Make sure the phone and computer are on the same Wi-Fi network when using LAN IP, or use USB with `adb reverse`:

```powershell
adb reverse tcp:8000 tcp:8000
```

Then point the app to `127.0.0.1` in `src/config/api.local.js` (`androidHost: '127.0.0.1'`, `androidUseUsbReverse: true`).

---

## API Configuration (Mobile)

The mobile app resolves the API base URL from:

- `src/config/api.local.js` — target (`production` or `local`), Railway URL, LAN/USB hosts
- `src/config/api.js` / `apiConfig.js` — base URL builder
- `src/config/devApiBase.js` — runtime dev host override

**npm scripts**

| Script | Purpose |
|--------|---------|
| `npm run api:use-production` | Point mobile app to Railway |
| `npm run api:use-local` | Point mobile app to local Symfony |
| `npm run api:sync-host-lan` | Set LAN IP for Wi-Fi testing |
| `npm run api:test` | Test API connectivity |
| `npm run dev:connect` | Sync host + connection helpers |

---

## Main Project Structure

```
ovalo/
├── android/                 # Android native project (APK build)
├── ios/                     # iOS native project
├── scripts/                 # PowerShell helpers (API, Android, backend)
├── src/
│   ├── app/
│   │   ├── actions.js       # Redux action types and creators
│   │   ├── api/             # API modules (auth, catalog, orders, contact, shop)
│   │   ├── reducers/        # auth, cart, products
│   │   └── sagas/           # auth login/register, product polling
│   ├── components/          # Reusable UI (ProductCard, AppTopBar, ApiGate, etc.)
│   ├── config/              # API base URL and dev configuration
│   ├── constants/           # theme, copy, tab icons
│   ├── context/             # ReduxProvider, ShopProvider
│   ├── navigations/         # RootNav, MainTabs, auth sync
│   ├── screens/             # Home, Shop, Cart, Checkout, Contact, Auth, More
│   └── utils/               # routes, product helpers, cart, auth, order status
├── App.js                   # App entry
└── package.json
```

---

## Authentication Flow

1. User registers or logs in with email and password on **Register** or **Login** screens.
2. App sends credentials to `POST /api/register` or `POST /api/login`.
3. Backend returns a JWT token and user object.
4. Redux Saga stores the session in the **auth** reducer; **redux-persist** saves it to AsyncStorage.
5. Protected API requests include:

   `Authorization: Bearer <token>`

6. Staff/admin accounts are rejected on mobile with a message to use the admin portal.
7. User can log out from the **More** (profile) screen; persisted auth and cart can be cleared as needed.

Guests can browse the catalog, use the cart, and submit contact inquiries without logging in (depending on screen flow).

---

## Catalog and Product Polling Flow

1. On app launch, **ProductsPollingController** starts global polling when the app is **active**.
2. Redux Saga calls `GET /api/mobile/products` every **15 seconds**.
3. **Home** and **Shop** screens read `state.products.items` from Redux.
4. When the app goes to the background, polling stops to save battery and data.
5. Pull-to-refresh on Home/Shop triggers an immediate fetch plus category reload.

---

## Checkout and Order Flow

1. User browses products on **Home** or **Shop** and opens **Product Detail**.
2. User adds bouquet items to the cart (local Redux **cart** state, persisted).
3. User opens **Cart** and proceeds to **Checkout**.
4. User enters delivery/contact details (name, phone, email, address, location, notes).
5. App sends order payload to `POST /api/mobile/orders` with `customer` and `items`.
6. Backend creates order records in MySQL; admin can update status on the FLORYNN dashboard.
7. User views order history and status on **More** → orders list → **Order Detail** via `GET /api/mobile/orders`.

---

## Contact / Inquiry Flow

1. User opens the **Contact** tab and fills the inquiry form (name, email, message).
2. App sends data to `POST /api/mobile/contact`.
3. Backend stores the inquiry for staff review in the admin dashboard.
4. User receives confirmation in the app after a successful submission.

---

## Testing and Verification

To verify API connection:

```powershell
npm run api:test
```

To check that the app runs:

```powershell
npm start
npm run android
```

To build a release APK:

```powershell
cd android
.\gradlew assembleRelease
```

APK output:

`android/app/build/outputs/apk/release/app-release.apk`

---

## Deployment Notes

- Host the Symfony **florynn** backend on **Railway** (or similar) with `DATABASE_URL` set for MySQL.
- Run `npm run api:use-production` before release builds so the APK targets the production API.
- Do not commit real secrets: `src/config/api.local.js`, `.env.local`, JWT keys, or database passwords.
- Android package name (current): `com.helloworld` — update in `android/app/build.gradle` and Google Cloud if rebranding.
- Ensure product images are uploaded on the server under `public/uploads/images/` so mobile can load them from the API host.
- Admin and mobile must use the **same** backend environment to avoid mismatched product or order data.

---

## Related Documentation

- `SYSTEM_REQUIREMENTS_OVALO.md` — hardware and software requirements
- `README.md` — quick project overview
- Backend mobile dev notes (if present): `florynn/MOBILE_DEV.md`
