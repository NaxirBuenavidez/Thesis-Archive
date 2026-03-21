import axios from 'axios';
window.axios = axios;

window.axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';
window.axios.defaults.withCredentials = true;      // Send cookies (session + XSRF) cross-port in dev
window.axios.defaults.withXSRFToken   = true;      // Auto-attach XSRF-TOKEN cookie as X-XSRF-TOKEN header

/**
 * reliable CSRF token implementation
 */
const token = document.head.querySelector('meta[name="csrf-token"]');

if (token) {
    window.axios.defaults.headers.common['X-CSRF-TOKEN'] = token.content;
} else {
    console.error('CSRF token not found: https://laravel.com/docs/csrf#csrf-x-csrf-token');
}

// Add a request interceptor
window.axios.interceptors.request.use(
    config => {
        window.dispatchEvent(new Event('loading-start'));
        return config;
    },
    error => {
        window.dispatchEvent(new Event('loading-stop'));
        return Promise.reject(error);
    }
);

// Add a response interceptor
window.axios.interceptors.response.use(
    response => {
        window.dispatchEvent(new Event('loading-stop'));
        return response;
    },
    error => {
        window.dispatchEvent(new Event('loading-stop'));
        if (error.response && (error.response.status === 401 || error.response.status === 419)) {
            // Unauthenticated interceptor: Don't redirect if on login or designated public pages
            const publicPaths = ['/', '/archive'];
            if (!publicPaths.includes(window.location.pathname)) {
                window.location.href = '/';
            }
        }
        return Promise.reject(error);
    }
);
