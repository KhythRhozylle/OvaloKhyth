import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { Platform, StatusBar, useColorScheme } from 'react-native';
import { useSelector } from 'react-redux';

import ReduxProvider from '../context/ReduxProvider';
import AuthNav from './AuthNav';
import MainNav from './MainNav';

interface RootState {
  auth: {
    data: {
      token?: string;
    } | null;
  };
}

const RootNavigator: React.FC = () => {
  const { data } = useSelector((state: RootState) => state.auth);
  const isLoggedIn = !!(data && data.token);

  return isLoggedIn ? <MainNav /> : <AuthNav />;
};

const AppNavigator: React.FC = () => {
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

export default AppNavigator;
