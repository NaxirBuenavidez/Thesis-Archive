import axios from 'axios';

/**
 * Public API for digital archive
 */
let thesisCache = {
    data: null,
    timestamp: 0
};
const CACHE_TTL = 1000 * 60 * 2; // 2 minutes cache for public listing

const publicApi = {
    /**
     * Fetch all public theses (cached)
     */
    getTheses: async (forceRefresh = false) => {
        const now = Date.now();
        if (!forceRefresh && thesisCache.data && (now - thesisCache.timestamp < CACHE_TTL)) {
            return thesisCache.data;
        }

        const response = await axios.get('/api/public/theses');
        let results = [];
        if (Array.isArray(response.data)) {
            results = response.data;
        } else if (response.data && Array.isArray(response.data.data)) {
            results = response.data.data;
        }
        
        thesisCache = { data: results, timestamp: now };
        return results;
    },

    /**
     * Get specific thesis by ID 
     */
    getThesisById: async (id) => {
        const response = await axios.get(`/api/public/theses/${id}`);
        return response.data;
    }
};

export default publicApi;
