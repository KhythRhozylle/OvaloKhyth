import { Dimensions, View } from 'react-native';
import { COLORS, SHADOW, SPACING } from '../constants/theme';

const screenWidth = Dimensions.get('window').width;
const cardWidth = screenWidth - SPACING.screen * 2;
const archRadius = cardWidth / 2;

/** Blush arch / tombstone card — content sits inside. */
const ContactArchCard = ({ children, style }) => (
    <View
        style={[
            {
                width: cardWidth,
                alignSelf: 'center',
                marginTop: SPACING.md,
                backgroundColor: COLORS.florynn.blush,
                borderWidth: 1,
                borderColor: 'rgba(128, 29, 45, 0.12)',
                borderTopLeftRadius: archRadius,
                borderTopRightRadius: archRadius,
                borderBottomLeftRadius: 20,
                borderBottomRightRadius: 20,
                paddingHorizontal: SPACING.md,
                paddingTop: 28,
                paddingBottom: SPACING.md,
                ...SHADOW.card,
            },
            style,
        ]}
    >
        {children}
    </View>
);

export default ContactArchCard;
