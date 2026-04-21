import React from 'react';
import { Text, View, TouchableOpacity, Alert, ViewStyle, TextStyle } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
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

const ProfileScreen: React.FC = () => {
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
      <AppHeader title="Profile" subtitle={`Welcome, ${data?.user?.name || 'User'}!`} />

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
          Profile overview
        </Text>

        <View style={{ marginBottom: 24 } as ViewStyle}>
          <Text style={{ fontSize: 16, fontWeight: '500', marginBottom: 4 } as TextStyle}>
            Name: {data?.user?.name || 'Not available'}
          </Text>
          <Text style={{ fontSize: 16, fontWeight: '500', marginBottom: 4 } as TextStyle}>
            Email: {data?.user?.email || 'Not available'}
          </Text>
          <Text style={{ fontSize: 16, fontWeight: '500', marginBottom: 4 } as TextStyle}>
            Status: Logged in
          </Text>
        </View>

        <Text
          style={{
            fontSize: 14,
            color: '#4A3A3A',
            marginBottom: 24,
          } as TextStyle}
        >
          This is where your profile information will appear. You can extend this
          screen with more details later.
        </Text>

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

export default ProfileScreen;
