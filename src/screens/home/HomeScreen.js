import { useCallback, useMemo, useState } from 'react';
import { Image, RefreshControl, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import CustomButton from '../../components/CustomButton';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';

import AppTopBar from '../../components/AppTopBar';
import CategoryCircle from '../../components/CategoryCircle';
import { ProductGridRows } from '../../components/ProductGrid';
import SectionHeader from '../../components/SectionHeader';
import { COLORS, RADIUS, SHADOW, SPACING } from '../../constants/theme';
import { fetchCategories } from '../../app/api/catalog';
import { productsFetch } from '../../app/actions';
import { useShop } from '../../context/ShopProvider';
import { ROUTES } from '../../utils';
import { getProductImage, isInStock } from '../../utils/product';

const HomeScreen = () => {
    const navigation = useNavigation();
    const { refresh: refreshShop } = useShop();
    const dispatch = useDispatch();
    const products = useSelector(state => state.products?.items ?? []);
    const [categories, setCategories] = useState([]);
    const [refreshing, setRefreshing] = useState(false);

    const loadCatalog = useCallback(async ({ reprobe = false } = {}) => {
        try {
            if (__DEV__ && reprobe) {
                const { resetDevApiBaseUrl } = await import('../../config/devApiBase');
                await resetDevApiBaseUrl();
            }
            dispatch(productsFetch());
            const c = await fetchCategories();
            setCategories(c);
        } catch {
            // Shop tab shows connection errors in dev
        } finally {
            setRefreshing(false);
        }
    }, [dispatch]);

    useFocusEffect(
        useCallback(() => {
            loadCatalog();
        }, [loadCatalog]),
    );

    const onRefresh = useCallback(() => {
        setRefreshing(true);
        refreshShop({ reprobe: true }).finally(() => loadCatalog({ reprobe: true }));
    }, [loadCatalog, refreshShop]);

    const inStock = useMemo(() => products.filter(isInStock), [products]);
    const heroProduct = inStock[0];
    const curated = inStock.slice(0, 6);

    const productForCategory = catId => {
        return products.find(p => String(p.categoryId) === String(catId));
    };

    const openExplore = (categoryId = null) => {
        navigation.navigate('MainTabs', {
            screen: ROUTES.TAB_SHOP,
            params: categoryId != null ? { categoryId } : undefined,
        });
    };

    return (
        <View style={{ flex: 1, backgroundColor: COLORS.background }}>
            <AppTopBar />
            <ScrollView
                showsVerticalScrollIndicator={false}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                        tintColor={COLORS.primary}
                    />
                }
            >
                <View
                    style={{
                        marginHorizontal: SPACING.screen,
                        marginTop: 8,
                        borderRadius: RADIUS.card,
                        backgroundColor: COLORS.heroBg,
                        overflow: 'hidden',
                        flexDirection: 'row',
                        minHeight: 160,
                        ...SHADOW.card,
                    }}
                >
                    <View style={{ flex: 1, padding: 20, justifyContent: 'center' }}>
                        <Text
                            style={{
                                fontSize: 11,
                                fontWeight: '700',
                                letterSpacing: 1,
                                color: 'rgba(255,255,255,0.78)',
                            }}
                        >
                            NEW ARRIVALS
                        </Text>
                        <Text
                            style={{
                                fontSize: 34,
                                fontWeight: '800',
                                color: COLORS.white,
                                marginTop: 6,
                                lineHeight: 37,
                            }}
                        >
                            Make Space{'\n'}For Something{'\n'}Better
                        </Text>
                        <Text
                            style={{
                                fontSize: 13,
                                color: 'rgba(255,255,255,0.85)',
                                marginTop: 6,
                            }}
                        >
                            Add to cart · checkout from Profile
                        </Text>
                        <View style={{ marginTop: 14, alignSelf: 'flex-start' }}>
                            <CustomButton
                                label="Shop More"
                                size="sm"
                                pill
                                onPress={() => openExplore()}
                                style={{ backgroundColor: COLORS.white, borderColor: COLORS.white }}
                                textStyle={{ color: COLORS.text, letterSpacing: 0 }}
                            />
                        </View>
                    </View>
                    {heroProduct && getProductImage(heroProduct) ? (
                        <Image
                            source={{ uri: getProductImage(heroProduct) }}
                            style={{ width: 130, height: '100%' }}
                            resizeMode="cover"
                        />
                    ) : null}
                </View>

                <View style={{ marginTop: 24, paddingLeft: SPACING.screen }}>
                    <View
                        style={{
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            paddingRight: SPACING.screen,
                            marginBottom: 12,
                        }}
                    >
                        <Text style={{ fontSize: 26, fontWeight: '800', color: COLORS.text }}>
                            Catalog
                        </Text>
                        <TouchableOpacity onPress={() => openExplore()}>
                            <Text style={{ fontSize: 13, color: COLORS.textMuted }}>Browse</Text>
                        </TouchableOpacity>
                    </View>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                        {categories.map(cat => (
                            <CategoryCircle
                                key={String(cat.id)}
                                name={cat.name}
                                imageProduct={productForCategory(cat.id)}
                                onPress={() => openExplore(cat.id)}
                            />
                        ))}
                    </ScrollView>
                </View>

                <View style={{ paddingHorizontal: SPACING.screen, marginTop: 28 }}>
                    <SectionHeader
                        title="Curated for you"
                        actionLabel="See all"
                        onAction={() => openExplore()}
                        style={{ marginBottom: 14 }}
                    />
                    {curated.length > 0 ? (
                        <ProductGridRows
                            products={curated}
                            onProductPress={p =>
                                navigation.navigate(ROUTES.PRODUCT_DETAIL, { product: p })
                            }
                        />
                    ) : (
                        <Text style={{ color: COLORS.textMuted }}>Loading products…</Text>
                    )}
                </View>
                <View
                    style={{
                        flexDirection: 'row',
                        justifyContent: 'center',
                        marginTop: 8,
                        marginBottom: 24,
                    }}
                >
                    <TouchableOpacity
                        onPress={() => navigation.navigate(ROUTES.ABOUT)}
                        style={{ marginHorizontal: 16 }}
                    >
                        <Text style={{ fontSize: 13, color: COLORS.textMuted }}>About Us</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => navigation.navigate(ROUTES.HISTORY)}
                        style={{ marginHorizontal: 16 }}
                    >
                        <Text style={{ fontSize: 13, color: COLORS.textMuted }}>Our History</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </View>
    );
};

export default HomeScreen;
