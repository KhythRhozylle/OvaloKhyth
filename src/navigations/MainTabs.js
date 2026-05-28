import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { COLORS } from '../constants/theme';
import CustomTabBar from '../components/CustomTabBar';
import { ROUTES } from '../utils';
import HomeScreen from '../screens/home/HomeScreen';
import ShopScreen from '../screens/shop/ShopScreen';
import ContactScreen from '../screens/contact/ContactScreen';
import MoreScreen from '../screens/more/MoreScreen';

const Tab = createBottomTabNavigator();

const MainTabs = () => (
    <Tab.Navigator
        tabBar={props => <CustomTabBar {...props} />}
        screenOptions={{
            headerShown: false,
            lazy: true,
        }}
    >
        <Tab.Screen name={ROUTES.TAB_HOME} component={HomeScreen} />
        <Tab.Screen name={ROUTES.TAB_SHOP} component={ShopScreen} />
        <Tab.Screen name={ROUTES.TAB_CONTACT} component={ContactScreen} />
        <Tab.Screen name={ROUTES.TAB_MORE} component={MoreScreen} />
    </Tab.Navigator>
);

export default MainTabs;
