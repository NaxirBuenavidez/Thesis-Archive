import React, { useEffect, useRef } from 'react';
import { useAuth } from '../../context/AuthContext';
import { sessionCache } from '../../utils/sessionCache';
import publicApi from '../../api/publicApi';
import thesesApi from '../../api/thesesApi';

/**
 * DataPreloader proactively fetches all essential application data once 
 * the user is authenticated, storing it in the sessionCache for immediate 
 * access by all modules.
 */
const DataPreloader = () => {
    const { user } = useAuth();
    const hasPreloaded = useRef(false);

    useEffect(() => {
        // Only preload for authenticated users (not guests)
        if (!user || user.role?.slug === 'anonymous') {
            hasPreloaded.current = false;
            return;
        }

        // Avoid redundant preloading if already done in this session
        if (hasPreloaded.current) return;

        const preloadData = async () => {
            hasPreloaded.current = true;
            try {
                const config = { silent: true };
                
                // Fetch all data in parallel
                await Promise.allSettled([
                    // Dashboard Analytics
                    window.axios.get('/api/dashboard/analytics', config).then(res => {
                        sessionCache.set('dashboard_analytics', res.data);
                    }),
                    
                    // Theses (Management & Review)
                    thesesApi.getAll(config).then(res => {
                        sessionCache.set('management_theses', res);
                        sessionCache.set('review_theses', res);
                    }),
                    
                    // Public Repository Theses
                    publicApi.getTheses(true, config).then(res => {
                        sessionCache.set('repository_theses', res);
                        sessionCache.set('public_theses', res);
                    }),
                    
                    // Users and Roles
                    window.axios.get('/api/users', config).then(res => {
                        sessionCache.set('users_list', res.data.data || res.data);
                    }),
                    
                    window.axios.get('/api/roles', config).then(res => {
                        sessionCache.set('users_roles', res.data.data || res.data);
                    })
                ]);
                
                console.log('[SYSTEM] Initial data pre-loaded successfully.');
            } catch (err) {
                console.error('[SYSTEM] Data preloading error:', err);
                hasPreloaded.current = false; // Allow retry on failure
            }
        };

        preloadData();
    }, [user]);

    return null;
};

export default DataPreloader;
