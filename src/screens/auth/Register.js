import { useEffect, useState } from 'react';
import { Alert, Image, Text, TouchableOpacity, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';

import AppTopBar from '../../components/AppTopBar';
import CustomButton from '../../components/CustomButton';
import CustomTextInput from '../../components/CustomTextInput';
import ScreenContainer from '../../components/ScreenContainer';
import { authRegister } from '../../app/actions';
import { TERMS_TEXT } from '../../constants/copy';
import { COLORS, RADIUS, SHADOW, SPACING } from '../../constants/theme';
import { ROUTES } from '../../utils';

const Register = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [agreed, setAgreed] = useState(false);
    const dispatch = useDispatch();
    const navigation = useNavigation();

    const { isRegistering, isRegisterError, registerError, registerData } =
        useSelector(state => state.auth);

    useEffect(() => {
        if (registerData && !isRegistering && !isRegisterError) {
            Alert.alert(
                'Account created',
                'You can sign in with your email and password.',
                [{ text: 'Sign in', onPress: () => navigation.replace(ROUTES.LOGIN) }],
            );
        }
    }, [registerData, isRegistering, isRegisterError, navigation]);

    const handleRegister = () => {
        if (!name.trim() || !email.trim() || !username.trim() || !password) {
            Alert.alert('Missing details', 'Please fill in all fields.');
            return;
        }
        if (!agreed) {
            Alert.alert('Terms', 'Please agree to the terms to continue.');
            return;
        }
        if (password !== confirmPassword) {
            Alert.alert('Password mismatch', 'Passwords do not match.');
            return;
        }
        if (password.length < 6) {
            Alert.alert('Weak password', 'Password must be at least 6 characters.');
            return;
        }
        dispatch(
            authRegister({
                name: name.trim(),
                email: email.trim(),
                username: username.trim(),
                password,
            }),
        );
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
                            Register now!
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
                            Checkout our floral designs
                        </Text>
                    </View>

                    <View style={{ marginTop: 12 }}>
                        <CustomTextInput
                            label=""
                            placeholder="Full name"
                            value={name}
                            onChangeText={setName}
                            autoCapitalize="words"
                            textStyle={{
                                borderRadius: RADIUS.pill,
                                borderColor: 'rgba(0,0,0,0.06)',
                                backgroundColor: 'rgba(255,255,255,0.95)',
                                paddingVertical: 14,
                            }}
                        />
                        <CustomTextInput
                            label=""
                            placeholder="Email Address"
                            value={email}
                            onChangeText={setEmail}
                            keyboardType="email-address"
                            autoCapitalize="none"
                            containerStyle={{ marginTop: 12 }}
                            textStyle={{
                                borderRadius: RADIUS.pill,
                                borderColor: 'rgba(0,0,0,0.06)',
                                backgroundColor: 'rgba(255,255,255,0.95)',
                                paddingVertical: 14,
                            }}
                        />
                        <CustomTextInput
                            label=""
                            placeholder="Username"
                            value={username}
                            onChangeText={setUsername}
                            autoCapitalize="none"
                            containerStyle={{ marginTop: 12 }}
                            textStyle={{
                                borderRadius: RADIUS.pill,
                                borderColor: 'rgba(0,0,0,0.06)',
                                backgroundColor: 'rgba(255,255,255,0.95)',
                                paddingVertical: 14,
                            }}
                        />
                        <CustomTextInput
                            label=""
                            placeholder="Password (min 6 characters)"
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
                        <CustomTextInput
                            label=""
                            placeholder="Confirm password"
                            value={confirmPassword}
                            onChangeText={setConfirmPassword}
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

                    <TouchableOpacity
                        onPress={() => setAgreed(!agreed)}
                        style={{
                            flexDirection: 'row',
                            alignItems: 'flex-start',
                            marginTop: 14,
                            paddingHorizontal: 4,
                        }}
                        activeOpacity={0.85}
                    >
                        <View
                            style={{
                                width: 22,
                                height: 22,
                                borderRadius: 6,
                                borderWidth: 1.5,
                                borderColor: COLORS.florynn.primary,
                                backgroundColor: agreed ? COLORS.florynn.primary : COLORS.white,
                                alignItems: 'center',
                                justifyContent: 'center',
                                marginRight: 10,
                                marginTop: 1,
                            }}
                        >
                            {agreed ? (
                                <Text style={{ color: COLORS.white, fontSize: 12, fontWeight: '900' }}>
                                    ✓
                                </Text>
                            ) : null}
                        </View>
                        <Text
                            style={{
                                flex: 1,
                                fontSize: 12,
                                color: COLORS.textMuted,
                                lineHeight: 18,
                            }}
                        >
                            {TERMS_TEXT}
                        </Text>
                    </TouchableOpacity>

                    {isRegisterError ? (
                        <Text
                            style={{
                                color: COLORS.error,
                                marginTop: 12,
                                fontSize: 13,
                                textAlign: 'center',
                            }}
                        >
                            {registerError}
                        </Text>
                    ) : null}

                    <CustomButton
                        label={isRegistering ? 'Creating account…' : 'Enter'}
                        variant="florynn"
                        fullWidth
                        pill
                        onPress={handleRegister}
                        disabled={isRegistering}
                        style={{
                            marginTop: 16,
                            borderRadius: RADIUS.pill,
                            backgroundColor: COLORS.florynn.primary,
                            borderColor: COLORS.florynn.primary,
                        }}
                        textStyle={{ letterSpacing: 0.2 }}
                    />

                    <View style={{ alignItems: 'center', marginTop: 16 }}>
                        <TouchableOpacity onPress={() => navigation.navigate(ROUTES.LOGIN)}>
                            <Text style={{ fontSize: 13, color: COLORS.textMuted }}>
                                Already have an account?{' '}
                                <Text
                                    style={{
                                        color: COLORS.florynn.primaryDark,
                                        fontWeight: '800',
                                    }}
                                >
                                    Sign in
                                </Text>
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </ScreenContainer>
        </View>
    );
};

export default Register;
