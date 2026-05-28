import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { AppState } from 'react-native';

import { fetchShopInfo } from '../app/api/shop';
import { loadDevApiBaseUrl, resetDevApiBaseUrl } from '../config/devApiBase';
import { getApiBaseUrl } from '../config/api';

const ShopContext = createContext({
    shop: null,
    apiBase: '',
    ready: false,
    error: null,
    productCount: 0,
    refresh: async () => {},
});

export function useShop() {
    return useContext(ShopContext);
}

export function ShopProvider({ children }) {
    const [shop, setShop] = useState(null);
    const [ready, setReady] = useState(false);
    const [error, setError] = useState(null);

    const refresh = useCallback(async ({ reprobe = false } = {}) => {
        setError(null);
        try {
            if (__DEV__ && reprobe) {
                await resetDevApiBaseUrl();
            } else if (__DEV__) {
                await loadDevApiBaseUrl();
            }
            const info = await fetchShopInfo();
            setShop(info);
            setReady(true);
        } catch (e) {
            setError(e.message || 'Could not connect to the shop API.');
            setReady(false);
        }
    }, []);

    useEffect(() => {
        refresh();
    }, [refresh]);

    useEffect(() => {
        const sub = AppState.addEventListener('change', state => {
            if (state === 'active' && __DEV__) {
                refresh({ reprobe: true });
            }
        });
        return () => sub.remove();
    }, [refresh]);

    const value = useMemo(
        () => ({
            shop,
            apiBase: getApiBaseUrl(),
            ready,
            error,
            productCount: shop?.productCount ?? 0,
            refresh,
        }),
        [shop, ready, error, refresh],
    );

    return <ShopContext.Provider value={value}>{children}</ShopContext.Provider>;
}
