import React from 'react';
import { ImageBackground, Platform, Text, View, ImageSourcePropType, ViewStyle, TextStyle, ImageStyle } from 'react-native';
import { IMG } from '../utils';

const PRIMARY_COLOR = '#801D2D';

interface AppHeaderProps {
  title?: string;
  subtitle?: string;
}

const AppHeader: React.FC<AppHeaderProps> = ({ title, subtitle }) => {
  return (
    <ImageBackground
      source={IMG.LOGO as ImageSourcePropType}
      style={{
        width: '100%',
        paddingTop: Platform.OS === 'ios' ? 60 : 40,
        paddingBottom: 24,
      } as ViewStyle}
      imageStyle={{
        resizeMode: 'cover',
      } as ImageStyle}
    >
      <View
        style={{
          backgroundColor: 'rgba(253, 228, 228, 0.9)',
          paddingHorizontal: 24,
          paddingVertical: 12,
        } as ViewStyle}
      >
        {title ? (
          <Text
            style={{
              fontSize: 24,
              fontWeight: '700',
              letterSpacing: 0.5,
              color: PRIMARY_COLOR,
            } as TextStyle}
          >
            {title}
          </Text>
        ) : null}
        {subtitle ? (
          <Text
            style={{
              marginTop: 4,
              fontSize: 14,
              color: '#4A3A3A',
            } as TextStyle}
          >
            {subtitle}
          </Text>
        ) : null}
      </View>
    </ImageBackground>
  );
};

export default AppHeader;
