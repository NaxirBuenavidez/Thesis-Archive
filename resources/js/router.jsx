
import React from 'react';
import { createBrowserRouter, Navigate, Outlet } from 'react-router-dom';
import PublicLayout from './public/components/PublicLayout';
import Dashboard from './public/pages/pageDashboard';
import Users from './public/pages/pageUsers';
import Profile from './public/pages/Profile';
import Repository from './public/pages/pageRepository';
import ThesisManagement from './public/pages/pageThesisManagement';
import ReviewManager from './public/pages/pageReviewManager';
import Permissions from './public/pages/SystemSettings/pagePermissions';
import ActivityLog from './public/pages/SystemSettings/pageActivityLog';
import SystemManager from './public/pages/SystemSettings/pageSystemManager';
import Reports from './public/pages/SystemSettings/pageReports';
import Login from './public/pages/pageLogin';
import PublicArchive from './public/pages/pagePublicArchive';
import { AuthProvider, useAuth } from './context/AuthContext';



import GlobalLoader from './public/components/GlobalLoader';

const getNormalizedPath = () => window.location.pathname.replace(/\/$/, '') || '/';

const ProtectedRoute = ({ children }) => {
    const { user, loading } = useAuth();
    const path = getNormalizedPath();
    
    if (loading) return (
        <div style={{ height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', background: '#f0f2f5' }}>
            <div style={{
                width: 48, height: 48, borderRadius: '50%',
                border: '4px solid #e0e4ff',
                borderTop: '4px solid #2845D6',
                animation: 'spin 0.8s linear infinite'
            }} />
            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
    );

    if (!user || user.role?.slug === 'anonymous') {
        if (path === '/login') return children;
        console.warn(`[ROUTER] ProtectedRoute: Redirecting Guest from [${window.location.pathname}] to /login`);
        return <Navigate to="/login" replace />;
    }
    return children;
};

// Redirect authenticated users away from /login
const AlreadyAuthedRoute = ({ children }) => {
    const { user, loading } = useAuth();
    const path = getNormalizedPath();

    if (loading) return null;

    if (user && user.role?.slug !== 'anonymous') {
        if (path === '/') return children;
        console.warn(`[ROUTER] AlreadyAuthedRoute: Redirecting User from [${window.location.pathname}] to /`);
        return <Navigate to="/" replace />;
    }
    return children;
};

const RoleRoute = ({ children, allowedRoles }) => {
    const { user } = useAuth();
    const slug = user?.role?.slug;
    const path = getNormalizedPath();

    if (!slug || !allowedRoles.includes(slug)) {
        if (path === '/') return children;
        console.warn(`[ROUTER] RoleRoute: Redirecting unauthorized from [${window.location.pathname}] to /`);
        return <Navigate to="/" replace />;
    }
    return children;
};


const router = createBrowserRouter([
    {
        element: (
            <>
                <GlobalLoader />
                <Outlet />
            </>
        ),
        children: [
            {
                path: "/login",
                element: <AlreadyAuthedRoute><Login /></AlreadyAuthedRoute>,
            },
            {
                path: "/archive",
                element: <PublicArchive />,
            },
            {
                path: "/",
                element: <ProtectedRoute><PublicLayout><Outlet /></PublicLayout></ProtectedRoute>,
                children: [
                    {
                        path: "/",
                        element: <Dashboard />,
                    },
                    {
                        path: "/users",
                        element: <Users />,
                    },
                    {
                        path: "/profile",
                        element: <Profile />,
                    },
                    {
                        path: "/repository",
                        element: <Repository />,
                    },
                    {
                        path: "/thesis-management",
                        element: <ThesisManagement />,
                    },
                    {
                        path: "/review-manager",
                        element: <ReviewManager />,
                    },
                    {
                        path: "/system-settings/permissions",
                        element: <RoleRoute allowedRoles={['spadmin']}><Permissions /></RoleRoute>,
                    },
                    {
                        path: "/system-settings/activity-log",
                        element: <RoleRoute allowedRoles={['spadmin']}><ActivityLog /></RoleRoute>,
                    },
                    {
                        path: "/system-settings/system-manager",
                        element: <SystemManager />,
                    },
                    {
                        path: "/system-settings/reports",
                        element: <Reports />,
                    },
                ]
            },
            {
                path: "*",
                element: window.location.pathname === '/' ? null : (
                    (() => {
                        console.warn('[ROUTER] Catch-all redirecting from:', window.location.pathname);
                        return <Navigate to="/" replace />;
                    })()
                ),
            }
        ]
    }
]);

export default router;
