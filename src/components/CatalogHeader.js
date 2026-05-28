import { Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { COLORS, SPACING } from '../constants/theme';

const CatalogHeader = ({ title, subtitle, breadcrumb }) => {
    const insets = useSafeAreaInsets();

    return (
        <View
            style={{
                backgroundColor: COLORS.surface,
                paddingTop: insets.top + SPACING.sm,
                paddingBottom: SPACING.md,
                paddingHorizontal: SPACING.screen,
                borderBottomWidth: 1,
                borderBottomColor: COLORS.border,
            }}
        >
            <Text
                style={{
                    fontSize: 22,
                    fontWeight: '700',
                    letterSpacing: 1,
                    color: COLORS.primary,
                }}
            >
                FLORYNN
            </Text>
            {breadcrumb ? (
                <Text style={{ fontSize: 12, color: COLORS.textMuted, marginTop: 4 }}>
                    {breadcrumb}
                </Text>
            ) : null}
            {title ? (
                <Text
                    style={{
                        fontSize: 20,
                        fontWeight: '600',
                        color: COLORS.text,
                        marginTop: breadcrumb ? 8 : 12,
                    }}
                >
                    {title}
                </Text>
            ) : null}
            {subtitle ? (
                <Text style={{ fontSize: 14, color: COLORS.textMuted, marginTop: 4 }}>
                    {subtitle}
                </Text>
            ) : null}
        </View>
    );
};

export default CatalogHeader;
