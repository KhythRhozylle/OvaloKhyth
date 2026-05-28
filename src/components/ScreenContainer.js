import { ScrollView, View } from 'react-native';
import { COLORS, SPACING } from '../constants/theme';

const ScreenContainer = ({ children, scroll = true, style }) => {
    const content = (
        <View
            style={[
                {
                    flex: 1,
                    paddingHorizontal: SPACING.screen,
                    paddingTop: SPACING.sm,
                    paddingBottom: SPACING.md,
                },
                style,
            ]}
        >
            {children}
        </View>
    );

    if (!scroll) {
        return content;
    }

    return (
        <ScrollView
            style={{ flex: 1, backgroundColor: COLORS.background }}
            contentContainerStyle={{ flexGrow: 1, paddingBottom: 32 }}
            keyboardShouldPersistTaps="handled"
        >
            {content}
        </ScrollView>
    );
};

export default ScreenContainer;
