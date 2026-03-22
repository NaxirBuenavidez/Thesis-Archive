import './bootstrap';
import React from 'react';
import { createRoot } from 'react-dom/client';
import { AppProvider } from './providers/AppProvider';
// import PrivateApp from './private/PrivateApp'; // Removed for now

import { RouterProvider } from 'react-router-dom';
import router from './router';

function App() {
    console.log('[DEBUG-ROOT] app.jsx rendering. Path:', window.location.pathname);
    const [loopError, setLoopError] = React.useState(null);
    
    React.useEffect(() => {
        let navCount = 0;
        let lastNav = Date.now();

        const logNav = (type, args) => {
            navCount++;
            const now = Date.now();
            if (now - lastNav > 3000) navCount = 1;
            lastNav = now;

            console.log(`[DEBUG-NAV] ${type}: count=${navCount}, to=${args?.[2] || 'popstate'}`);
            
            if (navCount > 50) {
                const msg = `CRITICAL: Navigation Loop Detected (${type}). Stopping app.`;
                console.error(msg);
                setLoopError(msg);
                throw new Error(msg); // Hard stop
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
