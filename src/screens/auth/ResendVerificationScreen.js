import { useEffect, useState } from 'react';
import { Text, View } from 'react-native';
import { useRoute } from '@react-navigation/native';

import AppTopBar from '../../components/AppTopBar';
import CustomButton from '../../components/CustomButton';
import CustomTextInput from '../../components/CustomTextInput';
import ScreenContainer from '../../components/ScreenContainer';
import { resendVerification } from '../../app/api/auth';
import { COLORS } from '../../constants/theme';

const ResendVerificationScreen = () => {
    const route = useRoute();
    const [email, setEmail] = useState(route.params?.email || '');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

    useEffect(() => {
        if (route.params?.email) {
            setEmail(route.params.email);
        }
    }, [route.params?.email]);

    const handleResend = async () => {
        if (!email.trim()) {
            setError('Please enter your email address.');
            return;
        }
        setLoading(true);
        setError(null);
        setSuccess(null);
        try {
            const result = await resendVerification({ email: email.trim() });
            setSuccess(
                result?.message ||
                    'If an account exists, a verification email has been sent.',
            );
        } catch (e) {
            if (e.status === 404) {
                setError('No account found with that email address.');
            } else if (e.status === 400) {
                setError(e.message || 'This email is already verified. You can sign in.');
            } else {
                setError(e.message || 'Could not resend verification email.');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={{ flex: 1, backgroundColor: COLORS.background }}>
            <AppTopBar showBack title="Resend verification" />
            <ScreenContainer>
                <Text style={{ fontSize: 14, color: COLORS.textMuted, marginBottom: 16 }}>
                    We will send a new verification link.
                </Text>
                <CustomTextInput
                    label="Email"
                    placeholder="your@email.com"
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                    autoCapitalize="none"
                />
                {error ? (
                    <Text style={{ color: COLORS.error, marginTop: 8 }}>{error}</Text>
                ) : null}
                {success ? (
                    <Text style={{ color: COLORS.success, marginTop: 8 }}>{success}</Text>
                ) : null}
                <CustomButton
                    label="Resend email"
                    loading={loading}
                    disabled={loading}
                    fullWidth
                    onPress={handleResend}
                    style={{ marginTop: 20 }}
                />
            </ScreenContainer>
        </View>
    );
};

export default ResendVerificationScreen;
