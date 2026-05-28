import {
    PRODUCTS_FETCH_REQUEST,
    PRODUCTS_FETCH_SUCCESS,
    PRODUCTS_FETCH_FAILURE,
    PRODUCTS_SET,
} from '../actions';

const INITIAL = {
    items: [],
    loading: false,
    error: null,
    lastUpdated: null,
};

export default function products(state = INITIAL, action) {
    switch (action.type) {
        case PRODUCTS_SET:
            return {
                ...state,
                items: Array.isArray(action.payload) ? action.payload : [],
                lastUpdated: Date.now(),
                error: null,
            };
        case PRODUCTS_FETCH_REQUEST:
            return { ...state, loading: true, error: null };
        case PRODUCTS_FETCH_SUCCESS:
            return {
                ...state,
                loading: false,
                items: Array.isArray(action.payload) ? action.payload : [],
                lastUpdated: action.meta?.at ?? Date.now(),
                error: null,
            };
        case PRODUCTS_FETCH_FAILURE:
            return { ...state, loading: false, error: action.error || 'Failed to load products' };
        default:
            return state;
    }
}

