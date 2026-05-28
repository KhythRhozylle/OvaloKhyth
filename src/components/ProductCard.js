import { Image, Text, TouchableOpacity, View } from 'react-native';
import { COLORS, RADIUS, SHADOW } from '../constants/theme';
import { PRODUCT_GRID } from '../utils/layout';
import { formatPrice, getProductImage, isInStock } from '../utils/product';

const ProductCard = ({ product, onPress, width, style }) => {
    const imageUri = getProductImage(product);
    const inStock = isInStock(product);
    const imageHeight = PRODUCT_GRID.imageHeight;

    return (
        <TouchableOpacity
            onPress={onPress}
            activeOpacity={0.9}
            style={[{ width }, style]}
        >
            <View
                style={{
                    backgroundColor: COLORS.surface,
                    borderRadius: RADIUS.card,
                    overflow: 'hidden',
                    borderWidth: 1,
                    borderColor: COLORS.border,
                    ...SHADOW.card,
                }}
            >
                <View
                    style={{
                        height: imageHeight,
                        backgroundColor: COLORS.imageBg,
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}
                >
                    {imageUri ? (
                        <Image
                            source={{ uri: imageUri }}
                            style={{ width: '100%', height: imageHeight }}
                            resizeMode="cover"
                        />
                    ) : null}
                    {!inStock ? (
                        <View
                            style={{
                                position: 'absolute',
                                bottom: 10,
                                left: 10,
                                backgroundColor: 'rgba(17,17,17,0.75)',
                                paddingHorizontal: 10,
                                paddingVertical: 4,
                                borderRadius: RADIUS.pill,
                            }}
                        >
                            <Text style={{ color: COLORS.white, fontSize: 10, fontWeight: '600' }}>
                                Out of stock
                            </Text>
                        </View>
                    ) : null}
                </View>

                <View style={{ paddingHorizontal: 14, paddingTop: 12, paddingBottom: 14 }}>
                    {product.category ? (
                        <Text
                            numberOfLines={1}
                            style={{
                                fontSize: 10,
                                color: COLORS.textMuted,
                                fontWeight: '700',
                                letterSpacing: 0.2,
                                textTransform: 'uppercase',
                            }}
                        >
                            {product.category}
                        </Text>
                    ) : (
                        <View style={{ height: 14 }} />
                    )}
                    <Text
                        numberOfLines={2}
                        style={{
                            fontSize: 15,
                            fontWeight: '700',
                            color: COLORS.text,
                            marginTop: 4,
                            lineHeight: 19,
                            minHeight: 38,
                        }}
                    >
                        {product.name}
                    </Text>
                    <View
                        style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            marginTop: 8,
                        }}
                    >
                        <Text
                            style={{
                                fontSize: 18,
                                fontWeight: '800',
                                color: COLORS.text,
                            }}
                        >
                            {formatPrice(product.price)}
                        </Text>
                        {inStock && product.stock != null ? (
                            <Text style={{ fontSize: 10, color: COLORS.textMuted }}>
                                {product.stock} left
                            </Text>
                        ) : null}
                    </View>
                </View>
            </View>
        </TouchableOpacity>
    );
};

export default ProductCard;
