import { getProductImageUrl } from '../config/api';

export function normalizeProduct(raw) {
    if (!raw) {
        return null;
    }
    const stock =
        raw.stock !== undefined && raw.stock !== null
            ? Number(raw.stock)
            : raw.inStock === false
              ? 0
              : null;
    return {
        id: raw.id,
        name: raw.name || '',
        price: Number(raw.price) || 0,
        description: raw.description || '',
        image: raw.image || null,
        stock,
        inStock: stock !== null ? stock > 0 : raw.inStock !== false,
        category: raw.category || null,
        categoryId: raw.categoryId ?? null,
    };
}

export function normalizeProducts(list) {
    return (list || []).map(normalizeProduct).filter(Boolean);
}

export function formatPrice(price) {
    const num = Number(price);
    if (Number.isNaN(num)) {
        return `₱${price}`;
    }
    return `₱${num.toLocaleString('en-PH', { minimumFractionDigits: 0, maximumFractionDigits: 2 })}`;
}

export function getStockLabel(product) {
    const stock = product?.stock;
    if (stock === undefined || stock === null) {
        return product?.inStock === false ? 'Out of stock' : 'In stock';
    }
    if (stock <= 0) {
        return 'Out of stock';
    }
    if (stock <= 5) {
        return 'Low stock';
    }
    return 'In stock';
}

export function isInStock(product) {
    if (product?.stock !== undefined && product?.stock !== null) {
        return product.stock > 0;
    }
    return product?.inStock !== false;
}

export function getProductImage(product) {
    return getProductImageUrl(product?.image);
}

export function filterProducts(
    products,
    { search = '', categoryId = null, inStockOnly = false } = {},
) {
    let list = [...(products || [])];
    if (categoryId != null && categoryId !== '') {
        list = list.filter(p => String(p.categoryId) === String(categoryId));
    }
    if (inStockOnly) {
        list = list.filter(isInStock);
    }
    const q = search.trim().toLowerCase();
    if (q) {
        list = list.filter(
            p =>
                (p.name || '').toLowerCase().includes(q) ||
                (p.description || '').toLowerCase().includes(q) ||
                (p.category || '').toLowerCase().includes(q),
        );
    }
    return list;
}

export function sortProducts(products, sortBy = 'popular') {
    const list = [...(products || [])];
    switch (sortBy) {
        case 'price_asc':
            return list.sort((a, b) => a.price - b.price);
        case 'price_desc':
            return list.sort((a, b) => b.price - a.price);
        case 'name':
            return list.sort((a, b) => (a.name || '').localeCompare(b.name || ''));
        default:
            return list.sort((a, b) => (b.stock ?? 0) - (a.stock ?? 0));
    }
}

export function getProductsByCategory(products, categoryId) {
    return filterProducts(products, { categoryId });
}
