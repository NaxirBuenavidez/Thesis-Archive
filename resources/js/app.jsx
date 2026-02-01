import './bootstrap';
import React from 'react';
import { createRoot } from 'react-dom/client';
import { ConfigProvider, App as AntApp } from 'antd';

// Import Ant Design styles
import 'antd/dist/reset.css';

// Main App Component
function App() {
    return (
        <ConfigProvider
            theme={{
                token: {
                    colorPrimary: '#1890ff',
                },
            }}
        >
            <AntApp>
                <div style={{ padding: '24px' }}>
                    <h1>Welcome to Thesis Archive</h1>
                    <p>React with Ant Design is ready!</p>
                </div>
            </AntApp>
        </ConfigProvider>
    );
}

// Mount the React app
const container = document.getElementById('app');
if (container) {
    const root = createRoot(container);
    root.render(<App />);
}
