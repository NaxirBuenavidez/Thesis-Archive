import React from 'react';
import { Typography } from 'antd';

const { Title } = Typography;

export default function SystemManager() {
    return (
        <div>
            <Title level={2}>System Manager</Title>
            <p>System management tools and configurations.</p>
        </div>
    );
}
