import { Text, TextInput, View } from 'react-native';
import { COLORS, RADIUS } from '../constants/theme';

const SearchBar = ({ value, onChangeText, placeholder = 'Search bouquets...' }) => (
    <View
        style={{
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: COLORS.surface,
            borderRadius: RADIUS.pill,
            borderWidth: 1,
            borderColor: COLORS.border,
            paddingHorizontal: 18,
            paddingVertical: 14,
            flex: 1,
        }}
    >
        <Text style={{ marginRight: 8, fontSize: 16 }}>🔍</Text>
        <TextInput
            placeholder={placeholder}
            placeholderTextColor={COLORS.textMuted}
            value={value}
            onChangeText={onChangeText}
            style={{ flex: 1, fontSize: 14, color: COLORS.text, padding: 0 }}
        />
    </View>
);

export default SearchBar;
