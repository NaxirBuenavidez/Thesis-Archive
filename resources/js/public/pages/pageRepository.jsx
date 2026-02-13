import React from 'react';
import { Typography } from 'antd';

import { useAuth } from '../../context/AuthContext';
import { Spin } from 'antd';

const { Title } = Typography;

export default function Repository() {
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
            <Title level={2}>Repository</Title>
            <p>Content for repository browsing will go here.</p>
        </div>
    );
}
