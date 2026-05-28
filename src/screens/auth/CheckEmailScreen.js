import { useEffect } from 'react';
import { Text, View } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { useDispatch } from 'react-redux';
import { resetRegister } from '../../app/actions';

import AppTopBar from '../../components/AppTopBar';
import CustomButton from '../../components/CustomButton';
import ScreenContainer from '../../components/ScreenContainer';
import { COLORS } from '../../constants/theme';
import { ROUTES } from '../../utils';

const CheckEmailScreen = () => {
    const route = useRoute();
    const navigation = useNavigation();
    const dispatch = useDispatch();
    const email = route.params?.email || 'your email';

    useEffect(() => {
        dispatch(resetRegister());
    }, [dispatch]);

    return (
        <View style={{ flex: 1, backgroundColor: COLORS.background }}>
            <AppTopBar showBack title="Check your email" />
            <ScreenContainer>
                <Text style={{ lineHeight: 22, color: COLORS.text, marginTop: 8 }}>
                    We sent a verification link to{' '}
                    <Text style={{ fontWeight: '700' }}>{email}</Text>. Open the link in
                    your email to verify your account, then sign in.
                </Text>
                <CustomButton
                    label="I verified — Sign in"
                    fullWidth
                    onPress={() => navigation.navigate(ROUTES.LOGIN)}
                    style={{ marginTop: 28 }}
                />
                <CustomButton
                    label="Resend verification"
                    variant="outline"
                    fullWidth
                    onPress={() =>
                        navigation.navigate(ROUTES.RESEND_VERIFICATION, { email })
                    }
                    style={{ marginTop: 12 }}
                />
            </ScreenContainer>
        </View>
    );
};

export default CheckEmailScreen;
