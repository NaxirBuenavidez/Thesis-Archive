import React from 'react';
import { createBrowserRouter, Navigate, Outlet } from 'react-router-dom';
import PublicLayout from './public/components/PublicLayout';
import Dashboard from './public/pages/Dashboard';
import Users from './public/pages/Users';
import Repository from './public/pages/Repository';
import ThesisManagement from './public/pages/ThesisManagement';
import ReviewManager from './public/pages/ReviewManager';
import Permissions from './public/pages/SystemSettings/Permissions';
import ActivityLog from './public/pages/SystemSettings/ActivityLog';
import SystemManager from './public/pages/SystemSettings/SystemManager';
import Reports from './public/pages/SystemSettings/Reports';

const router = createBrowserRouter([
    {
        path: "/",
        element: <PublicLayout><Outlet /></PublicLayout>,
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
                element: <Permissions />,
            },
            {
                path: "/system-settings/activity-log",
                element: <ActivityLog />,
            },
            {
                path: "/system-settings/system-manager",
                element: <SystemManager />,
            },
            {
                path: "/system-settings/reports",
                element: <Reports />,
            },
            {
                path: "*",
                element: <Navigate to="/" replace />,
            }
        ]
    }
]);

export default router;
