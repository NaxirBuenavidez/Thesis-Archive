import React from 'react';
import { ConfigProvider, App as AntApp } from 'antd';
import 'antd/dist/reset.css';
import '../public/components/UI/SystemNotifications';
import { SystemConfigProvider, useSystemConfig } from '../context/SystemConfigContext';
import { AuthProvider } from '../context/AuthContext';

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
        // If boot data was injected into the Blade template, consume it immediately to skip the network round-trip.
        if (window.__boot_data) {
            setBootData(window.__boot_data);
            setBooting(false);
            return;
        }

        const boot = async () => {
            // Safety timeout: don't hang for more than 10 seconds
            const timeout = setTimeout(() => {
                if (booting) setBooting(false);
            }, 10000);

            try {
                const { data } = await window.axios.get('/api/boot', { 
                    silent: window.location.pathname === '/archive' 
                });
                setBootData(data);
            } catch (error) {
                console.error('Boot failed', error);
            } finally {
                clearTimeout(timeout);
                setBooting(false);
            }
        };
        boot();
    }, []);

    if (booting) {
        return (
            <div style={{ height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', background: '#f0f2f5' }}>
                <div style={{ textAlign: 'center' }}>
                    <div style={{ width: 40, height: 40, border: '3px solid rgba(0,0,0,0.1)', borderTopColor: '#2845D6', borderRadius: '50%', animation: 'gl-spin 0.8s linear infinite', margin: '0 auto 16px' }} />
                    <div style={{ color: '#8c8c8c', fontSize: 14 }}>Initializing System...</div>
                </div>
            </div>
        );
    }

    return (
        <SystemConfigProvider initialData={bootData}>
            <ThemedApp>
                <AuthProvider initialUser={bootData?.user}>
                    {children}
                </AuthProvider>
            </ThemedApp>
        </SystemConfigProvider>
    );
}
