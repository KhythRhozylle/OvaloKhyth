import { useState } from 'react';
import { Text, TextInput, View } from 'react-native';
import { COLORS, RADIUS } from '../constants/theme';

const ContactField = ({
    label,
    required,
    value,
    onChangeText,
    placeholder,
    half,
    multiline,
    keyboardType,
    autoCapitalize,
    variant = 'light',
}) => {
    const [focused, setFocused] = useState(false);
    const isDark = variant === 'dark';

    const labelColor = isDark ? 'rgba(255,255,255,0.85)' : COLORS.florynn.primary;
    const borderBase = isDark ? 'rgba(105, 200, 255, 0.25)' : 'rgba(128, 29, 45, 0.25)';
    const borderFocus = isDark ? 'rgba(105, 200, 255, 0.95)' : COLORS.florynn.primary;
    const bg = isDark ? 'rgba(10, 20, 45, 0.35)' : COLORS.white;
    const textColor = isDark ? '#FFFFFF' : COLORS.text;
    const placeholderColor = isDark ? 'rgba(200, 220, 255, 0.55)' : COLORS.textMuted;

    return (
        <View style={{ width: half ? '48%' : '100%', marginBottom: 16 }}>
            <Text
                style={{
                    fontSize: 12,
                    fontWeight: '700',
                    color: labelColor,
                    marginBottom: 6,
                    letterSpacing: 0.2,
                }}
            >
                {label}
                {required ? ' *' : ''}
            </Text>
            <TextInput
                value={value}
                onChangeText={onChangeText}
                placeholder={placeholder}
                placeholderTextColor={placeholderColor}
                multiline={multiline}
                keyboardType={keyboardType}
                autoCapitalize={autoCapitalize}
                onFocus={() => setFocused(true)}
                onBlur={() => setFocused(false)}
                style={{
                    borderWidth: 1,
                    borderColor: focused ? borderFocus : borderBase,
                    borderRadius: RADIUS.pill,
                    backgroundColor: bg,
                    color: textColor,
                    fontSize: 15,
                    paddingHorizontal: 18,
                    paddingVertical: multiline ? 14 : 12,
                    minHeight: multiline ? 120 : undefined,
                    textAlignVertical: multiline ? 'top' : 'center',
                    ...(isDark && focused
                        ? {
                              shadowColor: 'rgba(105, 200, 255, 0.45)',
                              shadowOffset: { width: 0, height: 0 },
                              shadowOpacity: 1,
                              shadowRadius: 12,
                              elevation: 2,
                          }
                        : null),
                }}
            />
        </View>
    );
};

export default ContactField;
