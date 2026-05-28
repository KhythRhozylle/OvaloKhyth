import { Text, TextInput, View } from 'react-native';
import { COLORS, RADIUS, SPACING } from '../constants/theme';

const CustomTextInput = ({
    label,
    placeholder,
    value: valueProp,
    onChangeText,
    textStyle,
    containerStyle,
    secureTextEntry = false,
    multiline = false,
    keyboardType = 'default',
    autoCapitalize = 'sentences',
}) => {
    // Legacy: `value` was misused as onChangeText handler
    const changeHandler =
        typeof valueProp === 'function' ? valueProp : onChangeText;
    const inputValue = typeof valueProp === 'function' ? undefined : valueProp;

    return (
        <View style={containerStyle}>
            {label ? (
                <Text
                    style={{
                        fontSize: 13,
                        fontWeight: '600',
                        color: COLORS.text,
                        marginBottom: 6,
                    }}
                >
                    {label}
                </Text>
            ) : null}
            <TextInput
                placeholder={placeholder}
                placeholderTextColor={COLORS.textMuted}
                value={inputValue}
                onChangeText={changeHandler}
                secureTextEntry={secureTextEntry}
                multiline={multiline}
                keyboardType={keyboardType}
                autoCapitalize={autoCapitalize}
                style={[
                    {
                        width: '100%',
                        backgroundColor: COLORS.inputBg,
                        borderWidth: 1,
                        borderColor: COLORS.border,
                        borderRadius: RADIUS.button,
                        paddingHorizontal: SPACING.md,
                        paddingVertical: multiline ? 12 : 14,
                        fontSize: 15,
                        color: COLORS.text,
                    },
                    textStyle,
                ]}
            />
        </View>
    );
};

export default CustomTextInput;
