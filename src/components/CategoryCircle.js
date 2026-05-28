import { Image, Text, TouchableOpacity, View } from 'react-native';
import { COLORS } from '../constants/theme';
import { getProductImage } from '../utils/product';

const CategoryCircle = ({ name, imageProduct, onPress, selected = false }) => {
    const uri = imageProduct ? getProductImage(imageProduct) : null;

    return (
        <TouchableOpacity
            onPress={onPress}
            activeOpacity={0.85}
            style={{ alignItems: 'center', marginRight: 14, width: 76 }}
        >
            <View
                style={{
                    width: 64,
                    height: 64,
                    borderRadius: 32,
                    backgroundColor: COLORS.imageBg,
                    overflow: 'hidden',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderWidth: selected ? 2 : 1,
                    borderColor: selected ? COLORS.primary : COLORS.border,
                }}
            >
                {uri ? (
                    <Image source={{ uri }} style={{ width: 64, height: 64 }} resizeMode="cover" />
                ) : (
                    <Text style={{ fontSize: 22 }}>🌸</Text>
                )}
            </View>
            <Text
                numberOfLines={1}
                style={{
                    marginTop: 8,
                    fontSize: 12,
                    fontWeight: selected ? '700' : '500',
                    color: selected ? COLORS.text : COLORS.textMuted,
                    textAlign: 'center',
                    width: '100%',
                }}
            >
                {name}
            </Text>
        </TouchableOpacity>
    );
};

export default CategoryCircle;
