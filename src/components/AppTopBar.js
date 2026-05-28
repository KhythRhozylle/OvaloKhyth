import { Image, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import { COLORS, SPACING } from '../constants/theme';
import { ROUTES } from '../utils';
import { getCartItemCount } from '../utils/cart';

const AppTopBar = ({
    showBack,
    title,
    showCart = true,
    variant = 'light',
    contactIcon = 'mail',
}) => {
    const insets = useSafeAreaInsets();
    const navigation = useNavigation();
    const cartCount = useSelector(state => getCartItemCount(state.cart?.items ?? []));
    const isDark = variant === 'dark';

    const bg = isDark ? 'rgba(255,255,255,0.05)' : COLORS.surface;
    const textColor = isDark ? 'rgba(255,255,255,0.92)' : COLORS.text;
    const iconBg = isDark ? 'rgba(255,255,255,0.08)' : COLORS.imageBg;

    const openCart = () => {
        navigation.navigate('MainTabs', { screen: ROUTES.TAB_MORE });
    };

    return (
        <View
            style={{
                paddingTop: insets.top + SPACING.xs,
                paddingBottom: SPACING.sm + 2,
                paddingHorizontal: SPACING.screen,
                flexDirection: 'row',
                alignItems: 'center',
                backgroundColor: bg,
                borderBottomWidth: 0,
            }}
        >
            {showBack ? (
                <TouchableOpacity
                    onPress={() => navigation.goBack()}
                    hitSlop={12}
                    style={{
                        width: 34,
                        height: 34,
                        borderRadius: 17,
                        backgroundColor: iconBg,
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}
                >
                    <Text style={{ fontSize: 18, color: textColor }}>←</Text>
                </TouchableOpacity>
            ) : (
                <View
                    style={{
                        width: 100,
                        height: 44,
                        justifyContent: 'center',
                    }}
                >
                    <Image
                        source={require('../assets/brand/florynn_logo.png')}
                        style={{
                            width: 150,
                            height: 44,
                        }}
                        resizeMode="contain"
                        accessibilityLabel="Florynn"
                    />
                </View>
            )}
            {title ? (
                <Text
                    style={{
                        flex: 1,
                        textAlign: 'center',
                        fontSize: 17,
                        fontWeight: '600',
                        color: textColor,
                        marginHorizontal: 8,
                    }}
                    numberOfLines={1}
                >
                    {title}
                </Text>
            ) : (
                <View style={{ flex: 1 }} />
            )}
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                {showCart ? (
                    <TouchableOpacity
                        onPress={openCart}
                        hitSlop={8}
                        style={{
                            marginRight: 10,
                            width: 34,
                            height: 34,
                            borderRadius: 17,
                            backgroundColor: iconBg,
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}
                    >
                        <Text style={{ fontSize: 22 }}>🛍️</Text>
                        {cartCount > 0 ? (
                            <View
                                style={{
                                    position: 'absolute',
                                    top: -4,
                                    right: -8,
                                    minWidth: 18,
                                    height: 18,
                                    borderRadius: 9,
                                    backgroundColor: COLORS.accent,
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    paddingHorizontal: 4,
                                }}
                            >
                                <Text
                                    style={{
                                        color: COLORS.white,
                                        fontSize: 10,
                                        fontWeight: '700',
                                    }}
                                >
                                    {cartCount > 99 ? '99+' : cartCount}
                                </Text>
                            </View>
                        ) : null}
                    </TouchableOpacity>
                ) : null}
                <TouchableOpacity
                    onPress={() =>
                        navigation.navigate('MainTabs', { screen: ROUTES.TAB_CONTACT })
                    }
                    hitSlop={8}
                    style={{
                        width: 34,
                        height: 34,
                        borderRadius: 17,
                        backgroundColor: iconBg,
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}
                >
                    {contactIcon === 'phone_pink' ? (
                        <Image
                            source={require('../assets/icons/phone_pink.png')}
                            style={{ width: 22, height: 22 }}
                            resizeMode="contain"
                        />
                    ) : (
                        <Text style={{ fontSize: 20 }}>✉️</Text>
                    )}
                </TouchableOpacity>
            </View>
        </View>
    );
};

export default AppTopBar;
