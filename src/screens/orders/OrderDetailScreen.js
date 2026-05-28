import { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, ScrollView, Text, View } from 'react-native';
import { useFocusEffect, useRoute } from '@react-navigation/native';

import AppTopBar from '../../components/AppTopBar';
import OrderStatusTracker from '../../components/OrderStatusTracker';
import { fetchOrderByGroupId } from '../../app/api/orders';
import { COLORS, RADIUS, SHADOW, SPACING } from '../../constants/theme';
import { getOrderStatusLabel } from '../../utils/orderStatus';
import { formatPrice } from '../../utils/product';

const OrderDetailScreen = () => {
    const route = useRoute();
    const orderGroupId = route.params?.orderGroupId;
    const email = route.params?.email;
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const load = useCallback(async () => {
        if (!orderGroupId || !email) {
            setError('Missing order information.');
            setLoading(false);
            return;
        }
        setLoading(true);
        setError(null);
        try {
            const res = await fetchOrderByGroupId(orderGroupId, email);
            setOrder(res?.data ?? null);
        } catch (e) {
            setError(e.message || 'Could not load order.');
        } finally {
            setLoading(false);
        }
    }, [orderGroupId, email]);

    useFocusEffect(
        useCallback(() => {
            load();
        }, [load]),
    );

    return (
        <View style={{ flex: 1, backgroundColor: COLORS.background }}>
            <AppTopBar showBack title="Order tracking" showCart={false} />
            {loading ? (
                <ActivityIndicator color={COLORS.florynn.primary} style={{ marginTop: 48 }} />
            ) : error ? (
                <Text style={{ color: COLORS.error, padding: SPACING.screen }}>{error}</Text>
            ) : !order ? (
                <Text style={{ padding: SPACING.screen, color: COLORS.textMuted }}>
                    Order not found.
                </Text>
            ) : (
                <ScrollView contentContainerStyle={{ padding: SPACING.screen, paddingBottom: 32 }}>
                    <View
                        style={{
                            backgroundColor: COLORS.surface,
                            borderRadius: RADIUS.card,
                            padding: 16,
                            marginBottom: 16,
                            ...SHADOW.soft,
                        }}
                    >
                        <Text style={{ fontSize: 13, color: COLORS.textMuted }}>Status</Text>
                        <Text
                            style={{
                                fontSize: 20,
                                fontWeight: '800',
                                color: COLORS.florynn.primary,
                                marginTop: 4,
                                marginBottom: 12,
                            }}
                        >
                            {getOrderStatusLabel(order.status)}
                        </Text>
                        <OrderStatusTracker status={order.status} />
                        {order.orderDate ? (
                            <Text style={{ fontSize: 12, color: COLORS.textMuted, marginTop: 8 }}>
                                Placed {new Date(order.orderDate).toLocaleString()}
                            </Text>
                        ) : null}
                    </View>

                    <View
                        style={{
                            backgroundColor: COLORS.surface,
                            borderRadius: RADIUS.card,
                            padding: 16,
                            marginBottom: 16,
                            ...SHADOW.soft,
                        }}
                    >
                        <Text style={{ fontWeight: '700', marginBottom: 10 }}>Items</Text>
                        {(order.items || []).map(line => (
                            <View
                                key={String(line.id)}
                                style={{
                                    flexDirection: 'row',
                                    justifyContent: 'space-between',
                                    marginBottom: 8,
                                }}
                            >
                                <Text style={{ flex: 1, color: COLORS.text }}>
                                    {line.productName} × {line.quantity}
                                </Text>
                                <Text style={{ fontWeight: '600' }}>
                                    {formatPrice(line.lineTotal ?? line.price * line.quantity)}
                                </Text>
                            </View>
                        ))}
                        <Text
                            style={{
                                fontSize: 18,
                                fontWeight: '800',
                                color: COLORS.accent,
                                marginTop: 8,
                                textAlign: 'right',
                            }}
                        >
                            Total {formatPrice(order.total)}
                        </Text>
                    </View>

                    {order.customer ? (
                        <View
                            style={{
                                backgroundColor: COLORS.surface,
                                borderRadius: RADIUS.card,
                                padding: 16,
                                ...SHADOW.soft,
                            }}
                        >
                            <Text style={{ fontWeight: '700', marginBottom: 8 }}>
                                Delivery details
                            </Text>
                            <Text>{order.customer.fullName}</Text>
                            <Text style={{ color: COLORS.textMuted, marginTop: 4 }}>
                                {order.customer.contactNumber}
                            </Text>
                            <Text style={{ color: COLORS.textMuted, marginTop: 4 }}>
                                {order.customer.completeAddress}
                            </Text>
                            <Text style={{ color: COLORS.textMuted, marginTop: 4 }}>
                                {order.customer.deliveryLocation},{' '}
                                {order.customer.cityProvince}
                            </Text>
                        </View>
                    ) : null}
                </ScrollView>
            )}
        </View>
    );
};

export default OrderDetailScreen;
