import { Text, TouchableOpacity } from 'react-native';
import { COLORS, RADIUS } from '../constants/theme';

const FilterPill = ({ label, active, onPress, icon }) => (
    <TouchableOpacity
        onPress={onPress}
        activeOpacity={0.75}
        style={{
            flexDirection: 'row',
            alignItems: 'center',
            paddingHorizontal: 16,
            paddingVertical: 10,
            marginRight: 8,
            borderRadius: RADIUS.pill,
            borderWidth: 1,
            borderColor: active ? COLORS.florynn.primary : COLORS.border,
            backgroundColor: active ? COLORS.florynn.primary : COLORS.surface,
            minHeight: 40,
        }}
    >
        {icon ? (
            <Text style={{ fontSize: 12, marginRight: 6, color: active ? COLORS.white : COLORS.text }}>
                {icon}
            </Text>
        ) : null}
        <Text
            style={{
                fontSize: 13,
                fontWeight: '600',
                color: active ? COLORS.white : COLORS.textMuted,
            }}
        >
            {label}
        </Text>
    </TouchableOpacity>
);

export default FilterPill;
