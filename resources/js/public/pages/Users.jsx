import React, { useState } from 'react';
import { Typography, Table, Tag, Space, Button, Card, Input, Tooltip, Avatar, Grid, Dropdown, ConfigProvider, theme } from 'antd';
import {
    PlusOutlined,
    SearchOutlined,
    ReloadOutlined,
    MoreOutlined,
    EditOutlined,
    DeleteOutlined,
    EyeOutlined
} from '@ant-design/icons';
import { useTableSearch } from '../../hooks/useTableSearch';

const { Title, Text } = Typography;
const { useBreakpoint } = Grid;

export default function Users() {
    const screens = useBreakpoint();

    const { token } = theme.useToken();
    const primaryColor = token.colorPrimary;

    // Generate mock data (moved up to be passed to hook)
    const [data] = useState(
        Array.from({ length: 45 }).map((_, i) => ({
            key: i,
            username: `User ${i + 1}`,
            email: `user${i + 1}@example.com`,
            role: i % 3 === 0 ? 'admin' : i % 3 === 1 ? 'editor' : 'viewer',
            createdAt: new Date(Date.now() - Math.floor(Math.random() * 10000000000)).toLocaleString(),
        }))
    );

    const {
        getColumnSearchProps,
        filteredData,
        setGlobalSearchText,
        globalSearchText
    } = useTableSearch(data);

    const columns = [
        {
            title: 'Actions',
            key: 'actions',
            render: (_, record) => (
                <Dropdown
                    menu={{
                        items: [
                            { key: 'view', icon: <EyeOutlined />, label: 'View Details' },
                            { key: 'edit', icon: <EditOutlined />, label: 'Edit' },
                            { type: 'divider' },
                            { key: 'delete', icon: <DeleteOutlined />, label: 'Delete', danger: true },
                        ]
                    }}
                    trigger={['click']}
                >
                    <Button type="text" icon={<MoreOutlined />} />
                </Dropdown>
            ),
            width: 80,
            align: 'center',
            fixed: screens.xs ? false : 'left',
        },
        {
            title: 'User',
            dataIndex: 'username',
            key: 'username',
            ...getColumnSearchProps('username', primaryColor),
            sorter: (a, b) => a.username.localeCompare(b.username),
            render: (text, record) => (
                <Space>
                    <Avatar style={{ backgroundColor: primaryColor }}>{text.charAt(0).toUpperCase()}</Avatar>
                    <Space orientation="vertical" size={0}>
                        <Text strong>{text}</Text>
                        <Text type="secondary" style={{ fontSize: '12px' }}>{record.email}</Text>
                    </Space>
                </Space>
            ),
            fixed: screens.xs ? false : 'left',
        },
        {
            title: 'Email',
            dataIndex: 'email',
            key: 'email',
            ...getColumnSearchProps('email', primaryColor),
            sorter: (a, b) => a.email.localeCompare(b.email),
            responsive: ['md'], // Hide on small screens
        },
        {
            title: 'Role',
            key: 'role',
            dataIndex: 'role',
            filters: [
                { text: 'Admin', value: 'admin' },
                { text: 'Editor', value: 'editor' },
                { text: 'Viewer', value: 'viewer' },
            ],
            onFilter: (value, record) => record.role.indexOf(value) === 0,
            render: (role) => {
                let color = role === 'admin' ? 'blue' : 'green';
                if (role === 'viewer') {
                    color = 'default';
                }
                return (
                    <Tag
                        color={color}
                        key={role}
                        style={{ borderRadius: '12px', padding: '0 10px', fontWeight: 500 }}
                    >
                        {role.toUpperCase()}
                    </Tag>
                );
            },
        },
        {
            title: 'Created At',
            dataIndex: 'createdAt',
            key: 'createdAt',
            sorter: (a, b) => new Date(a.createdAt) - new Date(b.createdAt),
            responsive: ['lg'], // Only show on large screens
        },
    ];

    return (
        <div>
            <div style={{ marginBottom: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
                <div>
                    <Title level={2} style={{ margin: 0, color: primaryColor }}>Users Management</Title>
                    <Text type="secondary">Manage your system users and their permissions</Text>
                </div>
                <Space wrap>
                    <Input
                        placeholder="Quick search..."
                        prefix={<SearchOutlined style={{ color: primaryColor }} />}
                        style={{ width: 250, borderRadius: '8px' }}
                        allowClear
                        value={globalSearchText}
                        onChange={(e) => setGlobalSearchText(e.target.value)}
                    />
                    <Tooltip title="Refresh List">
                        <Button
                            icon={<ReloadOutlined style={{ color: primaryColor }} />}
                            style={{ borderRadius: '8px' }}
                            onClick={() => {
                                setGlobalSearchText('');
                                // In a real app, this would re-fetch data
                            }}
                        />
                    </Tooltip>
                    <Button type="primary" icon={<PlusOutlined />} style={{ backgroundColor: primaryColor, borderRadius: '8px', height: '40px', padding: '0 24px', fontWeight: 600 }}>
                        Register User
                    </Button>
                </Space>
            </div>

            <Card
                variant="borderless"
                style={{
                    borderRadius: '16px',
                    boxShadow: '0 10px 30px -10px rgba(0, 0, 0, 0.1)',
                    borderTop: `4px solid ${primaryColor}`,
                    overflow: 'hidden'
                }}
                styles={{ body: { padding: 0 } }}
            >

                <Table
                    columns={columns}
                    dataSource={filteredData}
                    scroll={{ x: 800 }} // Enable horizontal scroll
                    pagination={{
                        defaultPageSize: 10,
                        showSizeChanger: true,
                        pageSizeOptions: ['10', '25', '50', '100'],
                        showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} items`,
                        style: { padding: '16px' }
                    }}
                />

            </Card>
        </div>
    );
}
