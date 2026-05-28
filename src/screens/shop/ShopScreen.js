import { useCallback, useEffect, useMemo, useState } from 'react';
import {
    ActivityIndicator,
    RefreshControl,
    ScrollView,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { useFocusEffect, useNavigation, useRoute } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';

import AppTopBar from '../../components/AppTopBar';
import CategoryCircle from '../../components/CategoryCircle';
import FilterPill from '../../components/FilterPill';
import ProductGrid from '../../components/ProductGrid';
import SearchBar from '../../components/SearchBar';
import { COLORS, SPACING } from '../../constants/theme';
import { fetchCategories } from '../../app/api/catalog';
import { getApiBaseUrl } from '../../config/api';
import { resetDevApiBaseUrl } from '../../config/devApiBase';
import { useShop } from '../../context/ShopProvider';
import { productsFetch } from '../../app/actions';
import { ROUTES } from '../../utils';
import { filterProducts, sortProducts } from '../../utils/product';

const FILTER_PILLS = ['All', 'In stock', 'Low stock'];

const ShopScreen = () => {
    const navigation = useNavigation();
    const route = useRoute();
    const { refresh: refreshShop } = useShop();
    const dispatch = useDispatch();
    const products = useSelector(state => state.products?.items ?? []);
    const [categories, setCategories] = useState([]);
    const [search, setSearch] = useState('');
    const [categoryId, setCategoryId] = useState(route.params?.categoryId ?? null);
    const [filter, setFilter] = useState('All');
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [error, setError] = useState(null);

    const load = useCallback(async ({ silent = false } = {}) => {
        if (!silent) {
            setLoading(true);
        }
        setError(null);
        try {
            if (__DEV__ && !silent) {
                await resetDevApiBaseUrl();
            }
            dispatch(productsFetch());
            const c = await fetchCategories();
            setCategories(c);
        } catch (e) {
            setError(`${e.message}\n${getApiBaseUrl()}`);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    }, [dispatch]);

    useFocusEffect(
        useCallback(() => {
            load({ silent: products.length > 0 });
        }, [load, products.length]),
    );

    const onRefresh = useCallback(() => {
        setRefreshing(true);
        refreshShop({ reprobe: true }).finally(() => load({ silent: true }));
    }, [load, refreshShop]);

    useEffect(() => {
        if (route.params?.categoryId != null) {
            setCategoryId(route.params.categoryId);
        }
    }, [route.params?.categoryId]);

    const filtered = useMemo(() => {
        let list = filterProducts(products, { search, categoryId });
        if (filter === 'In stock') {
            list = list.filter(p => (p.stock ?? 1) > 0);
        }
        if (filter === 'Low stock') {
            list = list.filter(p => p.stock != null && p.stock > 0 && p.stock <= 5);
        }
        return sortProducts(list, 'popular');
    }, [products, search, categoryId, filter]);

    const productForCategory = catId =>
        products.find(p => String(p.categoryId) === String(catId));

    const openProduct = product => {
        navigation.navigate(ROUTES.PRODUCT_DETAIL, { product });
    };

    const ListHeader = () => (
        <View style={{ marginBottom: 4 }}>
            <View
                style={{
                    backgroundColor: COLORS.heroBg,
                    borderRadius: 24,
                    padding: 18,
                    marginTop: 8,
                    marginBottom: 14,
                }}
            >
                <Text style={{ color: 'rgba(255,255,255,0.8)', fontSize: 11, fontWeight: '700' }}>
                    EXCLUSIVE
                </Text>
                <Text
                    style={{
                        color: COLORS.white,
                        fontSize: 30,
                        fontWeight: '900',
                        lineHeight: 34,
                        marginTop: 6,
                        maxWidth: '78%',
                    }}
                >
                    Find your next signature bouquet
                </Text>
            </View>
            <View style={{ paddingTop: 8, paddingBottom: 12 }}>
                <SearchBar
                    value={search}
                    onChangeText={setSearch}
                    placeholder="Search bouquets..."
                />
            </View>

            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{
                    paddingBottom: 4,
                    alignItems: 'center',
                }}
            >
                {FILTER_PILLS.map(pill => (
                    <FilterPill
                        key={pill}
                        label={pill}
                        active={filter === pill}
                        icon={pill === 'In stock' ? '✓' : pill === 'Low stock' ? '!' : null}
                        onPress={() => setFilter(pill)}
                    />
                ))}
            </ScrollView>

            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                style={{ marginTop: 16 }}
                contentContainerStyle={{ paddingRight: SPACING.screen }}
            >
                <CategoryCircle
                    name="All"
                    onPress={() => setCategoryId(null)}
                    selected={categoryId == null}
                />
                {categories.map(cat => (
                    <CategoryCircle
                        key={String(cat.id)}
                        name={cat.name}
                        imageProduct={productForCategory(cat.id)}
                        onPress={() => setCategoryId(cat.id)}
                        selected={String(categoryId) === String(cat.id)}
                    />
                ))}
            </ScrollView>

            <View
                style={{
                    flexDirection: 'row',
                    alignItems: 'baseline',
                    justifyContent: 'space-between',
                    marginTop: 20,
                    marginBottom: 12,
                }}
            >
                <Text style={{ fontSize: 17, fontWeight: '700', color: COLORS.text }}>
                    Catalog
                </Text>
                <Text style={{ fontSize: 12, color: COLORS.textMuted, fontWeight: '500' }}>
                    {filtered.length} items
                </Text>
            </View>
        </View>
    );

    return (
        <View style={{ flex: 1, backgroundColor: COLORS.background }}>
            <AppTopBar />
            {loading ? (
                <ActivityIndicator color={COLORS.primary} style={{ marginTop: 48 }} />
            ) : error ? (
                <View style={{ padding: SPACING.screen }}>
                    <Text style={{ color: COLORS.error, lineHeight: 20 }}>{error}</Text>
                    <TouchableOpacity
                        onPress={load}
                        style={{
                            marginTop: 16,
                            alignSelf: 'flex-start',
                            backgroundColor: COLORS.florynn.primary,
                            paddingHorizontal: 20,
                            paddingVertical: 12,
                            borderRadius: 8,
                        }}
                    >
                        <Text style={{ color: COLORS.white, fontWeight: '600' }}>Retry</Text>
                    </TouchableOpacity>
                </View>
            ) : (
                <ProductGrid
                    products={filtered}
                    onProductPress={openProduct}
                    refreshControl={
                        <RefreshControl
                            refreshing={refreshing}
                            onRefresh={onRefresh}
                            tintColor={COLORS.primary}
                        />
                    }
                    ListHeaderComponent={ListHeader}
                    ListEmptyComponent={
                        <View style={{ alignItems: 'center', paddingVertical: 40 }}>
                            <Text style={{ fontSize: 16, fontWeight: '600', color: COLORS.text }}>
                                No products found
                            </Text>
                            <Text
                                style={{
                                    fontSize: 14,
                                    color: COLORS.textMuted,
                                    marginTop: 8,
                                    textAlign: 'center',
                                }}
                            >
                                Try another search or filter.
                            </Text>
                        </View>
                    }
                />
            )}
        </View>
    );
};

export default ShopScreen;
