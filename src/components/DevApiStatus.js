import { useEffect, useState } from 'react';
import { Text, View } from 'react-native';
import { getApiBaseUrl, getApiTargetLabel } from '../config/api';
import { useShop } from '../context/ShopProvider';
import { COLORS } from '../constants/theme';

/** Dev-only: shows API URL and catalog sync with admin. */
const DevApiStatus = () => {
    const { productCount, error, ready } = useShop();
    const [status, setStatus] = useState('checking…');
    const base = getApiBaseUrl();

    useEffect(() => {
        if (!__DEV__) {
            return;
        }
        if (error) {
            setStatus(`FAIL @ ${base}: ${error}`);
        } else if (ready) {
            setStatus(
                `OK — ${productCount} products (${getApiTargetLabel()}) @ ${base}`,
            );
        } else {
            setStatus('checking…');
        }
    }, [error, productCount, ready, base]);

    if (!__DEV__) {
        return null;
    }

    const ok = status.startsWith('OK');

    return (
        <View
            style={{
                backgroundColor: ok ? '#E8F5E9' : '#FFEBEE',
                padding: 10,
                marginBottom: 12,
                borderRadius: 8,
            }}
        >
            <Text style={{ fontSize: 11, color: COLORS.textMuted }}>Dev API (admin ↔ mobile)</Text>
            <Text style={{ fontSize: 12, fontWeight: '600', color: COLORS.text }}>{base}</Text>
            <Text
                style={{
                    fontSize: 12,
                    marginTop: 4,
                    color: ok ? COLORS.success : COLORS.error,
                }}
            >
                {status}
            </Text>
        </View>
    );
};

export default DevApiStatus;
