export const USER_LOGIN = 'USER_LOGIN';
export const USER_LOGIN_REQUEST = 'USER_LOGIN_REQUEST';
export const USER_LOGIN_COMPLETE = 'USER_LOGIN_COMPLETE';
export const USER_LOGIN_ERROR = 'USER_LOGIN_ERROR';
export const RESET_USER_LOGIN = 'RESET_USER_LOGIN';

export const USER_REGISTER = 'USER_REGISTER';
export const USER_REGISTER_REQUEST = 'USER_REGISTER_REQUEST';
export const USER_REGISTER_COMPLETE = 'USER_REGISTER_COMPLETE';
export const USER_REGISTER_ERROR = 'USER_REGISTER_ERROR';

export const authLogin = payload => ({
  type: USER_LOGIN,
  payload,
});

export const authRegister = payload => ({
  type: USER_REGISTER,
  payload,
});

export const authLogout = () => ({
  type: RESET_USER_LOGIN,
});

export const RESET_REGISTER = 'RESET_REGISTER';

export const resetRegister = () => ({
  type: RESET_REGISTER,
});

export const CART_ADD_ITEM = 'CART_ADD_ITEM';
export const CART_UPDATE_QUANTITY = 'CART_UPDATE_QUANTITY';
export const CART_REMOVE_ITEM = 'CART_REMOVE_ITEM';
export const CART_CLEAR = 'CART_CLEAR';

export const cartAddItem = product => ({
    type: CART_ADD_ITEM,
    payload: product,
});

export const cartUpdateQuantity = (productId, quantity) => ({
    type: CART_UPDATE_QUANTITY,
    payload: { productId, quantity },
});

export const cartRemoveItem = productId => ({
    type: CART_REMOVE_ITEM,
    payload: { productId },
});

export const cartClear = () => ({
    type: CART_CLEAR,
});

// PRODUCTS (global polling)
export const PRODUCTS_POLL_START = 'PRODUCTS_POLL_START';
export const PRODUCTS_POLL_STOP = 'PRODUCTS_POLL_STOP';
export const PRODUCTS_FETCH = 'PRODUCTS_FETCH';
export const PRODUCTS_FETCH_REQUEST = 'PRODUCTS_FETCH_REQUEST';
export const PRODUCTS_FETCH_SUCCESS = 'PRODUCTS_FETCH_SUCCESS';
export const PRODUCTS_FETCH_FAILURE = 'PRODUCTS_FETCH_FAILURE';
export const PRODUCTS_SET = 'PRODUCTS_SET';

export const productsPollStart = () => ({ type: PRODUCTS_POLL_START });
export const productsPollStop = () => ({ type: PRODUCTS_POLL_STOP });
export const productsFetch = () => ({ type: PRODUCTS_FETCH });
export const productsSet = products => ({ type: PRODUCTS_SET, payload: products });
