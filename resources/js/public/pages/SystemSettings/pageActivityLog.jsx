import React from 'react';
import { Typography } from 'antd';

const { Title } = Typography;

export default function ActivityLog() {
    return (
        <div>
            <Title level={2}>Activity Log</Title>
            <p>Display system activity logs here.</p>
        </div>
    );
}
