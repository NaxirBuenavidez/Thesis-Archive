import axios from 'axios';

// Ensure the local axios import uses the defaults we setup in bootstrap
const apiClient = axios;

// Intercept transparent HTML redirects (200 OK but HTML content)
apiClient.interceptors.response.use((response) => {
    if (typeof response.data === 'string' && response.data.includes('<!DOCTYPE html>')) {
        return Promise.reject({ response: { status: 401, data: { message: 'Unauthenticated.' } } });
    }
    return response;
});

export const loginArg = async (credentials) => {
    await apiClient.get('/api/sanctum/csrf-cookie', { headers: { 'Accept': 'application/json' } });
    
    // Credentials already contains email, password, and now captcha_token from the form
    return apiClient.post('/api/login', credentials, { headers: { 'Accept': 'application/json' }, useLoader: true });
};

export const logoutArg = () => {
    return apiClient.post('/api/logout', {}, { headers: { 'Accept': 'application/json' }, useLoader: true });
};

export const getUserArg = () => {
    return apiClient.get('/api/user', { headers: { 'Accept': 'application/json' }, silent: true });
};
