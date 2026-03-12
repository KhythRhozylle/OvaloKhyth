export async function userLogin({ username, password }) {
    const BASE_URL = 'http://127.0.0.1:8000';
    
    console.log('🔍 Login API call to:', BASE_URL + '/api/login');
    console.log('📧 Username:', username);
    
    const options = {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
    };

    try {
        const response = await fetch(
            BASE_URL + '/api/login',
            options,
        );

        console.log('📡 Response status:', response.status);
        console.log('📡 Response ok:', response.ok);

        let data;
        try {
            data = await response.json();
            console.log('📄 Response data:', data);
        } catch (e) {
            console.log('❌ JSON parse error:', e);
            data = null;
        }

        if (response.ok) {
            console.log('✅ Login success response:', data);
            return data;
        } else {
            const message =
                (data && (data.errors?.password || data.errors?.detail || data.detail)) ||
                'Login failed';
            console.log('❌ Login error:', message);
            throw new Error(message);
        }
    } catch (error) {
        console.log('🚨 Network error:', error);
        throw new Error('Network request failed. Please check your connection and server.');
    }
}

export async function userRegister({ name, username, password }) {
    const BASE_URL = 'http://127.0.0.1:8000';
    
    console.log('🔍 Register API call to:', BASE_URL + '/api/register');
    console.log('📧 Username:', username);
    console.log('👤 Name:', name);
    
    const options = {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, username, password }),
    };

    try {
        const response = await fetch(
            BASE_URL + '/api/register',
            options,
        );

        console.log('📡 Response status:', response.status);
        console.log('📡 Response ok:', response.ok);

        let data;
        try {
            data = await response.json();
            console.log('📄 Response data:', data);
        } catch (e) {
            console.log('❌ JSON parse error:', e);
            data = null;
        }

        if (response.ok) {
            console.log('✅ Registration success response:', data);
            return data;
        } else {
            const message =
                (data && (data.errors?.username || data.errors?.password || data.errors?.detail || data.detail)) ||
                'Registration failed';
            console.log('❌ Registration error:', message);
            throw new Error(message);
        }
    } catch (error) {
        console.log('🚨 Network error:', error);
        throw new Error('Network request failed. Please check your connection and server.');
    }
}