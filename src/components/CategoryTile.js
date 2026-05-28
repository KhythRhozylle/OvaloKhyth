import { Image, Text, TouchableOpacity, View } from 'react-native';
import { COLORS, RADIUS, SHADOW } from '../constants/theme';

const CategoryTile = ({ name, count, imageUri, onPress }) => (
    <TouchableOpacity
        onPress={onPress}
        activeOpacity={0.85}
        style={{
            width: '47%',
            aspectRatio: 1,
            marginBottom: 12,
            borderRadius: RADIUS.card,
            overflow: 'hidden',
            backgroundColor: COLORS.surface,
            ...SHADOW.card,
        }}
    >
        {imageUri ? (
            <Image source={{ uri: imageUri }} style={{ width: '100%', height: '70%' }} />
        ) : (
            <View
                style={{
                    height: '70%',
                    backgroundColor: '#E8F0E9',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}
            >
                <Text style={{ fontSize: 28 }}>🌸</Text>
            </View>
        )}
        <View
            style={{
                flex: 1,
                padding: 10,
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
            }}
        >
            <View style={{ flex: 1 }}>
                <Text numberOfLines={1} style={{ fontWeight: '600', fontSize: 13, color: COLORS.text }}>
                    {name}
                </Text>
                {count != null ? (
                    <Text style={{ fontSize: 11, color: COLORS.textMuted }}>{count} items</Text>
                ) : null}
            </View>
            <View
                style={{
                    width: 28,
                    height: 28,
                    borderRadius: 14,
                    backgroundColor: COLORS.primary,
                    alignItems: 'center',
                    justifyContent: 'center',
                }}
            >
                <Text style={{ color: COLORS.white, fontSize: 16, fontWeight: '600' }}>+</Text>
            </View>
        </View>
    </TouchableOpacity>
);

export default CategoryTile;
