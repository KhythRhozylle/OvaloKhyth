import { Image, Text, TouchableOpacity, View } from 'react-native';
import { COLORS, RADIUS, SHADOW } from '../constants/theme';
import { formatPrice, getProductImage } from '../utils/product';

const QtyButton = ({ label, onPress, disabled }) => (
    <TouchableOpacity
        onPress={onPress}
        disabled={disabled}
        style={{
            width: 32,
            height: 32,
            borderRadius: 8,
            borderWidth: 1,
            borderColor: COLORS.border,
            backgroundColor: COLORS.surface,
            alignItems: 'center',
            justifyContent: 'center',
            opacity: disabled ? 0.4 : 1,
        }}
    >
        <Text style={{ fontSize: 18, fontWeight: '600', color: COLORS.text }}>{label}</Text>
    </TouchableOpacity>
);

const CartLineItem = ({ item, onIncrease, onDecrease, onRemove }) => {
    const imageUri = getProductImage(item);
    const maxStock = item.stock ?? 99;
    const atMax = item.quantity >= maxStock;

    return (
        <View
            style={{
                flexDirection: 'row',
                backgroundColor: COLORS.surface,
                borderRadius: RADIUS.card,
                padding: 12,
                marginBottom: 12,
                ...SHADOW.soft,
            }}
        >
            <View
                style={{
                    width: 72,
                    height: 72,
                    borderRadius: RADIUS.sm,
                    backgroundColor: COLORS.imageBg,
                    overflow: 'hidden',
                }}
            >
                {imageUri ? (
                    <Image
                        source={{ uri: imageUri }}
                        style={{ width: 72, height: 72 }}
                        resizeMode="contain"
                    />
                ) : null}
            </View>
            <View style={{ flex: 1, marginLeft: 12 }}>
                <Text numberOfLines={2} style={{ fontSize: 14, fontWeight: '600', color: COLORS.text }}>
                    {item.name}
                </Text>
                <Text style={{ fontSize: 15, fontWeight: '700', color: COLORS.accent, marginTop: 4 }}>
                    {formatPrice(item.price)}
                </Text>
                <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 10 }}>
                    <QtyButton label="−" onPress={onDecrease} disabled={item.quantity <= 1} />
                    <Text
                        style={{
                            marginHorizontal: 14,
                            fontSize: 15,
                            fontWeight: '700',
                            color: COLORS.text,
                            minWidth: 24,
                            textAlign: 'center',
                        }}
                    >
                        {item.quantity}
                    </Text>
                    <QtyButton label="+" onPress={onIncrease} disabled={atMax} />
                </View>
            </View>
            <TouchableOpacity onPress={onRemove} hitSlop={8} style={{ padding: 4 }}>
                <Text style={{ fontSize: 18, color: COLORS.textMuted }}>✕</Text>
            </TouchableOpacity>
        </View>
    );
};

export default CartLineItem;
