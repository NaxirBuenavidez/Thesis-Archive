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
    await apiClient.get('/sanctum/csrf-cookie', { headers: { 'Accept': 'application/json' } });
    return apiClient.post('/login', credentials, { headers: { 'Accept': 'application/json' } });
};

export const logoutArg = () => {
    return apiClient.post('/logout', {}, { headers: { 'Accept': 'application/json' } });
};

export const getUserArg = () => {
    return apiClient.get('/api/user', { headers: { 'Accept': 'application/json' } });
};
