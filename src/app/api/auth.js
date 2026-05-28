import { apiRequest } from './client';

export async function userLogin({ email, password }) {
    return apiRequest('/api/login', {
        method: 'POST',
        body: { email, password },
    });
}

export async function userRegister({ name, email, username, password }) {
    return apiRequest('/api/register', {
        method: 'POST',
        body: { name, email, username, password },
    });
}
