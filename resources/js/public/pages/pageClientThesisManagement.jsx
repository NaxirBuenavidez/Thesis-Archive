import React, { useState, useEffect, useMemo } from 'react';
import { 
    Typography, Space, Button, Card, Input, Tooltip, Grid, theme, 
    Skeleton, Tag, Empty, Pagination, Row, Col, App, Form, ConfigProvider
} from 'antd';
import { 
    SearchOutlined, 
    ReloadOutlined, 
    PlusOutlined, 
    FilePdfOutlined,
    EditOutlined,
    DeleteOutlined,
    EyeOutlined
} from '@ant-design/icons';
import { Clock, Calendar, User, BookOpen } from 'lucide-react';
import dayjs from 'dayjs';
import { useAuth } from '../../context/AuthContext';
import { useSystemConfig } from '../../context/SystemConfigContext';
import { handleFormErrors } from '../../utils/formUtils';
import { Feedback } from '../components/UI/SystemNotifications';
import thesesApi from '../../api/thesesApi';
import { sessionCache } from '../../utils/sessionCache';

// Import local components from Management
import modalThesisForm from './Management/components/modalThesisForm';
import drawerThesisPreview from './Management/components/drawerThesisPreview';

// Local Thesis Card Component (Archive Style)
const ClientThesisCard = ({ item, primaryColor, primaryDark, onPreview, onEdit, onDelete }) => {
    return (
        <Card 
            hoverable
            style={{ height: '100%', borderRadius: 16, border: '1px solid #f0f0f0', boxShadow: '0 4px 20px rgba(0,0,0,0.05)', overflow: 'hidden' }}
            styles={{ body: { display: 'flex', flexDirection: 'column', height: '100%', padding: '24px' } }}
            cover={
                <div style={{ height: 120, background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <div style={{ padding: 20, background: '#fff', borderRadius: 12, boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
                        <FilePdfOutlined style={{ fontSize: 40, color: '#ef4444' }} />
                    </div>
                    <div style={{ position: 'absolute', top: 12, right: 12 }}>
                        <Tag color={item.status === 'published' ? 'green' : (item.status === 'under_review' ? 'orange' : 'blue')}>
                            {item.status.toUpperCase()}
                        </Tag>
                    </div>
                </div>
            }
            actions={[
                <Tooltip title="Preview"><EyeOutlined key="view" onClick={() => onPreview(item)} /></Tooltip>,
                <Tooltip title="Edit"><EditOutlined key="edit" onClick={() => onEdit(item)} /></Tooltip>,
                <Tooltip title="Delete"><DeleteOutlined key="delete" style={{ color: '#ff4d4f' }} onClick={() => onDelete(item.key)} /></Tooltip>,
            ]}
        >
            <Typography.Text type="secondary" style={{ fontSize: 12, marginBottom: 8, display: 'block' }}>
                <Calendar size={12} style={{ marginRight: 4 }} /> {item.submissionDate ? dayjs(item.submissionDate).format('MMM DD, YYYY') : 'Draft'}
            </Typography.Text>
            <Typography.Title level={5} style={{ margin: '0 0 12px 0', lineHeight: 1.4, height: 48, overflow: 'hidden' }} ellipsis={{ rows: 2 }}>
                {item.title}
            </Typography.Title>
            <Typography.Paragraph type="secondary" style={{ fontSize: 13, flex: 1, marginBottom: 16 }} ellipsis={{ rows: 3 }}>
                {item.abstract || 'No abstract provided.'}
            </Typography.Paragraph>
            <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                {(item.keywords || []).slice(0, 3).map(k => (
                    <Tag key={k} style={{ fontSize: 10, borderRadius: 10, background: '#f1f5f9' }}>{k}</Tag>
                ))}
            </div>
        </Card>
    );
};

export default function ClientThesisManagement() {
    const { user } = useAuth();
    const { token } = theme.useToken();
    const { departments: bootDepts, programs: bootProgs } = useSystemConfig();
    const primaryColor = token.colorPrimary;
    const primaryDark = '#1A2CA3'; // Matching archive style
    const { message, modal } = App.useApp();

    const [data, setData] = useState(sessionCache.get('client_theses') || []);
    const [loading, setLoading] = useState(!sessionCache.get('client_theses'));
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [form] = Form.useForm();
    const [submitLoading, setSubmitLoading] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [pdfFileList, setPdfFileList] = useState([]);
    const [existingPdfName, setExistingPdfName] = useState(null);
    const [departments, setDepartments] = useState([]);
    const [programs, setPrograms] = useState([]);
    const [selectedDeptId, setSelectedDeptId] = useState(null);
    const [previewThesis, setPreviewThesis] = useState(null);
    const [isPreviewOpen, setIsPreviewOpen] = useState(false);
    
    // Search and Pagination
    const [searchText, setSearchText] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const pageSize = 8;

    const fetchInitialData = async () => {
        try {
            setLoading(true);
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
                author: thesis.author,
                raw: thesis
            }));
            
            setData(formattedTheses);
            sessionCache.set('client_theses', formattedTheses);
            setDepartments(bootDepts || []);
            setPrograms(bootProgs || []);
        } catch (error) {
            console.error("Failed to fetch client data", error);
            Feedback.error("Failed to load your records");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchInitialData();
    }, []);

    const filteredData = useMemo(() => {
        return data.filter(t => 
            t.title.toLowerCase().includes(searchText.toLowerCase()) ||
            (t.keywords || []).some(k => k.toLowerCase().includes(searchText.toLowerCase()))
        );
    }, [data, searchText]);

    const openCreateModal = () => {
        setEditingId(null);
        form.resetFields();
        form.setFieldsValue({ status: 'draft', is_confidential: false, author: user?.name });
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

    const handleDelete = (id) => {
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
    };

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
                message.success('Thesis submitted for review');
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

    const ThesisForm = modalThesisForm;
    const ThesisPreview = drawerThesisPreview;

    return (
        <ConfigProvider theme={{ token: { borderRadius: 12 } }}>
            <div style={{ maxWidth: 1200, margin: '0 auto', padding: '24px' }}>
                {/* Personalized Header */}
                <div style={{ marginBottom: 40, padding: '40px', background: 'linear-gradient(135deg, ' + primaryDark + ' 0%, ' + primaryColor + ' 100%)', borderRadius: 24, color: '#fff', position: 'relative', overflow: 'hidden' }}>
                    <div style={{ position: 'relative', zIndex: 1 }}>
                        <Space direction="vertical" size={0}>
                            <Typography.Title level={2} style={{ color: '#fff', margin: 0, fontWeight: 800 }}>
                                Welcome back, {user?.name?.split(' ')[0]}!
                            </Typography.Title>
                            <Typography.Text style={{ color: 'rgba(255,255,255,0.8)', fontSize: 16 }}>
                                Manage your research contributions and archive your academic excellence.
                            </Typography.Text>
                        </Space>
                        <div style={{ marginTop: 24 }}>
                            <Button type="primary" size="large" icon={<PlusOutlined />} onClick={openCreateModal} style={{ background: '#fff', color: primaryColor, border: 'none', fontWeight: 600 }}>
                                Archive New Thesis
                            </Button>
                        </div>
                    </div>
                    {/* Decorative Elements */}
                    <BookOpen style={{ position: 'absolute', right: -20, bottom: -20, size: 200, color: 'rgba(255,255,255,0.1)', transform: 'rotate(-15deg)' }} size={240} />
                </div>

                {/* Stats summary (Optional but nice for personalization) */}
                <Row gutter={[24, 24]} style={{ marginBottom: 32 }}>
                    <Col xs={24} sm={8}>
                        <Card bordered={false} style={{ textAlign: 'center', background: '#f8fafc' }}>
                            <Typography.Title level={2} style={{ margin: 0 }}>{data.length}</Typography.Title>
                            <Typography.Text type="secondary">Total Submissions</Typography.Text>
                        </Card>
                    </Col>
                    <Col xs={24} sm={8}>
                        <Card bordered={false} style={{ textAlign: 'center', background: '#f0fdf4' }}>
                            <Typography.Title level={2} style={{ margin: 0, color: '#16a34a' }}>
                                {data.filter(t => t.status === 'published').length}
                            </Typography.Title>
                            <Typography.Text type="secondary">Published Works</Typography.Text>
                        </Card>
                    </Col>
                    <Col xs={24} sm={8}>
                        <Card bordered={false} style={{ textAlign: 'center', background: '#fff7ed' }}>
                            <Typography.Title level={2} style={{ margin: 0, color: '#ea580c' }}>
                                {data.filter(t => t.status === 'under_review').length}
                            </Typography.Title>
                            <Typography.Text type="secondary">In Review</Typography.Text>
                        </Card>
                    </Col>
                </Row>

                {/* Search Bar */}
                <div style={{ marginBottom: 32 }}>
                    <Input 
                        placeholder="Search your theses..." 
                        prefix={<SearchOutlined style={{ color: 'rgba(0,0,0,0.25)' }} />} 
                        size="large"
                        onChange={(e) => setSearchText(e.target.value)}
                        style={{ borderRadius: 12, boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}
                        allowClear
                    />
                </div>

                {/* Content Grid */}
                {loading ? (
                    <Row gutter={[24, 24]}>
                        {[1, 2, 3, 4].map(i => (
                            <Col xs={24} sm={12} md={8} lg={6} key={i}>
                                <Skeleton active paragraph={{ rows: 4 }} />
                            </Col>
                        ))}
                    </Row>
                ) : filteredData.length > 0 ? (
                    <>
                        <Row gutter={[24, 24]}>
                            {filteredData.slice((currentPage - 1) * pageSize, currentPage * pageSize).map(item => (
                                <Col xs={24} sm={12} md={8} lg={6} key={item.key}>
                                    <ClientThesisCard 
                                        item={item} 
                                        primaryColor={primaryColor} 
                                        primaryDark={primaryDark}
                                        onPreview={() => { setPreviewThesis(item); setIsPreviewOpen(true); }}
                                        onEdit={openEditModal}
                                        onDelete={handleDelete}
                                    />
                                </Col>
                            ))}
                        </Row>
                        <div style={{ marginTop: 40, display: 'flex', justifyContent: 'center' }}>
                            <Pagination 
                                current={currentPage} 
                                pageSize={pageSize} 
                                total={filteredData.length} 
                                onChange={setCurrentPage}
                                showSizeChanger={false}
                            />
                        </div>
                    </>
                ) : (
                    <Empty 
                        image={Empty.PRESENTED_IMAGE_SIMPLE} 
                        description="You haven't archived any theses yet."
                    >
                        <Button type="primary" icon={<PlusOutlined />} onClick={openCreateModal}>Start Archiving</Button>
                    </Empty>
                )}

                {/* Components from Management */}
                <ThesisPreview 
                    open={isPreviewOpen} 
                    onClose={() => setIsPreviewOpen(false)} 
                    thesis={previewThesis} 
                    isMobile={false} 
                    getStatusColor={(s) => s === 'published' ? 'green' : 'orange'} 
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
                    isMobile={false}
                />
            </div>
        </ConfigProvider>
    );
}
