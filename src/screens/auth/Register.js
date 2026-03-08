import { useState } from 'react';
import { Alert, Image, Text, TouchableOpacity, View } from 'react-native';

import { useNavigation } from '@react-navigation/native';
import CustomButton from '../../components/CustomButton';
import CustomTextInput from '../../components/CustomTextInput';
import { useAuth } from '../../context/AuthContext';
import { IMG, ROUTES } from '../../utils';

const BG_COLOR = '#FDE4E4'; // Pale blush - complements the red florynn logo

const Register = () => {
    const [name, setName] = useState('');
    const [emailAdd, setEmailAdd] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const { login } = useAuth();
    const navigation = useNavigation();

    const handleRegister = () => {
        if (!name.trim() || !emailAdd.trim() || !password || !confirmPassword) {
            Alert.alert('Missing Fields', 'Please fill in all fields');
            return;
        }
        if (password !== confirmPassword) {
            Alert.alert('Password Mismatch', 'Passwords do not match');
            return;
        }
        if (password.length < 6) {
            Alert.alert('Weak Password', 'Password must be at least 6 characters');
            return;
        }
        login();
    };

    return (
        <View
            style={{
                flex: 1,
                padding: 20,
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: BG_COLOR,
            }}
        >
            <Image
                source={IMG.LOGO}
                style={{ width: 180, height: 72, resizeMode: 'contain', marginBottom: 24 }}
            />
            <View style={{ width: '100%' }}>
                <CustomTextInput
                    label="Full Name"
                    placeholder="Enter your name"
                    value={val => setName(val)}
                    containerStyle={{ padding: 5 }}
                    textStyle={{
                        borderRadius: 10,
                        color: 'black',
                        marginLeft: 10,
                        fontWeight: 'bold',
                    }}
                />
                <CustomTextInput
                    label="Email Address"
                    placeholder="Enter Email Address"
                    value={val => setEmailAdd(val)}
                    containerStyle={{ padding: 5 }}
                    textStyle={{
                        borderRadius: 10,
                        color: 'black',
                        marginLeft: 10,
                        fontWeight: 'bold',
                    }}
                />
                <CustomTextInput
                    label="Password"
                    placeholder="Enter Password (min 6 characters)"
                    value={val => setPassword(val)}
                    containerStyle={{ padding: 5 }}
                    textStyle={{
                        borderRadius: 10,
                        color: 'black',
                        marginLeft: 10,
                        fontWeight: 'bold',
                    }}
                />
                <CustomTextInput
                    label="Confirm Password"
                    placeholder="Confirm your password"
                    value={val => setConfirmPassword(val)}
                    containerStyle={{ padding: 5 }}
                    textStyle={{
                        borderRadius: 10,
                        color: 'black',
                        marginLeft: 10,
                        fontWeight: 'bold',
                    }}
                />
            </View>

            <CustomButton
                label="REGISTER"
                containerStyle={{
                    backgroundColor: '#801D2D',
                    borderRadius: 10,
                    marginVertical: 20,
                    width: '80%',
                }}
                textStyle={{ color: 'white', fontWeight: 'bold' }}
                onPress={handleRegister}
            />

            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                <Text>Already have an account?</Text>
                <TouchableOpacity onPress={() => navigation.navigate(ROUTES.LOGIN)}>
                    <Text style={{ color: '#801D2D', marginLeft: 10, fontWeight: 'bold' }}>
                        Login
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

export default Register;
