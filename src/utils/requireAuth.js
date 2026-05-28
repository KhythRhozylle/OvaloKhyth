import { Alert } from 'react-native';
import { useSelector } from 'react-redux';
import { ROUTES } from './routes';

export function isLoggedIn(authData) {
    return Boolean(authData?.token);
}

export function promptLogin(navigation, message = 'Please sign in to continue.') {
    Alert.alert('Sign in', message, [
        { text: 'Not now', style: 'cancel' },
        {
            text: 'Sign in',
            onPress: () => {
                const parent = navigation.getParent?.();
                if (parent?.navigate) {
                    parent.navigate(ROUTES.LOGIN);
                } else {
                    navigation.navigate(ROUTES.LOGIN);
                }
            },
        },
    ]);
}

export function useAuth() {
    const authData = useSelector(state => state.auth?.data);
    const loggedIn = isLoggedIn(authData);
    return {
        authData,
        loggedIn,
        user: authData?.user ?? null,
    };
}
