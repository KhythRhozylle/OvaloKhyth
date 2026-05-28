# 2. System Requirements

## Software Requirements

- **Operating System (Development):** Windows 10/11, macOS, or Linux
- **Mobile Platform:** Android physical device or Android emulator
- **Frontend Framework:** React Native
- **Programming Language:** JavaScript (ES6+)
- **Runtime:** Node.js version 22 or higher
- **Package Manager:** npm
- **Backend Framework:** Symfony (REST API endpoints for mobile)
- **Database:** MySQL (hosted on Railway or local server)
- **Authentication:** JWT authentication (`/api/login`, `/api/register`)
- **API Endpoints Used by Mobile:**
  - `/api/mobile/shop`
  - `/api/mobile/products`
  - `/api/mobile/categories`
  - `/api/mobile/contact`
  - `/api/mobile/orders`
- **Development Tools:** Android Studio, React Native CLI, Metro Bundler, ADB
- **API Hosting:** Railway deployment or local Symfony server
- **Code Editor / IDE:** Visual Studio Code or Cursor IDE
- **Version Control:** Git (recommended for team collaboration and release tracking)

## Hardware Requirements

### Developer Computer

- **Processor:** Intel Core i5 / AMD Ryzen 5 or higher
- **RAM:** Minimum 8 GB (16 GB recommended)
- **Storage:** At least 10 GB free space (20 GB recommended for Android build caches/emulators)
- **Internet Connection:** Required for npm package installation, API access, and cloud services

### Mobile Device (Testing)

- **Device Type:** Android phone or Android emulator
- **Android Version:** Android 8.0 (Oreo) or higher recommended
- **RAM:** At least 2 GB (4 GB recommended for smoother testing)
- **Network:** Internet access, or same Wi-Fi/LAN as backend server during local testing
- **USB Debugging:** Recommended for direct device deployment and `adb reverse` workflows

### Server / Hosting

- **Application Hosting:** Railway (production API hosting)
- **Database Hosting:** MySQL instance (Railway-hosted or local)
- **Connectivity:** Stable internet connection for mobile API access and admin updates
- **Deployment Consideration:** Production and mobile app should target the same backend environment to keep product/order data synchronized

## Notes for OVALO (FLORYNN)

- The mobile app is designed as a bouquet browse-and-inquire application with optional user authentication.
- Product and category updates from the admin side are reflected in mobile via API integration and polling logic.
- For local development, ensure host configuration in the mobile app matches the active Symfony backend URL.
