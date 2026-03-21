import React, { createContext, useContext, useState, useEffect } from 'react';
import { Spin } from 'antd';
import { getUserArg, logoutArg } from '../private/api/auth';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const checkAuth = async (initialUser = undefined) => {
        if (initialUser !== undefined) {
            setUser(initialUser);
            setLoading(false);
            return;
        }

        try {
            // We catch the error here, so the 401 is expected if not logged in.
            const response = await getUserArg().catch(() => null);
            if (response && response.data) {
                setUser(response.data);
            } else {
                setUser(null);
            }
        } catch (error) {
            setUser(null);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        checkAuth(initialUser);
    }, [initialUser]);

    const login = (userData) => {
        setUser(userData);
    };

    const logout = async () => {
        try {
            await logoutArg();
        } catch (error) {
            console.error('Logout failed', error);
        } finally {
            setUser(null);
            window.location.href = '/login';
        }
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, checkAuth, loading }}>
            {!loading ? children : (
                <div style={{ height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <Spin size="large" />
                </div>
            )}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
