import { ImageBackground, Platform, Text, View } from 'react-native';
import { IMG } from '../utils';

const PRIMARY_COLOR = '#801D2D';

const AppHeader = ({ title, subtitle }) => {
    return (
        <ImageBackground
            source={IMG.LOGO}
            style={{
                width: '100%',
                paddingTop: Platform.OS === 'ios' ? 60 : 40,
                paddingBottom: 24,
            }}
            imageStyle={{
                resizeMode: 'cover',
            }}
        >
            <View
                style={{
                    backgroundColor: 'rgba(253, 228, 228, 0.9)',
                    paddingHorizontal: 24,
                    paddingVertical: 12,
                }}
            >
                {title ? (
                    <Text
                        style={{
                            fontSize: 24,
                            fontWeight: '700',
                            letterSpacing: 0.5,
                            color: PRIMARY_COLOR,
                        }}
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
                        }}
                    >
                        {subtitle}
                    </Text>
                ) : null}
            </View>
        </ImageBackground>
    );
};

export default AppHeader;

