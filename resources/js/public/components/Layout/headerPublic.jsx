import React from 'react';
import { Layout, Button, Typography, theme } from 'antd';
import { MenuUnfoldOutlined, MenuFoldOutlined } from '@ant-design/icons';
import NotificationBell from '../NotificationBell';

const { Header } = Layout;
const { Text } = Typography;

const headerPublic = ({ 
    collapsed, 
    setCollapsed, 
    isMobile, 
    logoPath, 
    appName, 
    appDescription, 
    appInitials, 
    primaryColor, 
    sidebarBg,
    setDrawerVisible 
}) => {
    const { token } = theme.useToken();

    return (
        <Header style={{ padding: '0 12px', background: token.colorBgContainer, display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 99, width: '100%', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 4, zIndex: 1, flexShrink: 0, minWidth: isMobile ? 44 : 60 }}>
                {!isMobile && (
                    <Button
                        type="text"
                        icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                        onClick={() => setCollapsed(!collapsed)}
                        style={{ fontSize: '16px', width: 50, height: 50 }}
                    />
                )}
            </div>

            <div style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', overflow: 'hidden', padding: '0 8px' }}>
                <div style={{ display: 'flex', alignItems: 'center', overflow: 'hidden' }}>
                    {logoPath ? (
                        <img src={logoPath} alt="System Logo" style={{ height: isMobile ? 32 : 40, width: 'auto', marginRight: 10, objectFit: 'contain', flexShrink: 0 }} />
                    ) : (
                        <div style={{
                            width: isMobile ? 32 : 40,
                            height: isMobile ? 32 : 40,
                            backgroundColor: primaryColor,
                            borderRadius: 8,
                            marginRight: 8,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: '#fff',
                            fontWeight: 'bold',
                            fontSize: isMobile ? 16 : 20,
                            flexShrink: 0
                        }}>{appInitials}</div>
                    )}
                    <div style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden', minWidth: 0 }}>
                        <Text strong style={{ fontSize: isMobile ? 13 : 18, color: sidebarBg, lineHeight: 1.2, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            {appName}
                        </Text>
                        {!isMobile && (
                            <Text type="secondary" style={{ fontSize: 12, lineHeight: 1.2, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                {appDescription}
                            </Text>
                        )}
                    </div>
                </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', zIndex: 1, flexShrink: 0, minWidth: isMobile ? 44 : 60, justifyContent: 'flex-end' }}>
                <NotificationBell isMobile={isMobile} onClickMobile={() => setDrawerVisible(true)} />
            </div>
        </Header>
    );
};

export default headerPublic;
