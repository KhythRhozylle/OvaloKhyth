import { Text, View } from 'react-native';
import { COLORS, RADIUS } from '../constants/theme';
import { getOrderStatusIndex, ORDER_STATUSES } from '../utils/orderStatus';

const TRACK_STEPS = ORDER_STATUSES.filter(s =>
    ['pending', 'confirmed', 'preparing', 'out_for_delivery', 'delivered'].includes(s.key),
);

const OrderStatusTracker = ({ status }) => {
    const current = getOrderStatusIndex(status);
    const cancelled = status === 'cancelled';

    if (cancelled) {
        return (
            <View
                style={{
                    backgroundColor: '#FFEBEE',
                    padding: 12,
                    borderRadius: RADIUS.card,
                }}
            >
                <Text style={{ color: COLORS.error, fontWeight: '700' }}>Order cancelled</Text>
            </View>
        );
    }

    return (
        <View style={{ marginVertical: 8 }}>
            {TRACK_STEPS.map((step, index) => {
                const done = index <= current;
                const active = index === current;
                return (
                    <View
                        key={step.key}
                        style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}
                    >
                        <View
                            style={{
                                width: 22,
                                height: 22,
                                borderRadius: 11,
                                backgroundColor: done ? COLORS.florynn.primary : COLORS.border,
                                alignItems: 'center',
                                justifyContent: 'center',
                            }}
                        >
                            {done ? (
                                <Text style={{ color: COLORS.white, fontSize: 11, fontWeight: '700' }}>
                                    ✓
                                </Text>
                            ) : null}
                        </View>
                        <Text
                            style={{
                                marginLeft: 10,
                                fontSize: 14,
                                fontWeight: active ? '700' : '500',
                                color: done ? COLORS.text : COLORS.textMuted,
                            }}
                        >
                            {step.label}
                        </Text>
                    </View>
                );
            })}
        </View>
    );
};

export default OrderStatusTracker;
