import React from 'react';
import { Table, Button, Space, Modal, Dropdown, Typography } from 'antd';
import { MoreOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';

const { Text } = Typography;

export default function tableDept({ data, loading, onEdit, onDelete }) {
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
                        onClick: () => onEdit(record),
                    },
                    {
                        key: 'delete',
                        label: 'Delete',
                        icon: <DeleteOutlined />,
                        danger: true,
                        onClick: () => {
                            Modal.confirm({
                                title: 'Delete Department',
                                content: 'Are you sure you want to delete this department? This will also delete all associated programs.',
                                okText: 'Yes',
                                okType: 'danger',
                                cancelText: 'No',
                                onOk: () => onDelete(record.id),
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
            title: 'Department',
            dataIndex: 'name',
            key: 'name',
            sorter: (a, b) => a.name.localeCompare(b.name),
            render: (text) => <span style={{ fontWeight: 600 }}>{text}</span>,
        },
        {
            title: 'Programs',
            dataIndex: 'programs_count',
            key: 'programs_count',
            align: 'center',
            width: 100,
            render: (count) => <Text type="secondary">{count}</Text>,
        },
    ];

    return (
        <Table
            columns={columns}
            dataSource={data}
            rowKey="id"
            loading={loading}
            pagination={{ pageSize: 10 }}
            scroll={{ x: 600 }}
        />
    );
}
