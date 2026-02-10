import React from 'react';
import { ConfigProvider, App as AntApp } from 'antd';
import 'antd/dist/reset.css';

export function AppProvider({ children }) {
    return (
        <ConfigProvider
            theme={{
                token: {
                    colorPrimary: import.meta.env.VITE_COLOR_PRIMARY || '#2845D6',
                    colorInfo: import.meta.env.VITE_COLOR_PRIMARY || '#2845D6',
                    colorWarning: '#fa8c16',
                    borderRadius: 6,
                },
                components: {
                    Layout: {
                        siderBg: import.meta.env.VITE_COLOR_PRIMARY_DARK || '#1A2CA3',
                        headerBg: '#ffffff', // White header for cleaner look
                        bodyBg: '#f0f2f5', // Standard grey background
                    },
                    Menu: {
                        darkItemBg: import.meta.env.VITE_COLOR_PRIMARY_DARK || '#1A2CA3',
                    },
                    Table: {
                        headerBg: '#f0f2ff',
                        headerColor: import.meta.env.VITE_COLOR_PRIMARY || '#2845D6',
                        headerSplitColor: 'transparent',
                        rowHoverBg: '#f9faff',
                    },
                }
            }}
        >
            <AntApp>
                {children}
            </AntApp>
        </ConfigProvider>
    );
}
