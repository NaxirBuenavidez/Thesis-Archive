import axios from 'axios';
window.axios = axios;

window.axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';
window.axios.defaults.headers.common['Accept'] = 'application/json';
window.axios.defaults.withCredentials = true;      // Send cookies (session + XSRF) cross-port in dev
window.axios.defaults.withXSRFToken   = true;      // Auto-attach XSRF-TOKEN cookie as X-XSRF-TOKEN header
window.axios.defaults.timeout = 30000;             // 30s global timeout to prevent indefinite XHR loading

/**
 * reliable CSRF token implementation
 */
const token = document.head.querySelector('meta[name="csrf-token"]');

if (token) {
    window.axios.defaults.headers.common['X-CSRF-TOKEN'] = token.content;
} else {
    console.error('CSRF token not found: https://laravel.com/docs/csrf#csrf-x-csrf-token');
}

// Dispatch loading events so GlobalLoader shows/hides on network activity
window.axios.interceptors.request.use(
    config => {
        if (!config.silent) {
            window.dispatchEvent(new Event('loading-start'));
        }
        return config;
    },
    error => {
        window.dispatchEvent(new Event('loading-stop'));
        return Promise.reject(error);
    }
);

window.axios.interceptors.response.use(
    response => {
        if (!response.config.silent) {
            window.dispatchEvent(new Event('loading-stop'));
        }
        return response;
    },
    error => {
        window.dispatchEvent(new Event('loading-stop'));

        const originalRequest = error.config;

        // Handle CSRF Token Mismatch (419) with a single retry
        if (error.response && error.response.status === 419 && !originalRequest._retry) {
            originalRequest._retry = true;
            return axios.get('/sanctum/csrf-cookie', { silent: originalRequest.silent }).then(() => {
                return axios(originalRequest);
            });
        }

        if (error.code === 'ECONNABORTED' && error.message.includes('timeout')) {
            console.error('Network Request Timeout: The server took too long to respond.');
            // Optional: Dispatch a global timeout notification if needed
        }

        if (error.response && (error.response.status === 401)) {
            const publicPaths = ['/login', '/archive'];
            if (!publicPaths.includes(window.location.pathname)) {
                window.location.href = '/login';
            }
        }
        return Promise.reject(error);
    }
);

