import { Image, Pressable, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { TAB_ICONS } from '../constants/tabIcons';
import { COLORS, SHADOW, TAB_BAR } from '../constants/theme';
import { ROUTES } from '../utils';

const TABS = [
    { route: ROUTES.TAB_HOME, label: 'Home', icon: TAB_ICONS.home, size: 26 },
    { route: ROUTES.TAB_SHOP, label: 'Explore', icon: TAB_ICONS.explore, size: 30 },
    { route: ROUTES.TAB_CONTACT, label: 'Contact', icon: TAB_ICONS.contact, size: 26 },
    { route: ROUTES.TAB_MORE, label: 'Profile', icon: TAB_ICONS.profile, size: 30 },
];

const CustomTabBar = ({ state, navigation }) => {
    const insets = useSafeAreaInsets();

    return (
        <View
            style={{
                backgroundColor: 'transparent',
                paddingBottom: Math.max(insets.bottom, 10),
                paddingHorizontal: 14,
            }}
        >
            <View
                style={{
                    flexDirection: 'row',
                    backgroundColor: COLORS.surface,
                    borderRadius: 28,
                    paddingTop: 8,
                    paddingBottom: 8,
                    paddingHorizontal: 6,
                    minHeight: TAB_BAR.height + 2,
                    ...SHADOW.card,
                }}
            >
                {state.routes.map((route, index) => {
                    const tab = TABS.find(t => t.route === route.name);
                    if (!tab) {
                        return null;
                    }

                    const focused = state.index === index;
                    const labelColor = focused ? COLORS.tabActive : COLORS.tabInactive;

                    const onPress = () => {
                        const event = navigation.emit({
                            type: 'tabPress',
                            target: route.key,
                            canPreventDefault: true,
                        });
                        if (!focused && !event.defaultPrevented) {
                            navigation.navigate(route.name);
                        }
                    };

                    return (
                        <Pressable
                            key={route.key}
                            onPress={onPress}
                            style={{
                                flex: 1,
                                alignItems: 'center',
                                justifyContent: 'center',
                                paddingVertical: 6,
                                borderRadius: 20,
                                backgroundColor: focused ? COLORS.imageBg : 'transparent',
                            }}
                            accessibilityRole="button"
                            accessibilityState={focused ? { selected: true } : {}}
                            accessibilityLabel={tab.label}
                        >
                            <Image
                                source={tab.icon}
                                style={{
                                    width: tab.size,
                                    height: tab.size,
                                    opacity: focused ? 1 : 0.45,
                                    transform: [{ scale: focused ? 1.05 : 1 }],
                                }}
                                resizeMode="contain"
                            />
                            <View style={{ height: 0, marginTop: 0 }} />
                        </Pressable>
                    );
                })}
            </View>
        </View>
    );
};

export default CustomTabBar;
