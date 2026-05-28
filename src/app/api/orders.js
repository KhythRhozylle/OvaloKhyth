import { apiRequest } from './client';

export async function placeOrder({ customer, items }) {
    return apiRequest('/api/mobile/orders', {
        method: 'POST',
        body: { customer, items },
    });
}

export async function fetchOrdersByEmail(email) {
    const encoded = encodeURIComponent(email.trim().toLowerCase());
    return apiRequest(`/api/mobile/orders?email=${encoded}&_t=${Date.now()}`);
}

export async function fetchOrderByGroupId(orderGroupId, email) {
    const encoded = encodeURIComponent(email.trim().toLowerCase());
    return apiRequest(
        `/api/mobile/orders/${orderGroupId}?email=${encoded}&_t=${Date.now()}`,
    );
}

export async function submitOrderPayment({
    orderGroupId,
    email,
    paymentMethod,
    referenceNumber,
    proofFile,
}) {
    const formData = new FormData();
    formData.append('email', (email || '').trim().toLowerCase());
    formData.append('payment_method', paymentMethod);
    if (referenceNumber) {
        formData.append('reference_number', referenceNumber);
    }
    if (proofFile) {
        formData.append('payment_proof', {
            uri: proofFile.uri,
            name: proofFile.name || 'payment-proof.jpg',
            type: proofFile.type || 'image/jpeg',
        });
    }
    const groupId = encodeURIComponent(String(orderGroupId).trim());
    return apiRequest(`/api/mobile/orders/${groupId}/payment`, {
        method: 'POST',
        formData,
        headers: {
            // Let fetch set multipart boundary automatically
        },
    });
}
