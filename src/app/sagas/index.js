import { all } from 'redux-saga/effects';
import { userLogin, userRegister } from './auth';

export default function* rootSaga() {
    yield all([
        // AUTH/Login
        userLogin(),
        // AUTH/Register
        userRegister(),
    ]);
}