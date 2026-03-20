import React from 'react';
import { ConfigProvider, App as AntApp } from 'antd';
import 'antd/dist/reset.css';
import '../public/components/UI/SystemNotifications';
import { SystemConfigProvider, useSystemConfig } from '../context/SystemConfigContext';

function ThemedApp({ children }) {
    const { primary_color, primary_color_dark } = useSystemConfig();

    return (
        <ConfigProvider
            theme={{
                token: {
                    colorPrimary: primary_color,
                    colorInfo: primary_color,
                    colorWarning: '#fa8c16',
                    borderRadius: 6,
                },
                components: {
                    Layout: {
                        siderBg: primary_color_dark,
                        headerBg: '#ffffff',
                        bodyBg: '#f0f2f5',
                    },
                    Menu: {
                        darkItemBg: primary_color_dark,
                    },
                    Table: {
                        headerBg: '#f0f2ff',
                        headerColor: primary_color,
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

export function AppProvider({ children }) {
    return (
        <SystemConfigProvider>
            <ThemedApp>{children}</ThemedApp>
        </SystemConfigProvider>
    );
}
