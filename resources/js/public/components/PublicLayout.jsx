import React, { useState } from 'react';
import { Layout, theme, Drawer, Grid, ConfigProvider, Breadcrumb, Modal } from 'antd';
import { useNavigate, useLocation, Link, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useSystemConfig } from '../../context/SystemConfigContext';
import {
    DashboardOutlined,
    UsergroupAddOutlined,
    BookOutlined,
    FileTextOutlined,
    AuditOutlined,
    SettingOutlined,
    UserOutlined,
    LogoutOutlined,
    SafetyCertificateOutlined,
    HistoryOutlined,
    ToolOutlined,
    BarChartOutlined,
    HomeOutlined,
    MenuOutlined
} from '@ant-design/icons';
import sidebarPublic from './Layout/sidebarPublic';
import headerPublic from './Layout/headerPublic';
import footerPublic from './Layout/footerPublic';

const { Sider, Content } = Layout;
const { useBreakpoint } = Grid;

export default function PublicLayout({ children }) {
    const [collapsed, setCollapsed] = useState(false);
    const [drawerVisible, setDrawerVisible] = useState(false);

    const navigate = useNavigate();
    const location = useLocation();
    const screens = useBreakpoint();
    const isMobile = !screens.md;

    const { token } = theme.useToken();
    const { colorBgContainer, borderRadiusLG, colorPrimary, colorTextTertiary } = token;

    const [searchParams] = useSearchParams();
    const currentTab = searchParams.get('tab');

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

    const tabNameMap = {
        '/thesis-management': { preview: 'Document Preview', modify: 'Modify Record', remove: 'Remove Record' },
        '/review-manager': { public: 'Publicly Archive', private: 'Private Archive' },
        '/system-settings/system-manager': { '1': 'Departments', '2': 'Programs', '3': 'Senior High Programs' },
    };

    const extraBreadcrumbItems = pathSnippets.map((_, index) => {
        const url = `/${pathSnippets.slice(0, index + 1).join('/')}`;
        const name = breadcrumbNameMap[url] || url.split('/').pop().replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
        return { key: url, title: <Link to={url}>{name}</Link> };
    });

    if (currentTab && tabNameMap[location.pathname] && tabNameMap[location.pathname][currentTab]) {
        extraBreadcrumbItems.push({ key: `tab-${currentTab}`, title: tabNameMap[location.pathname][currentTab] });
    }

    const breadcrumbItems = [{ title: <Link to="/"><HomeOutlined style={{ color: colorTextTertiary, fontSize: '18px' }} /></Link>, key: 'home' }].concat(extraBreadcrumbItems);

    const { primary_color_dark, site_title, site_description, logo_path } = useSystemConfig();
    const sidebarBg = primary_color_dark || '#1A2CA3';
    const appName = site_title || 'Thesis Archive';
    const appDescription = site_description || 'System Archive';

    const getInitials = (name) => name.split(' ').map(word => word[0]).join('').toUpperCase().slice(0, 2);
    const appInitials = getInitials(appName);

    const { user, logout } = useAuth();
    const isSpAdmin = user?.role?.slug === 'spadmin';
    const isGuest = user?.role?.slug === 'anonymous';

    const desktopMainMenuItems = [
        { key: '/', icon: <DashboardOutlined />, label: 'Dashboard' },
        { key: '/users', icon: <UsergroupAddOutlined />, label: 'Users' },
        { key: '/repository', icon: <BookOutlined />, label: 'Repository' },
        { key: '/thesis-management', icon: <FileTextOutlined />, label: 'Thesis Management' },
        { key: '/review-manager', icon: <AuditOutlined />, label: 'Review Manager' },
        {
            key: 'system-settings',
            icon: <SettingOutlined />,
            label: 'System Settings',
            children: [
                ...(isSpAdmin ? [{ key: '/system-settings/permissions', label: 'Permission', icon: <SafetyCertificateOutlined /> }, { key: '/system-settings/activity-log', label: 'Activity Log', icon: <HistoryOutlined /> }] : []),
                { key: '/system-settings/system-manager', label: 'System Manager', icon: <ToolOutlined /> },
                { key: '/system-settings/reports', label: 'Reports', icon: <BarChartOutlined /> }
            ]
        },
    ];

    const mobileMainMenuItems = [
        { key: '/users', icon: <UsergroupAddOutlined />, label: 'Users' },
        {
            key: 'system-settings',
            icon: <SettingOutlined />,
            label: 'System Settings',
            children: [
                ...(isSpAdmin ? [{ key: '/system-settings/permissions', label: 'Permission', icon: <SafetyCertificateOutlined /> }, { key: '/system-settings/activity-log', label: 'Activity Log', icon: <HistoryOutlined /> }] : []),
                { key: '/system-settings/system-manager', label: 'System Manager', icon: <ToolOutlined /> },
                { key: '/system-settings/reports', label: 'Reports', icon: <BarChartOutlined /> }
            ]
        },
    ];

    const mainMenuItems = isMobile ? mobileMainMenuItems : desktopMainMenuItems;

    const bottomMenuItems = [
        { type: 'divider', style: { margin: '24px 16px', borderColor: 'rgba(255,255,255,0.15)' } },
        isGuest ? { key: 'login', icon: <UserOutlined />, label: 'Sign In' } : { key: 'signout', icon: <LogoutOutlined />, label: 'Sign Out', danger: true },
    ];

    const handleLogout = () => {
        Modal.confirm({
            title: 'Sign Out',
            content: 'Are you sure you want to log out of your account?',
            okText: 'Yes, Sign Out',
            cancelText: 'Cancel',
            okType: 'danger',
            centered: true,
            onOk: async () => await logout()
        });
    };

    const onMenuClick = ({ key }) => {
        if (isMobile) setDrawerVisible(false);
        if (key === 'login') navigate('/login');
        else if (key !== 'signout' && key !== 'system-settings') navigate(key);
    };

    const SidebarContent = sidebarPublic;
    const HeaderContent = headerPublic;
    const FooterContent = footerPublic;

    return (
        <Layout style={{ height: '100dvh', overflow: 'hidden' }}>
            {!isMobile && (
                <Sider collapsible collapsed={collapsed} onCollapse={setCollapsed} width={250} style={{ background: sidebarBg, height: '100dvh', position: 'fixed', left: 0, top: 0, bottom: 0, zIndex: 100 }} trigger={null}>
                    <SidebarContent user={user} collapsed={collapsed} location={location} mainMenuItems={mainMenuItems} bottomMenuItems={bottomMenuItems} onMenuClick={onMenuClick} handleLogout={handleLogout} isGuest={isGuest} />
                </Sider>
            )}

            <Drawer placement={isMobile ? "bottom" : "left"} closable={!isMobile} onClose={() => setDrawerVisible(false)} open={drawerVisible} styles={{ body: { padding: 0, backgroundColor: sidebarBg }, header: isMobile ? { display: 'none' } : { borderBottom: '1px solid #333' }, content: isMobile ? { borderTopLeftRadius: 24, borderTopRightRadius: 24, backgroundColor: sidebarBg } : undefined }}>
                {isMobile && <div style={{ padding: '12px 0 0 0', display: 'flex', justifyContent: 'center' }}><div style={{ width: 40, height: 4, backgroundColor: 'rgba(255,255,255,0.3)', borderRadius: 4 }} /></div>}
                <SidebarContent user={user} collapsed={false} location={location} mainMenuItems={mainMenuItems} bottomMenuItems={bottomMenuItems} onMenuClick={onMenuClick} handleLogout={handleLogout} isGuest={isGuest} />
            </Drawer>

            <Layout style={{ marginLeft: isMobile ? 0 : (collapsed ? 80 : 250), transition: 'margin-left 0.2s', height: '100dvh', overflowY: 'auto', position: 'relative' }}>
                {logo_path && <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundImage: `url(${logo_path})`, backgroundSize: '50% auto', backgroundPosition: 'center', backgroundRepeat: 'no-repeat', opacity: 0.05, zIndex: 0, pointerEvents: 'none' }} />}

                <HeaderContent collapsed={collapsed} setCollapsed={setCollapsed} isMobile={isMobile} logoPath={logo_path} appName={appName} appDescription={appDescription} appInitials={appInitials} primaryColor={colorPrimary} sidebarBg={sidebarBg} setDrawerVisible={setDrawerVisible} />

                <Content style={{ margin: '0 16px', display: 'flex', flexDirection: 'column', minHeight: 'calc(100dvh - 64px)', position: 'relative', zIndex: 1, paddingBottom: isMobile ? 80 : 0 }}>
                    <Breadcrumb style={{ margin: '16px 0' }} items={breadcrumbItems} />
                    <div style={{ padding: isMobile ? 12 : 24, background: colorBgContainer, borderRadius: borderRadiusLG, marginBottom: 16, flex: 1 }}>
                        {children || 'Select an item from the menu'}
                    </div>
                    <FooterContent isMobile={isMobile} appName={appName} colorPrimary={colorPrimary} />
                </Content>

                {isMobile && (
                    <div style={{ position: 'fixed', bottom: 0, left: 0, right: 0, height: 60, backgroundColor: colorBgContainer, borderTop: `1px solid ${token.colorBorderSecondary}`, display: 'flex', justifyContent: 'space-around', alignItems: 'stretch', zIndex: 1000, paddingBottom: 'env(safe-area-inset-bottom)', boxShadow: '0 -2px 12px rgba(0,0,0,0.07)' }}>
                        {[
                            { key: '/', icon: <DashboardOutlined />, label: 'Home' },
                            { key: '/repository', icon: <BookOutlined />, label: 'Library' },
                            { key: '/thesis-management', icon: <FileTextOutlined />, label: 'Manage' },
                            { key: '/review-manager', icon: <AuditOutlined />, label: 'Review' },
                            { key: 'more', icon: <MenuOutlined />, label: 'Menu', isAction: true }
                        ].map(item => {
                            const isActive = item.isAction ? drawerVisible : location.pathname === item.key;
                            return (
                                <div key={item.key} onClick={() => item.isAction ? setDrawerVisible(true) : navigate(item.key)} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', flex: 1, color: isActive ? colorPrimary : token.colorTextSecondary, cursor: 'pointer', position: 'relative', paddingTop: 4 }}>
                                    {isActive && <div style={{ position: 'absolute', top: 0, left: '25%', right: '25%', height: 3, backgroundColor: colorPrimary, borderRadius: '0 0 3px 3px' }} />}
                                    <div style={{ fontSize: 20, marginBottom: 2, lineHeight: 1 }}>{item.icon}</div>
                                    <span style={{ fontSize: 10, fontWeight: isActive ? 700 : 400 }}>{item.label}</span>
                                </div>
                            );
                        })}
                    </div>
                )}
            </Layout>
        </Layout>
    );
}
