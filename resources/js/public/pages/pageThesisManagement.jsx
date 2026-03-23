import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Typography, Space, Button, Card, Input, Tooltip, Grid, theme, Tabs, App, Form, ConfigProvider, Table, Skeleton, Tag, Avatar } from 'antd';
import { 
    SearchOutlined, 
    ReloadOutlined, 
    PlusOutlined, 
    FilePdfOutlined 
} from '@ant-design/icons';
import { 
    Edit20Filled, 
    Delete20Filled, 
    Eye20Filled 
} from '@fluentui/react-icons';
import { Clock, Calendar } from 'lucide-react';
import dayjs from 'dayjs';
import { useAuth } from '../../context/AuthContext';
import { useSystemConfig } from '../../context/SystemConfigContext';
import { useTableSearch } from '../../hooks/useTableSearch';
import { handleFormErrors } from '../../utils/formUtils';
import { Feedback } from '../components/UI/SystemNotifications';
import thesesApi from '../../api/thesesApi';
import { sessionCache } from '../../utils/sessionCache';

// Import local components
import tableThesis from './Management/components/tableThesis';
import modalThesisForm from './Management/components/modalThesisForm';
import drawerThesisPreview from './Management/components/drawerThesisPreview';

const { Title, Text } = Typography;
const { useBreakpoint } = Grid;

export default function ThesisManagement() {
    const { user } = useAuth();
    const screens = useBreakpoint();
    const { token } = theme.useToken();
    const { departments: bootDepts, programs: bootProgs } = useSystemConfig();
    const primaryColor = token.colorPrimary;
    const { message, modal } = App.useApp();

    const [data, setData] = useState(sessionCache.get('management_theses') || []);
    const [loading, setLoading] = useState(!sessionCache.get('management_theses'));
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [form] = Form.useForm();
    const [submitLoading, setSubmitLoading] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [pdfFileList, setPdfFileList] = useState([]);
    const [existingPdfName, setExistingPdfName] = useState(null);
    const [departments, setDepartments] = useState([]);
    const [programs, setPrograms] = useState([]);
    const [selectedDeptId, setSelectedDeptId] = useState(null);
    const [searchParams, setSearchParams] = useSearchParams();
    const [previewThesis, setPreviewThesis] = useState(null);
    const [isPreviewOpen, setIsPreviewOpen] = useState(false);
    const [selectedRowKeys, setSelectedRowKeys] = useState([]);

    const activeTab = searchParams.get('tab') || 'preview';
    const setActiveTab = (key) => setSearchParams({ tab: key }, { replace: true });

    const fetchInitialData = async () => {
        setLoading(true);
        try {
            const thesesRes = await thesesApi.getAll({ silent: true });
            
            const formattedTheses = (thesesRes.data || thesesRes || []).map(thesis => ({
                key: thesis.id,
                title: thesis.title,
                subtitle: thesis.subtitle,
                abstract: thesis.abstract,
                discipline: thesis.discipline,
                keywords: thesis.keywords || [],
                status: thesis.status,
                degreeType: thesis.degree_type,
                department: thesis.department,
                submissionDate: thesis.submission_date,
                defenseDate: thesis.defense_date,
                isConfidential: thesis.is_confidential,
                author: thesis.author || (thesis.owner ? thesis.owner.name : 'Unknown'),
                raw: thesis
            }));
            
            setData(formattedTheses);
            sessionCache.set('management_theses', formattedTheses);
            setSelectedRowKeys([]); // Reset selection on refresh
            setDepartments(bootDepts || []);
            setPrograms(bootProgs || []);
        } catch (error) {
            console.error("Failed to fetch initial data", error);
            Feedback.error("Failed to load systems resources");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchInitialData();
    }, []);

    const handleBulkDelete = () => {
        modal.confirm({
            title: `Delete ${selectedRowKeys.length} Theses`,
            content: `Are you sure you want to delete the selected ${selectedRowKeys.length} thesis records? This action cannot be undone.`,
            okText: 'Yes, Delete All',
            okType: 'danger',
            onOk: async () => {
                try {
                    await thesesApi.bulkDelete(selectedRowKeys);
                    Feedback.success(`${selectedRowKeys.length} theses deleted successfully`);
                    fetchInitialData();
                } catch (error) {
                    Feedback.error('Failed to perform bulk deletion');
                }
            }
        });
    };

    const openCreateModal = () => {
        setEditingId(null);
        form.resetFields();
        form.setFieldsValue({ status: 'draft', is_confidential: false });
        setPdfFileList([]);
        setExistingPdfName(null);
        setSelectedDeptId(null);
        setIsModalOpen(true);
    };

    const openEditModal = (record) => {
        setEditingId(record.key);
        const matchedDept = departments.find(d => d.name === record.department);
        const deptId = matchedDept ? matchedDept.id : null;
        setSelectedDeptId(deptId);
        form.setFieldsValue({
            ...record.raw,
            submission_date: record.submissionDate ? dayjs(record.submissionDate) : null,
            defense_date: record.defenseDate ? dayjs(record.defenseDate) : null,
            dept_id: deptId,
            is_confidential: !!record.isConfidential
        });
        setPdfFileList([]);
        setExistingPdfName(record.raw?.pdf_original_name || null);
        setIsModalOpen(true);
    };

    const handleDelete = React.useCallback((id) => {
        modal.confirm({
            title: 'Delete Thesis',
            content: 'Are you sure you want to delete this thesis record? This action cannot be undone.',
            okText: 'Yes, Delete',
            okType: 'danger',
            onOk: async () => {
                try {
                    await thesesApi.delete(id);
                    Feedback.success('Thesis deleted successfully');
                    fetchInitialData();
                } catch (error) {
                    Feedback.error('Failed to delete thesis');
                }
            }
        });
    }, [modal, message, fetchInitialData]);

    const handleSubmit = async (values) => {
        setSubmitLoading(true);
        try {
            const formData = new FormData();
            Object.keys(values).forEach(key => {
                if (values[key] === undefined || values[key] === null) return;
                if (key === 'keywords') {
                    values.keywords.forEach(kw => formData.append('keywords[]', kw));
                } else if (key === 'submission_date' || key === 'defense_date') {
                    formData.append(key, values[key].format('YYYY-MM-DD HH:mm:ss'));
                } else if (key === 'is_confidential') {
                    formData.append(key, values[key] ? '1' : '0');
                } else if (key === 'dept_id') {
                    const dept = departments.find(d => d.id === values.dept_id);
                    if (dept) formData.append('department', dept.name);
                } else {
                    formData.append(key, values[key]);
                }
            });

            if (pdfFileList.length > 0 && pdfFileList[0].originFileObj) {
                formData.append('pdf_file', pdfFileList[0].originFileObj);
            }

            if (editingId) {
                await thesesApi.update(editingId, formData);
                message.success('Thesis updated successfully');
            } else {
                formData.append('status', 'under_review');
                await thesesApi.create(formData);
                message.success('Thesis created successfully');
            }
            setIsModalOpen(false);
            fetchInitialData();
        } catch (error) {
            if (!handleFormErrors(error, form)) {
                message.error(error.response?.data?.message || 'Failed to save thesis');
            }
        } finally {
            setSubmitLoading(false);
        }
    };

    const { getColumnSearchProps, filteredData, setGlobalSearchText, globalSearchText } = useTableSearch(data);

    const getStatusColor = React.useCallback((status) => {
        const colors = { published: 'green', accepted: 'cyan', under_review: 'orange', submitted: 'blue', rejected: 'red', draft: 'default' };
        return colors[status] || 'default';
    }, []);

    const onSelectChange = (newSelectedRowKeys) => {
        setSelectedRowKeys(newSelectedRowKeys);
    };

    const rowSelection = {
        selectedRowKeys,
        onChange: onSelectChange,
        selections: [
            Table.SELECTION_ALL,
            Table.SELECTION_INVERT,
            Table.SELECTION_NONE,
        ],
    };

    const columns = React.useMemo(() => [
        {
            title: 'Action',
            key: 'actions',
            render: (_, record) => {
                if (activeTab === 'modify') return <Button type="primary" icon={<Edit20Filled />} size="small" onClick={(e) => { e.stopPropagation(); openEditModal(record); }}>Modify</Button>;
                if (activeTab === 'remove') return <Button type="primary" danger icon={<Delete20Filled />} size="small" onClick={(e) => { e.stopPropagation(); handleDelete(record.key); }}>Remove</Button>;
                return <Button type="primary" icon={<Eye20Filled />} size="small" onClick={(e) => { e.stopPropagation(); setPreviewThesis(record); setIsPreviewOpen(true); }}>Preview</Button>;
            },
            width: 110, align: 'center', fixed: screens.xs ? false : 'left',
        },
        {
            title: 'Thesis Title',
            dataIndex: 'title',
            key: 'title',
            ...getColumnSearchProps('title', primaryColor),
            sorter: (a, b) => a.title.localeCompare(b.title),
            render: (text, record) => (
                <Space>
                    <Avatar style={{ backgroundColor: '#fff1f0', border: '1px solid #ffccc7' }} size={40} icon={<FilePdfOutlined style={{ color: '#ff4d4f', fontSize: 20 }} />} />
                    <Space direction="vertical" size={0}>
                        <Text strong style={{ fontSize: '15px', maxWidth: 300 }} ellipsis={{ tooltip: text }}>{text}</Text>
                        <Text type="secondary" style={{ fontSize: '13px' }}>{record.author} • {record.department || 'No Dept'}</Text>
                    </Space>
                </Space>
            ),
            fixed: screens.xs ? false : 'left', width: 350,
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            render: (status) => (
                <Tag color={getStatusColor(status)} className="status-tag">
                    <Clock size={14} style={{ marginRight: 4 }} />
                    {status.replace('_', ' ').toUpperCase()}
                </Tag>
            ),
        },
        {
            title: 'Submitted/Date',
            dataIndex: 'submissionDate',
            key: 'submissionDate',
            render: (date) => (
                <Space>
                    <Calendar size={14} style={{ color: token.colorTextSecondary }} />
                    <Text type="secondary">{date ? dayjs(date).format('MMM DD, YYYY') : 'Not submitted'}</Text>
                </Space>
            ),
        }
    ], [activeTab, openEditModal, handleDelete, getColumnSearchProps, primaryColor, screens.xs, getStatusColor, token.colorTextSecondary]);

    const isMobile = !screens.md;

    const ThesisTable = tableThesis;
    const ThesisForm = modalThesisForm;
    const ThesisPreview = drawerThesisPreview;

    return (
        <ConfigProvider theme={{ components: { Table: { headerBg: token.colorFillQuaternary, headerColor: token.colorTextSecondary } } }}>
            <div className="management-page-container" style={{ paddingBottom: '40px' }}>
                <div style={{ marginBottom: 20 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12, marginBottom: 12 }}>
                        <div>
                            <Title level={isMobile ? 3 : 2} style={{ margin: 0, fontWeight: 700 }}>Thesis Management</Title>
                            <Text type="secondary">Manage repository of theses and research papers</Text>
                        </div>
                        {!isMobile && (
                            <Space>
                                {selectedRowKeys.length > 0 && (
                                    <Button 
                                        danger 
                                        type="primary" 
                                        icon={<Delete20Filled />} 
                                        size="large" 
                                        onClick={handleBulkDelete}
                                        className="bulk-delete-btn"
                                    >
                                        Delete Selected ({selectedRowKeys.length})
                                    </Button>
                                )}
                                <Tooltip title="Refresh List"><Button icon={<ReloadOutlined />} size="large" onClick={() => { setGlobalSearchText(''); fetchInitialData(); }} /></Tooltip>
                                <Button type="primary" icon={<PlusOutlined />} size="large" onClick={openCreateModal}>Archive</Button>
                            </Space>
                        )}
                    </div>
                    <div style={{ display: 'flex', gap: 8 }}>
                        <Input placeholder="Search theses..." prefix={<SearchOutlined />} value={globalSearchText} onChange={(e) => setGlobalSearchText(e.target.value)} size="large" allowClear />
                        {isMobile && <Button type="primary" icon={<PlusOutlined />} size="large" onClick={openCreateModal} />}
                    </div>
                    
                    {isMobile && selectedRowKeys.length > 0 && (
                        <div style={{ marginTop: 12 }}>
                            <Button 
                                danger 
                                type="primary" 
                                icon={<Delete20Filled />} 
                                block 
                                size="large" 
                                onClick={handleBulkDelete}
                                style={{ borderRadius: 12 }}
                            >
                                Delete Selected ({selectedRowKeys.length})
                            </Button>
                        </div>
                    )}
                </div>

                <Card className="management-card">
                    <Tabs
                        activeKey={activeTab}
                        onChange={setActiveTab}
                        style={{ padding: isMobile ? '12px 16px 0' : '16px 24px 0' }}
                        items={[
                            { key: 'preview', label: <Space><Eye20Filled style={{ fontSize: 16 }} />{!isMobile && 'Document Preview'}</Space> },
                            { key: 'modify', label: <Space><Edit20Filled style={{ fontSize: 16 }} />{!isMobile && 'Modify Record'}</Space> },
                            { key: 'remove', label: <Space><Delete20Filled style={{ fontSize: 16 }} />{!isMobile && 'Remove Record'}</Space> },
                        ]}
                    />
                    
                    {isMobile ? (
                        <div style={{ padding: '12px 16px' }}>
                            {loading ? (
                                [1, 2, 3, 4, 5].map(i => (
                                    <Card key={i} style={{ marginBottom: 10, borderRadius: 10 }}>
                                        <Skeleton active paragraph={{ rows: 2 }} />
                                    </Card>
                                ))
                            ) : (
                                <>
                                    <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 12 }}>
                                        <Button 
                                            size="small" 
                                            onClick={() => setSelectedRowKeys(selectedRowKeys.length === filteredData.length ? [] : filteredData.map(d => d.key))}
                                        >
                                            {selectedRowKeys.length === filteredData.length ? 'Deselect All' : 'Select All'}
                                        </Button>
                                    </div>
                                    {filteredData.map(record => (
                                        <div 
                                            key={record.key} 
                                            className={`mobile-thesis-item ${selectedRowKeys.includes(record.key) ? 'selected' : ''}`} 
                                            onClick={() => {
                                                if (selectedRowKeys.length > 0) {
                                                    // If in selection mode, toggle selection
                                                    onSelectChange(selectedRowKeys.includes(record.key) ? selectedRowKeys.filter(k => k !== record.key) : [...selectedRowKeys, record.key]);
                                                } else {
                                                    if (activeTab === 'preview') { setPreviewThesis(record); setIsPreviewOpen(true); }
                                                    else if (activeTab === 'modify') openEditModal(record);
                                                    else if (activeTab === 'remove') handleDelete(record.key);
                                                }
                                            }}
                                            onContextMenu={(e) => {
                                                e.preventDefault();
                                                onSelectChange([...selectedRowKeys, record.key]);
                                            }}
                                        >
                                            <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                                                {selectedRowKeys.length > 0 && (
                                                    <div style={{ 
                                                        width: 20, height: 20, borderRadius: 6, 
                                                        border: `2px solid ${selectedRowKeys.includes(record.key) ? primaryColor : token.colorBorder}`,
                                                        backgroundColor: selectedRowKeys.includes(record.key) ? primaryColor : 'transparent',
                                                        display: 'flex', alignItems: 'center', justifyContent: 'center'
                                                    }}>
                                                        {selectedRowKeys.includes(record.key) && <div style={{ width: 8, height: 8, backgroundColor: '#fff', borderRadius: 2 }} />}
                                                    </div>
                                                )}
                                                <div style={{ flex: 1 }}>
                                                    <div style={{ display: 'flex', justifyContent: 'space-between', gap: 8, marginBottom: 6 }}>
                                                        <Text strong style={{ fontSize: 13, flex: 1 }} ellipsis>{record.title}</Text>
                                                        <Tag color={getStatusColor(record.status)} className="status-tag" style={{ fontSize: 11 }}>{record.status.toUpperCase()}</Tag>
                                                    </div>
                                                    <Text type="secondary" style={{ fontSize: 12 }}>{record.author} · {record.department || 'No dept'}</Text>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </>
                            )}
                        </div>
                    ) : (
                        <div style={{ padding: loading ? '24px' : '0' }}>
                            {loading ? (
                                <Skeleton active paragraph={{ rows: 10 }} />
                            ) : (
                                <ThesisTable 
                                    columns={columns} 
                                    dataSource={filteredData} 
                                    loading={false} 
                                    activeTab={activeTab}
                                    onPreview={(rec) => { setPreviewThesis(rec); setIsPreviewOpen(true); }}
                                    onEdit={openEditModal}
                                    onDelete={handleDelete}
                                    screens={screens}
                                    rowSelection={rowSelection}
                                />
                            )}
                        </div>
                    )}
                </Card>

                <ThesisPreview 
                    open={isPreviewOpen} 
                    onClose={() => setIsPreviewOpen(false)} 
                    thesis={previewThesis} 
                    isMobile={isMobile} 
                    getStatusColor={getStatusColor} 
                    primaryColor={primaryColor} 
                    token={token}
                />

                <ThesisForm 
                    open={isModalOpen}
                    onCancel={() => setIsModalOpen(false)}
                    onFinish={handleSubmit}
                    form={form}
                    loading={submitLoading}
                    editingId={editingId}
                    departments={departments}
                    programs={programs}
                    selectedDeptId={selectedDeptId}
                    setSelectedDeptId={setSelectedDeptId}
                    pdfFileList={pdfFileList}
                    setPdfFileList={setPdfFileList}
                    existingPdfName={existingPdfName}
                    primaryColor={primaryColor}
                    isMobile={isMobile}
                />
            </div>
        </ConfigProvider>
    );
}

