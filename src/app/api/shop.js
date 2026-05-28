import { apiRequest } from './client';
import { normalizeList } from './catalog';
import { logApi } from '../../config/apiLogger';

const FALLBACK_SHOP = {
    name: 'Florynn Handmade Bouquets',
    hours: 'Monday - Friday: 9:00 AM - 6:00 PM',
    phones: ['+09068023349', '09557351624'],
    email: 'florynn@flowershop.com',
    address: 'Agan-an, Sibulan, Negros Oriental',
    services: [
        'Custom wedding & event florals',
        'Same-day pickup arrangements',
        'Corporate gifting & subscriptions',
        'Hand-tied bouquets & gift boxes',
    ],
};

/** Build shop summary when /api/mobile/shop is not deployed yet on Railway. */
async function fetchShopInfoFallback() {
    const [productsRes, categoriesRes] = await Promise.all([
        apiRequest(`/api/mobile/products?_t=${Date.now()}`),
        apiRequest(`/api/mobile/categories?_t=${Date.now()}`).catch(() => ({ data: [] })),
    ]);
    const products = normalizeList(productsRes);
    const categories = normalizeList(categoriesRes);
    return {
        ...FALLBACK_SHOP,
        productCount: productsRes?.count ?? products.length,
        categoryCount: categoriesRes?.count ?? categories.length,
    };
}

export async function fetchShopInfo() {
    try {
        const data = await apiRequest(`/api/mobile/shop?_t=${Date.now()}`);
        const shop = data?.data ?? data;
        logApi('shop info', { productCount: shop?.productCount });
        return shop;
    } catch (e) {
        if (e.status === 404) {
            logApi('shop endpoint missing — using products fallback', undefined);
            return fetchShopInfoFallback();
        }
        throw e;
    }
}
