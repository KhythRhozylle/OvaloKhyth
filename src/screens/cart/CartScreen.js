import { useEffect } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';

import { COLORS } from '../../constants/theme';
import { ROUTES } from '../../utils';

/** Legacy route — cart lives on the Profile tab. */
const CartScreen = () => {
    const navigation = useNavigation();

    useEffect(() => {
        navigation.replace('MainTabs', { screen: ROUTES.TAB_MORE });
    }, [navigation]);

    return (
        <View
            style={{
                flex: 1,
                backgroundColor: COLORS.background,
                alignItems: 'center',
                justifyContent: 'center',
            }}
        >
            <ActivityIndicator color={COLORS.florynn.primary} />
        </View>
    );
};

export default CartScreen;
