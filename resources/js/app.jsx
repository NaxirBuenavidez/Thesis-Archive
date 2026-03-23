import './bootstrap';
import React from 'react';
import { createRoot } from 'react-dom/client';
import { AppProvider } from './providers/AppProvider';
// import PrivateApp from './private/PrivateApp'; // Removed for now

import { RouterProvider } from 'react-router-dom';
import router from './router';
import NetworkError from './public/components/UI/NetworkError';

function App() {
    const [loopError, setLoopError] = React.useState(null);
    const [connectionError, setConnectionError] = React.useState(null); // 'timeout' | 'offline' | null

    React.useEffect(() => {
        let navCount = 0;
        let lastNav = Date.now();

        const logNav = (type, args) => {
            navCount++;
            const now = Date.now();
            if (now - lastNav > 3000) navCount = 1;
            lastNav = now;

            if (navCount > 50) {
                const msg = `CRITICAL: Persistent Navigation Loop detected. Stopping application to protect system resources.`;
                setLoopError(msg);
                throw new Error(msg);
            }
        };

        window.addEventListener('popstate', () => logNav('POPSTATE'));
        
        const originalPush = window.history.pushState;
        const originalReplace = window.history.replaceState;
        
        window.history.pushState = function() {
            logNav('PUSH', arguments);
            return originalPush.apply(window.history, arguments);
        };
        window.history.replaceState = function() {
            logNav('REPLACE', arguments);
            return originalReplace.apply(window.history, arguments);
        };

        // Network Connectivity Handlers
        const handleOffline = () => setConnectionError('offline');
        const handleOnline = () => setConnectionError(null);
        const handleSystemConnectionError = (e) => setConnectionError(e.detail.type);

        window.addEventListener('offline', handleOffline);
        window.addEventListener('online', handleOnline);
        window.addEventListener('system-connection-error', handleSystemConnectionError);

        if (!navigator.onLine) setConnectionError('offline');

        return () => {
            window.removeEventListener('offline', handleOffline);
            window.removeEventListener('online', handleOnline);
            window.removeEventListener('system-connection-error', handleSystemConnectionError);
        };
    }, []);

    if (loopError) {
        return (
            <div style={{ padding: 40, background: '#fff0f0', border: '2px solid red', margin: 20, borderRadius: 8, color: '#f5222d' }}>
                <h1 style={{ fontSize: 24 }}>[EMERGENCY] Navigation Loop Breaker</h1>
                <p>{loopError}</p>
                <p>Check console logs for <code>[DEBUG-NAV]</code> to see the trigger.</p>
                <button onClick={() => window.location.reload()}>Try Refresh</button>
            </div>
        );
    }

    if (connectionError) {
        return <NetworkError type={connectionError} onRetry={() => setConnectionError(null)} />;
    }

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
