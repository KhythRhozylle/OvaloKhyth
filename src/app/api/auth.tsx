export interface LoginCredentials {
  username: string;
  password: string;
}

export interface RegisterCredentials {
  name: string;
  username: string;
  password: string;
}

export interface User {
  id: number;
  name: string;
  email: string;
  username?: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface ApiError {
  errors?: {
    password?: string;
    username?: string;
    detail?: string;
  };
  detail?: string;
}

export async function userLogin({ username, password }: LoginCredentials): Promise<AuthResponse> {
  const BASE_URL = 'http://127.0.0.1:8000';

  console.log('🔍 Login API call to:', BASE_URL + '/api/login');
  console.log('📧 Username:', username);

  const options: RequestInit = {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ username, password }),
  };

  try {
    const response = await fetch(BASE_URL + '/api/login', options);

    console.log('📡 Response status:', response.status);
    console.log('📡 Response ok:', response.ok);

    let data: AuthResponse | ApiError | null;
    try {
      data = await response.json();
      console.log('📄 Response data:', data);
    } catch (e) {
      console.log('❌ JSON parse error:', e);
      data = null;
    }

    if (response.ok) {
      console.log('✅ Login success response:', data);
      return data as AuthResponse;
    } else {
      const message =
        (data && ((data as ApiError).errors?.password || (data as ApiError).errors?.detail || (data as ApiError).detail)) ||
        'Login failed';
      console.log('❌ Login error:', message);
      throw new Error(message);
    }
  } catch (error) {
    console.log('🚨 Network error:', error);
    throw new Error('Network request failed. Please check your connection and server.');
  }
}

export async function userRegister({ name, username, password }: RegisterCredentials): Promise<AuthResponse> {
  const BASE_URL = 'http://127.0.0.1:8000';

  console.log('🔍 Register API call to:', BASE_URL + '/api/register');
  console.log('📧 Username:', username);
  console.log('👤 Name:', name);

  const options: RequestInit = {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ name, username, password }),
  };

  try {
    const response = await fetch(BASE_URL + '/api/register', options);

    console.log('📡 Response status:', response.status);
    console.log('📡 Response ok:', response.ok);

    let data: AuthResponse | ApiError | null;
    try {
      data = await response.json();
      console.log('📄 Response data:', data);
    } catch (e) {
      console.log('❌ JSON parse error:', e);
      data = null;
    }

    if (response.ok) {
      console.log('✅ Registration success response:', data);
      return data as AuthResponse;
    } else {
      const message =
        (data && ((data as ApiError).errors?.username || (data as ApiError).errors?.password || (data as ApiError).errors?.detail || (data as ApiError).detail)) ||
        'Registration failed';
      console.log('❌ Registration error:', message);
      throw new Error(message);
    }
  } catch (error) {
    console.log('🚨 Network error:', error);
    throw new Error('Network request failed. Please check your connection and server.');
  }
}
