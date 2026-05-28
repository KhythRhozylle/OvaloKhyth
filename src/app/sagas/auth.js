import { takeLatest, call, put } from 'redux-saga/effects';
import {
    USER_LOGIN,
    USER_LOGIN_REQUEST,
    USER_LOGIN_COMPLETE,
    USER_LOGIN_ERROR,
    USER_REGISTER,
    USER_REGISTER_REQUEST,
    USER_REGISTER_COMPLETE,
    USER_REGISTER_ERROR,
} from '../actions';
import { userLogin as userLoginApi, userRegister as userRegisterApi } from '../api/auth';
import { isCustomerUser, normalizeLoginResponse } from '../../utils/auth';

function buildLoginCompleteAction(raw, fallbackEmail) {
    const { token, user } = normalizeLoginResponse(raw);

    if (!token) {
        throw new Error('Login failed: no token received.');
    }

    if (user && !isCustomerUser(user)) {
        throw new Error(
            'This account is for staff only. Please use the admin portal.',
        );
    }

    return {
        type: USER_LOGIN_COMPLETE,
        payload: {
            token,
            user: user || {
                email: fallbackEmail,
                name: fallbackEmail,
            },
        },
    };
}

export function* userLoginAsync(action) {
    try {
        yield put({ type: USER_LOGIN_REQUEST });
        const raw = yield call(userLoginApi, action.payload);
        yield put(buildLoginCompleteAction(raw, action.payload.email));
    } catch (error) {
        yield put({
            type: USER_LOGIN_ERROR,
            error: error?.message || 'Login failed',
        });
    }
}

export function* userRegisterAsync(action) {
    try {
        yield put({ type: USER_REGISTER_REQUEST });
        const data = yield call(userRegisterApi, action.payload);
        yield put({
            type: USER_REGISTER_COMPLETE,
            payload: data,
        });
    } catch (error) {
        yield put({
            type: USER_REGISTER_ERROR,
            error: error?.message || 'Registration failed',
        });
    }
}

export function* userLogin() {
    yield takeLatest(USER_LOGIN, userLoginAsync);
}

export function* userRegister() {
    yield takeLatest(USER_REGISTER, userRegisterAsync);
}
