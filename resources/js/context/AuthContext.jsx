import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { Spin } from 'antd';
import { getUserArg, logoutArg } from '../private/api/auth';

const AuthContext = createContext();

export const AuthProvider = ({ children, initialUser = undefined }) => {
    const [user, _setUser] = useState(null);
    const [loading, _setLoading] = useState(true);

    const setUser = (val) => {
        _setUser(val);
    };
    const setLoading = (val) => {
        _setLoading(val);
    };

    const checkAuth = async (initialUser = undefined) => {
        if (initialUser !== undefined) {
            if (initialUser === null) {
                setUser({ role: { slug: 'anonymous', title: 'Guest' }, name: 'Guest' });
            } else {
                setUser(initialUser);
            }
            setLoading(false);
            return;
        }

        try {
            const response = await getUserArg().catch(() => null);
            if (response && response.data) {
                setUser(response.data);
            } else {
                setUser({ role: { slug: 'anonymous', title: 'Guest' }, name: 'Guest' });
            }
        } catch (error) {
            console.error('[DEBUG-AUTH] checkAuth error:', error);
            setUser({ role: { slug: 'anonymous', title: 'Guest' }, name: 'Guest' });
        } finally {
            setLoading(false);
        }
    };


    const lastInitialUserRef = useRef(null);

    useEffect(() => {
        const currentUserStr = JSON.stringify(initialUser);
        if (currentUserStr === lastInitialUserRef.current) {
            return;
        }
        lastInitialUserRef.current = currentUserStr;
        checkAuth(initialUser);
    }, [initialUser, checkAuth]);

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
