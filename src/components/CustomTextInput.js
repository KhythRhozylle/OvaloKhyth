import { Text, View } from 'react-native';
import { TextInput } from 'react-native-gesture-handler';

const CustomTextInput = ({
label,
placeholder,
value,
textStyle,
containerStyle,
}) => {
return (
    <View style={containerStyle}>
    <Text
        style={{
            fontSize: 14,
            fontWeight: '500',
            color: '#4A3A3A',
            marginBottom: 4,
        }}
    >
        {label}
    </Text>
    <TextInput
        placeholder={placeholder}
        onChangeText={value}
        style={[
        textStyle,
        {
            width: '100%',
            borderBottomWidth: 1,
            borderBottomColor: '#D5B4B4',
            paddingVertical: 8,
            fontSize: 15,
            color: '#2B1A1A',
        },
        ]}
    />
    </View>
);
};

export default CustomTextInput;
