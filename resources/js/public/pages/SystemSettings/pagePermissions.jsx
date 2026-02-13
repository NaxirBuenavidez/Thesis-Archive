import React from 'react';
import { Typography } from 'antd';

import { useAuth } from '../../../context/AuthContext';
import { Spin } from 'antd';

const { Title } = Typography;

export default function Permissions() {
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
            <Title level={2}>Permissions</Title>
            <p>Content for managing permissions will go here.</p>
        </div>
    );
}
