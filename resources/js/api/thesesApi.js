import axios from 'axios';

/**
 * Management API for thesis records
 */
const thesesApi = {
    /**
     * Fetch all theses (admin/reviewer view)
     */
    getAll: async (config = {}) => {
        try {
            const response = await axios.get('/api/theses', config);
            return response.data.data || response.data;
        } catch (error) {
            console.error('API Error: thesesApi.getAll', error);
            throw error;
        }
    },

    /**
     * Create a new thesis record
     * @param {FormData} formData 
     */
    create: async (formData) => {
        try {
            const config = { 
                headers: { 'Content-Type': 'multipart/form-data' },
                // Allow longer timeout for file uploads
                timeout: 120000,
                useLoader: true 
            };
            const response = await axios.post('/api/theses', formData, config);
            return response.data;
        } catch (error) {
            console.error('API Error: thesesApi.create', error);
            throw error;
        }
    },

    /**
     * Update an existing thesis record
     * @param {number|string} id 
     * @param {FormData} formData 
     */
    update: async (id, formData) => {
        try {
            const config = { 
                headers: { 'Content-Type': 'multipart/form-data' },
                timeout: 120000,
                useLoader: true
            };
            // Use POST with _method=PUT for multipart/form-data compatibility with Laravel
            if (formData instanceof FormData && !formData.has('_method')) {
                formData.append('_method', 'PUT');
            }
            const response = await axios.post(`/api/theses/${id}`, formData, config);
            return response.data;
        } catch (error) {
            console.error('API Error: thesesApi.update', error);
            throw error;
        }
    },

    /**
     * Delete a thesis record
     * @param {number|string} id 
     */
    delete: async (id) => {
        try {
            const response = await axios.delete(`/api/theses/${id}`);
            return response.data;
        } catch (error) {
            console.error('API Error: thesesApi.delete', error);
            throw error;
        }
    }
};

export default thesesApi;
