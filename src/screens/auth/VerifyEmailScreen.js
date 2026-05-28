import { useState } from 'react';
import { Text, View } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';

import AppTopBar from '../../components/AppTopBar';
import CustomButton from '../../components/CustomButton';
import CustomTextInput from '../../components/CustomTextInput';
import ScreenContainer from '../../components/ScreenContainer';
import { verifyEmail } from '../../app/api/auth';
import { COLORS } from '../../constants/theme';
import { ROUTES } from '../../utils';

const VerifyEmailScreen = () => {
    const route = useRoute();
    const navigation = useNavigation();
    const [token, setToken] = useState(route.params?.token || '');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

    const handleVerify = async () => {
        if (!token.trim()) {
            setError('Please enter your verification token.');
            return;
        }
        setLoading(true);
        setError(null);
        try {
            const result = await verifyEmail({ token: token.trim() });
            setSuccess(result?.message || 'Email verified successfully.');
            setTimeout(() => {
                navigation.navigate(ROUTES.LOGIN);
            }, 1500);
        } catch (e) {
            setError(e.message || 'Verification failed.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={{ flex: 1, backgroundColor: COLORS.background }}>
            <AppTopBar showBack title="Verify email" />
            <ScreenContainer>
                <Text style={{ fontSize: 14, color: COLORS.textMuted, marginBottom: 16 }}>
                    Paste the token from your email link.
                </Text>
                <CustomTextInput
                    label="Verification token"
                    placeholder="Paste token here"
                    value={token}
                    onChangeText={setToken}
                    autoCapitalize="none"
                    containerStyle={{ marginBottom: 8 }}
                />
                {error ? (
                    <Text style={{ color: COLORS.error, marginBottom: 8 }}>{error}</Text>
                ) : null}
                {success ? (
                    <Text style={{ color: COLORS.success, marginBottom: 8 }}>{success}</Text>
                ) : null}
                <CustomButton
                    label="Verify email"
                    loading={loading}
                    disabled={loading}
                    fullWidth
                    onPress={handleVerify}
                    style={{ marginTop: 16 }}
                />
            </ScreenContainer>
        </View>
    );
};

export default VerifyEmailScreen;
