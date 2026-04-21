import React from 'react';
import { Text, View, ViewStyle, TextStyle } from 'react-native';
import { TextInput } from 'react-native-gesture-handler';

interface CustomTextInputProps {
  label?: string;
  placeholder?: string;
  value: (val: string) => void;
  textStyle?: TextStyle;
  containerStyle?: ViewStyle;
}

const CustomTextInput: React.FC<CustomTextInputProps> = ({
  label,
  placeholder,
  value,
  textStyle,
  containerStyle,
}) => {
  return (
    <View style={containerStyle}>
      {label && (
        <Text
          style={{
            fontSize: 14,
            fontWeight: '500',
            color: '#4A3A3A',
            marginBottom: 4,
          } as TextStyle}
        >
          {label}
        </Text>
      )}
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
          } as TextStyle,
        ]}
      />
    </View>
  );
};

export default CustomTextInput;
