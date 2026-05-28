import { apiRequest } from './client';
import { logApi } from '../../config/apiLogger';
import { normalizeProduct, normalizeProducts } from '../../utils/product';

export function normalizeList(data) {
    if (Array.isArray(data)) {
        return data;
    }
    if (Array.isArray(data?.data)) {
        return data.data;
    }
    if (Array.isArray(data?.['hydra:member'])) {
        return data['hydra:member'];
    }
    if (Array.isArray(data?.member)) {
        return data.member;
    }
    return [];
}

export async function fetchProducts(categoryId = null) {
    const cacheBust = `_t=${Date.now()}`;
    const path =
        categoryId != null
            ? `/api/mobile/products?categoryId=${categoryId}&${cacheBust}`
            : `/api/mobile/products?${cacheBust}`;

    const data = await apiRequest(path);
    const rawList = normalizeList(data);
    const products = normalizeProducts(rawList);

    logApi('products parsed', {
        rawCount: rawList.length,
        parsedCount: products.length,
        names: products.map(p => p.name).slice(0, 8),
    });

    return products;
}

export async function fetchProductById(id) {
    const data = await apiRequest(`/api/mobile/products/${id}?_t=${Date.now()}`);
    const raw = data?.data ?? data;
    const product = normalizeProduct(raw);
    logApi('product detail', { id, name: product?.name });
    return product;
}

export async function fetchCategories() {
    const data = await apiRequest(`/api/mobile/categories?_t=${Date.now()}`);
    const list = normalizeList(data);
    logApi('categories parsed', { count: list.length });
    return list;
}
