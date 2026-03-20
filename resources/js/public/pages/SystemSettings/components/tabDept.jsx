import React, { useState, useEffect } from 'react';
import { Space, Input, Button, Tooltip } from 'antd';
import { Feedback } from '../../../components/UI/SystemNotifications';
import { ReloadOutlined, PlusOutlined, SearchOutlined } from '@ant-design/icons';
import TableDept from './departments/tableDept';
import ModalDept from './departments/modalDept';




export default function tabDept() {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [submitLoading, setSubmitLoading] = useState(false);
    const [searchText, setSearchText] = useState('');
    const [editingId, setEditingId] = useState(null);

    const fetchDepartments = async () => {
        setLoading(true);
        try {
            const response = await window.axios.get('/api/departments');
            setData(response.data);
        } catch (error) {
            Feedback.error('Failed to fetch departments');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDepartments();
    }, []);

    const handleCreateOrUpdate = async (values) => {
        setSubmitLoading(true);
        try {
            if (editingId) {
                await window.axios.put(`/api/departments/${editingId}`, values);
                Feedback.success('Department updated successfully');
            } else {
                await window.axios.post('/api/departments', values);
                Feedback.success('Department created successfully');
            }
            setIsModalOpen(false);
            setEditingId(null);
            fetchDepartments();
        } catch (error) {
            if (error.response && error.response.data && error.response.data.message) {
                Feedback.error(error.response.data.message);
            } else {
                Feedback.error('Failed to save department');
            }
        } finally {
            setSubmitLoading(false);
        }
    };

    const openEditModal = (record) => {
        setEditingId(record.id);
        setIsModalOpen(true);
    };

    const handleCancel = () => {
        setIsModalOpen(false);
        setEditingId(null);
    };

    const handleDelete = async (id) => {
        try {
            await window.axios.delete(`/api/departments/${id}`);
            Feedback.success('Department deleted successfully');
            fetchDepartments();
        } catch (error) {
            Feedback.error('Failed to delete department');
        }
    };

    const filteredData = data.filter(item =>
        item.name.toLowerCase().includes(searchText.toLowerCase())
    );

    return (
        <div>
            <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8 }}>
                <Input
                    placeholder="Search departments..."
                    prefix={<SearchOutlined style={{ color: 'rgba(0,0,0,.25)' }} />}
                    style={{ flex: 1, minWidth: 160, maxWidth: 300 }}
                    value={searchText}
                    onChange={(e) => setSearchText(e.target.value)}
                    allowClear
                />
                <Space>
                    <Tooltip title="Refresh">
                        <Button icon={<ReloadOutlined />} onClick={fetchDepartments} />
                    </Tooltip>
                    <Button type="primary" icon={<PlusOutlined />} onClick={() => { setEditingId(null); setIsModalOpen(true); }}>
                        Add Department
                    </Button>
                </Space>
            </div>

            <TableDept
                data={filteredData}
                loading={loading}
                onEdit={openEditModal}
                onDelete={handleDelete}
            />

            <ModalDept
                open={isModalOpen}
                onCancel={handleCancel}
                onFinish={handleCreateOrUpdate}
                submitLoading={submitLoading}
                initialValues={editingId ? data.find(d => d.id === editingId) : null}
            />
        </div>
    );
}
