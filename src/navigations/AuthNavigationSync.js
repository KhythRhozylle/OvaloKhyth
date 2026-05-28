import { useEffect, useRef } from 'react';
import { CommonActions } from '@react-navigation/native';

import { useAuth } from '../utils';

/** After logout, return to the main app (no login screen). */
const AuthNavigationSync = ({ navigationRef }) => {
    const { loggedIn } = useAuth();
    const wasLoggedIn = useRef(loggedIn);

    useEffect(() => {
        if (!navigationRef?.isReady?.()) {
            return;
        }
        if (wasLoggedIn.current && !loggedIn) {
            navigationRef.dispatch(
                CommonActions.reset({
                    index: 0,
                    routes: [{ name: 'MainTabs' }],
                }),
            );
        }
        wasLoggedIn.current = loggedIn;
    }, [loggedIn, navigationRef]);

    return null;
};

export default AuthNavigationSync;
