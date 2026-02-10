import axios from 'axios';

// Since we can't easily use hooks (useLoading) inside standard JS functions 
// without passing them in, we might need a different approach for "every process".
// However, typically we set up axios interceptors in a component or a setup file that has access to the provider.
// But `auth.js` is a static service. 
// A common pattern is to export a setup function or events.

// For simplicity and "realtime" requirement, let's assume we trigger it manually in components 
// OR we use a global event bus that the LoadingContext listens to.
// Let's iterate: modifying bootstrap.js to dispatch events is cleaner for "every process".

export const loginArg = (credentials) => {
    return axios.post('/login', credentials);
};

export const logoutArg = () => {
    return axios.post('/logout');
};

export const getUserArg = () => {
    return axios.get('/api/user');
};
