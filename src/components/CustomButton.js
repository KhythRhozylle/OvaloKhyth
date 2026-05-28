import { ActivityIndicator, Text, TouchableOpacity, View } from 'react-native';
import { COLORS, RADIUS } from '../constants/theme';

const VARIANTS = {
    primary: {
        bg: COLORS.primary,
        border: COLORS.primary,
        text: COLORS.white,
    },
    outline: {
        bg: COLORS.white,
        border: COLORS.primary,
        text: COLORS.primary,
    },
    secondary: {
        bg: COLORS.imageBg,
        border: COLORS.border,
        text: COLORS.text,
    },
    florynn: {
        bg: COLORS.florynn.primary,
        border: COLORS.florynn.primaryDark,
        text: COLORS.florynn.onPrimary,
    },
};

const SIZES = {
    md: { minHeight: 48, paddingVertical: 14, paddingHorizontal: 20, fontSize: 15 },
    sm: { minHeight: 40, paddingVertical: 10, paddingHorizontal: 18, fontSize: 13 },
};

/**
 * @param {'primary'|'outline'|'secondary'|'florynn'} variant
 * @param {'md'|'sm'} size
 * @param {boolean} pill — fully rounded ends (detail / hero CTAs)
 * @param {boolean} fullWidth
 * @param {string} [icon] — emoji or character shown before label
 */
const CustomButton = ({
    label,
    onPress,
    disabled = false,
    loading = false,
    variant = 'primary',
    size = 'md',
    pill = false,
    fullWidth = false,
    icon,
    style,
    textStyle,
}) => {
    const v = VARIANTS[variant] || VARIANTS.primary;
    const s = SIZES[size] || SIZES.md;
    const isDisabled = disabled || loading;

    return (
        <TouchableOpacity
            onPress={onPress}
            disabled={isDisabled}
            activeOpacity={0.75}
            style={[
                {
                    minHeight: s.minHeight,
                    paddingVertical: s.paddingVertical,
                    paddingHorizontal: s.paddingHorizontal,
                    borderRadius: pill ? RADIUS.pill : RADIUS.button,
                    backgroundColor: isDisabled ? COLORS.imageBg : v.bg,
                    borderWidth: variant === 'outline' ? 1.5 : 1,
                    borderColor: isDisabled ? COLORS.border : v.border,
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexDirection: 'row',
                    alignSelf: fullWidth ? 'stretch' : 'flex-start',
                    flex: fullWidth ? 1 : undefined,
                    opacity: isDisabled ? 0.65 : 1,
                },
                style,
            ]}
        >
            {loading ? (
                <ActivityIndicator color={v.text} size="small" />
            ) : (
                <>
                    {icon ? (
                        <Text style={{ fontSize: s.fontSize, marginRight: 8 }}>{icon}</Text>
                    ) : null}
                    <Text
                        style={[
                            {
                                fontSize: s.fontSize,
                                fontWeight: '700',
                                letterSpacing: 0.3,
                                color: isDisabled ? COLORS.textMuted : v.text,
                            },
                            textStyle,
                        ]}
                    >
                        {label}
                    </Text>
                </>
            )}
        </TouchableOpacity>
    );
};

/** Side-by-side primary + outline row (product detail, etc.) */
export const ButtonRow = ({ children, style }) => (
    <View
        style={[
            {
                flexDirection: 'row',
                alignItems: 'stretch',
            },
            style,
        ]}
    >
        {children}
    </View>
);

export default CustomButton;
