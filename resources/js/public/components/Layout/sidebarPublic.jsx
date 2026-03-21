import React from 'react';
import { Menu, Avatar, Typography, ConfigProvider, theme } from 'antd';
import { Link } from 'react-router-dom';
import { UserOutlined } from '@ant-design/icons';

const { Text } = Typography;

const sidebarPublic = ({ 
    user, 
    collapsed, 
    location, 
    mainMenuItems, 
    bottomMenuItems, 
    onMenuClick, 
    handleLogout,
    isGuest
}) => {
    const { token } = theme.useToken();
    
    const ProfileSection = (
        <div style={{ padding: '32px 16px', display: 'flex', flexDirection: 'column', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
            <Link to="/profile" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textDecoration: 'none' }}>
                <Avatar
                    size={80}
                    icon={<UserOutlined />}
                    src={user?.profile?.avatar ? (user.profile.avatar.startsWith('http') || user.profile.avatar.startsWith('data:image') ? user.profile.avatar : `/storage/${user.profile.avatar}`) : null}
                    style={{ backgroundColor: 'rgba(255,255,255,0.2)', marginBottom: 16, border: '2px solid rgba(255,255,255,0.1)', cursor: 'pointer' }}
                />
                {!collapsed && (
                    <div style={{ textAlign: 'center' }}>
                        <Text style={{ color: '#fff', display: 'block', fontWeight: 700, fontSize: '16px', letterSpacing: '0.5px' }}>
                            {isGuest ? 'Guest User' : (user?.name || 'User')}
                        </Text>
                        <Text style={{ color: 'rgba(255,255,255,0.65)', fontSize: '13px', marginTop: '4px', display: 'block' }}>
                            {isGuest ? 'Anonymous Access' : (user?.role?.title ? user.role.title : 'User')}
                        </Text>
                    </div>
                )}
            </Link>
        </div>
    );

    return (
        <ConfigProvider
            theme={{
                components: {
                    Menu: {
                        darkItemBg: 'transparent',
                        darkSubMenuItemBg: 'transparent',
                        itemSelectedBg: 'rgba(255, 255, 255, 0.2)',
                        itemHoverBg: 'rgba(255, 255, 255, 0.1)',
                        darkItemSelectedBg: 'rgba(255, 255, 255, 0.2)',
                        darkItemHoverBg: 'rgba(255, 255, 255, 0.1)',
                    },
                },
            }}
        >
            <div style={{ display: 'flex', flexDirection: 'column', height: '100%', borderRight: 0 }}>
                {ProfileSection}
                <Menu
                    theme="dark"
                    selectedKeys={[location.pathname]}
                    mode="inline"
                    items={mainMenuItems}
                    style={{ backgroundColor: 'transparent', borderRight: 0, flex: 1, padding: '16px 0' }}
                    onClick={onMenuClick}
                />
                <Menu
                    theme="dark"
                    mode="inline"
                    items={bottomMenuItems}
                    style={{ backgroundColor: 'transparent', borderRight: 0 }}
                    selectable={false}
                    onClick={({ key }) => {
                        if (key === 'signout') handleLogout();
                        else onMenuClick({ key });
                    }}
                />
            </div>
        </ConfigProvider>
    );
};

export default sidebarPublic;
