export const ORDER_STATUSES = [
    { key: 'pending', label: 'Pending' },
    { key: 'confirmed', label: 'Confirmed' },
    { key: 'preparing', label: 'Preparing' },
    { key: 'out_for_delivery', label: 'Out for Delivery' },
    { key: 'delivered', label: 'Delivered' },
    { key: 'cancelled', label: 'Cancelled' },
    { key: 'processing', label: 'Processing' },
];

export function getOrderStatusLabel(status) {
    const found = ORDER_STATUSES.find(s => s.key === status);
    return found?.label ?? status ?? 'Unknown';
}

export function getOrderStatusIndex(status) {
    const keys = ['pending', 'confirmed', 'preparing', 'out_for_delivery', 'delivered'];
    const idx = keys.indexOf(status);
    return idx >= 0 ? idx : 0;
}
