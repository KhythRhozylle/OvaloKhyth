// utils
import { NavigationContainer } from '@react-navigation/native';
import { useEffect } from 'react';
import { Platform, StatusBar, useColorScheme } from 'react-native';

import { AuthProvider, useAuth } from '../context/AuthContext';
import AuthNav from './AuthNav';
import MainNav from './MainNav';

const RootNavigator = () => {
    const { isLoggedIn } = useAuth();
    return isLoggedIn ? <MainNav /> : <AuthNav />;
};

export default () => {
    const isDarkMode = useColorScheme() === 'dark';

    useEffect(() => {
        if (Platform.OS === 'android') {
            StatusBar.setBarStyle('dark-content', true);
        }
    }, [isDarkMode]);

    return (
        <AuthProvider>
            <NavigationContainer>
                <RootNavigator />
            </NavigationContainer>
        </AuthProvider>
    );
};
