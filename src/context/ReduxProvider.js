import React from 'react';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';

import configureStore from '../app/reducers';
import ProductsPollingController from '../components/ProductsPollingController';

const { store, persistor } = configureStore();

const ReduxProvider = ({ children }) => {
    return (
        <Provider store={store}>
            <PersistGate loading={null} persistor={persistor}>
                <ProductsPollingController />
                {children}
            </PersistGate>
        </Provider>
    );
};

export default ReduxProvider;
