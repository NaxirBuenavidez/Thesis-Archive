import './bootstrap';
import React from 'react';
import { createRoot } from 'react-dom/client';
import { ConfigProvider, App as AntApp, Typography, Space, Button } from 'antd';
import MainLayout from './components/MainLayout';

// Import Ant Design styles
import 'antd/dist/reset.css';

const { Title, Paragraph } = Typography;

// Main App Component
function App() {
    return (
        <ConfigProvider
            theme={{
                token: {
                    colorPrimary: '#1677ff',
                    borderRadius: 8,
                },
            }}
        >
            <AntApp>
                <MainLayout>
                    <Typography>
                        <Title level={2}>Welcome to Thesis Archive</Title>
                        <Paragraph>
                            This project is now configured with Laravel 12, React 18, and Ant Design 5.
                            The application is mounting successfully and is ready for development.
                        </Paragraph>
                        <Space size="middle">
                            <Button type="primary" size="large">Get Started</Button>
                            <Button size="large" href="https://ant.design" target="_blank">AntD Documentation</Button>
                        </Space>
                    </Typography>
                </MainLayout>
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
