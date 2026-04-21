import React from 'react';
import { useNavigation } from '@react-navigation/native';
import { Text, TouchableOpacity, View, Alert, ViewStyle, TextStyle } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { ROUTES } from '../utils';
import AppHeader from '../components/AppHeader';
import { authLogout } from '../app/actions';
import { AuthResponse } from '../app/api/auth';

interface RootState {
  auth: {
    data: AuthResponse | null;
  };
}

const BG_COLOR = '#FDE4E4';
const PRIMARY_COLOR = '#801D2D';

const HomeScreen: React.FC = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const { data } = useSelector((state: RootState) => state.auth);

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: () => {
            dispatch(authLogout());
          },
        },
      ]
    );
  };

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: BG_COLOR,
      } as ViewStyle}
    >
      <AppHeader title="Florynn" subtitle={`Welcome, ${data?.user?.name || 'User'}!`} />

      <View
        style={{
          flex: 1,
          paddingHorizontal: 24,
          paddingTop: 24,
        } as ViewStyle}
      >
        <Text
          style={{
            fontSize: 22,
            fontWeight: '600',
            color: PRIMARY_COLOR,
            marginBottom: 8,
          } as TextStyle}
        >
          Welcome back!
        </Text>
        <Text
          style={{
            fontSize: 14,
            color: '#4A3A3A',
            marginBottom: 24,
          } as TextStyle}
        >
          You're successfully logged in. You can view and update your
          profile details from here.
        </Text>

        <TouchableOpacity
          onPress={() => {
            navigation.navigate(ROUTES.PROFILE as never);
          }}
          activeOpacity={0.9}
        >
          <View
            style={{
              backgroundColor: PRIMARY_COLOR,
              paddingVertical: 14,
              borderRadius: 999,
              alignItems: 'center',
              marginBottom: 16,
            } as ViewStyle}
          >
            <Text
              style={{
                fontSize: 16,
                fontWeight: '600',
                color: '#FFFFFF',
              } as TextStyle}
            >
              Go to profile
            </Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity onPress={handleLogout} activeOpacity={0.9}>
          <View
            style={{
              backgroundColor: '#E74C3C',
              paddingVertical: 14,
              borderRadius: 999,
              alignItems: 'center',
              borderWidth: 2,
              borderColor: '#C0392B',
            } as ViewStyle}
          >
            <Text
              style={{
                fontSize: 16,
                fontWeight: '600',
                color: '#FFFFFF',
              } as TextStyle}
            >
              Logout
            </Text>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default HomeScreen;
