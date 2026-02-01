import React, { useState } from 'react';
import { Layout, Menu, Breadcrumb, theme, Typography } from 'antd';
import {
    DesktopOutlined,
    PieChartOutlined,
    FileOutlined,
    TeamOutlined,
    UserOutlined,
} from '@ant-design/icons';

const { Header, Content, Footer, Sider } = Layout;
const { Title } = Typography;

function getItem(label, key, icon, children) {
    return {
        key,
        icon,
        children,
        label,
    };
}

const items = [
    getItem('Dashboard', '1', <PieChartOutlined />),
    getItem('Thesis Archive', '2', <DesktopOutlined />),
    getItem('User Management', 'sub1', <UserOutlined />, [
        getItem('Admins', '3'),
        getItem('Students', '4'),
    ]),
    getItem('Departments', 'sub2', <TeamOutlined />, [
        getItem('IT', '6'),
        getItem('Education', '8'),
    ]),
    getItem('Reports', '9', <FileOutlined />),
];

const MainLayout = ({ children }) => {
    const [collapsed, setCollapsed] = useState(false);
    const {
        token: { colorBgContainer, borderRadiusLG },
    } = theme.useToken();

    return (
        <Layout style={{ minHeight: '100vh' }}>
            <Sider collapsible collapsed={collapsed} onCollapse={(value) => setCollapsed(value)}>
                <div style={{ height: 32, margin: 16, background: 'rgba(255, 255, 255, 0.2)', borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 'bold' }}>
                    TA
                </div>
                <Menu theme="dark" defaultSelectedKeys={['1']} mode="inline" items={items} />
            </Sider>
            <Layout>
                <Header style={{ padding: '0 24px', background: colorBgContainer, display: 'flex', alignItems: 'center' }}>
                    <Title level={4} style={{ margin: 0 }}>Thesis Archiving System</Title>
                </Header>
                <Content style={{ margin: '0 16px' }}>
                    <Breadcrumb
                        style={{ margin: '16px 0' }}
                        items={[{ title: 'App' }, { title: 'Dashboard' }]}
                    />
                    <div
                        style={{
                            padding: 24,
                            minHeight: 360,
                            background: colorBgContainer,
                            borderRadius: borderRadiusLG,
                        }}
                    >
                        {children}
                    </div>
                </Content>
                <Footer style={{ textAlign: 'center' }}>
                    Thesis Archive ©{new Date().getFullYear()} Created by Naxir Buenavidez
                </Footer>
            </Layout>
        </Layout>
    );
};

export default MainLayout;
