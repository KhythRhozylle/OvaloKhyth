import { Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';

import AppTopBar from '../../components/AppTopBar';
import CustomButton from '../../components/CustomButton';
import ScreenContainer from '../../components/ScreenContainer';
import { ABOUT_COPY, HOME_COPY } from '../../constants/copy';
import { useShop } from '../../context/ShopProvider';
import { COLORS, RADIUS, SHADOW } from '../../constants/theme';
import { ROUTES } from '../../utils';

const AboutScreen = () => {
    const navigation = useNavigation();
    const { shop } = useShop();
    const services = shop?.services?.length ? shop.services : HOME_COPY.services;

    return (
        <View style={{ flex: 1, backgroundColor: COLORS.background }}>
            <AppTopBar showBack title={ABOUT_COPY.title} />
            <ScreenContainer>
                <View
                    style={{
                        backgroundColor: COLORS.surface,
                        borderRadius: RADIUS.card,
                        padding: 16,
                        ...SHADOW.soft,
                    }}
                >
                    {ABOUT_COPY.sections.map((section, i) => (
                        <View key={i} style={{ marginTop: i === 0 ? 0 : 20 }}>
                            <Text
                                style={{
                                    fontSize: 17,
                                    fontWeight: '700',
                                    color: COLORS.text,
                                    marginBottom: 6,
                                }}
                            >
                                {section.heading}
                            </Text>
                            <Text style={{ lineHeight: 22, color: COLORS.textMuted }}>
                                {section.body}
                            </Text>
                        </View>
                    ))}
                </View>
                <View
                    style={{
                        marginTop: 24,
                        backgroundColor: COLORS.surface,
                        borderRadius: RADIUS.card,
                        padding: 16,
                        ...SHADOW.soft,
                    }}
                >
                    <Text style={{ fontSize: 17, fontWeight: '700', color: COLORS.text, marginBottom: 10 }}>
                        {HOME_COPY.servicesTitle}
                    </Text>
                    {services.map(line => (
                        <Text
                            key={line}
                            style={{ fontSize: 14, lineHeight: 22, color: COLORS.textMuted, marginBottom: 6 }}
                        >
                            • {line}
                        </Text>
                    ))}
                </View>
                <CustomButton
                    label="Browse shop"
                    fullWidth
                    onPress={() =>
                        navigation.navigate('MainTabs', { screen: ROUTES.TAB_SHOP })
                    }
                    style={{ marginTop: 24 }}
                />
            </ScreenContainer>
        </View>
    );
};

export default AboutScreen;
