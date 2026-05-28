import { useEffect, useState } from 'react';
import { Alert, Image, Text, TouchableOpacity, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';

import AppTopBar from '../../components/AppTopBar';
import CustomButton from '../../components/CustomButton';
import CustomTextInput from '../../components/CustomTextInput';
import ScreenContainer from '../../components/ScreenContainer';
import { authLogin } from '../../app/actions';
import { COLORS, RADIUS, SHADOW, SPACING } from '../../constants/theme';
import { ROUTES } from '../../utils';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const dispatch = useDispatch();
    const navigation = useNavigation();
    const { isLoading, isError, error, data } = useSelector(state => state.auth);

    useEffect(() => {
        if (data?.token) {
            navigation.reset({
                index: 0,
                routes: [{ name: 'MainTabs' }],
            });
        }
    }, [data, navigation]);

    const handleLogin = () => {
        if (!email.trim() || !password) {
            Alert.alert('Sign in', 'Enter your email and password.');
            return;
        }
        dispatch(authLogin({ email: email.trim(), password }));
    };

    return (
        <View style={{ flex: 1, backgroundColor: COLORS.background }}>
            <AppTopBar showBack title="" showCart={false} />
            <View
                pointerEvents="none"
                style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: 320,
                    backgroundColor: 'rgba(127, 165, 100, 0.22)',
                    transform: [{ scaleY: 1.1 }],
                }}
            />
            <View
                pointerEvents="none"
                style={{
                    position: 'absolute',
                    bottom: -180,
                    left: -140,
                    width: 360,
                    height: 360,
                    borderRadius: 180,
                    backgroundColor: 'rgba(15, 138, 58, 0.18)',
                }}
            />

            <ScreenContainer style={{ justifyContent: 'center', paddingTop: 0 }}>
                <View
                    style={{
                        alignSelf: 'center',
                        width: '100%',
                        maxWidth: 420,
                        backgroundColor: 'rgba(255,255,255,0.92)',
                        borderRadius: 26,
                        padding: 18,
                        borderWidth: 1,
                        borderColor: 'rgba(220, 228, 216, 0.9)',
                        ...SHADOW.card,
                    }}
                >
                    <View style={{ alignItems: 'center', paddingTop: 8, paddingBottom: 8 }}>
                        <Image
                            source={require('../../assets/brand/florynn_logo.png')}
                            style={{ width: 160, height: 44 }}
                            resizeMode="contain"
                        />
                        <Text
                            style={{
                                marginTop: 10,
                                fontSize: 22,
                                fontWeight: '900',
                                color: COLORS.text,
                                letterSpacing: -0.3,
                            }}
                        >
                            Sign in now!
                        </Text>
                        <Text
                            style={{
                                marginTop: 6,
                                fontSize: 13,
                                color: COLORS.textMuted,
                                textAlign: 'center',
                                lineHeight: 18,
                            }}
                        >
                            Checkout our premium bouquets
                        </Text>
                    </View>

                    <View style={{ marginTop: 12 }}>
                        <CustomTextInput
                            label=""
                            placeholder="Email Address"
                            value={email}
                            onChangeText={setEmail}
                            keyboardType="email-address"
                            autoCapitalize="none"
                            textStyle={{
                                borderRadius: RADIUS.pill,
                                borderColor: 'rgba(0,0,0,0.06)',
                                backgroundColor: 'rgba(255,255,255,0.95)',
                                paddingVertical: 14,
                            }}
                        />
                        <CustomTextInput
                            label=""
                            placeholder="Password"
                            value={password}
                            onChangeText={setPassword}
                            secureTextEntry
                            containerStyle={{ marginTop: 12 }}
                            textStyle={{
                                borderRadius: RADIUS.pill,
                                borderColor: 'rgba(0,0,0,0.06)',
                                backgroundColor: 'rgba(255,255,255,0.95)',
                                paddingVertical: 14,
                            }}
                        />
                    </View>

                    <View
                        style={{
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            marginTop: 14,
                            paddingHorizontal: 4,
                        }}
                    >
                        <Text style={{ fontSize: 12, color: COLORS.textMuted }}>
                            Keep me centered
                        </Text>
                        <Text style={{ fontSize: 12, color: COLORS.florynn.primaryDark }}>
                            Restore access
                        </Text>
                    </View>

                    {isError ? (
                        <Text
                            style={{
                                color: COLORS.error,
                                marginTop: 12,
                                fontSize: 13,
                                textAlign: 'center',
                            }}
                        >
                            {error}
                        </Text>
                    ) : null}

                    <CustomButton
                        label={isLoading ? 'Signing in…' : 'Enter Sanctuary'}
                        variant="florynn"
                        fullWidth
                        pill
                        onPress={handleLogin}
                        disabled={isLoading}
                        style={{
                            marginTop: 16,
                            borderRadius: RADIUS.pill,
                            backgroundColor: COLORS.florynn.primary,
                            borderColor: COLORS.florynn.primary,
                        }}
                        textStyle={{ letterSpacing: 0.2 }}
                    />

                    <View style={{ alignItems: 'center', marginTop: 16 }}>
                        <TouchableOpacity onPress={() => navigation.navigate(ROUTES.REGISTER)}>
                            <Text style={{ fontSize: 13, color: COLORS.textMuted }}>
                                New to wellness?{' '}
                                <Text style={{ color: COLORS.florynn.primaryDark, fontWeight: '800' }}>
                                    Begin your journey
                                </Text>
                            </Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            onPress={() => navigation.replace('MainTabs')}
                            style={{ marginTop: 10 }}
                        >
                            <Text style={{ fontSize: 12, color: COLORS.textMuted }}>
                                Continue as guest
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </ScreenContainer>
        </View>
    );
};

export default Login;
