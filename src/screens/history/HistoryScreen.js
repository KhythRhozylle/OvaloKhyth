import { Text, View } from 'react-native';

import AppTopBar from '../../components/AppTopBar';
import ScreenContainer from '../../components/ScreenContainer';
import { HISTORY_COPY } from '../../constants/copy';
import { COLORS, RADIUS, SHADOW } from '../../constants/theme';

const HistoryScreen = () => (
    <View style={{ flex: 1, backgroundColor: COLORS.background }}>
        <AppTopBar showBack title={HISTORY_COPY.title} />
        <ScreenContainer>
            <View
                style={{
                    backgroundColor: COLORS.surface,
                    borderRadius: RADIUS.card,
                    padding: 16,
                    marginTop: 8,
                    ...SHADOW.soft,
                }}
            >
                {HISTORY_COPY.timeline.map(item => (
                    <View
                        key={item.year}
                        style={{
                            flexDirection: 'row',
                            marginBottom: 20,
                            paddingLeft: 4,
                            borderLeftWidth: 3,
                            borderLeftColor: COLORS.primary,
                        }}
                    >
                        <View style={{ marginLeft: 12, flex: 1 }}>
                            <Text
                                style={{
                                    fontWeight: '700',
                                    color: COLORS.text,
                                    fontSize: 16,
                                }}
                            >
                                {item.year}
                            </Text>
                            <Text
                                style={{
                                    marginTop: 4,
                                    lineHeight: 20,
                                    color: COLORS.textMuted,
                                }}
                            >
                                {item.event}
                            </Text>
                        </View>
                    </View>
                ))}
            </View>
        </ScreenContainer>
    </View>
);

export default HistoryScreen;
