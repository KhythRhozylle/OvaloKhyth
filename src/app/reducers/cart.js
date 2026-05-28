import {
    CART_ADD_ITEM,
    CART_CLEAR,
    CART_REMOVE_ITEM,
    CART_UPDATE_QUANTITY,
} from '../actions';
import { normalizeProduct } from '../../utils/product';

const initialState = {
    items: [],
};

function toLine(product) {
    const p = normalizeProduct(product);
    return {
        productId: p.id,
        name: p.name,
        price: p.price,
        image: p.image,
        stock: p.stock,
        category: p.category,
    };
}

function maxQty(stock) {
    if (stock === null || stock === undefined) {
        return 99;
    }
    return Math.max(0, Number(stock));
}

export default (state = initialState, action) => {
    switch (action.type) {
        case CART_ADD_ITEM: {
            const line = toLine(action.payload);
            const cap = maxQty(line.stock);
            if (cap <= 0) {
                return state;
            }
            const idx = state.items.findIndex(i => i.productId === line.productId);
            if (idx >= 0) {
                const items = [...state.items];
                items[idx] = {
                    ...items[idx],
                    quantity: Math.min(items[idx].quantity + 1, cap),
                };
                return { items };
            }
            return {
                items: [...state.items, { ...line, quantity: 1 }],
            };
        }
        case CART_UPDATE_QUANTITY: {
            const { productId, quantity } = action.payload;
            const items = state.items
                .map(item => {
                    if (item.productId !== productId) {
                        return item;
                    }
                    const cap = maxQty(item.stock);
                    const qty = Math.max(0, Math.min(quantity, cap));
                    return qty > 0 ? { ...item, quantity: qty } : null;
                })
                .filter(Boolean);
            return { items };
        }
        case CART_REMOVE_ITEM:
            return {
                items: state.items.filter(i => i.productId !== action.payload.productId),
            };
        case CART_CLEAR:
            return initialState;
        default:
            return state;
    }
};
