import { useNavigation } from '@react-navigation/native';
import { Image, Text, TouchableOpacity, View } from 'react-native';
import { IMG, ROUTES } from '../utils';

const BG_COLOR = '#FDE4E4'; // Pale blush - complements the red florynn logo

const HomeScreen = () => {
const navigation = useNavigation();
return (
    <View
    style={{
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: BG_COLOR,
    }}
    >
    <Image
        source={IMG.LOGO}
        style={{ width: 200, height: 80, resizeMode: 'contain' }}
    />
    <Text style={{ fontSize: 24, fontWeight: '600', color: '#801D2D', marginVertical: 20 }}>
        You're logged in!
    </Text>

      {/* <Button title="GO TO PROFILE" /> */}

    <TouchableOpacity
        onPress={() => {
        navigation.navigate(ROUTES.PROFILE);
        }}
    >
        <View
        style={{
            backgroundColor: 'green',
            padding: 10,
            borderRadius: 20,
        }}
        >
        <Text style={{ fontSize: 40, color: 'white' }}>GO TO PROFILE</Text>
        </View>
    </TouchableOpacity>
    </View>
);
};

export default HomeScreen;
