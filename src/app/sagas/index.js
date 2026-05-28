import { all } from 'redux-saga/effects';
import { userLogin, userRegister } from './auth';
import { productsSaga } from './products';

export default function* rootSaga() {
    yield all([
        // AUTH/Login
        userLogin(),
        // AUTH/Register
        userRegister(),
        // PRODUCTS global polling
        productsSaga(),
    ]);
}