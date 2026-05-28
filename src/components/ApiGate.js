import { ActivityIndicator, Text, TouchableOpacity, View } from 'react-native';

import { useShop } from '../context/ShopProvider';
import { COLORS, SPACING } from '../constants/theme';

/**
 * Dev: blocks the app until the shop API is reachable (same DB as admin).
 */
const ApiGate = ({ children }) => {
    const { ready, error, productCount, apiBase, refresh } = useShop();

    if (!__DEV__) {
        return children;
    }

    if (!ready && !error) {
        return (
            <View
                style={{
                    flex: 1,
                    justifyContent: 'center',
                    alignItems: 'center',
                    backgroundColor: COLORS.background,
                    padding: SPACING.screen,
                }}
            >
                <ActivityIndicator size="large" color={COLORS.primary} />
                <Text style={{ marginTop: 16, color: COLORS.textMuted }}>Connecting to shop…</Text>
            </View>
        );
    }

    if (error) {
        return (
            <View
                style={{
                    flex: 1,
                    justifyContent: 'center',
                    backgroundColor: COLORS.background,
                    padding: SPACING.screen,
                }}
            >
                <Text style={{ fontSize: 18, fontWeight: '700', color: COLORS.text }}>
                    Cannot reach Florynn API
                </Text>
                <Text style={{ marginTop: 12, color: COLORS.error, lineHeight: 22 }}>{error}</Text>
                <Text style={{ marginTop: 8, fontSize: 12, color: COLORS.textMuted }}>{apiBase}</Text>
                <Text style={{ marginTop: 16, color: COLORS.textMuted, lineHeight: 20 }}>
                    Production (Railway): npm run api:use-production{'\n'}
                    Local dev: npm run dev:connect
                </Text>
                <TouchableOpacity
                    onPress={() => refresh({ reprobe: true })}
                    style={{
                        marginTop: 24,
                        backgroundColor: COLORS.florynn.primary,
                        paddingVertical: 14,
                        borderRadius: 8,
                        alignItems: 'center',
                    }}
                >
                    <Text style={{ color: COLORS.white, fontWeight: '600' }}>Retry connection</Text>
                </TouchableOpacity>
            </View>
        );
    }

    if (ready && productCount === 0) {
        return (
            <View
                style={{
                    flex: 1,
                    justifyContent: 'center',
                    padding: SPACING.screen,
                    backgroundColor: COLORS.background,
                }}
            >
                <Text style={{ fontSize: 18, fontWeight: '700', color: COLORS.text }}>
                    Shop connected — no products yet
                </Text>
                <Text style={{ marginTop: 12, color: COLORS.textMuted, lineHeight: 20 }}>
                    Add bouquets in the admin dashboard at {apiBase}, then tap Retry.
                </Text>
                <TouchableOpacity
                    onPress={() => refresh({ reprobe: true })}
                    style={{
                        marginTop: 24,
                        backgroundColor: COLORS.florynn.primary,
                        paddingVertical: 14,
                        borderRadius: 8,
                        alignItems: 'center',
                    }}
                >
                    <Text style={{ color: COLORS.white, fontWeight: '600' }}>Refresh catalog</Text>
                </TouchableOpacity>
            </View>
        );
    }

    return children;
};

export default ApiGate;
