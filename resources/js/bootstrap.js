import axios from 'axios';
window.axios = axios;

window.axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';
window.axios.defaults.headers.common['Accept'] = 'application/json';
window.axios.defaults.withCredentials = true;      // Send cookies (session + XSRF) cross-port in dev
window.axios.defaults.withXSRFToken   = true;      // Auto-attach XSRF-TOKEN cookie as X-XSRF-TOKEN header
window.axios.defaults.timeout = 30000;             // 30s global timeout to prevent indefinite XHR loading

// XSRF Token Handling
// We rely on withXSRFToken: true above to automatically attach the X-XSRF-TOKEN header from the cookie
// This is more reliable for SPAs than the static meta tag, which can become stale.

// Dispatch loading events so GlobalLoader shows/hides ONLY when explicitly requested via 'useLoader: true'

window.axios.interceptors.request.use(
    config => {
        if (config.useLoader) {
            window.dispatchEvent(new Event('loading-start'));
        }
        return config;
    },
    error => {
        // We only stop if the original config wanted the loader
        if (error.config?.useLoader) {
            window.dispatchEvent(new Event('loading-stop'));
        }
        return Promise.reject(error);
    }
);

window.axios.interceptors.response.use(
    response => {
        if (response.config.useLoader) {
            window.dispatchEvent(new Event('loading-stop'));
        }
        return response;
    },
    error => {
        if (error.config?.useLoader) {
            window.dispatchEvent(new Event('loading-stop'));
        }

        const originalRequest = error.config;

        // Handle CSRF Token Mismatch (419) with a single retry
        if (error.response && error.response.status === 419 && !originalRequest._retry) {
            originalRequest._retry = true;
            return axios.get('/sanctum/csrf-cookie', { silent: originalRequest.silent }).then(() => {
                return axios(originalRequest);
            });
        }

        if (error.code === 'ECONNABORTED' && error.message.includes('timeout')) {
            window.dispatchEvent(new CustomEvent('system-connection-error', { detail: { type: 'timeout' } }));
        }

        if (!error.response && error.code === 'ERR_NETWORK') {
            window.dispatchEvent(new CustomEvent('system-connection-error', { detail: { type: 'offline' } }));
        }

        if (error.response && error.response.status === 401) {
            const publicPaths = ['/login', '/archive'];
            // Normalize path (case-insensitive and trailing slash) for comparison
            const currentPath = window.location.pathname.toLowerCase().replace(/\/$/, '') || '/';
            
            if (!publicPaths.includes(currentPath)) {
                window.location.href = '/login';
            }
        }
        return Promise.reject(error);
    }
);

