import { useNavigation } from '@react-navigation/native';
import { Text, TouchableOpacity, View, Alert } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { ROUTES } from '../utils';
import AppHeader from '../components/AppHeader';
import { authLogout } from '../app/actions';

const BG_COLOR = '#FDE4E4'; // Pale blush - complements the red florynn logo
const PRIMARY_COLOR = '#801D2D';

const HomeScreen = () => {
    const navigation = useNavigation();
    const dispatch = useDispatch();
    const { data } = useSelector(state => state.auth);

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
                        // Navigation will automatically handle redirect to login
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
            }}
        >
            <AppHeader title="Florynn" subtitle={`Welcome, ${data?.user?.name || 'User'}!`} />

            <View
                style={{
                    flex: 1,
                    paddingHorizontal: 24,
                    paddingTop: 24,
                }}
            >
                <Text
                    style={{
                        fontSize: 22,
                        fontWeight: '600',
                        color: PRIMARY_COLOR,
                        marginBottom: 8,
                    }}
                >
                    Welcome back!
                </Text>
                <Text
                    style={{
                        fontSize: 14,
                        color: '#4A3A3A',
                        marginBottom: 24,
                    }}
                >
                    You&apos;re successfully logged in. You can view and update your
                    profile details from here.
                </Text>

                <TouchableOpacity
                    onPress={() => {
                        navigation.navigate(ROUTES.PROFILE);
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
                        }}
                    >
                        <Text
                            style={{
                                fontSize: 16,
                                fontWeight: '600',
                                color: '#FFFFFF',
                            }}
                        >
                            Go to profile
                        </Text>
                    </View>
                </TouchableOpacity>

                <TouchableOpacity
                    onPress={handleLogout}
                    activeOpacity={0.9}
                >
                    <View
                        style={{
                            backgroundColor: '#E74C3C',
                            paddingVertical: 14,
                            borderRadius: 999,
                            alignItems: 'center',
                            borderWidth: 2,
                            borderColor: '#C0392B',
                        }}
                    >
                        <Text
                            style={{
                                fontSize: 16,
                                fontWeight: '600',
                                color: '#FFFFFF',
                            }}
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
