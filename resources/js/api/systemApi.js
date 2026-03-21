import axios from 'axios';

/**
 * System/Reference Data API (Departments, Programs, Settings)
 */
const CACHE_TTL = 1000 * 60 * 5; // 5 minutes cache
let cache = {
    departments: { data: null, timestamp: 0 },
    programs: { data: null, timestamp: 0 }
};

const systemApi = {
    /**
     * Get all departments (cached)
     */
    getDepartments: async (forceRefresh = false) => {
        const now = Date.now();
        if (!forceRefresh && cache.departments.data && (now - cache.departments.timestamp < CACHE_TTL)) {
            return cache.departments.data;
        }
        
        try {
            const response = await axios.get('/api/departments');
            cache.departments = { data: response.data, timestamp: now };
            return response.data;
        } catch (error) {
            console.error('API Error: getDepartments', error);
            throw error;
        }
    },

    /**
     * Get all programs (cached)
     */
    getPrograms: async (forceRefresh = false) => {
        const now = Date.now();
        if (!forceRefresh && cache.programs.data && (now - cache.programs.timestamp < CACHE_TTL)) {
            return cache.programs.data;
        }

        try {
            const response = await axios.get('/api/programs');
            cache.programs = { data: response.data, timestamp: now };
            return response.data;
        } catch (error) {
            console.error('API Error: getPrograms', error);
            throw error;
        }
    },

    /**
     * Get system settings
     */
    getSettings: async () => {
        const response = await axios.get('/api/settings');
        return response.data;
    }
};

export default systemApi;
