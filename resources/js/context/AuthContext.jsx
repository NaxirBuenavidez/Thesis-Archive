import React, { createContext, useContext, useState, useEffect } from 'react';
import { Spin } from 'antd';
import { getUserArg, logoutArg } from '../private/api/auth';

const AuthContext = createContext();

export const AuthProvider = ({ children, initialUser = undefined }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const checkAuth = async (initialUser = undefined) => {
        if (initialUser !== undefined) {
            // If the server explicitly returned no user, we inject our Guest identity
            if (initialUser === null) {
                setUser({ role: { slug: 'anonymous', title: 'Guest' }, name: 'Guest' });
            } else {
                setUser(initialUser);
            }
            setLoading(false);
            return;
        }

        try {
            // We catch the error here, so the 401 is expected if not logged in.
            const response = await getUserArg().catch(() => null);
            if (response && response.data) {
                setUser(response.data);
            } else {
                // Anonymous is the default role if not authenticated
                setUser({ role: { slug: 'anonymous', title: 'Guest' }, name: 'Guest' });
            }
        } catch (error) {
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
