import React from 'react';
import { Text, TouchableOpacity, View, ViewStyle, TextStyle } from 'react-native';

interface CustomButtonProps {
  containerStyle?: ViewStyle;
  textStyle?: TextStyle;
  label: string;
  onPress?: () => void;
  disabled?: boolean;
}

const CustomButton: React.FC<CustomButtonProps> = ({ containerStyle, textStyle, label, onPress, disabled }) => {
  return (
    <View style={containerStyle}>
      <TouchableOpacity onPress={onPress} disabled={disabled}>
        <View
          style={{
            alignItems: 'center',
            justifyContent: 'center',
            padding: 10,
          } as ViewStyle}
        >
          <Text style={textStyle}>{label}</Text>
        </View>
      </TouchableOpacity>
    </View>
  );
};

export default CustomButton;
