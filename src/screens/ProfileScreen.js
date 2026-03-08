import { Image, Text, View } from 'react-native';
import { IMG } from '../utils';

const BG_COLOR = '#FDE4E4'; // Pale blush - complements the red florynn logo

const ProfileScreen = () => {
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
    <Text style={{ fontSize: 40 }}>ProfileScreen</Text>
    </View>
);
};

export default ProfileScreen;
