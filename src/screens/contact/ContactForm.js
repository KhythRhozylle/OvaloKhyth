import { useEffect, useRef, useState } from 'react';
import {
    Animated,
    Alert,
    KeyboardAvoidingView,
    useWindowDimensions,
    Platform,
    ScrollView,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { useSelector } from 'react-redux';

import AppTopBar from '../../components/AppTopBar';
import ContactField from '../../components/ContactField';
import { CONTACT_COPY } from '../../constants/copy';
import { COLORS, RADIUS, SHADOW, SPACING } from '../../constants/theme';
import { submitContact } from '../../app/api/contact';
import { useShop } from '../../context/ShopProvider';
import { useAuth } from '../../utils';
import { buildCartInquiryMessage } from '../../utils/cart';

function splitName(full) {
    const parts = (full || '').trim().split(/\s+/);
    if (parts.length <= 1) {
        return { first: parts[0] || '', last: '' };
    }
    return { first: parts[0], last: parts.slice(1).join(' ') };
}

const ContactForm = ({ productName, fromCart }) => {
    const { shop } = useShop();
    const { authData } = useAuth();
    const cartItems = useSelector(state => state.cart?.items ?? []);
    const { width } = useWindowDimensions();
    const isWide = width >= 760;

    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [subject, setSubject] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState(null);
    const didPrefillProfile = useRef(false);
    const prefillKey = useRef('');

    const fade = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        if (didPrefillProfile.current || !authData?.user) {
            return;
        }
        if (authData.user.name) {
            const { first, last } = splitName(authData.user.name);
            setFirstName(first);
            setLastName(last);
        }
        if (authData.user.email) {
            setEmail(authData.user.email);
        }
        didPrefillProfile.current = true;
    }, [authData]);

    useEffect(() => {
        const key = `${fromCart ? 'cart' : ''}|${productName ?? ''}|${cartItems.length}`;
        if (prefillKey.current === key) {
            return;
        }
        prefillKey.current = key;
        if (fromCart && cartItems.length > 0) {
            setMessage(buildCartInquiryMessage(cartItems));
            setSubject(prev => (prev.trim().length ? prev : 'Cart inquiry'));
        } else if (productName) {
            setMessage(`I would like to inquire about "${productName}".\n\n`);
            setSubject(prev => (prev.trim().length ? prev : `Inquiry: ${productName}`));
        }
    }, [productName, fromCart, cartItems]);

    const handleSubmit = async () => {
        const name = `${firstName.trim()} ${lastName.trim()}`.trim();
        if (!firstName.trim() || !email.trim() || !message.trim()) {
            Alert.alert('Missing fields', 'Please fill in first name, email, and your message.');
            return;
        }
        setSubmitting(true);
        setError(null);
        try {
            const combinedMessage = subject.trim()
                ? `Subject: ${subject.trim()}\n\n${message.trim()}`
                : message.trim();
            const result = await submitContact({
                name,
                email: email.trim(),
                message: combinedMessage,
            });
            Alert.alert(
                'Message sent',
                result?.message || 'Thank you! We will get back to you soon.',
            );
            setMessage('');
            setSubject('');
        } catch (e) {
            setError(e.message || 'Could not send your message.');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <View style={{ flex: 1, backgroundColor: COLORS.background }}>
            <AppTopBar showCart={false} contactIcon="phone_pink" />
            <KeyboardAvoidingView
                style={{ flex: 1 }}
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            >
                {/* Soft green glows (same family as Home). */}
                <View
                    pointerEvents="none"
                    style={{
                        position: 'absolute',
                        top: -140,
                        left: -120,
                        width: 320,
                        height: 320,
                        borderRadius: 160,
                        backgroundColor: 'rgba(15, 138, 58, 0.16)',
                    }}
                />
                <View
                    pointerEvents="none"
                    style={{
                        position: 'absolute',
                        bottom: -160,
                        right: -130,
                        width: 360,
                        height: 360,
                        borderRadius: 180,
                        backgroundColor: 'rgba(127, 165, 100, 0.18)',
                    }}
                />
                <ScrollView
                    keyboardShouldPersistTaps="handled"
                    contentContainerStyle={{
                        paddingHorizontal: SPACING.screen,
                        paddingBottom: 32,
                    }}
                    showsVerticalScrollIndicator={false}
                >
                    <Animated.View
                        style={{
                            opacity: fade,
                            transform: [
                                {
                                    translateY: fade.interpolate({
                                        inputRange: [0, 1],
                                        outputRange: [14, 0],
                                    }),
                                },
                            ],
                        }}
                        onLayout={() => {
                            Animated.timing(fade, {
                                toValue: 1,
                                duration: 450,
                                useNativeDriver: true,
                            }).start();
                        }}
                    >
                        <View
                            style={{
                                flexDirection: isWide ? 'row' : 'column',
                                marginTop: 10,
                            }}
                        >
                            <View
                                style={{
                                    flex: isWide ? 0.42 : undefined,
                                    paddingRight: isWide ? 10 : 0,
                                    paddingBottom: isWide ? 0 : 18,
                                }}
                            >
                                <Text
                                    style={{
                                        color: COLORS.text,
                                        fontSize: 30,
                                        fontWeight: '900',
                                        marginBottom: 10,
                                        letterSpacing: -0.3,
                                    }}
                                >
                                    Contact Us
                                </Text>
                                <Text
                                    style={{
                                        color: COLORS.textMuted,
                                        fontSize: 13,
                                        lineHeight: 20,
                                        marginBottom: 16,
                                        maxWidth: 320,
                                    }}
                                >
                                    {CONTACT_COPY.intro}
                                </Text>

                                <View>
                                    <View
                                        style={{
                                            padding: 14,
                                            borderRadius: 18,
                                            backgroundColor: COLORS.surface,
                                            borderWidth: 1,
                                            borderColor: COLORS.border,
                                            marginBottom: 12,
                                            ...SHADOW.soft,
                                        }}
                                    >
                                        <Text style={{ color: COLORS.textMuted, fontSize: 12, fontWeight: '700' }}>
                                            📍 Address
                                        </Text>
                                        <Text style={{ color: COLORS.text, fontSize: 13, marginTop: 6, lineHeight: 18 }}>
                                            {shop?.address || '—'}
                                        </Text>
                                    </View>
                                    <View
                                        style={{
                                            padding: 14,
                                            borderRadius: 18,
                                            backgroundColor: COLORS.surface,
                                            borderWidth: 1,
                                            borderColor: COLORS.border,
                                            marginBottom: 12,
                                            ...SHADOW.soft,
                                        }}
                                    >
                                        <Text style={{ color: COLORS.textMuted, fontSize: 12, fontWeight: '700' }}>
                                            ✉️ Email
                                        </Text>
                                        <Text style={{ color: COLORS.text, fontSize: 13, marginTop: 6, lineHeight: 18 }}>
                                            {shop?.email || '—'}
                                        </Text>
                                    </View>
                                    <View
                                        style={{
                                            padding: 14,
                                            borderRadius: 18,
                                            backgroundColor: COLORS.surface,
                                            borderWidth: 1,
                                            borderColor: COLORS.border,
                                            ...SHADOW.soft,
                                        }}
                                    >
                                        <Text style={{ color: COLORS.textMuted, fontSize: 12, fontWeight: '700' }}>
                                            ☎️ Phone
                                        </Text>
                                        <Text style={{ color: COLORS.text, fontSize: 13, marginTop: 6, lineHeight: 18 }}>
                                            {(shop?.phones || []).slice(0, 2).join(' · ') || '—'}
                                        </Text>
                                    </View>
                                </View>

                                {fromCart && cartItems.length > 0 ? (
                                    <Text
                                        style={{
                                            color: COLORS.florynn.primaryDark,
                                            marginTop: 16,
                                            fontSize: 12,
                                            lineHeight: 18,
                                        }}
                                    >
                                        Your cart is included in the message below.
                                    </Text>
                                ) : null}
                            </View>

                            <View style={{ flex: isWide ? 0.58 : undefined }}>
                                <View
                                    style={{
                                        backgroundColor: COLORS.surface,
                                        borderRadius: 24,
                                        padding: 18,
                                        borderWidth: 1,
                                        borderColor: COLORS.border,
                                        ...SHADOW.card,
                                        overflow: 'hidden',
                                    }}
                                >
                                    <Text
                                        style={{
                                            color: COLORS.text,
                                            fontSize: 15,
                                            fontWeight: '800',
                                            marginBottom: 14,
                                        }}
                                    >
                                        Send a message
                                    </Text>

                                    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                        <ContactField
                                            label="Name"
                                            required
                                            value={firstName}
                                            onChangeText={setFirstName}
                                            placeholder="Your first name"
                                            half
                                            autoCapitalize="words"
                                            variant="light"
                                        />
                                        <ContactField
                                            label="Last name"
                                            value={lastName}
                                            onChangeText={setLastName}
                                            placeholder="Optional"
                                            half
                                            autoCapitalize="words"
                                            variant="light"
                                        />
                                    </View>

                                    <ContactField
                                        label="Email"
                                        required
                                        value={email}
                                        onChangeText={setEmail}
                                        placeholder="your@email.com"
                                        keyboardType="email-address"
                                        autoCapitalize="none"
                                        variant="light"
                                    />

                                    <ContactField
                                        label="Subject"
                                        value={subject}
                                        onChangeText={setSubject}
                                        placeholder="What is this about?"
                                        variant="light"
                                    />

                                    <ContactField
                                        label="Details"
                                        value={message}
                                        onChangeText={setMessage}
                                        placeholder="Tell us about your order..."
                                        multiline
                                        variant="light"
                                    />

                                    {error ? (
                                        <Text
                                            style={{
                                                color: COLORS.error,
                                                textAlign: 'center',
                                                marginBottom: 10,
                                                fontSize: 13,
                                            }}
                                        >
                                            {error}
                                        </Text>
                                    ) : null}

                                    <View
                                        style={{
                                            flexDirection: 'row',
                                            justifyContent: 'center',
                                            marginTop: 8,
                                        }}
                                    >
                                        <TouchableOpacity
                                            onPress={handleSubmit}
                                            disabled={submitting}
                                            activeOpacity={0.9}
                                            style={{
                                                width: 74,
                                                height: 74,
                                                borderRadius: 37,
                                                backgroundColor: '#78D13C',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                opacity: submitting ? 0.65 : 1,
                                                shadowColor: 'rgba(120, 209, 60, 0.55)',
                                                shadowOffset: { width: 0, height: 14 },
                                                shadowOpacity: 0.28,
                                                shadowRadius: 18,
                                                elevation: 10,
                                            }}
                                        >
                                            <Text
                                                style={{
                                                    fontSize: 30,
                                                    color: COLORS.white,
                                                    marginLeft: 1,
                                                }}
                                            >
                                                ☎
                                            </Text>
                                        </TouchableOpacity>
                                    </View>
                                    <Text
                                        style={{
                                            textAlign: 'center',
                                            marginTop: 10,
                                            fontSize: 12,
                                            fontWeight: '700',
                                            color: COLORS.textMuted,
                                            letterSpacing: 0.5,
                                        }}
                                    >
                                        {submitting ? 'SENDING…' : 'SEND MESSAGE'}
                                    </Text>
                                </View>
                            </View>
                        </View>
                    </Animated.View>
                </ScrollView>
            </KeyboardAvoidingView>
        </View>
    );
};

export default ContactForm;
