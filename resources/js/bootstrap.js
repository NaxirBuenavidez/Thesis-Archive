import axios from 'axios';
window.axios = axios;

window.axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';

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
            // If the user is unauthenticated or session expired, redirect to login
            // But verify we are not already on the login page to avoid loops
            if (window.location.pathname !== '/login') {
                window.location.href = '/login';
            }
        }
        return Promise.reject(error);
    }
);
