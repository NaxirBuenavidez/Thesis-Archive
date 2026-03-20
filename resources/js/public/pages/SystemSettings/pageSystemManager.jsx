import React from 'react';
import { useSearchParams } from 'react-router-dom';
import { Typography, Tabs, Card, theme, Space, Grid } from 'antd';

const { useBreakpoint } = Grid;
import { useAuth } from '../../../context/AuthContext';
import TabDept from './components/tabDept';
import TabProgram from './components/tabProgram';
import TabBranding from './components/tabBranding';
import {
    Building20Filled,
    HatGraduation20Filled,
    BookOpen20Filled,
    PaintBucket20Filled,
} from '@fluentui/react-icons';

const { Title, Text } = Typography;

export default function SystemManager() {
    const { user } = useAuth();
    const { token } = theme.useToken();
    const screens = useBreakpoint();
    const isMobile = !screens.md;
    const [searchParams, setSearchParams] = useSearchParams();
    const activeTab = searchParams.get('tab') || '1';
    const setActiveTab = (key) => setSearchParams({ tab: key }, { replace: true });


    const items = [
        {
            key: '1',
            label: <Space><Building20Filled style={{ fontSize: 16, color: activeTab === '1' ? token.colorPrimary : undefined }} />{!isMobile && ' Departments'}</Space>,
            children: <TabDept />,
        },
        {
            key: '2',
            label: <Space><HatGraduation20Filled style={{ fontSize: 16, color: activeTab === '2' ? token.colorPrimary : undefined }} />{!isMobile && ' Programs'}</Space>,
            children: <TabProgram apiEndpoint="/api/programs" />,
        },
        {
            key: '3',
            label: <Space><BookOpen20Filled style={{ fontSize: 16, color: activeTab === '3' ? token.colorPrimary : undefined }} />{!isMobile && ' Senior High Programs'}</Space>,
            children: <TabProgram apiEndpoint="/api/senior-high-programs" isSeniorHigh={true} />,
        },
        {
            key: '4',
            label: <Space><PaintBucket20Filled style={{ fontSize: 16, color: activeTab === '4' ? token.colorPrimary : undefined }} />{!isMobile && ' Branding & CMS'}</Space>,
            children: <TabBranding />,
        },
    ];

    return (
        <div style={{ paddingBottom: '40px' }}>
            <div style={{ marginBottom: 24 }}>
                <Title level={isMobile ? 3 : 2} style={{ margin: 0, fontWeight: 700 }}>System Manager</Title>
                <Text type="secondary">Manage departments, programs, and educational tracks.</Text>
            </div>

            <Card
                variant="borderless"
                style={{
                    borderRadius: '16px',
                    boxShadow: '0 5px 20px rgba(0, 0, 0, 0.05)',
                    overflow: 'hidden',
                    background: token.colorBgContainer
                }}
            >
                <Tabs activeKey={activeTab} onChange={setActiveTab} items={items} />
            </Card>
        </div>
    );
}
