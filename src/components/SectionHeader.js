import { Text, TouchableOpacity, View } from 'react-native';
import { COLORS } from '../constants/theme';

const SectionHeader = ({ title, actionLabel, onAction, style }) => (
    <View
        style={[
            {
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
            },
            style,
        ]}
    >
        <Text style={{ fontSize: 17, fontWeight: '700', color: COLORS.text }}>{title}</Text>
        {actionLabel && onAction ? (
            <TouchableOpacity onPress={onAction}>
                <Text style={{ color: COLORS.primary, fontWeight: '600', fontSize: 13 }}>
                    {actionLabel}
                </Text>
            </TouchableOpacity>
        ) : null}
    </View>
);

export default SectionHeader;
