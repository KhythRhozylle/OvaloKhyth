import { useCallback, useEffect, useRef, useState } from 'react';
import {
    ActivityIndicator,
    Image,
    RefreshControl,
    ScrollView,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { useFocusEffect, useNavigation } from '@react-navigation/native';

import AppTopBar from '../../components/AppTopBar';
import CartLineItem from '../../components/CartLineItem';
import CustomButton from '../../components/CustomButton';
import { fetchOrdersByEmail } from '../../app/api/orders';
import { fetchProducts } from '../../app/api/catalog';
import { useShop } from '../../context/ShopProvider';
import {
    authLogout,
    cartClear,
    cartRemoveItem,
    cartUpdateQuantity,
} from '../../app/actions';
import { PROFILE_COPY } from '../../constants/copy';
import { COLORS, RADIUS, SHADOW, SPACING } from '../../constants/theme';
import { getCartItemCount, getCartSubtotal } from '../../utils/cart';
import {
    EMPTY_PROFILE,
    clearCustomerProfile,
    isProfileComplete,
    loadCustomerProfile,
    mergeProfileWithAuth,
} from '../../utils/customerProfile';
import { getOrderStatusLabel } from '../../utils/orderStatus';
import { formatPrice, getProductImage } from '../../utils/product';
import { getMobileRoleLabel } from '../../utils/auth';
import { ROUTES } from '../../utils';

const MoreScreen = () => {
    const navigation = useNavigation();
    const dispatch = useDispatch();
    const items = useSelector(state => state.cart?.items ?? []);
    const authData = useSelector(state => state.auth?.data);
    const authUser = authData?.user;
    const isLoggedIn = !!(authData?.token);
    const orderEmail = (authUser?.email || '').trim().toLowerCase();
    const lastOrderEmailRef = useRef('');

    const [profile, setProfile] = useState(null);
    const [orders, setOrders] = useState([]);
    const [ordersLoading, setOrdersLoading] = useState(false);
    const [productThumbByName, setProductThumbByName] = useState({});

    const count = getCartItemCount(items);
    const subtotal = getCartSubtotal(items);

    const hydrate = useCallback(async () => {
        const saved = await loadCustomerProfile();
        setProfile(mergeProfileWithAuth(saved, authUser));
    }, [authUser]);

    const loadOrders = useCallback(async (email) => {
        const normalized = (email || '').trim().toLowerCase();
        if (!normalized) {
            setOrders([]);
            return;
        }
        setOrdersLoading(true);
        try {
            const res = await fetchOrdersByEmail(normalized);
            const list = res?.data ?? [];
            setOrders(list);

            // Load product thumbnails once so orders can show bouquet images.
            if (list.length && Object.keys(productThumbByName).length === 0) {
                fetchProducts()
                    .then(products => {
                        const map = {};
                        for (const p of products || []) {
                            const key = (p?.name || '').trim().toLowerCase();
                            const uri = getProductImage(p);
                            if (key && uri) {
                                map[key] = uri;
                            }
                        }
                        setProductThumbByName(map);
                    })
                    .catch(() => {});
            }
        } catch {
            setOrders([]);
        } finally {
            setOrdersLoading(false);
        }
    }, [productThumbByName]);

    const thumbsForOrder = useCallback(
        order => {
            const names = (order?.items || [])
                .map(i => (i?.productName || i?.name || '').trim().toLowerCase())
                .filter(Boolean);
            const unique = [];
            for (const n of names) {
                if (!unique.includes(n)) {
                    unique.push(n);
                }
                if (unique.length >= 3) break;
            }
            return unique.map(n => productThumbByName[n]).filter(Boolean);
        },
        [productThumbByName],
    );

    useEffect(() => {
        hydrate();
    }, [hydrate]);

    useEffect(() => {
        if (!isLoggedIn || !orderEmail) {
            setOrders([]);
            setOrdersLoading(false);
            lastOrderEmailRef.current = '';
            return;
        }
        if (lastOrderEmailRef.current !== orderEmail) {
            setOrders([]);
            lastOrderEmailRef.current = orderEmail;
        }
        loadOrders(orderEmail);
    }, [isLoggedIn, orderEmail, loadOrders]);

    useFocusEffect(
        useCallback(() => {
            if (!isLoggedIn || !orderEmail) {
                setOrders([]);
                return undefined;
            }
            loadOrders(orderEmail);
            const pollId = setInterval(() => {
                loadOrders(orderEmail);
            }, 15000);
            return () => clearInterval(pollId);
        }, [isLoggedIn, orderEmail, loadOrders]),
    );

    const handleLogout = async () => {
        await clearCustomerProfile();
        dispatch(authLogout());
        dispatch(cartClear());
        setOrders([]);
        setOrdersLoading(false);
        setProfile({ ...EMPTY_PROFILE });
        lastOrderEmailRef.current = '';
    };

    const goCheckout = () => {
        if (!items.length) {
            return;
        }
        navigation.navigate(ROUTES.CHECKOUT, {
            startAtConfirm: profile && isProfileComplete(profile),
        });
    };

    const normalizePaymentStatus = order => {
        return String(
            order?.paymentStatus ??
                order?.payment_status ??
                order?.payment?.status ??
                '',
        )
            .trim()
            .toLowerCase();
    };

    const renderOrderStatusAction = order => {
        const orderStatus = String(order?.status || '')
            .trim()
            .toLowerCase();
        const paymentStatus = normalizePaymentStatus(order);

        const isRejected = orderStatus === 'rejected' || orderStatus === 'cancelled';
        const isConfirmed = orderStatus === 'confirmed';
        const isPaid = paymentStatus === 'paid';
        const isPendingVerification =
            paymentStatus === 'pending_verification' ||
            paymentStatus === 'pending verification' ||
            paymentStatus === 'under_review' ||
            paymentStatus === 'under review';
        const isCOD =
            paymentStatus === 'cash_on_delivery' ||
            paymentStatus === 'cash on delivery' ||
            paymentStatus === 'cod';
        const isUnpaid =
            paymentStatus === '' ||
            paymentStatus === 'unpaid' ||
            paymentStatus === 'not_paid';

        if (isRejected) {
            return (
                <View
                    style={{
                        paddingHorizontal: 10,
                        paddingVertical: 6,
                        borderRadius: 999,
                        backgroundColor: 'rgba(217, 74, 88, 0.10)',
                        borderWidth: 1,
                        borderColor: 'rgba(217, 74, 88, 0.35)',
                    }}
                >
                    <Text style={{ fontSize: 12, fontWeight: '700', color: COLORS.error }}>
                        Order Rejected
                    </Text>
                </View>
            );
        }

        if (isPaid) {
            return (
                <View
                    style={{
                        paddingHorizontal: 10,
                        paddingVertical: 6,
                        borderRadius: 999,
                        backgroundColor: 'rgba(127, 165, 100, 0.16)',
                        borderWidth: 1,
                        borderColor: 'rgba(127, 165, 100, 0.45)',
                    }}
                >
                    <Text
                        style={{
                            fontSize: 12,
                            fontWeight: '700',
                            color: COLORS.florynn.primaryDark,
                        }}
                    >
                        Paid
                    </Text>
                </View>
            );
        }

        if (isPendingVerification) {
            return (
                <View
                    style={{
                        paddingHorizontal: 10,
                        paddingVertical: 6,
                        borderRadius: 999,
                        backgroundColor: COLORS.imageBg,
                        borderWidth: 1,
                        borderColor: COLORS.border,
                    }}
                >
                    <Text style={{ fontSize: 12, fontWeight: '700', color: COLORS.textMuted }}>
                        Pending Verification
                    </Text>
                </View>
            );
        }

        if (isCOD) {
            return (
                <View
                    style={{
                        paddingHorizontal: 10,
                        paddingVertical: 6,
                        borderRadius: 999,
                        backgroundColor: COLORS.imageBg,
                        borderWidth: 1,
                        borderColor: COLORS.border,
                    }}
                >
                    <Text style={{ fontSize: 12, fontWeight: '700', color: COLORS.textMuted }}>
                        Cash on Delivery
                    </Text>
                </View>
            );
        }

        if (isConfirmed && isUnpaid) {
            return (
                <TouchableOpacity
                    onPress={() => {
                        navigation.navigate(ROUTES.PAY, {
                            order,
                            email: orderEmail,
                        });
                    }}
                    style={{
                        paddingHorizontal: 12,
                        paddingVertical: 8,
                        borderRadius: 999,
                        backgroundColor: COLORS.florynn.primary,
                    }}
                >
                    <Text style={{ fontSize: 12, fontWeight: '800', color: COLORS.white }}>
                        Proceed to Payment
                    </Text>
                </TouchableOpacity>
            );
        }

        return (
            <View
                style={{
                    paddingHorizontal: 10,
                    paddingVertical: 6,
                    borderRadius: 999,
                    backgroundColor: COLORS.imageBg,
                    borderWidth: 1,
                    borderColor: COLORS.border,
                }}
            >
                <Text
                    style={{
                        fontSize: 12,
                        fontWeight: '700',
                        color: COLORS.florynn.primaryDark,
                    }}
                >
                    {getOrderStatusLabel(order.status)}
                </Text>
            </View>
        );
    };

    return (
        <View style={{ flex: 1, backgroundColor: COLORS.background }}>
            <AppTopBar showCart={false} />
            <ScrollView
                contentContainerStyle={{
                    paddingHorizontal: SPACING.screen,
                    paddingBottom: 32,
                }}
                showsVerticalScrollIndicator={false}
                refreshControl={
                    isLoggedIn ? (
                        <RefreshControl
                            refreshing={ordersLoading}
                            onRefresh={() => orderEmail && loadOrders(orderEmail)}
                            colors={[COLORS.florynn.primary]}
                        />
                    ) : undefined
                }
            >
                <Text
                    style={{
                        fontSize: 30,
                        fontWeight: '800',
                        color: COLORS.text,
                        marginTop: 8,
                    }}
                >
                    Profile
                </Text>
                <Text
                    style={{
                        fontSize: 13,
                        color: COLORS.textMuted,
                        marginTop: 4,
                        marginBottom: 16,
                    }}
                >
                    {isLoggedIn
                        ? 'Your cart, orders, and delivery details.'
                        : 'Your cart and delivery details. Sign in to see your orders.'}
                </Text>

                {/* Account */}
                <View
                    style={{
                        backgroundColor: COLORS.surface,
                        borderRadius: RADIUS.card,
                        padding: 18,
                        marginBottom: 16,
                        ...SHADOW.card,
                    }}
                >
                    {isLoggedIn && authUser ? (
                        <>
                            <Text style={{ fontWeight: '700', fontSize: 16 }}>
                                {authUser.name || 'Customer'}
                            </Text>
                            <Text style={{ color: COLORS.textMuted, marginTop: 4 }}>
                                {authUser.email}
                            </Text>
                            <Text
                                style={{
                                    color: COLORS.florynn.primaryDark,
                                    marginTop: 6,
                                    fontSize: 12,
                                    fontWeight: '700',
                                }}
                            >
                                {getMobileRoleLabel(authUser)}
                            </Text>
                            <TouchableOpacity
                                onPress={handleLogout}
                                style={{ marginTop: 12 }}
                            >
                                <Text
                                    style={{
                                        color: COLORS.textMuted,
                                        textDecorationLine: 'underline',
                                    }}
                                >
                                    Log out
                                </Text>
                            </TouchableOpacity>
                        </>
                    ) : (
                        <View style={{ flexDirection: 'row' }}>
                            <CustomButton
                                label="Sign in"
                                variant="outline"
                                size="sm"
                                onPress={() => navigation.navigate(ROUTES.LOGIN)}
                                style={{ flex: 1, marginRight: 6 }}
                            />
                            <CustomButton
                                label="Register"
                                variant="florynn"
                                size="sm"
                                onPress={() => navigation.navigate(ROUTES.REGISTER)}
                                style={{ flex: 1, marginLeft: 6 }}
                            />
                        </View>
                    )}
                    {/* Saved delivery details section removed (requested) */}
                </View>

                {/* Cart */}
                <View
                    style={{
                        backgroundColor: COLORS.surface,
                        borderRadius: RADIUS.card,
                        padding: 18,
                        marginBottom: 16,
                        ...SHADOW.card,
                    }}
                >
                    <Text style={{ fontSize: 15, fontWeight: '700', marginBottom: 12 }}>
                        {PROFILE_COPY.cartTitle}
                        {count > 0 ? ` (${count})` : ''}
                    </Text>
                    {items.length === 0 ? (
                        <>
                            <Text style={{ color: COLORS.textMuted, marginBottom: 12 }}>
                                {PROFILE_COPY.cartEmpty}
                            </Text>
                            <CustomButton
                                label="Browse bouquets"
                                variant="florynn"
                                onPress={() =>
                                    navigation.navigate('MainTabs', {
                                        screen: ROUTES.TAB_SHOP,
                                    })
                                }
                            />
                        </>
                    ) : (
                        <>
                            {items.map(item => (
                                <CartLineItem
                                    key={String(item.productId)}
                                    item={item}
                                    onIncrease={() =>
                                        dispatch(
                                            cartUpdateQuantity(
                                                item.productId,
                                                item.quantity + 1,
                                            ),
                                        )
                                    }
                                    onDecrease={() =>
                                        dispatch(
                                            cartUpdateQuantity(
                                                item.productId,
                                                item.quantity - 1,
                                            ),
                                        )
                                    }
                                    onRemove={() =>
                                        dispatch(cartRemoveItem(item.productId))
                                    }
                                />
                            ))}
                            <View
                                style={{
                                    flexDirection: 'row',
                                    justifyContent: 'space-between',
                                    marginTop: 8,
                                    paddingTop: 12,
                                    borderTopWidth: 1,
                                    borderTopColor: COLORS.border,
                                }}
                            >
                                <Text style={{ fontWeight: '600' }}>Subtotal</Text>
                                <Text style={{ fontWeight: '800', color: COLORS.text, fontSize: 22 }}>
                                    {formatPrice(subtotal)}
                                </Text>
                            </View>
                            <CustomButton
                                label={PROFILE_COPY.placeOrder}
                                variant="florynn"
                                fullWidth
                                onPress={goCheckout}
                                style={{ marginTop: 16 }}
                            />
                        </>
                    )}
                </View>

                {isLoggedIn ? (
                    <View
                        style={{
                            backgroundColor: COLORS.surface,
                            borderRadius: RADIUS.card,
                            padding: 18,
                            ...SHADOW.card,
                        }}
                    >
                        <Text style={{ fontSize: 15, fontWeight: '700', marginBottom: 12 }}>
                            {PROFILE_COPY.myOrders}
                        </Text>
                        {ordersLoading ? (
                            <ActivityIndicator color={COLORS.florynn.primary} />
                        ) : orders.length === 0 ? (
                            <Text style={{ color: COLORS.textMuted, fontSize: 14 }}>
                                {PROFILE_COPY.noOrders}
                            </Text>
                        ) : (
                            orders.map(order => (
                                <TouchableOpacity
                                    key={order.orderGroupId || String(order.orderDate)}
                                    onPress={() =>
                                        navigation.navigate(ROUTES.ORDER_DETAIL, {
                                            orderGroupId: order.orderGroupId,
                                            email: orderEmail,
                                        })
                                    }
                                    style={{
                                        paddingVertical: 12,
                                        borderBottomWidth: 1,
                                        borderBottomColor: COLORS.border,
                                    }}
                                >
                                    <View
                                        style={{
                                            flexDirection: 'row',
                                            justifyContent: 'space-between',
                                        }}
                                    >
                                        <View
                                            style={{
                                                flexDirection: 'row',
                                                alignItems: 'center',
                                            }}
                                        >
                                            {thumbsForOrder(order).length ? (
                                                <View
                                                    style={{
                                                        flexDirection: 'row',
                                                        marginRight: 10,
                                                    }}
                                                >
                                                    {thumbsForOrder(order).map((uri, idx) => (
                                                        <Image
                                                            key={`${order.orderGroupId || 'order'}-${idx}`}
                                                            source={{ uri }}
                                                            style={{
                                                                width: 28,
                                                                height: 28,
                                                                borderRadius: 10,
                                                                marginLeft: idx === 0 ? 0 : -8,
                                                                borderWidth: 2,
                                                                borderColor: COLORS.surface,
                                                                backgroundColor: COLORS.imageBg,
                                                            }}
                                                        />
                                                    ))}
                                                </View>
                                            ) : null}
                                            <Text
                                                style={{
                                                    fontWeight: '600',
                                                    color: COLORS.text,
                                                }}
                                            >
                                                {formatPrice(order.total)}
                                            </Text>
                                        </View>

                                        {renderOrderStatusAction(order)}
                                    </View>
                                    <Text
                                        style={{
                                            fontSize: 12,
                                            color: COLORS.textMuted,
                                            marginTop: 4,
                                        }}
                                    >
                                        {(order.items || []).length} item(s)
                                        {order.orderDate
                                            ? ` · ${new Date(order.orderDate).toLocaleDateString()}`
                                            : ''}
                                    </Text>
                                </TouchableOpacity>
                            ))
                        )}
                    </View>
                ) : null}
            </ScrollView>
        </View>
    );
};

export default MoreScreen;
