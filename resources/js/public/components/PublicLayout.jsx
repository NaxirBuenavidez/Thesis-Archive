import React, { useState } from 'react';
import { Layout, Menu, theme, Drawer, Button, Grid, Avatar, Typography, Space, ConfigProvider, Breadcrumb } from 'antd';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext'; // Import useAuth
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
        token: { colorBgContainer, borderRadiusLG, colorPrimary, colorTextTertiary },
    } = theme.useToken();

    // Breadcrumb Logic
    const pathSnippets = location.pathname.split('/').filter((i) => i);
    const breadcrumbNameMap = {
        '/': 'Dashboard',
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

    const extraBreadcrumbItems = pathSnippets.map((_, index) => {
        const url = `/${pathSnippets.slice(0, index + 1).join('/')}`;
        const name = breadcrumbNameMap[url] || url.split('/').pop().replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
        return {
            key: url,
            title: <Link to={url}>{name}</Link>,
        };
    });

    const breadcrumbItems = [
        {
            title: <Link to="/"><HomeOutlined style={{ color: colorTextTertiary, fontSize: '18px' }} /></Link>,
            key: 'home',
        },
    ].concat(extraBreadcrumbItems);



    // Blue Theme Palette
    const sidebarBg = import.meta.env.VITE_COLOR_PRIMARY_DARK || '#1A2CA3'; // Use env theme
    const appName = import.meta.env.VITE_APP_NAME || 'Thesis Archive';
    const appDescription = import.meta.env.VITE_APP_DESCRIPTION || 'System Archive';

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

    const mainMenuItems = [
        {
            key: 'dashboard',
            icon: <DashboardOutlined style={{ fontSize: '20px' }} />,
            label: <span style={{ fontWeight: 600, fontSize: '16px' }}>Dashboard</span>,
        },
        {
            key: 'users',
            icon: <UsergroupAddOutlined style={{ fontSize: '20px' }} />,
            label: <span style={{ fontWeight: 600, fontSize: '16px' }}>Users</span>,
        },
        {
            key: 'repository',
            icon: <BookOutlined style={{ fontSize: '20px' }} />,
            label: <span style={{ fontWeight: 600, fontSize: '16px' }}>Repository</span>,
        },
        {
            key: 'thesis-management',
            icon: <FileTextOutlined style={{ fontSize: '20px' }} />,
            label: <span style={{ fontWeight: 600, fontSize: '16px' }}>Thesis Management</span>,
        },
        {
            key: 'review-manager',
            icon: <AuditOutlined style={{ fontSize: '20px' }} />,
            label: <span style={{ fontWeight: 600, fontSize: '16px' }}>Review Manager</span>,
        },
        {
            key: 'system-settings',
            icon: <SettingOutlined style={{ fontSize: '20px' }} />,
            label: <span style={{ fontWeight: 600, fontSize: '16px' }}>System Settings</span>,
            children: [
                {
                    key: 'permissions',
                    label: 'Permission',
                    icon: <SafetyCertificateOutlined />,
                },
                {
                    key: 'activity-log',
                    label: 'Activity Log',
                    icon: <HistoryOutlined />,
                },
                {
                    key: 'system-manager',
                    label: 'System Manager',
                    icon: <ToolOutlined />,
                },
                {
                    key: 'reports',
                    label: 'Reports',
                    icon: <BarChartOutlined />,
                }
            ]
        },
    ];

    const bottomMenuItems = [
        {
            type: 'divider',
            style: { margin: '24px 16px', borderColor: 'rgba(255,255,255,0.15)' },
        },
        {
            key: 'notifications',
            icon: <BellOutlined style={{ fontSize: '20px' }} />,
            label: <span style={{ fontWeight: 600, fontSize: '16px' }}>Notifications</span>,
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
            <Avatar size={80} icon={<UserOutlined />} style={{ backgroundColor: 'rgba(255,255,255,0.2)', marginBottom: 16, border: '2px solid rgba(255,255,255,0.1)' }} />
            {!collapsed && (
                <div style={{ textAlign: 'center' }}>
                    <Text style={{ color: '#fff', display: 'block', fontWeight: 700, fontSize: '16px', letterSpacing: '0.5px' }}>Admin User</Text>
                    <Text style={{ color: 'rgba(255,255,255,0.65)', fontSize: '13px', marginTop: '4px', display: 'block' }}>Administrator</Text>
                </div>
            )}
        </div>
    );

    const { logout } = useAuth(); // Get logout from context

    const handleLogout = () => {
        logout();
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
                            'dashboard': '/',
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
        <Layout style={{ height: '100vh', overflow: 'hidden' }}>
            {!isMobile && (
                <Sider
                    collapsible
                    collapsed={collapsed}
                    onCollapse={(value) => setCollapsed(value)}
                    width={250}
                    style={{ background: sidebarBg, height: '100vh', position: 'fixed', left: 0, top: 0, bottom: 0, zIndex: 100 }}
                    trigger={null}
                >
                    {MenuComponent}
                </Sider>
            )}

            <Drawer
                title={appName}
                placement="left"
                onClose={() => setDrawerVisible(false)}
                open={drawerVisible}
                styles={{ body: { padding: 0, backgroundColor: sidebarBg }, header: { borderBottom: '1px solid #333' }, wrapper: { width: 250 } }}
            >
                {MenuComponent}
            </Drawer>

            <Layout style={{ marginLeft: isMobile ? 0 : (collapsed ? 80 : 250), transition: 'margin-left 0.2s', height: '100vh', overflowY: 'auto' }}>
                <Header style={{ padding: '0 16px', background: colorBgContainer, display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 99, width: '100%' }}>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        <Button
                            type="text"
                            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                            onClick={() => {
                                if (isMobile) {
                                    setDrawerVisible(true);
                                } else {
                                    setCollapsed(!collapsed);
                                }
                            }}
                            style={{
                                fontSize: '16px',
                                width: 50,
                                height: 50,
                                marginRight: 16
                            }}
                        />
                    </div>

                    {/* Centered Logo */}
                    <div style={{ position: 'absolute', left: '50%', transform: 'translateX(-50%)', display: 'flex', alignItems: 'center' }}>
                        <div style={{
                            width: 40,
                            height: 40,
                            backgroundColor: colorPrimary,
                            borderRadius: 8,
                            marginRight: 10,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: '#fff',
                            fontWeight: 'bold',
                            fontSize: 20
                        }}>{appInitials}</div>
                        <span style={{ fontSize: 20, fontWeight: 700, color: sidebarBg }}>{appName}</span>
                    </div>

                    {/* Placeholder for right side header items (notifications etc) */}
                    <div style={{ width: 64 }}></div>
                </Header>
                <Content style={{ margin: '0 16px' }}>
                    <Breadcrumb style={{ margin: '16px 0' }} items={breadcrumbItems} />
                    <div
                        style={{
                            padding: 24,
                            minHeight: 360,
                            background: colorBgContainer,
                            borderRadius: borderRadiusLG,
                            marginBottom: 24
                        }}
                    >
                        {children || "Select an item from the menu"}
                    </div>
                </Content>
            </Layout>
        </Layout>
    );
}
