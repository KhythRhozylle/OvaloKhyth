/**
 * Copy to api.local.js
 *
 * PRODUCTION (Railway — matches admin dashboard):
 *   apiTarget: 'production'
 *   Or run: npm run api:use-production
 *
 * LOCAL dev (PC Symfony):
 *   apiTarget: 'local'
 *   Or run: npm run api:use-local && npm run dev:connect
 */

export default {
    apiTarget: 'production',
    productionUrl: 'https://finaldeployment-production-1b57.up.railway.app',
    port: 8000,
    host: null,
    androidHost: '127.0.0.1',
    androidUseUsbReverse: true,
    iosHost: '127.0.0.1',
};
