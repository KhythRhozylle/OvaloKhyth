import { useCallback, useEffect, useState } from 'react';
import {
    Alert,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigation, useRoute } from '@react-navigation/native';

import AppTopBar from '../../components/AppTopBar';
import ContactField from '../../components/ContactField';
import CustomButton from '../../components/CustomButton';
import { placeOrder } from '../../app/api/orders';
import { cartClear } from '../../app/actions';
import { CHECKOUT_COPY } from '../../constants/copy';
import { COLORS, RADIUS, SHADOW, SPACING } from '../../constants/theme';
import { getCartItemCount, getCartSubtotal } from '../../utils/cart';
import {
    isProfileComplete,
    loadCustomerProfile,
    mergeProfileWithAuth,
    saveCustomerProfile,
} from '../../utils/customerProfile';
import { formatPrice } from '../../utils/product';
import { ROUTES } from '../../utils';

const CheckoutScreen = () => {
    const navigation = useNavigation();
    const route = useRoute();
    const dispatch = useDispatch();
    const items = useSelector(state => state.cart?.items ?? []);
    const authUser = useSelector(state => state.auth?.data?.user);

    const [step, setStep] = useState('details');
    const [profile, setProfile] = useState({
        fullName: '',
        contactNumber: '',
        email: '',
        completeAddress: '',
        deliveryLocation: '',
        cityProvince: '',
        additionalNotes: '',
    });
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState(null);

    const subtotal = getCartSubtotal(items);
    const count = getCartItemCount(items);

    const hydrate = useCallback(async () => {
        const saved = await loadCustomerProfile();
        const merged = mergeProfileWithAuth(saved, authUser);
        setProfile(merged);
        const startAtConfirm =
            route.params?.startAtConfirm === true || isProfileComplete(merged);
        setStep(startAtConfirm ? 'confirm' : 'details');
    }, [authUser, route.params?.startAtConfirm]);

    useEffect(() => {
        if (!items.length) {
            Alert.alert('Empty cart', 'Add items before checkout.', [
                { text: 'OK', onPress: () => navigation.goBack() },
            ]);
            return;
        }
        hydrate();
    }, [hydrate, items.length, navigation]);

    const validateDetails = () => {
        if (!isProfileComplete(profile)) {
            Alert.alert(
                'Missing information',
                'Please fill in all required fields: name, phone, email, address, delivery location, and city/province.',
            );
            return false;
        }
        const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRe.test(profile.email.trim())) {
            Alert.alert('Invalid email', 'Enter a valid email address.');
            return false;
        }
        return true;
    };

    const goToConfirm = async () => {
        if (!validateDetails()) {
            return;
        }
        await saveCustomerProfile(profile);
        setStep('confirm');
        setError(null);
    };

    const handleSubmitOrder = async () => {
        if (!validateDetails()) {
            setStep('details');
            return;
        }
        setSubmitting(true);
        setError(null);
        try {
            await saveCustomerProfile(profile);
            const result = await placeOrder({
                customer: {
                    fullName: profile.fullName.trim(),
                    contactNumber: profile.contactNumber.trim(),
                    email: profile.email.trim(),
                    completeAddress: profile.completeAddress.trim(),
                    deliveryLocation: profile.deliveryLocation.trim(),
                    cityProvince: profile.cityProvince.trim(),
                    additionalNotes: profile.additionalNotes.trim(),
                },
                items: items.map(item => ({
                    productId: item.productId,
                    name: item.name,
                    quantity: item.quantity,
                    price: item.price,
                })),
            });
            dispatch(cartClear());
            const groupId = result?.data?.orderGroupId;
            Alert.alert(
                'Order submitted',
                result?.message || CHECKOUT_COPY.orderPendingNote,
                [
                    {
                        text: 'Track order',
                        onPress: () =>
                            navigation.replace(ROUTES.ORDER_DETAIL, {
                                orderGroupId: groupId,
                                email: profile.email.trim(),
                            }),
                    },
                ],
            );
        } catch (e) {
            setError(e.message || 'Could not place order.');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <View style={{ flex: 1, backgroundColor: COLORS.background }}>
            <AppTopBar showBack title={CHECKOUT_COPY.title} showCart={false} />
            <KeyboardAvoidingView
                style={{ flex: 1 }}
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            >
                <ScrollView
                    keyboardShouldPersistTaps="handled"
                    contentContainerStyle={{ padding: SPACING.screen, paddingBottom: 120 }}
                >
                    {step === 'details' ? (
                        <>
                            <Text style={{ fontSize: 18, fontWeight: '700', color: COLORS.text }}>
                                {CHECKOUT_COPY.detailsTitle}
                            </Text>
                            <Text
                                style={{
                                    fontSize: 13,
                                    color: COLORS.textMuted,
                                    marginTop: 6,
                                    marginBottom: 16,
                                    lineHeight: 18,
                                }}
                            >
                                {CHECKOUT_COPY.detailsSubtitle}
                            </Text>
                            <View
                                style={{
                                    backgroundColor: COLORS.surface,
                                    borderRadius: RADIUS.card,
                                    padding: 18,
                                    ...SHADOW.card,
                                }}
                            >
                                <ContactField
                                    label="Full name"
                                    required
                                    value={profile.fullName}
                                    onChangeText={v => setProfile(p => ({ ...p, fullName: v }))}
                                    placeholder="Full name"
                                    autoCapitalize="words"
                                />
                                <ContactField
                                    label="Contact number"
                                    required
                                    value={profile.contactNumber}
                                    onChangeText={v =>
                                        setProfile(p => ({ ...p, contactNumber: v }))
                                    }
                                    placeholder="Phone number"
                                    keyboardType="phone-pad"
                                />
                                <ContactField
                                    label="Email address"
                                    required
                                    value={profile.email}
                                    onChangeText={v => setProfile(p => ({ ...p, email: v }))}
                                    placeholder="your@email.com"
                                    keyboardType="email-address"
                                    autoCapitalize="none"
                                />
                                <ContactField
                                    label="Complete address"
                                    required
                                    value={profile.completeAddress}
                                    onChangeText={v =>
                                        setProfile(p => ({ ...p, completeAddress: v }))
                                    }
                                    placeholder="Street, barangay, etc."
                                    multiline
                                />
                                <ContactField
                                    label="Delivery location"
                                    required
                                    value={profile.deliveryLocation}
                                    onChangeText={v =>
                                        setProfile(p => ({ ...p, deliveryLocation: v }))
                                    }
                                    placeholder="Landmark or delivery point"
                                />
                                <ContactField
                                    label="City / Province"
                                    required
                                    value={profile.cityProvince}
                                    onChangeText={v =>
                                        setProfile(p => ({ ...p, cityProvince: v }))
                                    }
                                    placeholder="City and province"
                                />
                                <ContactField
                                    label="Additional notes (optional)"
                                    value={profile.additionalNotes}
                                    onChangeText={v =>
                                        setProfile(p => ({ ...p, additionalNotes: v }))
                                    }
                                    placeholder="Card message, preferred time, etc."
                                    multiline
                                />
                            </View>
                            <View style={{ marginTop: 20 }} />
                        </>
                    ) : (
                        <>
                            <Text style={{ fontSize: 18, fontWeight: '700', color: COLORS.text }}>
                                {CHECKOUT_COPY.confirmTitle}
                            </Text>
                            <Text
                                style={{
                                    fontSize: 13,
                                    color: COLORS.textMuted,
                                    marginTop: 6,
                                    marginBottom: 16,
                                }}
                            >
                                {CHECKOUT_COPY.confirmSubtitle}
                            </Text>
                            <TouchableOpacity onPress={() => setStep('details')}>
                                <Text
                                    style={{
                                        fontSize: 13,
                                        color: COLORS.florynn.primary,
                                        fontWeight: '600',
                                        marginBottom: 12,
                                    }}
                                >
                                    {CHECKOUT_COPY.editDetails}
                                </Text>
                            </TouchableOpacity>

                            <View
                                style={{
                                    backgroundColor: COLORS.surface,
                                    borderRadius: RADIUS.card,
                                    padding: 18,
                                    marginBottom: 12,
                                    ...SHADOW.card,
                                }}
                            >
                                <Text style={{ fontWeight: '700', marginBottom: 8 }}>
                                    Deliver to
                                </Text>
                                <Text style={{ color: COLORS.text }}>{profile.fullName}</Text>
                                <Text style={{ color: COLORS.textMuted, marginTop: 4 }}>
                                    {profile.contactNumber} · {profile.email}
                                </Text>
                                <Text style={{ color: COLORS.textMuted, marginTop: 4 }}>
                                    {profile.completeAddress}
                                </Text>
                                <Text style={{ color: COLORS.textMuted, marginTop: 4 }}>
                                    {profile.deliveryLocation}, {profile.cityProvince}
                                </Text>
                            </View>

                            <View
                                style={{
                                    backgroundColor: COLORS.surface,
                                    borderRadius: RADIUS.card,
                                    padding: 18,
                                    marginBottom: 12,
                                    ...SHADOW.card,
                                }}
                            >
                                <Text style={{ fontWeight: '700', marginBottom: 10 }}>
                                    Order summary ({count} items)
                                </Text>
                                {items.map(item => (
                                    <View
                                        key={String(item.productId)}
                                        style={{
                                            flexDirection: 'row',
                                            justifyContent: 'space-between',
                                            marginBottom: 8,
                                        }}
                                    >
                                        <Text style={{ flex: 1, color: COLORS.text }}>
                                            {item.name} × {item.quantity}
                                        </Text>
                                        <Text style={{ fontWeight: '600', color: COLORS.text }}>
                                            {formatPrice(item.price * item.quantity)}
                                        </Text>
                                    </View>
                                ))}
                                <View
                                    style={{
                                        borderTopWidth: 1,
                                        borderTopColor: COLORS.border,
                                        marginTop: 8,
                                        paddingTop: 12,
                                        flexDirection: 'row',
                                        justifyContent: 'space-between',
                                    }}
                                >
                                    <Text style={{ fontSize: 16, fontWeight: '700' }}>
                                        Total payment
                                    </Text>
                                    <Text
                                        style={{
                                            fontSize: 20,
                                            fontWeight: '800',
                                            color: COLORS.accent,
                                        }}
                                    >
                                        {formatPrice(subtotal)}
                                    </Text>
                                </View>
                            </View>

                            {error ? (
                                <Text style={{ color: COLORS.error, marginBottom: 12 }}>
                                    {error}
                                </Text>
                            ) : null}
                            <View style={{ marginTop: 2 }} />
                        </>
                    )}
                </ScrollView>
                <View
                    style={{
                        position: 'absolute',
                        left: 0,
                        right: 0,
                        bottom: 0,
                        backgroundColor: 'rgba(255,255,255,0.97)',
                        borderTopWidth: 1,
                        borderTopColor: COLORS.border,
                        paddingHorizontal: SPACING.screen,
                        paddingTop: 10,
                        paddingBottom: 16,
                    }}
                >
                    <View
                        style={{
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            marginBottom: 10,
                        }}
                    >
                        <Text style={{ color: COLORS.textMuted, fontSize: 12 }}>
                            {count} item(s)
                        </Text>
                        <Text style={{ color: COLORS.text, fontSize: 22, fontWeight: '800' }}>
                            {formatPrice(subtotal)}
                        </Text>
                    </View>
                    {step === 'details' ? (
                        <CustomButton
                            label="Continue to order summary"
                            variant="florynn"
                            fullWidth
                            onPress={goToConfirm}
                        />
                    ) : (
                        <CustomButton
                            label={submitting ? 'Submitting…' : CHECKOUT_COPY.confirmPurchase}
                            variant="florynn"
                            fullWidth
                            disabled={submitting}
                            onPress={handleSubmitOrder}
                        />
                    )}
                </View>
            </KeyboardAvoidingView>
        </View>
    );
};

export default CheckoutScreen;
