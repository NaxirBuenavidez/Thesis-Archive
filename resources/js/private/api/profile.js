import axios from 'axios';

export const updateProfile = async (data) => {
    return await axios.post('/api/profile', data);
};

export const uploadAvatar = async (formData) => {
    return await axios.post('/api/profile/avatar', formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
};

export const updateAccount = async (data) => {
    return await axios.post('/api/profile/account', data);
};

export const verifyPassword = async (password) => {
    return await axios.post('/api/profile/verify-password', { password });
};

// Education API
export const getEducation = async () => {
    return await axios.get('/api/education');
};

export const addEducation = async (data) => {
    return await axios.post('/api/education', data);
};

export const updateEducation = async (id, data) => {
    return await axios.put(`/api/education/${id}`, data);
};

export const deleteEducation = async (id) => {
    return await axios.delete(`/api/education/${id}`);
};
