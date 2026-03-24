
import React from 'react';
import { createBrowserRouter, Navigate, Outlet, useLocation } from 'react-router-dom';
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
import ClientThesisManagement from './public/pages/pageClientThesisManagement';
import Login from './public/pages/pageLogin';
import PublicArchive from './public/pages/pagePublicArchive';
import UserManual from './public/pages/Archive/SubPages/UserManual';
import ResearchPolicy from './public/pages/Archive/SubPages/ResearchPolicy';
import SubmissionGuide from './public/pages/Archive/SubPages/SubmissionGuide';
import GeneralAccessFAQ from './public/pages/Archive/SubPages/GeneralAccessFAQ';
import SubmissionFAQ from './public/pages/Archive/SubPages/SubmissionFAQ';
import AccountHelp from './public/pages/Archive/SubPages/AccountHelp';
import { AuthProvider, useAuth } from './context/AuthContext';



import GlobalLoader from './public/components/GlobalLoader';

const getNormalizedPath = (path) => path.replace(/\/$/, '') || '/';

const SafeNavigate = ({ to, ...props }) => {
    const location = useLocation();
    const current = getNormalizedPath(location.pathname);
    const target = getNormalizedPath(to);
    
    // ───────────────────────────────────────────────────────────
    // CIRCUIT BREAKER: Definitive loop prevention
    // ───────────────────────────────────────────────────────────
    const navKey = `ptas_nav_${to}_${Date.now().toString().slice(0, -3)}`; // Per-second bucket
    const currentNavs = parseInt(sessionStorage.getItem(navKey) || '0');
    
    if (currentNavs > 5) {
        console.error('[FATAL-LOOP] SafeNavigate: Navigation loop detected for', to, '- HALTING APP');
        return (
            <div style={{ padding: 20, background: '#fff1f0', border: '1px solid #ffa39e', borderRadius: 8, margin: 20 }}>
                <h3 style={{ color: '#cf1322', margin: 0 }}>Navigation Loop Detected</h3>
                <p style={{ margin: '8px 0 0 0' }}>The system has prevented an infinite redirect loop to <code>{to}</code>.</p>
                <button 
                    onClick={() => { sessionStorage.clear(); window.location.href = '/login'; }} 
                    style={{ marginTop: 12, padding: '4px 12px', cursor: 'pointer' }}
                >
                    Reset & Sign In
                </button>
            </div>
        );
    }
    sessionStorage.setItem(navKey, (currentNavs + 1).toString());
    // ───────────────────────────────────────────────────────────

    if (current === target) {
        return null;
    }
    
    return <Navigate to={to} replace {...props} />;
};


const ProtectedRoute = ({ children }) => {
    const { user, loading } = useAuth();
    const location = useLocation();
    
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

    const currentPath = getNormalizedPath(location.pathname);

    if (!user || user.role?.slug === 'anonymous') {
        if (currentPath === '/login' || currentPath === '/archive') {
            return children;
        }
        
        return <SafeNavigate to="/login" state={{ from: location }} />;
    }
    return children;
};

// Redirect authenticated users away from /login
const AlreadyAuthedRoute = ({ children }) => {
    const { user, loading } = useAuth();
    const location = useLocation();

    if (loading) return null;

    const currentPath = getNormalizedPath(location.pathname);

    if (user && user.role?.slug !== 'anonymous') {
        if (currentPath !== '/login') return children;
        
        // Custom redirection based on role
        if (user.role?.slug === 'client') {
            return <SafeNavigate to="/my-thesis" />;
        }
        return <SafeNavigate to="/" />;
    }
    return children;
};

const RoleRoute = ({ children, allowedRoles }) => {
    const { user } = useAuth();
    const location = useLocation();
    const slug = user?.role?.slug;

    const currentPath = getNormalizedPath(location.pathname);

    if (!slug || !allowedRoles.includes(slug)) {
        if (currentPath === '/') return children;
        return <SafeNavigate to="/" />;
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
            { path: "/user-manual", element: <UserManual /> },
            { path: "/research-policy", element: <ResearchPolicy /> },
            { path: "/submission-guide", element: <SubmissionGuide /> },
            { path: "/general-access-faq", element: <GeneralAccessFAQ /> },
            { path: "/submission-faq", element: <SubmissionFAQ /> },
            { path: "/account-help", element: <AccountHelp /> },
            {
                path: "/",
                element: <ProtectedRoute><PublicLayout><Outlet /></PublicLayout></ProtectedRoute>,
                children: [
                    {
                        index: true,
                        element: user?.role?.slug === 'client' ? <SafeNavigate to="/my-thesis" /> : <Dashboard />,
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
                        element: <RoleRoute allowedRoles={['spadmin', 'admin']}><ThesisManagement /></RoleRoute>,
                    },
                    {
                        path: "/my-thesis",
                        element: <RoleRoute allowedRoles={['client']}><ClientThesisManagement /></RoleRoute>,
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
                element: <SafeNavigate to="/archive" />,
            }
        ]
    }
]);

export default router;
