import { NavigationContainer, useNavigationContainerRef } from '@react-navigation/native';
import { useEffect } from 'react';
import { Platform, StatusBar, useColorScheme } from 'react-native';

import ApiGate from '../components/ApiGate';
import ReduxProvider from '../context/ReduxProvider';
import { ShopProvider } from '../context/ShopProvider';
import { getApiBaseUrl, getApiTargetLabel } from '../config/api';
import { loadDevApiBaseUrl } from '../config/devApiBase';
import { logApi } from '../config/apiLogger';
import AuthNavigationSync from './AuthNavigationSync';
import RootNav from './RootNav';

export default () => {
    const navigationRef = useNavigationContainerRef();
    useEffect(() => {
        if (__DEV__) {
            loadDevApiBaseUrl().then(() => {
                logApi('app ready', {
                    target: getApiTargetLabel(),
                    base: getApiBaseUrl(),
                });
            });
        }
    }, []);
    const isDarkMode = useColorScheme() === 'dark';

    useEffect(() => {
        if (Platform.OS === 'android') {
            StatusBar.setBarStyle('light-content', true);
            StatusBar.setTranslucent(true);
            StatusBar.setBackgroundColor('transparent');
        }
    }, [isDarkMode]);

    return (
        <ReduxProvider>
            <ShopProvider>
                <ApiGate>
                    <NavigationContainer ref={navigationRef}>
                        <AuthNavigationSync navigationRef={navigationRef} />
                        <RootNav />
                    </NavigationContainer>
                </ApiGate>
            </ShopProvider>
        </ReduxProvider>
    );
};
