import { formatPrice } from './product';

export function getCartItemCount(items) {
    return (items || []).reduce((sum, item) => sum + item.quantity, 0);
}

export function getCartSubtotal(items) {
    return (items || []).reduce((sum, item) => sum + item.price * item.quantity, 0);
}

export function getLineTotal(item) {
    return item.price * item.quantity;
}

function buildCartLines(items) {
    return items.map(
        (item, i) =>
            `${i + 1}. ${item.name} × ${item.quantity} — ${formatPrice(getLineTotal(item))}`,
    );
}

export function buildCartInquiryMessage(items) {
    if (!items?.length) {
        return '';
    }
    const total = formatPrice(getCartSubtotal(items));
    return `I would like to inquire about the following items:\n\n${buildCartLines(items).join('\n')}\n\nEstimated total: ${total}\n\n`;
}

export function buildCartOrderMessage(items, { notes, phone } = {}) {
    if (!items?.length) {
        return '';
    }
    const total = formatPrice(getCartSubtotal(items));
    let message = `ORDER REQUEST (mobile app)\n\n${buildCartLines(items).join('\n')}\n\nEstimated total: ${total}`;
    if (phone?.trim()) {
        message += `\nPhone: ${phone.trim()}`;
    }
    if (notes?.trim()) {
        message += `\n\nNotes:\n${notes.trim()}`;
    }
    return message;
}
