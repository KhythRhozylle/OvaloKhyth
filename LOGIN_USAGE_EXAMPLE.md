# Redux Login Integration - Usage Example

This document demonstrates how to use the complete Redux-Saga login integration in your React Native project.

## File Structure

```
src/
  app/
    api/
      auth.js          # API functions
    reducers/
      auth.js          # Auth reducer
      index.js         # Root reducer
    sagas/
      auth.js          # Auth sagas
      index.js         # Root saga
    actions.js         # Action types and creators
  screens/
    auth/
      Login.js         # Login screen
```

## API Integration (`src/app/api/auth.js`)

The API function handles the HTTP request to your login endpoint:

```javascript
export async function userLogin({ email, password }) {
    const BASE_URL = 'http://10.0.2.2:8000';
    const options = {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
    };

    const response = await fetch(BASE_URL + '/api/login', options);
    
    if (response.ok) {
        const data = await response.json();
        return data; // { token: "", user: {} }
    } else {
        throw new Error('Login failed');
    }
}
```

## Redux Actions (`src/app/actions.js`)

Action types and creators for the login flow:

```javascript
export const USER_LOGIN = 'USER_LOGIN';
export const USER_LOGIN_REQUEST = 'USER_LOGIN_REQUEST';
export const USER_LOGIN_COMPLETE = 'USER_LOGIN_COMPLETE';
export const USER_LOGIN_ERROR = 'USER_LOGIN_ERROR';
export const RESET_USER_LOGIN = 'RESET_USER_LOGIN';

export const authLogin = payload => ({
  type: USER_LOGIN,
  payload,
});

export const authLogout = () => ({
  type: RESET_USER_LOGIN,
});
```

## Redux Saga (`src/app/sagas/auth.js`)

The saga handles the async login flow:

```javascript
import { takeLatest, call, put } from 'redux-saga/effects';
import { USER_LOGIN, USER_LOGIN_REQUEST, USER_LOGIN_COMPLETE, USER_LOGIN_ERROR } from '../actions';
import { userLogin as userLoginApi } from '../api/auth';

export function* userLoginAsync(action) {
  try {
    yield put({ type: USER_LOGIN_REQUEST });
    const data = yield call(userLoginApi, action.payload);
    yield put({
      type: USER_LOGIN_COMPLETE,
      payload: data,
    });
  } catch (error) {
    yield put({
      type: USER_LOGIN_ERROR,
      error: error?.message || 'Login failed',
    });
  }
}

export function* userLogin() {
  yield takeLatest(USER_LOGIN, userLoginAsync);
}
```

## Auth Reducer (`src/app/reducers/auth.js`)

The reducer manages the auth state:

```javascript
const INITIALSTATE = {
  data: null,        // { token: "", user: {} }
  isLoading: false,
  isError: false,
  error: null,
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

    case RESET_USER_LOGIN:
      return INITIALSTATE;

    default:
      return state;
  }
}
```

## Login Screen Usage (`src/screens/auth/Login.js`)

Example of how to use the login functionality in a component:

```javascript
import { useState, useEffect } from 'react';
import { Alert, Text } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { authLogin } from '../../app/actions';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const dispatch = useDispatch();
    
    const { isLoading, isError, error, data } = useSelector(state => state.auth);

    // Handle successful login
    useEffect(() => {
        if (data && data.token) {
            Alert.alert('Success', 'Login successful!');
            // Navigate to home screen
            // navigation.navigate('Home');
        }
    }, [data]);

    const handleLogin = () => {
        if (!email || !password) {
            Alert.alert('Error', 'Please enter email and password');
            return;
        }
        
        dispatch(authLogin({ email, password }));
    };

    return (
        <View>
            {/* Email and password inputs */}
            
            <Button 
                title={isLoading ? "Signing in..." : "Log in"}
                onPress={handleLogin}
                disabled={isLoading}
            />
            
            {isError && (
                <Text style={{ color: 'red' }}>{error}</Text>
            )}
        </View>
    );
};
```

## Store Setup

Make sure your Redux store is configured with the saga middleware and reducers:

```javascript
import { createStore, applyMiddleware } from 'redux';
import createSagaMiddleware from 'redux-saga';
import { persistReducer, persistStore } from 'redux-persist';
import AsyncStorage from '@react-native-async-storage/async-storage';

import rootReducer from './reducers';
import rootSaga from './sagas';

const sagaMiddleware = createSagaMiddleware();

const store = createStore(
  persistReducer(persistConfig, rootReducer),
  applyMiddleware(sagaMiddleware)
);

sagaMiddleware.run(rootSaga);

export default store;
```

## Usage Summary

1. **Dispatch login action**: `dispatch(authLogin({ email, password }))`
2. **Saga intercepts**: Takes the action and calls the API
3. **API call**: Makes HTTP request to your login endpoint
4. **Update state**: Dispatches success or error actions
5. **UI updates**: Component responds to state changes with loading/error states

The system handles:
- ✅ Loading states during API calls
- ✅ Error handling and display
- ✅ Success state management
- ✅ Token and user data storage
- ✅ Redux persistence with AsyncStorage

## API Response Format

Your login API should return:

```json
{
  "token": "jwt_token_here",
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com"
  }
}
```

The token and user data will be stored in the Redux state and automatically persisted to AsyncStorage.
