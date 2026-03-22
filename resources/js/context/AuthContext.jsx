import React, { createContext, useContext, useState, useEffect } from 'react';
import { Spin } from 'antd';
import { getUserArg, logoutArg } from '../private/api/auth';

const AuthContext = createContext();

export const AuthProvider = ({ children, initialUser = undefined }) => {
    const [user, _setUser] = useState(null);
    const [loading, _setLoading] = useState(true);

    const setUser = (val) => {
        console.log('[DEBUG-AUTH-STATE] setUser called with:', val?.role?.slug || 'Guest');
        _setUser(val);
    };
    const setLoading = (val) => {
        console.log('[DEBUG-AUTH-STATE] setLoading:', val);
        _setLoading(val);
    };

    const checkAuth = async (initialUser = undefined) => {
        console.log('[DEBUG-AUTH] checkAuth called. initialUser:', !!initialUser);
        if (initialUser !== undefined) {
            console.log('[DEBUG-AUTH] Using initialUser:', initialUser?.role?.slug || 'Guest');
            if (initialUser === null) {
                setUser({ role: { slug: 'anonymous', title: 'Guest' }, name: 'Guest' });
            } else {
                setUser(initialUser);
            }
            setLoading(false);
            return;
        }

        try {
            console.log('[DEBUG-AUTH] Fetching user from API...');
            const response = await getUserArg().catch(() => null);
            if (response && response.data) {
                console.log('[DEBUG-AUTH] API User verified:', response.data.role?.slug);
                setUser(response.data);
            } else {
                console.log('[DEBUG-AUTH] API check failed, setting Guest.');
                setUser({ role: { slug: 'anonymous', title: 'Guest' }, name: 'Guest' });
            }
        } catch (error) {
            console.error('[DEBUG-AUTH] checkAuth error:', error);
            setUser({ role: { slug: 'anonymous', title: 'Guest' }, name: 'Guest' });
        } finally {
            setLoading(false);
        }
    };


    useEffect(() => {
        checkAuth(initialUser);
    }, [initialUser]);

    const login = React.useCallback((userData) => {
        setUser(userData);
    }, []);

    const logout = React.useCallback(async () => {
        try {
            await logoutArg();
        } catch (error) {
            console.error('Logout failed', error);
        } finally {
            setUser(null);
            window.location.href = '/login';
        }
    }, []);

    const contextValue = React.useMemo(() => ({
        user, login, logout, checkAuth, loading
    }), [user, loading, login, logout]);

    return (
        <AuthContext.Provider value={contextValue}>
            {!loading ? children : (
                <div style={{ height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <Spin size="large" />
                </div>
            )}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
