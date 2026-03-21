import React, { useState, useEffect } from 'react';
import { Typography, Table, Tag, Space, Button, Card, Input, Tooltip, Avatar, Grid, Dropdown, ConfigProvider, theme, Modal, Form, Select, App, Divider, Row, Col } from 'antd';
import {
    PlusOutlined,
    SearchOutlined,
    ReloadOutlined,
    MoreOutlined,
    EditOutlined,
    DeleteOutlined,
    EyeOutlined,
    UserOutlined
} from '@ant-design/icons';
import { User, Mail, Shield, Calendar, UserPlus } from 'lucide-react';
import { useTableSearch } from '../../hooks/useTableSearch';
import { handleFormErrors } from '../../utils/formUtils';
import { Feedback } from '../components/UI/SystemNotifications';
import { useAuth } from '../../context/AuthContext';

const { Title, Text } = Typography;
const { useBreakpoint } = Grid;

export default function Users() {
    const { user } = useAuth();
    const screens = useBreakpoint();
    const { token, roles: bootRoles } = useSystemConfig();
    const primaryColor = token.colorPrimary;


    const { message } = App.useApp();
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [form] = Form.useForm();
    const [submitLoading, setSubmitLoading] = useState(false);
    const [roles, setRoles] = useState([]);

    const fetchRoles = React.useCallback(async () => {
        if (bootRoles && bootRoles.length > 0) {
            setRoles(bootRoles);
            return;
        }
        try {
            const response = await window.axios.get('/api/roles', { silent: true });
            if (response.data) {
                setRoles(response.data);
            }
        } catch (error) {
            console.error("Failed to fetch roles", error);
        }
    }, [bootRoles]);

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const response = await window.axios.get('/api/users', { silent: true });
            if (response.data) {
                // Map API data to table format. Handle both paginated and direct array responses
                const usersList = response.data.data || (Array.isArray(response.data) ? response.data : []);
                const users = usersList.map(user => ({
                    key: user.id,
                    username: user.name,
                    email: user.email,
                    role: user.role ? user.role.name : 'viewer', // Adjust based on Role model
                    createdAt: user.created_at,
                    avatarUrl: user.profile?.avatar ? (user.profile.avatar.startsWith('http') || user.profile.avatar.startsWith('data:image') ? user.profile.avatar : `/storage/${user.profile.avatar}`) : null,
                }));
                setData(users);
            }
        } catch (error) {
            console.error("Failed to fetch users", error);
            Feedback.error("Failed to load users");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
        fetchRoles();
    }, [fetchRoles]);

    const handleCreateUser = async (values) => {
        setSubmitLoading(true);
        try {
            await window.axios.post('/api/users', values);
            Feedback.success('User created successfully');
            setIsModalOpen(false);
            form.resetFields();
            fetchUsers();
        } catch (error) {
            if (!handleFormErrors(error, form)) {
                Feedback.error(error.response?.data?.message || 'Failed to create user');
            }
        } finally {
            setSubmitLoading(false);
        }
    };

    const {
        getColumnSearchProps,
        filteredData,
        setGlobalSearchText,
        globalSearchText
    } = useTableSearch(data);

    const columns = [
        {
            title: 'User',
            dataIndex: 'username',
            key: 'username',
            ...getColumnSearchProps('username', primaryColor),
            sorter: (a, b) => a.username.localeCompare(b.username),
            render: (text, record) => (
                <Space>
                    <Avatar
                        style={{
                            backgroundColor: primaryColor,
                            verticalAlign: 'middle',
                            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                        }}
                        size={40}
                        src={record.avatarUrl}
                        icon={<UserOutlined />}
                    />
                    <Space orientation="vertical" size={0}>
                        <Text strong style={{ fontSize: '15px' }}>{text}</Text>
                        <Text type="secondary" style={{ fontSize: '13px' }}>{record.email}</Text>
                    </Space>
                </Space>
            ),
            fixed: screens.xs ? false : 'left',
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
            onFilter: (value, record) => record.role.toLowerCase() === value.toLowerCase(),
            render: (role) => {
                let color = role === 'admin' ? 'blue' : 'green';
                let icon = <Shield size={14} style={{ marginRight: 4, verticalAlign: 'middle' }} />;

                if (role === 'viewer') {
                    color = 'default';
                    icon = <User size={14} style={{ marginRight: 4, verticalAlign: 'middle' }} />;
                }

                return (
                    <Tag
                        color={color}
                        key={role}
                        style={{
                            borderRadius: '20px',
                            padding: '4px 12px',
                            fontWeight: 500,
                            display: 'inline-flex',
                            alignItems: 'center',
                            border: 'none'
                        }}
                    >
                        {icon}
                        {role.toUpperCase()}
                    </Tag>
                );
            },
        },
        {
            title: 'Added Date',
            dataIndex: 'createdAt',
            key: 'createdAt',
            sorter: (a, b) => new Date(a.createdAt) - new Date(b.createdAt),
            render: (date) => (
                <Space>
                    <Calendar size={14} style={{ color: token.colorTextSecondary }} />
                    <Text type="secondary">
                        {new Date(date).toLocaleDateString(undefined, {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric'
                        })}
                    </Text>
                </Space>
            ),
            responsive: ['md'],
        },
    ];

    const isMobile = !screens.md;

    return (
        <div style={{ paddingBottom: '40px' }}>
            <div style={{ marginBottom: 20 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 12, marginBottom: 12 }}>
                    <div>
                        <Title level={isMobile ? 3 : 2} style={{ margin: 0, fontWeight: 700 }}>Users</Title>
                        <Text type="secondary">Manage system access and permissions</Text>
                    </div>
                    {!isMobile && (
                        <Space>
                            <Tooltip title="Refresh List">
                                <Button icon={<ReloadOutlined />} size="large" style={{ borderRadius: '8px' }} onClick={() => { setGlobalSearchText(''); fetchUsers(); }} />
                            </Tooltip>
                            <Button type="primary" icon={<PlusOutlined />} size="large" style={{ borderRadius: '8px', padding: '0 24px', fontWeight: 600 }} onClick={() => setIsModalOpen(true)}>
                                Register User
                            </Button>
                        </Space>
                    )}
                </div>
                <div style={{ display: 'flex', gap: 8 }}>
                    <Input
                        placeholder="Search users..."
                        prefix={<SearchOutlined style={{ color: token.colorTextDescription }} />}
                        style={{ flex: 1, borderRadius: '8px' }}
                        allowClear
                        value={globalSearchText}
                        onChange={(e) => setGlobalSearchText(e.target.value)}
                        size="large"
                    />
                    {isMobile && (
                        <Button type="primary" icon={<PlusOutlined />} size="large" style={{ borderRadius: '8px' }} onClick={() => setIsModalOpen(true)} />
                    )}
                </div>
            </div>

            {isMobile ? (
                // ── Mobile: Card List ──
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                    {!loading && filteredData.map(record => (
                        <div key={record.key} style={{ background: token.colorBgContainer, borderRadius: 12, padding: '14px 16px', border: `1px solid ${token.colorBorderSecondary}`, display: 'flex', alignItems: 'center', gap: 12 }}>
                            <Avatar size={44} src={record.avatarUrl} icon={<UserOutlined />} style={{ backgroundColor: primaryColor, flexShrink: 0 }} />
                            <div style={{ flex: 1, minWidth: 0 }}>
                                <Text strong style={{ fontSize: 14, display: 'block' }} ellipsis>{record.username}</Text>
                                <Text type="secondary" style={{ fontSize: 12 }} ellipsis>{record.email}</Text>
                                <div style={{ marginTop: 4 }}>
                                    <Tag color={record.role === 'admin' ? 'blue' : record.role === 'viewer' ? 'default' : 'green'} style={{ borderRadius: 20, fontSize: 11, border: 'none' }}>{record.role.toUpperCase()}</Tag>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                // ── Desktop: Table ──
                <Card variant="borderless" style={{ borderRadius: '16px', boxShadow: '0 5px 20px rgba(0,0,0,0.05)', overflow: 'hidden', background: token.colorBgContainer }} styles={{ body: { padding: 0 } }}>
                    <Table
                        columns={columns}
                        dataSource={filteredData}
                        scroll={{ x: 800 }}
                        pagination={{ defaultPageSize: 10, showSizeChanger: true, pageSizeOptions: ['10', '25', '50'], showTotal: (total) => <Text type="secondary">{total} users found</Text>, style: { padding: '16px 24px' } }}
                        rowClassName={(record, index) => index % 2 === 0 ? 'table-row-light' : 'table-row-dark'}
                    />
                </Card>
            )}

            <Modal
                title={null}
                open={isModalOpen}
                onCancel={() => setIsModalOpen(false)}
                footer={null}
                centered
                width={500}
                style={{ maxWidth: 'calc(100vw - 32px)' }}
            >
                <div style={{ padding: '24px 0' }}>
                    <div style={{ textAlign: 'center', marginBottom: 24 }}>
                        <Title level={4} style={{ margin: 0 }}>Register New User</Title>
                        <Text type="secondary">Register a new account for a team member</Text>
                    </div>

                    <Form
                        form={form}
                        layout="vertical"
                        onFinish={handleCreateUser}
                        size="large"
                    >
                        <Form.Item
                            name="name"
                            label="Full Name"
                            rules={[{ required: true, message: 'Please enter a name' }]}
                        >
                            <Input
                                placeholder="John Doe"
                                prefix={<User size={18} color="rgba(0,0,0,.25)" />}
                            />
                        </Form.Item>
                        <Form.Item
                            name="email"
                            label="Email Address"
                            rules={[
                                { required: true, message: 'Please enter an email' },
                                { type: 'email', message: 'Please enter a valid email' }
                            ]}
                        >
                            <Input
                                placeholder="john@company.com"
                                prefix={<Mail size={18} color="rgba(0,0,0,.25)" />}
                            />
                        </Form.Item>
                        <Form.Item
                            name="role_id"
                            label="Role"
                            rules={[{ required: true, message: 'Please select a role' }]}
                        >
                            <Select
                                suffixIcon={<Shield size={18} color="rgba(0,0,0,.25)" />}
                                options={roles.map(role => ({
                                    label: role.name.charAt(0).toUpperCase() + role.name.slice(1),
                                    value: role.id
                                }))}
                            />
                        </Form.Item>
                        <Form.Item
                            name="password"
                            label="Password"
                            rules={[
                                { required: true, message: 'Please enter a password' },
                                { min: 8, message: 'Password must be at least 8 characters' }
                            ]}
                        >
                            <Input.Password
                                placeholder="Enter password"
                                prefix={<Shield size={18} color="rgba(0,0,0,.25)" />}
                            />
                        </Form.Item>
                        <Form.Item
                            name="password_confirmation"
                            label="Confirm Password"
                            dependencies={['password']}
                            rules={[
                                { required: true, message: 'Please confirm the password' },
                                ({ getFieldValue }) => ({
                                    validator(_, value) {
                                        if (!value || getFieldValue('password') === value) {
                                            return Promise.resolve();
                                        }
                                        return Promise.reject(new Error('Passwords do not match'));
                                    },
                                }),
                            ]}
                        >
                            <Input.Password
                                placeholder="Confirm password"
                                prefix={<Shield size={18} color="rgba(0,0,0,.25)" />}
                            />
                        </Form.Item>

                        <Divider style={{ margin: '24px 0' }} />

                        <Form.Item style={{ marginBottom: 0, textAlign: 'right' }}>
                            <Space>
                                <Button onClick={() => setIsModalOpen(false)} size="large">
                                    Cancel
                                </Button>
                                <Button type="primary" htmlType="submit" loading={submitLoading} size="large">
                                    Register User
                                </Button>
                            </Space>
                        </Form.Item>
                    </Form>
                </div>
            </Modal>
        </div>
    );
}
