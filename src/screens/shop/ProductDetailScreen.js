import { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, Image, ScrollView, Text, View } from 'react-native';
import { useDispatch } from 'react-redux';
import CustomButton, { ButtonRow } from '../../components/CustomButton';
import { useNavigation, useRoute } from '@react-navigation/native';

import AppTopBar from '../../components/AppTopBar';
import { cartAddItem } from '../../app/actions';
import { COLORS, RADIUS, SHADOW, SPACING } from '../../constants/theme';
import { fetchProductById } from '../../app/api/catalog';
import { ROUTES } from '../../utils';
import { formatPrice, getProductImage, isInStock } from '../../utils/product';

const ProductDetailScreen = () => {
    const navigation = useNavigation();
    const dispatch = useDispatch();
    const route = useRoute();
    const initial = route.params?.product;
    const [product, setProduct] = useState(initial);
    const [loading, setLoading] = useState(!!initial?.id);

    useEffect(() => {
        if (initial?.id) {
            fetchProductById(initial.id)
                .then(setProduct)
                .catch(() => setProduct(initial))
                .finally(() => setLoading(false));
        }
    }, [initial?.id]);

    const addToCart = (goToCart = false) => {
        if (!isInStock(product)) {
            Alert.alert('Out of stock', 'This item is not available right now.');
            return;
        }
        dispatch(cartAddItem(product));
        if (goToCart) {
            navigation.navigate('MainTabs', { screen: ROUTES.TAB_MORE });
            return;
        }
        Alert.alert('Added to cart', `${product.name} was added to your cart.`, [
            { text: 'Continue shopping', style: 'cancel' },
            {
                text: 'View profile',
                onPress: () =>
                    navigation.navigate('MainTabs', { screen: ROUTES.TAB_MORE }),
            },
        ]);
    };

    if (loading && !product) {
        return (
            <View style={{ flex: 1, backgroundColor: COLORS.background }}>
                <AppTopBar showBack title="Detail Product" />
                <ActivityIndicator style={{ marginTop: 40 }} />
            </View>
        );
    }

    if (!product) {
        return (
            <View style={{ flex: 1, backgroundColor: COLORS.background }}>
                <AppTopBar showBack title="Detail Product" />
                <Text style={{ padding: SPACING.screen }}>Product not found</Text>
            </View>
        );
    }

    const imageUri = getProductImage(product);
    const inStock = isInStock(product);

    return (
        <View style={{ flex: 1, backgroundColor: COLORS.background }}>
            <AppTopBar showBack title="Detail Product" />
            <ScrollView contentContainerStyle={{ paddingBottom: 32 }}>
                <View
                    style={{
                        marginHorizontal: SPACING.screen,
                        marginTop: 8,
                        backgroundColor: COLORS.imageBg,
                        borderRadius: RADIUS.card,
                        alignItems: 'center',
                        paddingVertical: 24,
                        ...SHADOW.card,
                    }}
                >
                    {imageUri ? (
                        <Image
                            source={{ uri: imageUri }}
                            style={{ width: '85%', height: 280 }}
                            resizeMode="contain"
                        />
                    ) : (
                        <View style={{ width: '85%', height: 280 }} />
                    )}
                    <View style={{ flexDirection: 'row', marginTop: 16 }}>
                        {[COLORS.florynn.primary, COLORS.border, COLORS.border].map((bg, i) => (
                            <View
                                key={i}
                                style={{
                                    width: 8,
                                    height: 8,
                                    borderRadius: 4,
                                    backgroundColor: bg,
                                    marginHorizontal: 3,
                                }}
                            />
                        ))}
                    </View>
                </View>

                <View style={{ paddingHorizontal: SPACING.screen, marginTop: 20 }}>
                    <View
                        style={{
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                            alignItems: 'flex-start',
                        }}
                    >
                        <View style={{ flex: 1 }}>
                            {product.category ? (
                                <Text style={{ fontSize: 13, color: COLORS.textMuted, fontWeight: '600' }}>
                                    {product.category}
                                </Text>
                            ) : null}
                            <Text
                                style={{
                                    fontSize: 20,
                                    fontWeight: '700',
                                    color: COLORS.text,
                                    marginTop: 6,
                                    lineHeight: 26,
                                }}
                            >
                                {product.name}
                            </Text>
                        </View>
                        <View
                            style={{
                                width: 40,
                                height: 40,
                                borderRadius: 20,
                                backgroundColor: COLORS.imageBg,
                                alignItems: 'center',
                                justifyContent: 'center',
                            }}
                        >
                            <Text style={{ fontSize: 20 }}>♡</Text>
                        </View>
                    </View>

                    <Text
                        style={{
                            fontSize: 22,
                            fontWeight: '800',
                                color: COLORS.text,
                            marginTop: 12,
                        }}
                    >
                        {formatPrice(product.price)}
                    </Text>
                    <Text style={{ fontSize: 13, color: inStock ? COLORS.success : COLORS.error, marginTop: 6 }}>
                        {inStock
                            ? `${product.stock ?? '—'} available · In stock`
                            : 'Out of stock'}
                    </Text>

                    <Text
                        style={{
                            marginTop: 20,
                            lineHeight: 22,
                            fontSize: 14,
                            color: COLORS.textMuted,
                        }}
                    >
                        {product.description || 'No description available.'}
                    </Text>

                    <ButtonRow style={{ marginTop: 28 }}>
                        <CustomButton
                            label="ADD TO CART"
                            variant="outline"
                            pill
                            fullWidth
                            icon="🛍️"
                            disabled={!inStock}
                            onPress={() => addToCart(false)}
                            style={{ marginRight: 6 }}
                        />
                        <CustomButton
                            label="BUY NOW"
                            variant="primary"
                            pill
                            fullWidth
                            disabled={!inStock}
                            onPress={() => addToCart(true)}
                            style={{ marginLeft: 6 }}
                        />
                    </ButtonRow>
                    <CustomButton
                        label="Ask about this item"
                        variant="secondary"
                        fullWidth
                        onPress={() => {
                            navigation.navigate('MainTabs', {
                                screen: ROUTES.TAB_CONTACT,
                                params: { productName: product.name },
                            });
                        }}
                        style={{ marginTop: 12 }}
                    />
                </View>
            </ScrollView>
        </View>
    );
};

export default ProductDetailScreen;
