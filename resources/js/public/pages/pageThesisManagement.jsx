import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Typography, Table, Tag, Space, Button, Card, Input, Tooltip, Avatar, Grid, Dropdown, ConfigProvider, theme, Modal, Form, Select, DatePicker, Switch, App, Divider, Row, Col, Upload, Tabs, Drawer, Descriptions, Badge } from 'antd';
import {
    PlusOutlined,
    SearchOutlined,
    ReloadOutlined,
    MoreOutlined,
    EditOutlined,
    DeleteOutlined,
    EyeOutlined,
    InboxOutlined,
    FilePdfOutlined,
    LinkOutlined,
    FileTextOutlined
} from '@ant-design/icons';
import { Calendar, BookOpen, Clock, Eye, Pencil, Trash2 } from 'lucide-react';
import { useTableSearch } from '../../hooks/useTableSearch';
import { useAuth } from '../../context/AuthContext';
import { Spin } from 'antd';
import dayjs from 'dayjs';

const { Title, Text } = Typography;
const { TextArea } = Input;
const { useBreakpoint } = Grid;

export default function ThesisManagement() {
    const { user } = useAuth();
    const screens = useBreakpoint();
    const navigate = useNavigate();

    if (!user) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 400 }}>
                <Spin size="large" />
            </div>
        );
    }

    const { token } = theme.useToken();
    const primaryColor = token.colorPrimary;
    const { message, modal } = App.useApp();

    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
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
    const activeTab = searchParams.get('tab') || 'preview';
    const setActiveTab = (key) => setSearchParams({ tab: key }, { replace: true });
    const [previewThesis, setPreviewThesis] = useState(null);
    const [isPreviewOpen, setIsPreviewOpen] = useState(false);

    const fetchTheses = async () => {
        setLoading(true);
        try {
            const response = await window.axios.get('/api/theses');
            if (response.data) {
                const theses = response.data.map(thesis => ({
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
                setData(theses);
            }
        } catch (error) {
            console.error("Failed to fetch theses", error);
            message.error("Failed to load theses");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTheses();
        const fetchDepartments = async () => {
            try {
                const res = await window.axios.get('/api/departments');
                if (res.data) setDepartments(res.data);
            } catch (e) {
                console.error('Failed to load departments', e);
            }
        };
        const fetchPrograms = async () => {
            try {
                const res = await window.axios.get('/api/programs');
                if (res.data) setPrograms(res.data);
            } catch (e) {
                console.error('Failed to load programs', e);
            }
        };
        fetchDepartments();
        fetchPrograms();
    }, []);

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
        const rawDeptName = record.department || '';
        const matchedDept = departments.find(d => d.name === rawDeptName);
        const deptId = matchedDept ? matchedDept.id : null;
        setSelectedDeptId(deptId);
        form.setFieldsValue({
            title: record.title,
            author: record.author,
            subtitle: record.subtitle,
            abstract: record.abstract,
            discipline: record.discipline,
            keywords: record.keywords,
            status: record.status,
            dept_id: deptId,
            degree_type: record.degreeType,
            submission_date: record.submissionDate ? dayjs(record.submissionDate) : null,
            defense_date: record.defenseDate ? dayjs(record.defenseDate) : null,
            is_confidential: record.isConfidential,
            doi: record.raw?.doi,
            co_author: record.raw?.co_author,
            panelists: record.raw?.panelists,
            recommended_by: record.raw?.recommended_by,
            archived_by: record.raw?.archived_by,
        });
        setPdfFileList([]);
        setExistingPdfName(record.raw && record.raw.pdf_original_name ? record.raw.pdf_original_name : null);
        setIsModalOpen(true);
    };

    const handleDelete = (id) => {
        modal.confirm({
            title: 'Delete Thesis',
            content: 'Are you sure you want to delete this thesis record? This action cannot be undone.',
            okText: 'Yes, Delete',
            okType: 'danger',
            cancelText: 'Cancel',
            onOk: async () => {
                try {
                    await window.axios.delete(`/api/theses/${id}`);
                    message.success('Thesis deleted successfully');
                    fetchTheses();
                } catch (error) {
                    message.error('Failed to delete thesis');
                }
            }
        });
    };

    const handleSubmit = async (values) => {
        setSubmitLoading(true);
        try {
            const formData = new FormData();
            formData.append('title', values.title || '');
            formData.append('author', values.author || '');
            if (values.subtitle) formData.append('subtitle', values.subtitle);
            if (values.abstract) formData.append('abstract', values.abstract);
            if (values.discipline) formData.append('discipline', values.discipline);
            if (values.doi) formData.append('doi', values.doi);
            if (values.co_author) formData.append('co_author', values.co_author);
            if (values.panelists) formData.append('panelists', values.panelists);
            if (values.recommended_by) formData.append('recommended_by', values.recommended_by);
            if (values.archived_by) formData.append('archived_by', values.archived_by);
            if (values.keywords && values.keywords.length > 0) {
                values.keywords.forEach((kw) => formData.append('keywords[]', kw));
            }
            formData.append('status', editingId ? (values.status || 'under_review') : 'under_review');
            if (values.degree_type) formData.append('degree_type', values.degree_type);
            if (values.institution) formData.append('institution', values.institution);
            if (values.dept_id) {
                const dept = departments.find(d => d.id === values.dept_id);
                if (dept) formData.append('department', dept.name);
            }
            if (values.submission_date) formData.append('submission_date', values.submission_date.format('YYYY-MM-DD HH:mm:ss'));
            if (values.defense_date) formData.append('defense_date', values.defense_date.format('YYYY-MM-DD HH:mm:ss'));
            formData.append('is_confidential', values.is_confidential ? '1' : '0');
            if (pdfFileList.length > 0 && pdfFileList[0].originFileObj) {
                formData.append('pdf_file', pdfFileList[0].originFileObj);
            }

            const config = { headers: { 'Content-Type': 'multipart/form-data' } };

            if (editingId) {
                formData.append('_method', 'PUT');
                await window.axios.post(`/api/theses/${editingId}`, formData, config);
                message.success('Thesis updated successfully');
            } else {
                await window.axios.post('/api/theses', formData, config);
                message.success('Thesis created successfully');
            }
            setIsModalOpen(false);
            setPdfFileList([]);
            fetchTheses();
        } catch (error) {
            console.error(error);
            if (error.response && error.response.data && error.response.data.message) {
                message.error(error.response.data.message);
            } else {
                message.error('Failed to save thesis');
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

    const getStatusColor = (status) => {
        switch (status) {
            case 'published': return 'green';
            case 'accepted': return 'cyan';
            case 'under_review': return 'orange';
            case 'submitted': return 'blue';
            case 'rejected': return 'red';
            case 'draft': default: return 'default';
        }
    };

    const columns = [
        {
            title: 'Action',
            key: 'actions',
            render: (_, record) => {
                if (activeTab === 'modify') {
                    return (
                        <Button type="primary" icon={<EditOutlined />} size="small" onClick={(e) => { e.stopPropagation(); openEditModal(record); }}>
                            Modify
                        </Button>
                    );
                }
                if (activeTab === 'remove') {
                    return (
                        <Button type="primary" danger icon={<DeleteOutlined />} size="small" onClick={(e) => { e.stopPropagation(); handleDelete(record.key); }}>
                            Remove
                        </Button>
                    );
                }
                return (
                    <Button type="primary" icon={<EyeOutlined />} size="small" onClick={(e) => { e.stopPropagation(); setPreviewThesis(record); setIsPreviewOpen(true); }}>
                        Preview
                    </Button>
                );
            },
            width: 110,
            align: 'center',
            fixed: screens.xs ? false : 'left',
        },
        {
            title: 'Thesis Title',
            dataIndex: 'title',
            key: 'title',
            ...getColumnSearchProps('title', primaryColor),
            sorter: (a, b) => a.title.localeCompare(b.title),
            render: (text, record) => (
                <Space>
                    <Avatar
                        style={{ backgroundColor: '#fff1f0', verticalAlign: 'middle', boxShadow: '0 2px 4px rgba(0,0,0,0.1)', border: '1px solid #ffccc7' }}
                        size={40}
                        icon={<FilePdfOutlined style={{ color: '#ff4d4f', fontSize: 20 }} />}
                    />
                    <Space orientation="vertical" size={0}>
                        <Text strong style={{ fontSize: '15px', maxWidth: 300 }} ellipsis={{ tooltip: text }}>{text}</Text>
                        <Text type="secondary" style={{ fontSize: '13px' }}>{record.author} • {record.department || record.discipline || 'No Dept'}</Text>
                    </Space>
                </Space>
            ),
            fixed: screens.xs ? false : 'left',
            width: 350,
        },
        {
            title: 'Status',
            key: 'status',
            dataIndex: 'status',
            filters: [
                { text: 'Draft', value: 'draft' },
                { text: 'Submitted', value: 'submitted' },
                { text: 'Under Review', value: 'under_review' },
                { text: 'Accepted', value: 'accepted' },
                { text: 'Published', value: 'published' },
            ],
            onFilter: (value, record) => record.status === value,
            render: (status) => (
                <Tag color={getStatusColor(status)} style={{ borderRadius: '20px', padding: '4px 12px', fontWeight: 500, display: 'inline-flex', alignItems: 'center', border: 'none' }}>
                    <Clock size={14} style={{ marginRight: 4, verticalAlign: 'middle' }} />
                    {status.replace('_', ' ').toUpperCase()}
                </Tag>
            ),
        },
        {
            title: 'Keywords',
            dataIndex: 'keywords',
            key: 'keywords',
            render: (keywords) => (
                <Space size={[0, 4]} wrap style={{ maxWidth: 200 }}>
                    {keywords && keywords.length > 0 ? keywords.slice(0, 2).map((kw, i) => (
                        <Tag key={i}>{kw}</Tag>
                    )) : <Text type="secondary" style={{ fontSize: 12 }}>None</Text>}
                    {keywords && keywords.length > 2 && <Tag>+{keywords.length - 2} more</Tag>}
                </Space>
            )
        },
        {
            title: 'Submitted/Date',
            dataIndex: 'submissionDate',
            key: 'submissionDate',
            sorter: (a, b) => new Date(a.submissionDate || 0) - new Date(b.submissionDate || 0),
            render: (date) => (
                <Space>
                    <Calendar size={14} style={{ color: token.colorTextSecondary }} />
                    <Text type="secondary">
                        {date ? new Date(date).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' }) : 'Not submitted'}
                    </Text>
                </Space>
            ),
        },
    ];

    return (
        <div style={{ paddingBottom: '40px' }}>
            <div style={{ marginBottom: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
                <div>
                    <Title level={2} style={{ margin: 0, fontWeight: 700 }}>Thesis Management</Title>
                    <Text type="secondary">Manage repository of theses and research papers</Text>
                </div>
                <Space wrap>
                    <Input
                        placeholder="Search theses..."
                        prefix={<SearchOutlined style={{ color: token.colorTextDescription }} />}
                        style={{ width: 280, borderRadius: '8px', backgroundColor: token.colorBgContainer, border: `1px solid ${token.colorBorder}` }}
                        allowClear
                        value={globalSearchText}
                        onChange={(e) => setGlobalSearchText(e.target.value)}
                        size="large"
                    />
                    <Tooltip title="Refresh List">
                        <Button icon={<ReloadOutlined />} size="large" style={{ borderRadius: '8px' }} onClick={() => { setGlobalSearchText(''); fetchTheses(); }} />
                    </Tooltip>
                    <Button
                        type="primary"
                        icon={<PlusOutlined />}
                        size="large"
                        style={{ borderRadius: '8px', padding: '0 24px', fontWeight: 600, boxShadow: '0 4px 10px rgba(0,0,0,0.1)' }}
                        onClick={openCreateModal}
                    >
                        Archive
                    </Button>
                </Space>
            </div>

            <Card
                variant="borderless"
                style={{ borderRadius: '16px', boxShadow: '0 5px 20px rgba(0, 0, 0, 0.05)', overflow: 'hidden', background: token.colorBgContainer }}
                styles={{ body: { padding: 0 } }}
            >
                <Tabs
                    activeKey={activeTab}
                    onChange={(key) => { setActiveTab(key); }}
                    style={{ padding: '16px 24px 0 24px' }}
                    items={[
                        { key: 'preview', label: <Space><Eye size={15} /> Document Preview</Space> },
                        { key: 'modify', label: <Space><Pencil size={15} /> Modify Record</Space> },
                        { key: 'remove', label: <Space><Trash2 size={15} /> Remove Record</Space> },
                    ]}
                />
                <Table
                    columns={columns}
                    dataSource={filteredData}
                    loading={loading}
                    scroll={{ x: 1000 }}
                    pagination={{ defaultPageSize: 10, showSizeChanger: true, pageSizeOptions: ['10', '25', '50'], showTotal: (total) => <Text type="secondary">{total} theses found</Text>, style: { padding: '16px 24px' } }}
                    rowClassName={(record, index) => index % 2 === 0 ? 'table-row-light' : 'table-row-dark'}
                    onRow={(record) => ({
                        onClick: () => {
                            if (activeTab === 'preview') {
                                setPreviewThesis(record);
                                setIsPreviewOpen(true);
                            } else if (activeTab === 'modify') {
                                openEditModal(record);
                            } else if (activeTab === 'remove') {
                                handleDelete(record.key);
                            }
                        },
                        style: { cursor: 'pointer' }
                    })}
                />
            </Card>

            <Drawer
                title={
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        <FilePdfOutlined style={{ color: '#ff4d4f', fontSize: 20 }} />
                        <div>
                            <Text strong style={{ fontSize: 16, display: 'block', lineHeight: 1.2 }}>Document Preview</Text>
                            <Text type="secondary" style={{ fontSize: 12, fontWeight: 400 }}>Review research details and attached document</Text>
                        </div>
                    </div>
                }
                placement="right"
                onClose={() => { setIsPreviewOpen(false); setPreviewThesis(null); }}
                open={isPreviewOpen}
                width={screens.md ? 720 : '100%'}
                headerStyle={{ borderBottom: `1px solid ${token.colorBorderSecondary}`, padding: '16px 24px' }}
                bodyStyle={{ padding: 0 }}
            >
                {previewThesis ? (
                    <Tabs
                        defaultActiveKey="1"
                        style={{ height: '100%' }}
                        tabBarStyle={{ padding: '0 24px', margin: 0, background: token.colorBgContainer }}
                        items={[
                            {
                                key: '1',
                                label: 'Overview',
                                children: (
                                    <div style={{ padding: 24, overflowY: 'auto', height: 'calc(100vh - 110px)' }}>
                                        <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
                                            <Col xs={24} lg={12}>
                                                <Card size="small" variant="borderless" style={{ background: token.colorFillAlter, borderRadius: 12, height: '100%' }}>
                                                    <Descriptions title={<Space><FileTextOutlined style={{ fontSize: 16 }} /> <Text strong>Submission Details</Text></Space>} column={1} size="small" labelStyle={{ color: token.colorTextSecondary }}>
                                                        <Descriptions.Item label="Status">
                                                            <Tag color={getStatusColor(previewThesis.status)} style={{ borderRadius: 12 }}>{previewThesis.status.replace('_', ' ').toUpperCase()}</Tag>
                                                        </Descriptions.Item>
                                                        <Descriptions.Item label="Submission Date">
                                                            <Space size={4}>
                                                                <Calendar size={14} />
                                                                <Text>{previewThesis.submissionDate ? new Date(previewThesis.submissionDate).toLocaleDateString() : 'N/A'}</Text>
                                                            </Space>
                                                        </Descriptions.Item>
                                                        <Descriptions.Item label="DOI"><Text>{previewThesis.raw?.doi || 'N/A'}</Text></Descriptions.Item>
                                                        <Descriptions.Item label="Visibility">
                                                            <Badge status={previewThesis.isConfidential ? "warning" : "success"} text={previewThesis.isConfidential ? "Confidential" : "Public"} />
                                                        </Descriptions.Item>
                                                        <Descriptions.Item label="Degree Type"><Tag color="blue" bordered={false}>{previewThesis.degreeType || 'N/A'}</Tag></Descriptions.Item>
                                                    </Descriptions>
                                                </Card>
                                            </Col>
                                            <Col xs={24} lg={12}>
                                                <Card size="small" variant="borderless" style={{ background: token.colorFillAlter, borderRadius: 12, height: '100%' }}>
                                                    <Descriptions title={<Space><BookOpen size={16} /> <Text strong>Author & Affiliation</Text></Space>} column={1} size="small" labelStyle={{ color: token.colorTextSecondary }}>
                                                        <Descriptions.Item label="Main Author"><Text strong>{previewThesis.author}</Text></Descriptions.Item>
                                                        <Descriptions.Item label="Program"><Text>{previewThesis.discipline || 'N/A'}</Text></Descriptions.Item>
                                                        <Descriptions.Item label="Department"><Text type="secondary">{previewThesis.department || 'N/A'}</Text></Descriptions.Item>
                                                        <Descriptions.Item label="Co-Author(s)"><Text>{previewThesis.raw?.co_author || 'N/A'}</Text></Descriptions.Item>
                                                        <Descriptions.Item label="Panelists"><Text>{previewThesis.raw?.panelists || 'N/A'}</Text></Descriptions.Item>
                                                    </Descriptions>
                                                </Card>
                                            </Col>
                                        </Row>

                                        <div style={{ marginBottom: 24 }}>
                                            <Title level={5} style={{ marginBottom: 12 }}>Research Title</Title>
                                            <Text strong style={{ fontSize: 18, color: primaryColor, display: 'block', lineHeight: 1.4 }}>
                                                {previewThesis.title}
                                            </Text>
                                            {previewThesis.subtitle && (
                                                <Text type="secondary" style={{ fontSize: 14, display: 'block', marginTop: 4 }}>{previewThesis.subtitle}</Text>
                                            )}
                                        </div>

                                        <Divider style={{ margin: '16px 0' }} />

                                        <div style={{ marginBottom: 24 }}>
                                            <Title level={5} style={{ marginBottom: 12 }}>Abstract</Title>
                                            <div style={{ padding: 16, background: token.colorFillQuaternary, border: `1px solid ${token.colorBorderSecondary}`, borderRadius: 8, minHeight: 100 }}>
                                                <Text type="secondary" style={{ whiteSpace: 'pre-wrap', lineHeight: 1.6 }}>
                                                    {previewThesis.abstract || 'No abstract provided for this thesis.'}
                                                </Text>
                                            </div>
                                        </div>

                                        <div style={{ marginBottom: 24 }}>
                                            <Title level={5} style={{ marginBottom: 12 }}>Index Keywords</Title>
                                            <Space wrap>
                                                {previewThesis.keywords && previewThesis.keywords.length > 0 ? (
                                                    previewThesis.keywords.map(kw => (
                                                        <Tag key={kw} style={{ borderRadius: 4, padding: '2px 10px', margin: '4px 0' }}>{kw}</Tag>
                                                    ))
                                                ) : <Text type="secondary" italic>No keywords defined</Text>}
                                            </Space>
                                        </div>

                                        <Divider style={{ margin: '16px 0' }} />

                                        <div>
                                            <Title level={5} style={{ marginBottom: 12 }}>Recommended & Archived By</Title>
                                            <Row gutter={16}>
                                                <Col xs={24} md={12}>
                                                    <div style={{ background: token.colorFillQuaternary, padding: '12px 16px', borderRadius: 8, marginBottom: 8 }}>
                                                        <Text type="secondary" style={{ fontSize: 12, display: 'block', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 4 }}>Recommended By</Text>
                                                        <Text strong>{previewThesis.raw?.recommended_by || 'N/A'}</Text>
                                                    </div>
                                                </Col>
                                                <Col xs={24} md={12}>
                                                    <div style={{ background: token.colorFillQuaternary, padding: '12px 16px', borderRadius: 8, marginBottom: 8 }}>
                                                        <Text type="secondary" style={{ fontSize: 12, display: 'block', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 4 }}>Archived By</Text>
                                                        <Text strong>{previewThesis.raw?.archived_by || 'N/A'}</Text>
                                                    </div>
                                                </Col>
                                            </Row>
                                        </div>
                                    </div>
                                )
                            },
                            {
                                key: '2',
                                label: 'Full Document (PDF)',
                                children: (
                                    <div style={{ height: 'calc(100vh - 110px)', position: 'relative' }}>
                                        {previewThesis.raw && previewThesis.raw.pdf_path ? (
                                            <div style={{ height: '100%', position: 'relative' }}>
                                                <div style={{ position: 'absolute', top: 12, right: 24, zIndex: 10 }}>
                                                    <Button
                                                        icon={<LinkOutlined />}
                                                        size="small"
                                                        href={`/storage/${previewThesis.raw.pdf_path}`}
                                                        target="_blank"
                                                        type="text"
                                                        style={{ background: 'rgba(255,255,255,0.8)', border: '1px solid #ddd' }}
                                                    >
                                                        Open Full
                                                    </Button>
                                                </div>
                                                <iframe
                                                    src={`/storage/${previewThesis.raw.pdf_path}`}
                                                    width="100%"
                                                    height="100%"
                                                    style={{ border: 'none' }}
                                                    title="PDF Preview"
                                                />
                                            </div>
                                        ) : (
                                            <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                <Space direction="vertical" align="center">
                                                    <FilePdfOutlined style={{ fontSize: 48, color: token.colorTextDisabled }} />
                                                    <Text type="secondary">No PDF document attached to this thesis.</Text>
                                                </Space>
                                            </div>
                                        )}
                                    </div>
                                )
                            }
                        ]}
                    />
                ) : null}
            </Drawer>

            <Modal
                title={null}
                open={isModalOpen}
                onCancel={() => setIsModalOpen(false)}
                footer={null}
                centered
                width={800}
                style={{ maxWidth: 'calc(100vw - 32px)' }}
                destroyOnClose
            >
                <div style={{ padding: '24px 0' }}>

                    <Form form={form} layout="vertical" onFinish={handleSubmit} size="large">
                        <Row gutter={16}>
                            <Col xs={24}>
                                <Form.Item name="title" label="Thesis Title" rules={[{ required: true, message: 'Please enter the title' }]}>
                                    <Input placeholder="Enter main title" prefix={<FileTextOutlined style={{ fontSize: 18, color: 'rgba(0,0,0,.25)' }} />} />
                                </Form.Item>
                            </Col>
                        </Row>

                        <Row gutter={16}>
                            <Col xs={24} md={12}>
                                <Form.Item name="author" label="Main Author" rules={[{ required: true, message: 'Please enter the main author name' }]}>
                                    <Input placeholder="Enter full name of author" />
                                </Form.Item>
                            </Col>
                            <Col xs={24} md={12}>
                                <Form.Item name="co_author" label="Co-Author(s) (Optional)">
                                    <Input placeholder="Enter co-author(s) names" />
                                </Form.Item>
                            </Col>
                        </Row>

                        <Row gutter={16}>
                            <Col xs={24} md={12}>
                                <Form.Item name="panelists" label="Panelists (Optional)">
                                    <Input placeholder="Enter panelist names" />
                                </Form.Item>
                            </Col>
                            <Col xs={24} md={12}>
                                <Form.Item name="subtitle" label="Subtitle (Optional)">
                                    <Input placeholder="Enter subtitle or alternative title" />
                                </Form.Item>
                            </Col>
                        </Row>

                        <Form.Item name="abstract" label="Abstract">
                            <TextArea rows={4} placeholder="Enter thesis abstract or executive summary" />
                        </Form.Item>

                        <Row gutter={16}>
                            <Col xs={24} md={12}>
                                <Form.Item name="dept_id" label="Department">
                                    <Select
                                        placeholder="Select department"
                                        allowClear
                                        options={departments.map(d => ({ label: d.name, value: d.id }))}
                                        onChange={(val) => {
                                            setSelectedDeptId(val);
                                            form.setFieldValue('discipline', undefined);
                                        }}
                                    />
                                </Form.Item>
                            </Col>
                            <Col xs={24} md={12}>
                                <Form.Item name="discipline" label="Program / Discipline">
                                    <Select
                                        placeholder={selectedDeptId ? 'Select program' : 'Select a department first'}
                                        allowClear
                                        disabled={!selectedDeptId}
                                        options={programs
                                            .filter(p => p.department_id === selectedDeptId)
                                            .map(p => ({ label: p.name, value: p.name }))
                                        }
                                    />
                                </Form.Item>
                            </Col>
                        </Row>

                        <Form.Item name="keywords" label="Keywords">
                            <Select mode="tags" placeholder="Type and press enter to add keywords" tokenSeparators={[',']} />
                        </Form.Item>

                        <Row gutter={16}>
                            <Col xs={24} md={12}>
                                <Form.Item name="degree_type" label="Degree Type">
                                    <Input placeholder="e.g. MSc, PhD, BSCS" />
                                </Form.Item>
                            </Col>
                            <Col xs={24} md={12}>
                                <Form.Item name="doi" label="DOI (Optional)">
                                    <Input placeholder="e.g. 10.1000/xyz123" />
                                </Form.Item>
                            </Col>
                        </Row>
                        
                        <Row gutter={16}>
                            <Col xs={24} md={12}>
                                <Form.Item name="submission_date" label="Submission Date">
                                    <DatePicker style={{ width: '100%' }} />
                                </Form.Item>
                            </Col>
                        </Row>

                        <Form.Item label="Upload PDF Document">
                            <Upload.Dragger
                                name="pdf_file"
                                accept=".pdf"
                                multiple={false}
                                maxCount={1}
                                fileList={pdfFileList}
                                beforeUpload={() => false}
                                onChange={({ fileList }) => setPdfFileList(fileList)}
                                style={{ borderRadius: 8 }}
                            >
                                <p className="ant-upload-drag-icon">
                                    <InboxOutlined style={{ color: primaryColor, fontSize: 32 }} />
                                </p>
                                <p className="ant-upload-text" style={{ fontWeight: 600 }}>Click or drag PDF file here</p>
                                <p className="ant-upload-hint" style={{ color: token.colorTextSecondary }}>Only .pdf files up to 50MB are accepted</p>
                            </Upload.Dragger>
                            {existingPdfName && pdfFileList.length === 0 && (
                                <div style={{ marginTop: 8, padding: '8px 12px', background: token.colorFillAlter, borderRadius: 6, display: 'flex', alignItems: 'center', gap: 8 }}>
                                    <FilePdfOutlined style={{ color: 'red' }} />
                                    <Text style={{ fontSize: 13 }}>{existingPdfName}</Text>
                                    <Text type="secondary" style={{ fontSize: 12 }}>(existing file — upload a new one to replace)</Text>
                                </div>
                            )}
                        </Form.Item>

                        <Form.Item name="is_confidential" valuePropName="checked">
                            <Switch checkedChildren="Confidential Document" unCheckedChildren="Public Document" />
                        </Form.Item>

                        <Row gutter={16}>
                            <Col xs={24} md={12}>
                                <Form.Item name="recommended_by" label="Recommended By (Optional)">
                                    <Input placeholder="Enter recommender's name" />
                                </Form.Item>
                            </Col>
                            <Col xs={24} md={12}>
                                <Form.Item name="archived_by" label="Archived By (Optional)">
                                    <Input placeholder="Enter archiver's name" />
                                </Form.Item>
                            </Col>
                        </Row>

                        <Divider style={{ margin: '24px 0' }} />

                        <Form.Item style={{ marginBottom: 0, textAlign: 'right' }}>
                            <Space>
                                <Button onClick={() => setIsModalOpen(false)} size="large">Cancel</Button>
                                <Button type="primary" htmlType="submit" loading={submitLoading} size="large">
                                    {editingId ? 'Update Thesis' : 'Archive Thesis'}
                                </Button>
                            </Space>
                        </Form.Item>
                    </Form>
                </div>
            </Modal>
        </div>
    );
}
