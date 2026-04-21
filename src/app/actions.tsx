export const USER_LOGIN = 'USER_LOGIN';
export const USER_LOGIN_REQUEST = 'USER_LOGIN_REQUEST';
export const USER_LOGIN_COMPLETE = 'USER_LOGIN_COMPLETE';
export const USER_LOGIN_ERROR = 'USER_LOGIN_ERROR';
export const RESET_USER_LOGIN = 'RESET_USER_LOGIN';

export const USER_REGISTER = 'USER_REGISTER';
export const USER_REGISTER_REQUEST = 'USER_REGISTER_REQUEST';
export const USER_REGISTER_COMPLETE = 'USER_REGISTER_COMPLETE';
export const USER_REGISTER_ERROR = 'USER_REGISTER_ERROR';

export interface LoginPayload {
  username: string;
  password: string;
}

export interface RegisterPayload {
  name: string;
  username: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  user: {
    id: number;
    name: string;
    email: string;
  };
}

export interface UserLoginAction {
  type: typeof USER_LOGIN;
  payload: LoginPayload;
  [key: string]: unknown;
}

export interface UserLoginRequestAction {
  type: typeof USER_LOGIN_REQUEST;
  [key: string]: unknown;
}

export interface UserLoginCompleteAction {
  type: typeof USER_LOGIN_COMPLETE;
  payload: AuthResponse;
  [key: string]: unknown;
}

export interface UserLoginErrorAction {
  type: typeof USER_LOGIN_ERROR;
  error: string;
  [key: string]: unknown;
}

export interface ResetUserLoginAction {
  type: typeof RESET_USER_LOGIN;
  [key: string]: unknown;
}

export interface UserRegisterAction {
  type: typeof USER_REGISTER;
  payload: RegisterPayload;
  [key: string]: unknown;
}

export interface UserRegisterRequestAction {
  type: typeof USER_REGISTER_REQUEST;
  [key: string]: unknown;
}

export interface UserRegisterCompleteAction {
  type: typeof USER_REGISTER_COMPLETE;
  payload: AuthResponse;
  [key: string]: unknown;
}

export interface UserRegisterErrorAction {
  type: typeof USER_REGISTER_ERROR;
  error: string;
  [key: string]: unknown;
}

export type AuthAction =
  | UserLoginAction
  | UserLoginRequestAction
  | UserLoginCompleteAction
  | UserLoginErrorAction
  | ResetUserLoginAction
  | UserRegisterAction
  | UserRegisterRequestAction
  | UserRegisterCompleteAction
  | UserRegisterErrorAction;

export const authLogin = (payload: LoginPayload): UserLoginAction => ({
  type: USER_LOGIN,
  payload,
});

export const authRegister = (payload: RegisterPayload): UserRegisterAction => ({
  type: USER_REGISTER,
  payload,
});

export const authLogout = (): ResetUserLoginAction => ({
  type: RESET_USER_LOGIN,
});
