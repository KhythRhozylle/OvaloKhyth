import { apiRequest } from './client';

export async function submitContact({ name, email, message }) {
    return apiRequest('/api/mobile/contact', {
        method: 'POST',
        body: { name, email, message },
    });
}
