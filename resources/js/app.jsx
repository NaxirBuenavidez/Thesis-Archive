import './bootstrap';
import React from 'react';
import { createRoot } from 'react-dom/client';
import { AppProvider } from './providers/AppProvider';
// import PrivateApp from './private/PrivateApp'; // Removed for now

import { RouterProvider } from 'react-router-dom';
import router from './router';

function App() {
    console.log('[DEBUG-ROOT] app.jsx rendering. Path:', window.location.pathname);
    const isPrivate = window.location.pathname.startsWith('/admin');

    return (
        <AppProvider>
            {isPrivate ? (
                <div style={{ padding: 20 }}>Admin Interface (Coming Soon)</div>
            ) : (
                <RouterProvider router={router} />
            )}
        </AppProvider>
    );
}

const container = document.getElementById('app');
if (container) {
    const root = createRoot(container);
    root.render(<App />);
}
