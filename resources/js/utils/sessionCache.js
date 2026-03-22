// Simple client-side cache to prevent "re-loading" flickers during the session.
const cache = new Map();

export const sessionCache = {
    get: (key) => {
        const item = cache.get(key);
        if (!item) return null;
        // Expire after 2 minutes
        if (Date.now() - item.time > 120000) {
            cache.delete(key);
            return null;
        }
        return item.data;
    },
    set: (key, data) => {
        cache.set(key, { data, time: Date.now() });
    },
    clear: () => cache.clear()
};
