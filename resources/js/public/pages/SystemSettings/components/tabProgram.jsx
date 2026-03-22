import React, { useState, useEffect } from 'react';
import { Table, Button, Space, Modal, Form, Input, Select, Popconfirm, Typography, Tooltip, Tag, Dropdown, App, Skeleton } from 'antd';
import { PlusOutlined, DeleteOutlined, ReloadOutlined, SearchOutlined, MoreOutlined, EditOutlined } from '@ant-design/icons';
import { handleFormErrors } from '../../../../utils/formUtils';

const { Text } = Typography;
const { Option } = Select;

export default function tabProgram({ apiEndpoint = '/api/programs', isSeniorHigh = false }) {
    const { message } = App.useApp();
    const [data, setData] = useState([]);
    const [departments, setDepartments] = useState([]);
    const [loading, setLoading] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [form] = Form.useForm();
    const [submitLoading, setSubmitLoading] = useState(false);
    const [searchText, setSearchText] = useState('');

    const [editingId, setEditingId] = useState(null);

    const fetchPrograms = async () => {
        setLoading(true);
        try {
            const response = await window.axios.get(apiEndpoint, { silent: true });
            setData(response.data);
        } catch (error) {
            message.error('Failed to fetch programs');
        } finally {
            setLoading(false);
        }
    };

    const fetchDepartments = async () => {
        try {
            const response = await window.axios.get('/api/departments', { silent: true });
            if (isSeniorHigh) {
                const shsDept = response.data.filter(d => d.name === 'SENIOR HIGH SCHOOL');
                setDepartments(shsDept);
            } else {
                setDepartments(response.data);
            }
        } catch (error) {
            message.error('Failed to fetch departments');
        }
    };

    useEffect(() => {
        fetchPrograms();
    }, [isSeniorHigh]);

    useEffect(() => {
        if (isModalOpen) {
            fetchDepartments();
        }
    }, [isModalOpen, isSeniorHigh]);

    const handleCreateOrUpdate = async (values) => {
        setSubmitLoading(true);
        try {
            if (editingId) {
                await window.axios.put(`${apiEndpoint}/${editingId}`, values, { silent: true });
                message.success('Program updated successfully');
            } else {
                await window.axios.post(apiEndpoint, values, { silent: true });
                message.success('Program created successfully');
            }
            setIsModalOpen(false);
            form.resetFields();
            setEditingId(null);
            fetchPrograms();
        } catch (error) {
            if (!handleFormErrors(error, form)) {
                message.error(error.response?.data?.message || 'Failed to save program');
            }
        } finally {
            setSubmitLoading(false);
        }
    };

    const openEditModal = (record) => {
        setEditingId(record.id);
        form.setFieldsValue({
            department_id: record.department_id,
            name: record.name,
            code: record.code,
            description: record.description,
        });
        setIsModalOpen(true);
    };

    const handleCancel = () => {
        setIsModalOpen(false);
        form.resetFields();
        setEditingId(null);
    };

    const handleDelete = async (id) => {
        try {
            await window.axios.delete(`${apiEndpoint}/${id}`, { silent: true });
            message.success('Program deleted successfully');
            fetchPrograms();
        } catch (error) {
            message.error('Failed to delete program');
        }
    };

    const columns = [
        {
            title: '',
            key: 'actions',
            width: 50,
            align: 'center',
            render: (_, record) => {
                const items = [
                    {
                        key: 'edit',
                        label: 'Edit',
                        icon: <EditOutlined />,
                        onClick: () => openEditModal(record),
                    },
                    {
                        key: 'delete',
                        label: 'Delete',
                        icon: <DeleteOutlined />,
                        danger: true,
                        onClick: () => {
                            Modal.confirm({
                                title: 'Delete Program',
                                content: 'Are you sure you want to delete this program?',
                                okText: 'Yes',
                                okType: 'danger',
                                cancelText: 'No',
                                onOk: () => handleDelete(record.id),
                            });
                        },
                    },
                ];

                return (
                    <Dropdown menu={{ items }} trigger={['click']}>
                        <Button type="text" icon={<MoreOutlined />} />
                    </Dropdown>
                );
            },
        },
        {
            title: 'Program Name',
            dataIndex: 'name',
            key: 'name',
            sorter: (a, b) => a.name.localeCompare(b.name),
            render: (text) => <span style={{ fontWeight: 600 }}>{text}</span>,
        },
        {
            title: 'Code',
            dataIndex: 'code',
            key: 'code',
            width: 120,
            render: (text) => <Tag color="blue">{text}</Tag>
        },
        {
            title: 'Department',
            dataIndex: ['department', 'name'],
            key: 'department',
            responsive: ['md'],
        },
        {
            title: 'Description',
            dataIndex: 'description',
            key: 'description',
            responsive: ['lg'],
            ellipsis: true,
        },
    ];

    const filteredData = data.filter(item =>
        item.name.toLowerCase().includes(searchText.toLowerCase()) ||
        (item.code && item.code.toLowerCase().includes(searchText.toLowerCase())) ||
        (item.department && item.department.name.toLowerCase().includes(searchText.toLowerCase()))
    );

    return (
        <div>
            <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8 }}>
                <Input
                    placeholder="Search programs..."
                    prefix={<SearchOutlined style={{ color: 'rgba(0,0,0,.25)' }} />}
                    style={{ width: 250 }}
                    value={searchText}
                    onChange={(e) => setSearchText(e.target.value)}
                    allowClear
                />
                <Space>
                    <Tooltip title="Refresh">
                        <Button icon={<ReloadOutlined />} onClick={fetchPrograms} />
                    </Tooltip>
                    <Button type="primary" icon={<PlusOutlined />} onClick={() => { setEditingId(null); form.resetFields(); setIsModalOpen(true); }}>
                        Add Program
                    </Button>
                </Space>
            </div>

            {loading ? (
                <div style={{ padding: '24px 0' }}>
                    <Skeleton active paragraph={{ rows: 8 }} />
                </div>
            ) : (
                <Table
                    columns={columns}
                    dataSource={filteredData}
                    rowKey="id"
                    loading={false}
                    pagination={{ pageSize: 10 }}
                    scroll={{ x: 600 }}
                />
            )}

            <Modal
                title={editingId ? (isSeniorHigh ? "Edit Senior High Program" : "Edit Program") : (isSeniorHigh ? "Add Senior High Program" : "Add New Program")}
                open={isModalOpen}
                onCancel={handleCancel}
                footer={null}
            >
                <Form layout="vertical" form={form} onFinish={handleCreateOrUpdate}>
                    <Form.Item
                        name="department_id"
                        label="Department"
                        rules={[{ required: true, message: 'Please select a department' }]}
                        initialValue={isSeniorHigh && departments.length > 0 ? departments[0].id : undefined}
                    >
                        <Select placeholder="Select Department" disabled={isSeniorHigh}>
                            {departments.map(dept => (
                                <Option key={dept.id} value={dept.id}>{dept.name}</Option>
                            ))}
                        </Select>
                    </Form.Item>
                    <Form.Item
                        name="name"
                        label="Program Name"
                        rules={[{ required: true, message: 'Please enter program name' }]}
                    >
                        <Input placeholder="e.g. Bachelor of Science in Information Systems" />
                    </Form.Item>
                    <Form.Item
                        name="code"
                        label="Code"
                        rules={[{ required: true, message: 'Please enter program code' }]}
                    >
                        <Input placeholder="e.g. BSIS" />
                    </Form.Item>
                    <Form.Item
                        name="description"
                        label="Description"
                    >
                        <Input.TextArea placeholder="Optional description" />
                    </Form.Item>
                    <Form.Item style={{ textAlign: 'right', marginBottom: 0 }}>
                        <Space>
                            <Button onClick={handleCancel}>Cancel</Button>
                            <Button type="primary" htmlType="submit" loading={submitLoading}>
                                {editingId ? "Update" : "Create"}
                            </Button>
                        </Space>
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
}
