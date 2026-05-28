import { Text, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';

import AppTopBar from '../../components/AppTopBar';
import CustomButton from '../../components/CustomButton';
import ScreenContainer from '../../components/ScreenContainer';
import { COLORS, RADIUS, SHADOW } from '../../constants/theme';
import { authLogout, cartClear } from '../../app/actions';
import { ROUTES } from '../../utils';

const AccountScreen = () => {
    const dispatch = useDispatch();
    const navigation = useNavigation();
    const { data } = useSelector(state => state.auth);
    const user = data?.user || {};

    return (
        <View style={{ flex: 1, backgroundColor: COLORS.background }}>
            <AppTopBar showBack title="My account" />
            <ScreenContainer>
                <View
                    style={{
                        backgroundColor: COLORS.surface,
                        borderRadius: RADIUS.card,
                        padding: 16,
                        marginTop: 8,
                        ...SHADOW.soft,
                    }}
                >
                    <Text style={{ fontSize: 13, color: COLORS.textMuted }}>Name</Text>
                    <Text
                        style={{
                            fontSize: 18,
                            fontWeight: '600',
                            color: COLORS.text,
                            marginBottom: 16,
                            marginTop: 4,
                        }}
                    >
                        {user.name || user.username || '—'}
                    </Text>
                    <Text style={{ fontSize: 13, color: COLORS.textMuted }}>Email</Text>
                    <Text
                        style={{
                            fontSize: 18,
                            fontWeight: '600',
                            color: COLORS.text,
                            marginTop: 4,
                        }}
                    >
                        {user.email || '—'}
                    </Text>
                </View>
                <CustomButton
                    label="Log out"
                    fullWidth
                    onPress={() => {
                        dispatch(authLogout());
                        dispatch(cartClear());
                        navigation.navigate('MainTabs');
                    }}
                    style={{ marginTop: 12 }}
                />
            </ScreenContainer>
        </View>
    );
};

export default AccountScreen;
