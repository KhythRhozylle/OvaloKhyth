import { useState, useEffect } from 'react';
import { Alert, Text, TouchableOpacity, View } from 'react-native';

import { useDispatch, useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import AppHeader from '../../components/AppHeader';
import CustomButton from '../../components/CustomButton';
import CustomTextInput from '../../components/CustomTextInput';
import { authRegister } from '../../app/actions';
import { ROUTES } from '../../utils';

const BG_COLOR = '#FDE4E4'; // Pale blush - complements the red florynn logo
const PRIMARY_COLOR = '#801D2D';

const Register = () => {
    const [name, setName] = useState('');
    const [emailAdd, setEmailAdd] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const dispatch = useDispatch();
    const navigation = useNavigation();
    
    const { isRegistering, isRegisterError, registerError, registerData } = useSelector(state => state.auth);

    useEffect(() => {
        if (registerData && registerData.token) {
            // Registration successful - navigate to login or home
            Alert.alert('Success', 'Account created successfully! Please login.');
            navigation.navigate(ROUTES.LOGIN);
        }
    }, [registerData, navigation]);

    const handleRegister = () => {
        if (!name.trim() || !emailAdd.trim() || !password || !confirmPassword) {
            Alert.alert('Missing details', 'Please fill in all fields.');
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
        
        dispatch(authRegister({ name, email: emailAdd, password }));
    };

    return (
        <View
            style={{
                flex: 1,
                backgroundColor: BG_COLOR,
            }}
        >
            <AppHeader title="Create account" subtitle="Join Florynn in just a few steps." />

            <View
                style={{
                    flex: 1,
                    paddingHorizontal: 24,
                    paddingTop: 24,
                }}
            >
                <View style={{ width: '100%' }}>
                    <CustomTextInput
                        label="Full name"
                        placeholder="Enter your name"
                        value={val => setName(val)}
                        containerStyle={{ marginBottom: 16 }}
                        textStyle={{ fontSize: 15 }}
                    />
                    <CustomTextInput
                        label="Email address"
                        placeholder="Enter your email"
                        value={val => setEmailAdd(val)}
                        containerStyle={{ marginBottom: 16 }}
                        textStyle={{ fontSize: 15 }}
                    />
                    <CustomTextInput
                        label="Password"
                        placeholder="Enter a password (min 6 characters)"
                        value={val => setPassword(val)}
                        containerStyle={{ marginBottom: 16 }}
                        textStyle={{ fontSize: 15 }}
                    />
                    <CustomTextInput
                        label="Confirm password"
                        placeholder="Re-enter your password"
                        value={val => setConfirmPassword(val)}
                        containerStyle={{ marginBottom: 8 }}
                        textStyle={{ fontSize: 15 }}
                    />
                </View>

                <CustomButton
                    label={isRegistering ? "Creating account..." : "Create account"}
                    containerStyle={{
                        backgroundColor: PRIMARY_COLOR,
                        borderRadius: 999,
                        marginVertical: 24,
                        width: '100%',
                    }}
                    textStyle={{ color: 'white', fontWeight: '600', fontSize: 16 }}
                    onPress={handleRegister}
                    disabled={isRegistering}
                />

                {isRegisterError && (
                    <Text style={{ 
                        color: 'red', 
                        textAlign: 'center', 
                        marginBottom: 16,
                        fontSize: 14 
                    }}>
                        {registerError}
                    </Text>
                )}

                <View
                    style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}
                >
                    <Text style={{ fontSize: 14 }}>Already have an account?</Text>
                    <TouchableOpacity onPress={() => navigation.navigate(ROUTES.LOGIN)}>
                        <Text
                            style={{
                                color: PRIMARY_COLOR,
                                marginLeft: 8,
                                fontWeight: '600',
                                fontSize: 14,
                            }}
                        >
                            Log in
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
};

export default Register;
