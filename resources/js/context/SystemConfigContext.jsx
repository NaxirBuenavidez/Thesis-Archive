import React, { createContext, useContext, useState, useEffect } from 'react';

const SystemConfigContext = createContext();

export function SystemConfigProvider({ children }) {
    const [settings, setSettings] = useState({
        primary_color: import.meta.env.VITE_COLOR_PRIMARY || '#2845D6',
        primary_color_dark: import.meta.env.VITE_COLOR_PRIMARY_DARK || '#1A2CA3',
        site_title: 'THESIS ARCHIVE SYSTEM',
        site_description: 'PHILIPPINE ELECTRONICS & COMMUNICATION INSTITUTE OF TECHNOLOGY',
        logo_path: null
    });
    const [loading, setLoading] = useState(true);

    const fetchSettings = async (initialData = null) => {
        if (initialData) {
            setSettings(prev => ({
                ...prev,
                primary_color: initialData.primary_color || prev.primary_color,
                primary_color_dark: initialData.primary_color_dark || prev.primary_color_dark,
                site_title: initialData.site_title || prev.site_title,
                site_description: initialData.site_description || prev.site_description,
                logo_path: initialData.logo_path || prev.logo_path
            }));
            setLoading(false);
            return;
        }

        try {
            const response = await window.axios.get('/api/settings');
            const data = response.data;
            
            // Only update if keys exist in DB
            setSettings(prev => ({
                ...prev,
                primary_color: data.primary_color || prev.primary_color,
                primary_color_dark: data.primary_color_dark || prev.primary_color_dark,
                site_title: data.site_title || prev.site_title,
                site_description: data.site_description || prev.site_description,
                logo_path: data.logo_path || prev.logo_path
            }));
        } catch (error) {
            console.error('Failed to load system settings', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSettings(initialData);
    }, [initialData]);

    // We can conditionally render children only after loading, but since branding shouldn't 
    // block the initial paint entirely, we allow it to render with defaults while fetching.
    return (
        <SystemConfigContext.Provider value={{ ...settings, loading, refreshSettings: fetchSettings }}>
            {children}
        </SystemConfigContext.Provider>
    );
}

export function useSystemConfig() {
    return useContext(SystemConfigContext);
}
