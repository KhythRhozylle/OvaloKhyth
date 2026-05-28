import { useMemo, useState } from 'react';
import { Alert, Image, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import {
    errorCodes,
    isErrorWithCode,
    keepLocalCopy,
    pick,
    types,
} from '@react-native-documents/picker';

import AppTopBar from '../../components/AppTopBar';
import CustomButton from '../../components/CustomButton';
import CustomTextInput from '../../components/CustomTextInput';
import { submitOrderPayment } from '../../app/api/orders';
import { COLORS, RADIUS, SHADOW, SPACING } from '../../constants/theme';
import { formatPrice } from '../../utils/product';
import ROUTES from '../../utils/routes';

const METHOD_OPTIONS = [
    { key: 'gcash', label: 'GCash' },
    { key: 'bank_transfer', label: 'Bank Transfer' },
    { key: 'cash_on_delivery', label: 'Cash on Delivery (COD)' },
];

const PayScreen = () => {
    const navigation = useNavigation();
    const route = useRoute();
    const order = route.params?.order ?? null;

    const [paymentMethod, setPaymentMethod] = useState('gcash');
    const [referenceNumber, setReferenceNumber] = useState('');
    const [proofFile, setProofFile] = useState(null);
    const [pickingProof, setPickingProof] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    const total = useMemo(() => Number(order?.total || 0), [order?.total]);
    const items = order?.items || [];

    const isOnlinePayment = paymentMethod === 'gcash' || paymentMethod === 'bank_transfer';
    const isCashOnDelivery = paymentMethod === 'cash_on_delivery';

    const onPickProof = async () => {
        setPickingProof(true);
        try {
            const [file] = await pick({
                type: [types.images],
                allowMultiSelection: false,
                mode: 'import',
            });
            if (!file?.uri) {
                throw new Error('No file selected.');
            }
            const mime = (file.type || '').toLowerCase();
            if (mime && !['image/jpeg', 'image/jpg', 'image/png'].includes(mime)) {
                Alert.alert('Invalid file', 'Please choose a JPG or PNG image.');
                return;
            }

            const fileName = file.name || 'payment-proof.jpg';
            const [copyResult] = await keepLocalCopy({
                files: [{ uri: file.uri, fileName }],
                destination: 'cachesDirectory',
            });
            if (copyResult.status !== 'success') {
                throw new Error(copyResult.copyError || 'Could not prepare file for upload.');
            }

            setProofFile({
                uri: copyResult.localUri,
                name: fileName,
                type: file.type || 'image/jpeg',
            });
        } catch (e) {
            if (isErrorWithCode(e) && e.code === errorCodes.OPERATION_CANCELED) {
                return;
            }
            Alert.alert('Upload failed', e?.message || 'Could not select file.');
        } finally {
            setPickingProof(false);
        }
    };

    const customerEmail = (
        route.params?.email ||
        order?.customer?.email ||
        ''
    )
        .trim()
        .toLowerCase();

    const goToMyOrders = () => {
        navigation.navigate('MainTabs', { screen: ROUTES.TAB_MORE });
    };

    const onSubmit = async () => {
        if (!order?.orderGroupId) {
            Alert.alert('Missing order', 'Order information is missing.');
            return;
        }

        if (!customerEmail) {
            Alert.alert('Missing account', 'Sign in again to submit payment.');
            return;
        }

        if (!paymentMethod) {
            Alert.alert('Missing method', 'Please select a payment method.');
            return;
        }

        if (isOnlinePayment) {
            if (!referenceNumber.trim()) {
                Alert.alert('Missing reference', 'Please enter your reference number.');
                return;
            }
            if (!proofFile?.uri) {
                Alert.alert('Missing proof', 'Please upload payment proof first.');
                return;
            }
        }

        setSubmitting(true);
        try {
            const result = await submitOrderPayment({
                orderGroupId: order.orderGroupId,
                email: customerEmail,
                paymentMethod,
                referenceNumber: referenceNumber.trim(),
                proofFile: isOnlinePayment ? proofFile : null,
            });

            const successMessage =
                result?.message ||
                (isOnlinePayment
                    ? 'Your payment is now pending verification.'
                    : 'Your Cash on Delivery order has been recorded.');

            Alert.alert('Payment Successful', successMessage, [
                { text: 'OK', onPress: goToMyOrders },
            ]);
        } catch (e) {
            const message = e?.message || 'Could not submit payment.';
            Alert.alert('Submit failed', message);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <View style={{ flex: 1, backgroundColor: COLORS.background }}>
            <AppTopBar showBack title="Pay" showCart={false} />
            <ScrollView
                contentContainerStyle={{
                    padding: SPACING.screen,
                    paddingBottom: 32,
                }}
                showsVerticalScrollIndicator={false}
            >
                <View
                    style={{
                        backgroundColor: COLORS.surface,
                        borderRadius: RADIUS.card,
                        padding: 16,
                        ...SHADOW.card,
                    }}
                >
                    <Text style={{ fontSize: 16, fontWeight: '800', color: COLORS.text }}>
                        Order Summary
                    </Text>
                    <Text style={{ color: COLORS.textMuted, marginTop: 4 }}>
                        Order ID: {order?.orderGroupId || 'N/A'}
                    </Text>

                    <View style={{ marginTop: 12 }}>
                        {items.length ? (
                            items.map((line, idx) => (
                                <View
                                    key={`${line?.id || idx}`}
                                    style={{
                                        flexDirection: 'row',
                                        justifyContent: 'space-between',
                                        marginBottom: 8,
                                    }}
                                >
                                    <Text style={{ flex: 1, color: COLORS.text }}>
                                        {line?.productName || line?.name || 'Item'} x{' '}
                                        {line?.quantity || 1}
                                    </Text>
                                    <Text style={{ fontWeight: '700', color: COLORS.text }}>
                                        {formatPrice(
                                            line?.lineTotal ??
                                                Number(line?.price || 0) *
                                                    Number(line?.quantity || 1),
                                        )}
                                    </Text>
                                </View>
                            ))
                        ) : (
                            <Text style={{ color: COLORS.textMuted }}>No line items found.</Text>
                        )}
                    </View>

                    <View
                        style={{
                            marginTop: 10,
                            paddingTop: 10,
                            borderTopWidth: 1,
                            borderTopColor: COLORS.border,
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                        }}
                    >
                        <Text style={{ fontWeight: '700', color: COLORS.text }}>Total Amount</Text>
                        <Text
                            style={{
                                fontSize: 22,
                                fontWeight: '800',
                                color: COLORS.florynn.primaryDark,
                            }}
                        >
                            {formatPrice(total)}
                        </Text>
                    </View>
                </View>

                <View
                    style={{
                        backgroundColor: COLORS.surface,
                        borderRadius: RADIUS.card,
                        padding: 16,
                        marginTop: 16,
                        ...SHADOW.card,
                    }}
                >
                    <Text style={{ fontSize: 16, fontWeight: '800', color: COLORS.text }}>
                        Payment Method
                    </Text>
                    <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginTop: 10 }}>
                        {METHOD_OPTIONS.map(method => {
                            const active = method.key === paymentMethod;
                            return (
                                <TouchableOpacity
                                    key={method.key}
                                    onPress={() => setPaymentMethod(method.key)}
                                    style={{
                                        paddingHorizontal: 12,
                                        paddingVertical: 8,
                                        borderRadius: 999,
                                        borderWidth: 1,
                                        borderColor: active
                                            ? COLORS.florynn.primary
                                            : COLORS.border,
                                        backgroundColor: active
                                            ? 'rgba(127, 165, 100, 0.14)'
                                            : COLORS.surface,
                                        marginRight: 8,
                                        marginBottom: 8,
                                    }}
                                >
                                    <Text
                                        style={{
                                            fontSize: 13,
                                            fontWeight: '700',
                                            color: active
                                                ? COLORS.florynn.primaryDark
                                                : COLORS.textMuted,
                                        }}
                                    >
                                        {method.label}
                                    </Text>
                                </TouchableOpacity>
                            );
                        })}
                    </View>

                    {isOnlinePayment ? (
                        <>
                            {!proofFile?.uri ? (
                                <CustomButton
                                    label="Upload payment proof"
                                    variant="outline"
                                    fullWidth
                                    loading={pickingProof}
                                    onPress={onPickProof}
                                    style={{ marginTop: 6 }}
                                />
                            ) : null}
                            {proofFile?.uri ? (
                                <View style={{ marginTop: 10 }}>
                                    <Image
                                        source={{ uri: proofFile.uri }}
                                        style={{
                                            width: '100%',
                                            height: 180,
                                            borderRadius: RADIUS.card,
                                            backgroundColor: COLORS.imageBg,
                                        }}
                                        resizeMode="cover"
                                    />
                                    <View
                                        style={{
                                            flexDirection: 'row',
                                            alignItems: 'center',
                                            justifyContent: 'space-between',
                                            marginTop: 10,
                                        }}
                                    >
                                        <Text style={{ color: COLORS.textMuted, fontSize: 12 }}>
                                            {proofFile.name || 'payment-proof.jpg'}
                                        </Text>
                                        <TouchableOpacity onPress={() => setProofFile(null)}>
                                            <Text
                                                style={{
                                                    color: COLORS.error,
                                                    fontSize: 12,
                                                    fontWeight: '800',
                                                    textDecorationLine: 'underline',
                                                }}
                                            >
                                                Remove
                                            </Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            ) : null}

                            <CustomTextInput
                                label="Reference Number"
                                placeholder="Enter payment reference"
                                value={referenceNumber}
                                onChangeText={setReferenceNumber}
                                autoCapitalize="none"
                                containerStyle={{ marginTop: 12 }}
                            />
                        </>
                    ) : (
                        <View
                            style={{
                                marginTop: 12,
                                borderRadius: RADIUS.button,
                                borderWidth: 1,
                                borderColor: COLORS.border,
                                backgroundColor: COLORS.imageBg,
                                padding: 12,
                            }}
                        >
                            <Text style={{ color: COLORS.textMuted, fontSize: 13, lineHeight: 19 }}>
                                Cash on Delivery selected. No reference number or payment proof is
                                required.
                            </Text>
                        </View>
                    )}

                    <CustomButton
                        label={
                            submitting
                                ? 'Submitting...'
                                : isCashOnDelivery
                                  ? 'Confirm Cash on Delivery'
                                  : 'Submit Payment'
                        }
                        variant="florynn"
                        fullWidth
                        loading={submitting}
                        onPress={onSubmit}
                        style={{ marginTop: 14 }}
                    />
                </View>
            </ScrollView>
        </View>
    );
};

export default PayScreen;
