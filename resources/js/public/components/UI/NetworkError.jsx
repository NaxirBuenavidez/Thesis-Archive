import React from 'react';
import { Typography, Button, Result, Space, theme } from 'antd';
import { WifiOutlined, ReloadOutlined, AlertOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

export default function NetworkError({ type = 'offline', onRetry }) {
    const { token } = theme.useToken();
    
    const isTimeout = type === 'timeout';
    
    return (
        <div style={{ 
            height: '100vh', 
            width: '100vw', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            background: token.colorBgContainer,
            position: 'fixed',
            top: 0,
            left: 0,
            zIndex: 9999,
            padding: '24px'
        }}>
            <Result
                status="error"
                icon={
                    <div style={{ 
                        fontSize: 72, 
                        color: token.colorError,
                        marginBottom: 24,
                        animation: 'pulse 2s infinite'
                    }}>
                        {isTimeout ? <AlertOutlined /> : <WifiOutlined />}
                    </div>
                }
                title={
                    <Title level={2} style={{ margin: 0 }}>
                        {isTimeout ? 'Request Timed Out' : 'Connection Lost'}
                    </Title>
                }
                subTitle={
                    <Space direction="vertical" align="center" size={0}>
                        <Text type="secondary" style={{ fontSize: 16 }}>
                            {isTimeout 
                                ? "The server is taking too long to respond. This might be due to poor internet connectivity." 
                                : "It seems you're offline. Please check your internet connection and try again."}
                        </Text>
                        <Text type="secondary" style={{ fontSize: 14, marginTop: 12 }}>
                            We'll automatically reconnect once your connection is restored.
                        </Text>
                    </Space>
                }
                extra={[
                    <Button 
                        type="primary" 
                        key="retry" 
                        size="large" 
                        icon={<ReloadOutlined />}
                        onClick={onRetry || (() => window.location.reload())}
                        style={{ height: 48, padding: '0 32px', borderRadius: 8, fontWeight: 600 }}
                    >
                        Retry Connection
                    </Button>
                ]}
            />
            <style>{`
                @keyframes pulse {
                    0% { opacity: 1; transform: scale(1); }
                    50% { opacity: 0.7; transform: scale(0.95); }
                    100% { opacity: 1; transform: scale(1); }
                }
            `}</style>
        </div>
    );
}
