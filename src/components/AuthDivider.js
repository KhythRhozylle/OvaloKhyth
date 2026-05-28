import { Text, View } from 'react-native';
import { COLORS } from '../constants/theme';

const AuthDivider = ({ label = 'or' }) => (
    <View
        style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginVertical: 20,
        }}
    >
        <View style={{ flex: 1, height: 1, backgroundColor: COLORS.border }} />
        <Text
            style={{
                marginHorizontal: 14,
                fontSize: 13,
                fontWeight: '600',
                color: COLORS.textMuted,
                textTransform: 'uppercase',
                letterSpacing: 0.8,
            }}
        >
            {label}
        </Text>
        <View style={{ flex: 1, height: 1, backgroundColor: COLORS.border }} />
    </View>
);

export default AuthDivider;
