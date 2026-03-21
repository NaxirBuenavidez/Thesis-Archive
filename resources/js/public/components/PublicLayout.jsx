import React, { useState } from 'react';
import { Layout, Menu, theme, Drawer, Button, Grid, Avatar, Typography, Space, ConfigProvider, Breadcrumb, Modal } from 'antd';
import { useNavigate, useLocation, Link, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useSystemConfig } from '../../context/SystemConfigContext';
import {
    MenuOutlined,
    DashboardOutlined,
    UsergroupAddOutlined,
    BookOutlined,
    FileTextOutlined,
    AuditOutlined,
    SettingOutlined,
    UserOutlined,
    BellOutlined,
    LogoutOutlined,
    MenuUnfoldOutlined,
    MenuFoldOutlined,
    SafetyCertificateOutlined,
    HistoryOutlined,
    ToolOutlined,
    BarChartOutlined,
    HomeOutlined
} from '@ant-design/icons';
import NotificationBell from './NotificationBell';

const { Header, Sider, Content } = Layout;
const { useBreakpoint } = Grid;
const { Text } = Typography;

export default function PublicLayout({ children }) {
    const [collapsed, setCollapsed] = useState(false);
    const [drawerVisible, setDrawerVisible] = useState(false);

    const navigate = useNavigate();
    const location = useLocation();

    const screens = useBreakpoint();
    const isMobile = !screens.md;

    const {
        token,
        token: { colorBgContainer, borderRadiusLG, colorPrimary, colorTextTertiary },
    } = theme.useToken();

    // Breadcrumb Logic
    const pathSnippets = location.pathname.split('/').filter((i) => i);
    const breadcrumbNameMap = {
        '/dashboard': 'Dashboard',
        '/users': 'Users',
        '/repository': 'Repository',
        '/thesis-management': 'Thesis Management',
        '/review-manager': 'Review Manager',
        '/system-settings': 'System Settings',
        '/system-settings/permissions': 'Permissions',
        '/system-settings/activity-log': 'Activity Log',
        '/system-settings/system-manager': 'System Manager',
        '/system-settings/reports': 'Reports',
    };

    const [searchParams] = useSearchParams();
    const currentTab = searchParams.get('tab');

    const tabNameMap = {
        '/thesis-management': { preview: 'Document Preview', modify: 'Modify Record', remove: 'Remove Record' },
        '/review-manager': { public: 'Publicly Archive', private: 'Private Archive' },
        '/system-settings/system-manager': { '1': 'Departments', '2': 'Programs', '3': 'Senior High Programs' },
    };

    const extraBreadcrumbItems = pathSnippets.map((_, index) => {
        const url = `/${pathSnippets.slice(0, index + 1).join('/')}`;
        const name = breadcrumbNameMap[url] || url.split('/').pop().replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
        return {
            key: url,
            title: <Link to={url}>{name}</Link>,
        };
    });

    if (currentTab && tabNameMap[location.pathname] && tabNameMap[location.pathname][currentTab]) {
        extraBreadcrumbItems.push({
            key: `tab-${currentTab}`,
            title: tabNameMap[location.pathname][currentTab],
        });
    }

    const breadcrumbItems = [
        {
            title: <Link to="/dashboard"><HomeOutlined style={{ color: colorTextTertiary, fontSize: '18px' }} /></Link>,
            key: 'home',
        },
    ].concat(extraBreadcrumbItems);



    // Blue Theme Palette & Settings from DB Context
    const { primary_color_dark, site_title, site_description, logo_path } = useSystemConfig();
    const sidebarBg = primary_color_dark || '#1A2CA3';
    const appName = site_title || 'Thesis Archive';
    const appDescription = site_description || 'System Archive';

    // Generate initials from app name
    const getInitials = (name) => {
        return name
            .split(' ')
            .map(word => word[0])
            .join('')
            .toUpperCase()
            .slice(0, 2);
    };

    const appInitials = getInitials(appName);

    const { user, logout } = useAuth(); // Single useAuth call — destructure both user and logout
    const isSpAdmin = user?.role?.slug === 'spadmin';

    const desktopMainMenuItems = [
        { key: 'dashboard', icon: <DashboardOutlined style={{ fontSize: '20px' }} />, label: <span style={{ fontWeight: 600, fontSize: '16px' }}>Dashboard</span> },
        { key: 'users', icon: <UsergroupAddOutlined style={{ fontSize: '20px' }} />, label: <span style={{ fontWeight: 600, fontSize: '16px' }}>Users</span> },
        { key: 'repository', icon: <BookOutlined style={{ fontSize: '20px' }} />, label: <span style={{ fontWeight: 600, fontSize: '16px' }}>Repository</span> },
        { key: 'thesis-management', icon: <FileTextOutlined style={{ fontSize: '20px' }} />, label: <span style={{ fontWeight: 600, fontSize: '16px' }}>Thesis Management</span> },
        { key: 'review-manager', icon: <AuditOutlined style={{ fontSize: '20px' }} />, label: <span style={{ fontWeight: 600, fontSize: '16px' }}>Review Manager</span> },
        {
            key: 'system-settings',
            icon: <SettingOutlined style={{ fontSize: '20px' }} />,
            label: <span style={{ fontWeight: 600, fontSize: '16px' }}>System Settings</span>,
            children: [
                ...(isSpAdmin ? [
                    { key: 'permissions', label: 'Permission', icon: <SafetyCertificateOutlined /> },
                    { key: 'activity-log', label: 'Activity Log', icon: <HistoryOutlined /> },
                ] : []),
                { key: 'system-manager', label: 'System Manager', icon: <ToolOutlined /> },
                { key: 'reports', label: 'Reports', icon: <BarChartOutlined /> }
            ]
        },
    ];

    const mobileMainMenuItems = [
        { key: 'users', icon: <UsergroupAddOutlined style={{ fontSize: '20px' }} />, label: <span style={{ fontWeight: 600, fontSize: '16px' }}>Users</span> },
        {
            key: 'system-settings',
            icon: <SettingOutlined style={{ fontSize: '20px' }} />,
            label: <span style={{ fontWeight: 600, fontSize: '16px' }}>System Settings</span>,
            children: [
                ...(isSpAdmin ? [
                    { key: 'permissions', label: 'Permission', icon: <SafetyCertificateOutlined /> },
                    { key: 'activity-log', label: 'Activity Log', icon: <HistoryOutlined /> },
                ] : []),
                { key: 'system-manager', label: 'System Manager', icon: <ToolOutlined /> },
                { key: 'reports', label: 'Reports', icon: <BarChartOutlined /> }
            ]
        },
    ];

    const mainMenuItems = isMobile ? mobileMainMenuItems : desktopMainMenuItems;

    const bottomMenuItems = [
        {
            type: 'divider',
            style: { margin: '24px 16px', borderColor: 'rgba(255,255,255,0.15)' },
        },
        {
            key: 'signout',
            icon: <LogoutOutlined style={{ fontSize: '20px' }} />,
            label: <span style={{ fontWeight: 600, fontSize: '16px' }}>Sign Out</span>,
            danger: true,
        },
    ];

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
                            {user?.name || 'User'}
                        </Text>
                        <Text style={{ color: 'rgba(255,255,255,0.65)', fontSize: '13px', marginTop: '4px', display: 'block' }}>
                            {user?.role?.title ? user.role.title : 'User'}
                        </Text>
                    </div>
                )}
            </Link>
        </div>
    );

    const handleLogout = () => {
        Modal.confirm({
            title: 'Sign Out',
            content: 'Are you sure you want to log out of your account?',
            okText: 'Yes, Sign Out',
            cancelText: 'Cancel',
            okType: 'danger',
            centered: true,
            onOk: async () => {
                await logout();
            }
        });
    };

    const MenuComponent = (
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
                    defaultSelectedKeys={['dashboard']}
                    selectedKeys={[location.pathname]}
                    mode="inline"
                    items={mainMenuItems}
                    style={{ backgroundColor: 'transparent', borderRight: 0, flex: 1, padding: '16px 0' }}
                    onClick={({ key }) => {
                        if (isMobile) setDrawerVisible(false);

                        // Map keys to routes
                        const routeMap = {
                            'dashboard': '/dashboard',
                            'users': '/users',
                            'repository': '/repository',
                            'thesis-management': '/thesis-management',
                            'review-manager': '/review-manager',
                            'permissions': '/system-settings/permissions',
                            'activity-log': '/system-settings/activity-log',
                            'system-manager': '/system-settings/system-manager',
                            'reports': '/system-settings/reports'
                        };

                        if (routeMap[key]) {
                            navigate(routeMap[key]);
                        }
                    }}
                />
                <Menu
                    theme="dark"
                    mode="inline"
                    items={bottomMenuItems}
                    style={{ backgroundColor: 'transparent', borderRight: 0 }}
                    selectable={false}
                    onClick={({ key }) => {
                        if (isMobile) setDrawerVisible(false);
                        if (key === 'signout') {
                            handleLogout();
                        }
                    }}
                />
            </div>
        </ConfigProvider>
    );

    return (
        <Layout style={{ height: '100dvh', overflow: 'hidden' }}>
            {!isMobile && (
                <Sider
                    collapsible
                    collapsed={collapsed}
                    onCollapse={(value) => setCollapsed(value)}
                    width={250}
                    style={{ background: sidebarBg, height: '100dvh', position: 'fixed', left: 0, top: 0, bottom: 0, zIndex: 100 }}
                    trigger={null}
                >
                    {MenuComponent}
                </Sider>
            )}

            <Drawer
                title={isMobile ? null : appName}
                placement={isMobile ? "bottom" : "left"}
                closable={!isMobile}
                onClose={() => setDrawerVisible(false)}
                open={drawerVisible}
                styles={{ 
                    body: { padding: 0, backgroundColor: sidebarBg }, 
                    header: isMobile ? { display: 'none' } : { borderBottom: '1px solid #333' }, 
                    wrapper: isMobile ? { height: 'auto' } : { width: 250 },
                    content: isMobile ? { borderTopLeftRadius: 24, borderTopRightRadius: 24, backgroundColor: sidebarBg, paddingBottom: 'env(safe-area-inset-bottom)' } : undefined
                }}
            >
                {isMobile && (
                    <div style={{ padding: '12px 0 0 0', display: 'flex', justifyContent: 'center' }}>
                        <div style={{ width: 40, height: 4, backgroundColor: 'rgba(255,255,255,0.3)', borderRadius: 4 }} />
                    </div>
                )}
                {MenuComponent}
            </Drawer>

            <Layout style={{ marginLeft: isMobile ? 0 : (collapsed ? 80 : 250), transition: 'margin-left 0.2s', height: '100dvh', overflowY: 'auto', position: 'relative' }}>
                {/* Global CMS Background Logo Implementation */}
                {logo_path && (
                    <div style={{
                        position: 'fixed',
                        top: 0, left: 0, right: 0, bottom: 0,
                        backgroundImage: `url(${logo_path})`,
                        backgroundSize: '50% auto',
                        backgroundPosition: 'center',
                        backgroundRepeat: 'no-repeat',
                        opacity: 0.05,
                        zIndex: 0,
                        pointerEvents: 'none'
                    }} />
                )}

                <Header style={{ padding: '0 12px', background: colorBgContainer, display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 99, width: '100%', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
                    {/* Left: collapse button (desktop) */}
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

                    {/* Center: Dynamic CMS Header Branding */}
                    <div style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', overflow: 'hidden', padding: '0 8px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', overflow: 'hidden' }}>
                            {logo_path ? (
                                <img src={logo_path} alt="System Logo" style={{ height: isMobile ? 32 : 40, width: 'auto', marginRight: 10, objectFit: 'contain', flexShrink: 0 }} />
                            ) : (
                                <div style={{
                                    width: isMobile ? 32 : 40,
                                    height: isMobile ? 32 : 40,
                                    backgroundColor: colorPrimary,
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

                    {/* Right: notification bell */}
                    <div style={{ display: 'flex', alignItems: 'center', zIndex: 1, flexShrink: 0, minWidth: isMobile ? 44 : 60, justifyContent: 'flex-end' }}>
                        <NotificationBell isMobile={isMobile} onClickMobile={() => setDrawerVisible(true)} />
                    </div>
                </Header>
                <Content style={{ margin: '0 16px', display: 'flex', flexDirection: 'column', minHeight: 'calc(100dvh - 64px)', position: 'relative', zIndex: 1, paddingBottom: isMobile ? 80 : 0 }}>
                    <Breadcrumb style={{ margin: '16px 0', flexShrink: 0 }} items={breadcrumbItems} />
                    <div
                        style={{
                            padding: isMobile ? 12 : 24,
                            background: colorBgContainer,
                            borderRadius: borderRadiusLG,
                            marginBottom: 16,
                            flex: 1,
                        }}
                    >
                        {children || 'Select an item from the menu'}
                    </div>
                    <footer style={{
                        padding: isMobile ? '12px' : '16px 24px',
                        marginBottom: isMobile ? 72 : 16,
                        background: colorBgContainer,
                        borderRadius: borderRadiusLG,
                        border: `1px solid ${token.colorBorderSecondary}`,
                        flexShrink: 0,
                        position: 'relative',
                        zIndex: 1,
                    }}>
                        <div style={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', justifyContent: 'space-between', alignItems: isMobile ? 'flex-start' : 'center', gap: 8 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                <a href="https://privacy.gov.ph/" target="_blank" rel="noopener noreferrer" style={{ flexShrink: 0 }}>
                                    <img src="/images/npc-logo.png" alt="National Privacy Commission" style={{ height: isMobile ? 40 : 56, width: 'auto', display: 'block' }} />
                                </a>
                                <div style={{ minWidth: 0 }}>
                                    <a href="https://privacy.gov.ph/" target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }}>
                                        <Text strong style={{ fontSize: 12, display: 'block', lineHeight: 1.4, color: colorPrimary }}>
                                            {isMobile ? 'Data Privacy Act (RA 10173)' : 'Data Privacy Act of 2012 (RA 10173)'}
                                        </Text>
                                    </a>
                                    {!isMobile && (
                                        <Text type="secondary" style={{ fontSize: 11, lineHeight: 1.5, display: 'block' }}>
                                            This system complies with RA 10173. Personal information is handled per{' '}
                                            <a href="https://privacy.gov.ph/" target="_blank" rel="noopener noreferrer" style={{ color: colorPrimary }}>NPC</a> guidelines.
                                        </Text>
                                    )}
                                </div>
                            </div>
                            <Text type="secondary" style={{ fontSize: 11, flexShrink: 0, whiteSpace: 'nowrap' }}>
                                &copy; {new Date().getFullYear()} {isMobile ? appName.split(' ').slice(0, 2).join(' ') : appName}. All rights reserved.
                            </Text>
                        </div>
                    </footer>
                </Content>
                
                {/* Mobile Bottom Navigation Bar */}
                {isMobile && (
                    <div style={{
                        position: 'fixed',
                        bottom: 0,
                        left: 0,
                        right: 0,
                        height: 60,
                        backgroundColor: colorBgContainer,
                        borderTop: `1px solid ${token.colorBorderSecondary}`,
                        display: 'flex',
                        justifyContent: 'space-around',
                        alignItems: 'stretch',
                        zIndex: 1000,
                        paddingBottom: 'env(safe-area-inset-bottom)',
                        boxShadow: '0 -2px 12px rgba(0,0,0,0.07)'
                    }}>
                        {[
                            { key: '/', icon: <DashboardOutlined />, label: 'Home' },
                            { key: '/repository', icon: <BookOutlined />, label: 'Library' },
                            { key: '/thesis-management', icon: <FileTextOutlined />, label: 'Manage' },
                            { key: '/review-manager', icon: <AuditOutlined />, label: 'Review' },
                            { key: 'more', icon: <MenuOutlined />, label: 'Menu', isAction: true }
                        ].map(item => {
                            const isActive = item.isAction ? drawerVisible : location.pathname === item.key;
                            return (
                                <div
                                    key={item.key}
                                    onClick={() => {
                                        if (item.isAction) {
                                            setDrawerVisible(true);
                                        } else {
                                            navigate(item.key);
                                        }
                                    }}
                                    style={{
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        flex: 1,
                                        height: '100%',
                                        color: isActive ? colorPrimary : token.colorTextSecondary,
                                        cursor: 'pointer',
                                        transition: 'color 0.18s',
                                        position: 'relative',
                                        paddingTop: 4,
                                    }}
                                >
                                    {/* Active top indicator bar */}
                                    {isActive && (
                                        <div style={{
                                            position: 'absolute',
                                            top: 0,
                                            left: '25%',
                                            right: '25%',
                                            height: 3,
                                            backgroundColor: colorPrimary,
                                            borderRadius: '0 0 3px 3px',
                                        }} />
                                    )}
                                    <div style={{ fontSize: 20, marginBottom: 2, lineHeight: 1 }}>{item.icon}</div>
                                    <span style={{ fontSize: 10, fontWeight: isActive ? 700 : 400, lineHeight: 1 }}>{item.label}</span>
                                </div>
                            );
                        })}
                    </div>
                )}
            </Layout>
        </Layout>
    );
}
