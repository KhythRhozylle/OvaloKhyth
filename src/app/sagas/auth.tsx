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
  LoginPayload,
  RegisterPayload,
} from '../actions';
import { userLogin as userLoginApi, userRegister as userRegisterApi, AuthResponse } from '../api/auth';

interface LoginAction {
  type: typeof USER_LOGIN;
  payload: LoginPayload;
}

interface RegisterAction {
  type: typeof USER_REGISTER;
  payload: RegisterPayload;
}

export function* userLoginAsync(action: LoginAction) {
  console.log('User login saga started: ', action);

  try {
    yield put({ type: USER_LOGIN_REQUEST });

    const data: AuthResponse = yield call(userLoginApi, action.payload);

    yield put({
      type: USER_LOGIN_COMPLETE,
      payload: data,
    });
  } catch (error) {
    console.log('User login saga error: ', error);
    yield put({
      type: USER_LOGIN_ERROR,
      error: (error as Error)?.message || 'Login failed',
    });
  }
}

export function* userRegisterAsync(action: RegisterAction) {
  console.log('User register saga started: ', action);

  try {
    yield put({ type: USER_REGISTER_REQUEST });

    const data: AuthResponse = yield call(userRegisterApi, action.payload);

    yield put({
      type: USER_REGISTER_COMPLETE,
      payload: data,
    });
  } catch (error) {
    console.log('User register saga error: ', error);
    yield put({
      type: USER_REGISTER_ERROR,
      error: (error as Error)?.message || 'Registration failed',
    });
  }
}

export function* userLogin() {
  yield takeLatest(USER_LOGIN, userLoginAsync);
}

export function* userRegister() {
  yield takeLatest(USER_REGISTER, userRegisterAsync);
}
