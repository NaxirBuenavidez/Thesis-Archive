import React from 'react';
import { Typography, Tabs, Card, theme } from 'antd';
import { useAuth } from '../../../context/AuthContext';
import { Spin } from 'antd';
import TabDept from './components/tabDept';
import TabProgram from './components/tabProgram';

const { Title, Text } = Typography;

export default function SystemManager() {
    const { user } = useAuth();
    const { token } = theme.useToken();

    if (!user) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 400 }}>
                <Spin size="large" />
            </div>
        );
    }

    const items = [
        {
            key: '1',
            label: 'Departments',
            children: <TabDept />,
        },
        {
            key: '2',
            label: 'Programs',
            children: <TabProgram apiEndpoint="/api/programs" />,
        },
        {
            key: '3',
            label: 'Senior High Programs',
            children: <TabProgram apiEndpoint="/api/senior-high-programs" isSeniorHigh={true} />,
        },
    ];

    return (
        <div style={{ paddingBottom: '40px' }}>
            <div style={{ marginBottom: 24 }}>
                <Title level={2} style={{ margin: 0, fontWeight: 700 }}>System Manager</Title>
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
                <Tabs defaultActiveKey="1" items={items} />
            </Card>
        </div>
    );
}
