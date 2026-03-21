import './bootstrap';
import React from 'react';
import { createRoot } from 'react-dom/client';
import { AppProvider } from './providers/AppProvider';
// import PrivateApp from './private/PrivateApp'; // Removed for now

import { RouterProvider } from 'react-router-dom';
import router from './router';
import { SpeedInsights } from '@vercel/speed-insights/react';

function App() {
    // For now, let's just render PublicApp. 
    // In a real app, we'd use a Router (react-router-dom) to switch between them.
    // Or check a global variable/prop to decide.
    // Let's assume we are on the public side for now.
    const isPrivate = window.location.pathname.startsWith('/admin');

    return (
        <AppProvider>
            {isPrivate ? (
                <div style={{ padding: 20 }}>Admin Interface (Coming Soon)</div>
            ) : (
                <RouterProvider router={router} />
            )}
            <SpeedInsights />
        </AppProvider>
    );
}

const container = document.getElementById('app');
if (container) {
    const root = createRoot(container);
    root.render(<App />);
}
