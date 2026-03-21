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
    const [bootData, setBootData] = React.useState(null);
    const [booting, setBooting] = React.useState(true);

    React.useEffect(() => {
        const boot = async () => {
            try {
                const { data } = await window.axios.get('/api/boot');
                setBootData(data);
            } catch (error) {
                console.error('Boot failed', error);
            } finally {
                setBooting(false);
            }
        };
        boot();
    }, []);

    // We still render the providers, but we pass the bootData for hydration.
    // The SystemConfigProvider will use the settings, and AuthProvider will use the user.
    return (
        <SystemConfigProvider initialData={bootData?.settings}>
            <ThemedApp>
                <AuthProvider initialUser={bootData?.user}>
                    {children}
                </AuthProvider>
            </ThemedApp>
        </SystemConfigProvider>
    );
}
