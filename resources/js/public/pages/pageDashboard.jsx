import React from 'react';
import { Typography, Card, Row, Col } from 'antd';

import { useAuth } from '../../context/AuthContext';
import { Spin } from 'antd';

const { Title } = Typography;

export default function Dashboard() {
    const { user } = useAuth();

    if (!user) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 400 }}>
                <Spin size="large" />
            </div>
        );
    }
    return (
        <div>
            <Title level={2}>Dashboard</Title>
            <Row gutter={16}>
                <Col span={8}>
                    <Card title="Total Theses" variant="borderless">
                        120
                    </Card>
                </Col>
                <Col span={8}>
                    <Card title="Active Users" variant="borderless">
                        45
                    </Card>
                </Col>
                <Col span={8}>
                    <Card title="Pending Reviews" variant="borderless">
                        12
                    </Card>
                </Col>
            </Row>
        </div>
    );
}
