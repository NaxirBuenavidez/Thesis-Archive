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
                    silent: window.location.pathname === '/archive',
                    useLoader: true 
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
        const logo = window.__boot_data?.settings?.logo_path || null;
        const primaryColor = window.__boot_data?.settings?.primary_color || '#2845D6';
        
        return (
            <div style={{ 
                height: '100vh', 
                display: 'flex', 
                flexDirection: 'column',
                justifyContent: 'center', 
                alignItems: 'center', 
                background: '#f8f9fc',
                fontFamily: "'Inter', sans-serif"
            }}>
                <style>{`
                    @keyframes boot-spin { to { transform: rotate(360deg); } }
                    @keyframes boot-pulse { 0%, 100% { transform: scale(1); opacity: 1; } 50% { transform: scale(0.95); opacity: 0.8; } }
                `}</style>
                <div style={{ position: 'relative', width: 100, height: 100, marginBottom: 24 }}>
                    <div style={{ 
                        position: 'absolute', inset: 0, borderRadius: '50%', 
                        border: '3px solid rgba(0,0,0,0.05)', borderTopColor: primaryColor,
                        animation: 'boot-spin 0.8s cubic-bezier(0.5, 0.1, 0.4, 0.9) infinite' 
                    }} />
                    <div style={{ 
                        position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
                        animation: 'boot-pulse 2s ease-in-out infinite'
                    }}>
                        {logo ? (
                            <img src={logo} alt="Logo" style={{ width: 48, height: 48, objectFit: 'contain' }} />
                        ) : (
                            <div style={{ width: 40, height: 40, borderRadius: 8, background: primaryColor, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: 18 }}>
                                TA
                            </div>
                        )}
                    </div>
                </div>
                <div style={{ color: '#595959', fontSize: 14, fontWeight: 600, letterSpacing: '0.5px' }}>
                    INITIALIZING SYSTEM
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
