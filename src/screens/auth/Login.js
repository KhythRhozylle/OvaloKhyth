import { useState } from 'react';
import { Alert, Image, Text, TouchableOpacity, View } from 'react-native';

import { useNavigation } from '@react-navigation/native';
import CustomButton from '../../components/CustomButton';
import CustomTextInput from '../../components/CustomTextInput';
import { useAuth } from '../../context/AuthContext';
import { IMG, ROUTES } from '../../utils';

const BG_COLOR = '#FDE4E4'; // Pale blush - complements the red florynn logo

const Login = () => {
const [emailAdd, setEmailAdd] = useState('');
const [password, setPassword] = useState('');
const { login } = useAuth();
const navigation = useNavigation();

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
        style={{ width: 180, height: 72, resizeMode: 'contain', marginBottom: 30 }}
    />
    <View style={{ width: '100%' }}>
        <CustomTextInput
        label={'Email Address'}
        placeholder={'Enter Email Address'}
        value={val => setEmailAdd(val)}
        containerStyle={{
            padding: 5,
        }}
        textStyle={{
            borderRadius: 10,
            color: 'black',
            marginLeft: 10,
            fontWeight: 'bold',
        }}
        />
        <CustomTextInput
        label={'Password'}
        placeholder={'Enter Password'}
        value={val => setPassword(val)}
        containerStyle={{
            padding: 5,
        }}
        textStyle={{
            borderRadius: 10,
            color: 'black',
            marginLeft: 10,
        }}
        />
    </View>

    <CustomButton
        label={'LOGIN'}
        containerStyle={{
        backgroundColor: '#801D2D',
        borderRadius: 10,
        marginVertical: 20,
        width: '80%',
        }}
        textStyle={{
        color: 'white',
        fontWeight: 'bold',
        }}
        onPress={() => {
        if (emailAdd === '' || password === '') {
            Alert.alert(
            'Invalid Credentials',
            'Please enter valid email address and password',
            );
            return;
        }
        login();
        }}
    />

    <View
        style={{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        }}
    >
        <Text>Create an account?</Text>
        <TouchableOpacity onPress={() => navigation.navigate(ROUTES.REGISTER)}>
        <Text style={{ color: '#801D2D', marginLeft: 10, fontWeight: 'bold' }}>
            Register
        </Text>
        </TouchableOpacity>
    </View>
    </View>
);
};

export default Login;
