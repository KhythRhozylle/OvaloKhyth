// utils
import { NavigationContainer } from '@react-navigation/native';
import { useEffect } from 'react';
import { Platform, StatusBar, useColorScheme } from 'react-native';
import { useSelector } from 'react-redux';

import ReduxProvider from '../context/ReduxProvider';
import AuthNav from './AuthNav';
import MainNav from './MainNav';

const RootNavigator = () => {
    const { data } = useSelector(state => state.auth);
    const isLoggedIn = !!(data && data.token);
    
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
        <ReduxProvider>
            <NavigationContainer>
                <RootNavigator />
            </NavigationContainer>
        </ReduxProvider>
    );
};
