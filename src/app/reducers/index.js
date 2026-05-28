import { applyMiddleware, combineReducers, createStore } from 'redux';
import { persistReducer, persistStore } from 'redux-persist';
import createSagaMiddleware from 'redux-saga';

import AsyncStorage from '@react-native-async-storage/async-storage';

import auth from '../reducers/auth.js';
import cart from '../reducers/cart.js';
import products from '../reducers/products.js';
import rootSaga from '../sagas';

const sagaMiddleware = createSagaMiddleware();
const rootPersistConfig = {
    key: 'root',
    storage: AsyncStorage,
    blacklist: ['auth', 'cart', 'products'],
};

const authPersistConfig = {
    key: 'auth',
    storage: AsyncStorage,
    blacklist: [],
};

const cartPersistConfig = {
    key: 'cart',
    storage: AsyncStorage,
};

const rootReducer = combineReducers({
    auth: persistReducer(authPersistConfig, auth),
    cart: persistReducer(cartPersistConfig, cart),
    products,
});

const persistedReducer = persistReducer(rootPersistConfig, rootReducer);

export default () => {
    let store = createStore(persistedReducer, applyMiddleware(sagaMiddleware));
    let persistor = persistStore(store);
    sagaMiddleware.run(rootSaga);
    
    return { store, persistor };
};