import { createStackNavigator } from '@react-navigation/stack';

import { ROUTES } from '../utils';
import MainTabs from './MainTabs';
import Login from '../screens/auth/Login';
import Register from '../screens/auth/Register';
import ProductDetailScreen from '../screens/shop/ProductDetailScreen';
import CartScreen from '../screens/cart/CartScreen';
import CheckoutScreen from '../screens/checkout/CheckoutScreen';
import OrderDetailScreen from '../screens/orders/OrderDetailScreen';
import PayScreen from '../screens/payments/PayScreen';
import AboutScreen from '../screens/about/AboutScreen';
import HistoryScreen from '../screens/history/HistoryScreen';
import AccountScreen from '../screens/account/AccountScreen';

const Stack = createStackNavigator();

/** Guest-first: shop opens first; sign in is optional from More. */
const RootNav = () => (
    <Stack.Navigator
        screenOptions={{ headerShown: false }}
        initialRouteName="MainTabs"
    >
        <Stack.Screen name="MainTabs" component={MainTabs} />
        <Stack.Screen name={ROUTES.LOGIN} component={Login} />
        <Stack.Screen name={ROUTES.PRODUCT_DETAIL} component={ProductDetailScreen} />
        <Stack.Screen name={ROUTES.CART} component={CartScreen} />
        <Stack.Screen name={ROUTES.CHECKOUT} component={CheckoutScreen} />
        <Stack.Screen name={ROUTES.ORDER_DETAIL} component={OrderDetailScreen} />
        <Stack.Screen name={ROUTES.PAY} component={PayScreen} />
        <Stack.Screen name={ROUTES.REGISTER} component={Register} />
        <Stack.Screen name={ROUTES.ABOUT} component={AboutScreen} />
        <Stack.Screen name={ROUTES.HISTORY} component={HistoryScreen} />
        <Stack.Screen name={ROUTES.ACCOUNT} component={AccountScreen} />
    </Stack.Navigator>
);

export default RootNav;
