import { getApiBaseUrl, isProductionTarget } from '../../config/api';
import { logApi } from '../../config/apiLogger';
import { loadDevApiBaseUrl, resetDevApiBaseUrl } from '../../config/devApiBase';

async function ensureDevApiReady() {
    if (typeof __DEV__ !== 'undefined' && __DEV__) {
        await loadDevApiBaseUrl();
    }
}

export async function apiRequest(path, options = {}) {
    const { method = 'GET', body, formData, token, headers = {} } = options;

    const requestHeaders = {
        Accept: 'application/json',
        ...headers,
    };

    if (body !== undefined && formData === undefined) {
        requestHeaders['Content-Type'] = 'application/json';
    }

    if (token) {
        requestHeaders.Authorization = `Bearer ${token}`;
    }

    await ensureDevApiReady();

    async function doFetch(basePath) {
        const baseUrl = getApiBaseUrl();
        const requestUrl = `${baseUrl}${basePath}`;
        logApi(`${method} ${requestUrl}`, body ? { bodyKeys: Object.keys(body) } : undefined);

        const response = await fetch(requestUrl, {
            method,
            headers: requestHeaders,
            body:
                formData !== undefined
                    ? formData
                    : body !== undefined
                      ? JSON.stringify(body)
                      : undefined,
        });

        const text = await response.text();
        let data = null;
        if (text) {
            try {
                data = JSON.parse(text);
            } catch {
                data = { message: text.slice(0, 200) };
            }
        }

        logApi(`response ${response.status}`, {
            url: requestUrl,
            ok: response.ok,
            preview: Array.isArray(data?.data)
                ? `${data.data.length} items`
                : data?.count != null
                  ? `count=${data.count}`
                  : data?.status,
        });

        if (!response.ok) {
            const violationMsg = data?.violations?.[0]?.message;
            const flatErrors = Object.values(data?.errors || {})
                .flat()
                .filter(Boolean)[0];
            let message =
                data?.message ||
                violationMsg ||
                (typeof data?.detail === 'string' ? data.detail : null) ||
                data?.error ||
                (typeof data?.errors === 'string' ? data.errors : null) ||
                flatErrors;

            if (!message && response.status === 404) {
                message =
                    'Payment service not found. Restart the Symfony server and deploy the latest backend.';
            }

            if (!message) {
                message = `Request failed (${response.status})`;
            }
            const error = new Error(message);
            error.status = response.status;
            error.data = data;
            throw error;
        }

        return data;
    }

    try {
        return await doFetch(path);
    } catch (networkError) {
        if (networkError.status) {
            throw networkError;
        }

        if (typeof __DEV__ !== 'undefined' && __DEV__ && !isProductionTarget()) {
            await resetDevApiBaseUrl();
            try {
                return await doFetch(path);
            } catch (retryError) {
                if (retryError.status) {
                    throw retryError;
                }
                const err = new Error(
                    `Cannot reach server at ${getApiBaseUrl()}${path}. ` +
                        'Run npm run dev:connect on your PC, then pull to refresh Shop.',
                );
                err.cause = retryError;
                err.isNetworkError = true;
                throw err;
            }
        }

        const hint = isProductionTarget()
            ? 'Check internet connection and Railway deployment.'
            : 'Run npm run dev:connect on your PC.';
        const err = new Error(`Cannot reach server at ${getApiBaseUrl()}${path}. ${hint}`);
        err.cause = networkError;
        err.isNetworkError = true;
        throw err;
    }
}
