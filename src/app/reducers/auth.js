import {
  USER_LOGIN_REQUEST,
  USER_LOGIN_COMPLETE,
  USER_LOGIN_ERROR,
  RESET_USER_LOGIN,
  USER_REGISTER_REQUEST,
  USER_REGISTER_COMPLETE,
  USER_REGISTER_ERROR,
  RESET_REGISTER,
} from '../actions';

const INITIALSTATE = {
  data: null,
  isLoading: false,
  isError: false,
  error: null,
  isRegistering: false,
  isRegisterError: false,
  registerError: null,
  registerData: null,
};

export default function reducer(state = INITIALSTATE, action) {
  switch (action.type) {
    case USER_LOGIN_REQUEST:
      return {
        ...state,
        data: null,
        isLoading: true,
        isError: false,
        error: null,
      };

    case USER_LOGIN_COMPLETE:
      return {
        ...state,
        data: action.payload || null,
        isLoading: false,
        isError: false,
        error: null,
      };

    case USER_LOGIN_ERROR:
      return {
        ...state,
        data: null,
        isLoading: false,
        isError: true,
        error: action.error || 'Login failed',
      };

    case USER_REGISTER_REQUEST:
      return {
        ...state,
        registerData: null,
        isRegistering: true,
        isRegisterError: false,
        registerError: null,
      };

    case USER_REGISTER_COMPLETE:
      return {
        ...state,
        registerData: action.payload || null,
        isRegistering: false,
        isRegisterError: false,
        registerError: null,
      };

    case USER_REGISTER_ERROR:
      return {
        ...state,
        registerData: null,
        isRegistering: false,
        isRegisterError: true,
        registerError: action.error || 'Registration failed',
      };

    case RESET_USER_LOGIN:
      return INITIALSTATE;

    case RESET_REGISTER:
      return {
        ...state,
        registerData: null,
        isRegistering: false,
        isRegisterError: false,
        registerError: null,
      };

    default:
      return state;
  }
}