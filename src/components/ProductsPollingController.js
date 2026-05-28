import { useEffect } from 'react';
import { AppState } from 'react-native';
import { useDispatch } from 'react-redux';

import { productsPollStart, productsPollStop } from '../app/actions';

/**
 * Starts/stops global product polling based on AppState.
 * Purely frontend; does not change any API endpoints.
 */
export default function ProductsPollingController() {
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(productsPollStart());

        const sub = AppState.addEventListener('change', state => {
            if (state === 'active') {
                dispatch(productsPollStart());
            } else {
                dispatch(productsPollStop());
            }
        });

        return () => {
            sub.remove();
            dispatch(productsPollStop());
        };
    }, [dispatch]);

    return null;
}

