import { useState, useEffect } from 'react';
import { Alert, Text, TouchableOpacity, View } from 'react-native';

import { useDispatch, useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import AppHeader from '../../components/AppHeader';
import CustomButton from '../../components/CustomButton';
import CustomTextInput from '../../components/CustomTextInput';
import { authLogin } from '../../app/actions';
import { ROUTES } from '../../utils';

const BG_COLOR = '#FDE4E4'; // Pale blush - complements the red florynn logo
const PRIMARY_COLOR = '#801D2D';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const dispatch = useDispatch();
    const navigation = useNavigation();
    
    const { isLoading, isError, error, data } = useSelector(state => state.auth);

    useEffect(() => {
        if (data && data.token) {
            // Login successful - navigate to home or dashboard
            Alert.alert('Success', 'Login successful!');
            // navigation.navigate(ROUTES.HOME); // Uncomment when you have a home route
        }
    }, [data, navigation]);

    return (
        <View
            style={{
                flex: 1,
                backgroundColor: BG_COLOR,
            }}
        >
            <AppHeader title="Welcome back" subtitle="Sign in to your Florynn account." />

            <View
                style={{
                    flex: 1,
                    paddingHorizontal: 24,
                    paddingTop: 24,
                }}
            >
                <View style={{ width: '100%' }}>
                    <CustomTextInput
                        label="Username"
                        placeholder="Enter your username"
                        value={val => setUsername(val)}
                        containerStyle={{
                            marginBottom: 16,
                        }}
                        textStyle={{
                            fontSize: 15,
                        }}
                    />
                    <CustomTextInput
                        label="Password"
                        placeholder="Enter your password"
                        value={val => setPassword(val)}
                        containerStyle={{
                            marginBottom: 8,
                        }}
                        textStyle={{
                            fontSize: 15,
                        }}
                    />
                </View>

                <CustomButton
                    label={isLoading ? "Signing in..." : "Log in"}
                    containerStyle={{
                        backgroundColor: PRIMARY_COLOR,
                        borderRadius: 999,
                        marginVertical: 24,
                        width: '100%',
                    }}
                    textStyle={{
                        color: 'white',
                        fontWeight: '600',
                        fontSize: 16,
                    }}
                    onPress={() => {
                        if (username === '' || password === '') {
                            Alert.alert(
                                'Invalid credentials',
                                'Please enter your username and password.',
                            );
                            return;
                        }
                        
                        dispatch(authLogin({ username, password }));
                    }}
                />

                {isError && (
                    <Text style={{ 
                        color: 'red', 
                        textAlign: 'center', 
                        marginBottom: 16,
                        fontSize: 14 
                    }}>
                        {error}
                    </Text>
                )}

                <View
                    style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}
                >
                    <Text style={{ fontSize: 14 }}>Don&apos;t have an account?</Text>
                    <TouchableOpacity onPress={() => navigation.navigate(ROUTES.REGISTER)}>
                        <Text
                            style={{
                                color: PRIMARY_COLOR,
                                marginLeft: 8,
                                fontWeight: '600',
                                fontSize: 14,
                            }}
                        >
                            Register
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
};

export default Login;
