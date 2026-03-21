import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Typography, Table, Tag, Space, Button, Card, Input, Tooltip, Avatar, Grid, Dropdown, theme, Modal, Form, Select, App, Divider, Row, Col, Drawer, Descriptions, Badge, Tabs, Skeleton, Empty, Checkbox } from 'antd';
import {
    SearchOutlined,
    ReloadOutlined,
    MoreOutlined,
    EyeOutlined,
    CheckOutlined,
    CloseOutlined,
    ClockCircleOutlined,
    FilePdfOutlined,
    LinkOutlined,
    FileTextOutlined,
    UserOutlined
} from '@ant-design/icons';
import { BookOpen, Clock, Calendar, CheckCircle, Globe, Lock } from 'lucide-react';
import { Earth20Filled, LockClosed20Filled } from '@fluentui/react-icons';
import { useTableSearch } from '../../hooks/useTableSearch';
import { useAuth } from '../../context/AuthContext';
import { Spin } from 'antd';
import SignaturePad from '../components/UI/SignaturePad';

const { Title, Text } = Typography;
const { TextArea } = Input;
const { useBreakpoint } = Grid;

export default function ReviewManager() {
    const { user } = useAuth();
    const screens = useBreakpoint();
    const { token } = theme.useToken();
    const primaryColor = token.colorPrimary;

    const { message, modal } = App.useApp();

    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [reviewModal, setReviewModal] = useState({ open: false, thesis: null, action: null });
    const [form] = Form.useForm();
    const [drawerForm] = Form.useForm();
    const [submitLoading, setSubmitLoading] = useState(false);
    const [isDetailOpen, setIsDetailOpen] = useState(false);
    const [selectedThesis, setSelectedThesis] = useState(null);
    const [previewThesis, setPreviewThesis] = useState(null);
    const [searchParams, setSearchParams] = useSearchParams();
    const activeTab = searchParams.get('tab') || 'public';
    const setActiveTab = (key) => setSearchParams({ tab: key }, { replace: true });

    const fetchTheses = async () => {
        setLoading(true);
        try {
            const response = await window.axios.get('/api/theses');
            if (response.data) {
                const theses = response.data
                    .filter(t => t.status === 'under_review')
                    .map(thesis => ({
                        key: thesis.id,
                        title: thesis.title,
                        abstract: thesis.abstract,
                        discipline: thesis.discipline,
                        department: thesis.department,
                        keywords: thesis.keywords || [],
                        status: thesis.status,
                        degreeType: thesis.degree_type,
                        submissionDate: thesis.submission_date,
                        isConfidential: thesis.is_confidential,
                        doi: thesis.doi,
                        co_author: thesis.co_author,
                        panelists: thesis.panelists,
                        hasPdf: !!thesis.pdf_path,
                        pdfName: thesis.pdf_original_name,
                        pdfUrl: thesis.pdf_path ? `/storage/${thesis.pdf_path}` : null,
                        author: thesis.author || (thesis.owner ? thesis.owner.name : 'Unknown'),
                        authorAvatar: thesis.owner?.profile?.avatar ? (thesis.owner.profile.avatar.startsWith('http') || thesis.owner.profile.avatar.startsWith('data:image') ? thesis.owner.profile.avatar : `/storage/${thesis.owner.profile.avatar}`) : null,
                        raw: thesis
                    }));
                setData(theses);
            }
        } catch (error) {
            console.error('Failed to fetch theses for review', error);
            message.error('Failed to load theses under review');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTheses();
    }, []);

    const openReviewModal = (thesis, action) => {
        form.resetFields();
        setReviewModal({ open: true, thesis, action });
    };

    const openDetailDrawer = (thesis) => {
        setSelectedThesis(thesis);
        drawerForm.resetFields();
        setIsDetailOpen(true);
    };

    const handleDrawerAcceptSubmit = async (values) => {
        setSubmitLoading(true);
        try {
            await window.axios.patch(`/api/theses/${selectedThesis.key}/review`, {
                status: 'accepted',
                remarks: null,
                review_checklist: values.review_checklist ? [...values.review_checklist, `e_signature:${values.e_signature}`] : [`e_signature:${values.e_signature}`],
                recommended_by: values.recommended_by,
                archived_by: values.archived_by,
            });
            message.success(`Thesis accepted successfully`);
            setIsDetailOpen(false);
            setSelectedThesis(null);
            fetchTheses();
        } catch (error) {
            console.error(error);
            const msg = error.response?.data?.message;
            message.error(msg || 'Failed to update thesis status');
        } finally {
            setSubmitLoading(false);
        }
    };

    const handleReviewSubmit = async (values) => {
        const { thesis, action } = reviewModal;
        setSubmitLoading(true);
        try {
            const newStatus = action === 'accept' ? 'accepted' : 'rejected';
            await window.axios.patch(`/api/theses/${thesis.key}/review`, {
                status: newStatus,
                remarks: values.remarks || null,
                ...(action === 'accept' && {
                    review_checklist: values.review_checklist ? [...values.review_checklist, `e_signature:${values.e_signature}`] : [`e_signature:${values.e_signature}`],
                    recommended_by: values.recommended_by,
                    archived_by: values.archived_by,
                })
            });
            message.success(`Thesis ${action === 'accept' ? 'accepted' : 'rejected'} successfully`);
            setReviewModal({ open: false, thesis: null, action: null });
            fetchTheses();
        } catch (error) {
            console.error(error);
            const msg = error.response?.data?.message;
            message.error(msg || 'Failed to update thesis status');
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
            title: 'Action',
            key: 'actions',
            render: (_, record) => (
                <Button 
                    type="primary" 
                    icon={<FileTextOutlined />} 
                    onClick={(e) => {
                        e.stopPropagation();
                        openDetailDrawer(record);
                    }}
                    size="small"
                >
                    Review
                </Button>
            ),
            width: 110,
            align: 'center',
            fixed: screens.xs ? false : 'left',
        },
        {
            title: 'Thesis',
            dataIndex: 'title',
            key: 'title',
            ...getColumnSearchProps('title', primaryColor),
            sorter: (a, b) => a.title.localeCompare(b.title),
            render: (text, record) => (
                <Space>
                    <Avatar
                        style={{ backgroundColor: '#fff1f0', verticalAlign: 'middle', boxShadow: '0 2px 4px rgba(0,0,0,0.1)', border: '1px solid #ffccc7' }}
                        size={42}
                        icon={<FilePdfOutlined style={{ color: '#ff4d4f', fontSize: 20 }} />}
                    />
                    <Space orientation="vertical" size={0}>
                        <Text strong style={{ fontSize: '15px', maxWidth: 280 }} ellipsis={{ tooltip: text }}>{text}</Text>
                        <Text type="secondary" style={{ fontSize: '12px' }}>{record.author} • {record.department || record.discipline || 'No Dept'}</Text>
                    </Space>
                </Space>
            ),
            fixed: screens.xs ? false : 'left',
            width: 320,
        },
        {
            title: 'Status',
            key: 'status',
            dataIndex: 'status',
            render: () => (
                <Tag color="orange" style={{ borderRadius: '20px', padding: '4px 12px', fontWeight: 500, display: 'inline-flex', alignItems: 'center', border: 'none' }}>
                    <Clock size={13} style={{ marginRight: 4, verticalAlign: 'middle' }} />
                    UNDER REVIEW
                </Tag>
            ),
        },
        {
            title: 'Degree',
            dataIndex: 'degreeType',
            key: 'degreeType',
            render: (deg) => deg ? <Tag>{deg}</Tag> : <Text type="secondary" style={{ fontSize: 12 }}>—</Text>,
        },
        {
            title: 'PDF',
            key: 'pdf',
            render: (_, record) => record.hasPdf ? (
                <Space>
                    <FilePdfOutlined style={{ color: '#ff4d4f' }} />
                    <Text style={{ fontSize: 12 }} ellipsis={{ tooltip: record.pdfName }}>{record.pdfName || 'Attached'}</Text>
                </Space>
            ) : (
                <Text type="secondary" style={{ fontSize: 12 }}>No PDF</Text>
            ),
        },
        {
            title: 'Submitted',
            dataIndex: 'submissionDate',
            key: 'submissionDate',
            sorter: (a, b) => new Date(a.submissionDate || 0) - new Date(b.submissionDate || 0),
            render: (date) => (
                <Space>
                    <Calendar size={13} style={{ color: token.colorTextSecondary }} />
                    <Text type="secondary" style={{ fontSize: 13 }}>
                        {date ? new Date(date).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' }) : '—'}
                    </Text>
                </Space>
            ),
            responsive: ['md'],
        },
    ];

    const actionColor = reviewModal.action === 'accept' ? token.colorSuccess : token.colorError;

    const isMobile = !screens.md;

    return (
        <div style={{ paddingBottom: '40px' }}>
            <div style={{ marginBottom: 20 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                    <div>
                        <Title level={isMobile ? 3 : 2} style={{ margin: 0, fontWeight: 700 }}>Review Manager</Title>
                        <Text type="secondary">Review and approve submitted theses</Text>
                    </div>
                    {!isMobile && (
                        <Tooltip title="Refresh List">
                            <Button icon={<ReloadOutlined />} size="large" style={{ borderRadius: '8px' }} onClick={() => { setGlobalSearchText(''); fetchTheses(); }} />
                        </Tooltip>
                    )}
                </div>
                <Input
                    placeholder="Search theses..."
                    prefix={<SearchOutlined style={{ color: token.colorTextDescription }} />}
                    style={{ width: '100%', borderRadius: '8px', backgroundColor: token.colorBgContainer, border: `1px solid ${token.colorBorder}` }}
                    allowClear
                    value={globalSearchText}
                    onChange={(e) => setGlobalSearchText(e.target.value)}
                    size="large"
                />
            </div>

            {previewThesis && (
                <Card 
                    variant="borderless" 
                    style={{ marginBottom: 24, borderRadius: '12px', boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)', background: token.colorBgContainer, border: `1px solid ${token.colorBorderSecondary}` }}
                    bodyStyle={{ padding: '24px' }}
                >
                    <Row gutter={[24, 24]} align="middle">
                        <Col xs={24} lg={18}>
                            <div style={{ marginBottom: 16 }}>
                                <Space align="center" style={{ marginBottom: 8 }} wrap>
                                    <Tag color={previewThesis.isConfidential ? "warning" : "success"} style={{ borderRadius: 12, margin: 0, padding: '0 10px', fontWeight: 500 }}>
                                        {previewThesis.isConfidential ? "Private Archive" : "Publicly Archive"}
                                    </Tag>
                                    <Text type="secondary" style={{ fontSize: 13, backgroundColor: token.colorFillAlter, padding: '2px 8px', borderRadius: 6 }}>DOI: {previewThesis.doi || 'N/A'}</Text>
                                </Space>
                                <Title level={4} style={{ margin: 0, lineHeight: 1.3, fontWeight: 700 }}>{previewThesis.title}</Title>
                            </div>
                            
                            <div style={{ background: token.colorFillQuaternary, padding: '16px 20px', borderRadius: 8 }}>
                                <Descriptions column={{ xxl: 3, xl: 3, lg: 3, md: 2, sm: 1, xs: 1 }} size="small" colon={false} styles={{ label: { color: token.colorTextSecondary, paddingBottom: 4 } }}>
                                    <Descriptions.Item label={<Text strong type="secondary" style={{ fontSize: 12, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Main Author</Text>}>
                                        <Space size={8}>
                                            <Avatar size={20} style={{ backgroundColor: primaryColor, fontSize: 12 }} src={previewThesis.authorAvatar} icon={<UserOutlined />} />
                                            <Text strong>{previewThesis.author}</Text>
                                        </Space>
                                    </Descriptions.Item>
                                    <Descriptions.Item label={<Text strong type="secondary" style={{ fontSize: 12, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Program</Text>}>
                                        <Space size={6}><BookOpen size={14} style={{ color: token.colorTextSecondary }} /><Text>{previewThesis.discipline || 'N/A'}</Text></Space>
                                    </Descriptions.Item>
                                    <Descriptions.Item label={<Text strong type="secondary" style={{ fontSize: 12, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Department</Text>}>
                                        <Text>{previewThesis.department || 'N/A'}</Text>
                                    </Descriptions.Item>
                                    <Descriptions.Item label={<Text strong type="secondary" style={{ fontSize: 12, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Submission Date</Text>}>
                                        <Space size={6}><Calendar size={14} style={{ color: token.colorTextSecondary }} /><Text>{previewThesis.submissionDate ? new Date(previewThesis.submissionDate).toLocaleDateString() : 'N/A'}</Text></Space>
                                    </Descriptions.Item>
                                    <Descriptions.Item label={<Text strong type="secondary" style={{ fontSize: 12, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Co-Authors</Text>}>
                                        <Text ellipsis={{ tooltip: previewThesis.co_author }} style={{ maxWidth: 200, display: 'inline-block' }}>{previewThesis.co_author || 'None'}</Text>
                                    </Descriptions.Item>
                                    <Descriptions.Item label={<Text strong type="secondary" style={{ fontSize: 12, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Panelists</Text>}>
                                        <Text ellipsis={{ tooltip: previewThesis.panelists }} style={{ maxWidth: 200, display: 'inline-block' }}>{previewThesis.panelists || 'None'}</Text>
                                    </Descriptions.Item>
                                </Descriptions>
                            </div>
                        </Col>
                        
                        <Col xs={24} lg={6} style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: screens.lg ? 'flex-end' : 'flex-start' }}>
                            <Button 
                                type="primary" 
                                size="large" 
                                icon={<FileTextOutlined />} 
                                onClick={() => openDetailDrawer(previewThesis)}
                                style={{ borderRadius: 8, width: screens.lg ? 'auto' : '100%' }}
                            >
                                Open Review Panel
                            </Button>
                        </Col>
                    </Row>
                </Card>
            )}

            <Card
                variant="borderless"
                style={{ borderRadius: '16px', boxShadow: '0 5px 20px rgba(0, 0, 0, 0.05)', overflow: 'hidden', background: token.colorBgContainer }}
                styles={{ body: { padding: 0 } }}
            >
                <Tabs
                    activeKey={activeTab}
                    onChange={setActiveTab}
                    style={{ padding: isMobile ? '12px 16px 0' : '16px 24px 0 24px' }}
                    size={isMobile ? 'small' : 'middle'}
                    items={[
                        { key: 'public', label: <Space><Earth20Filled style={{ fontSize: 16, color: activeTab === 'public' ? token.colorPrimary : undefined }} />{!isMobile && ' Publicly Archive'}</Space> },
                        { key: 'private', label: <Space><LockClosed20Filled style={{ fontSize: 16, color: activeTab === 'private' ? token.colorPrimary : undefined }} />{!isMobile && ' Private Archive'}</Space> }
                    ]}
                />
                {isMobile ? (
                    // Mobile card list
                    <div style={{ padding: '12px 16px' }}>
                        {!loading && filteredData.filter(item => activeTab === 'public' ? !item.isConfidential : item.isConfidential).map(record => (
                            <div
                                key={record.key}
                                style={{ background: token.colorFillAlter, borderRadius: 10, padding: '12px 14px', marginBottom: 10, border: `1px solid ${token.colorBorderSecondary}` }}
                            >
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8, marginBottom: 6 }}>
                                    <Text strong style={{ fontSize: 13, flex: 1, lineHeight: 1.4 }} ellipsis={{ tooltip: record.title }}>{record.title}</Text>
                                    <Button type="primary" size="small" icon={<FileTextOutlined />} onClick={() => openDetailDrawer(record)} style={{ flexShrink: 0 }} />
                                </div>
                                <Text type="secondary" style={{ fontSize: 12 }}>{record.author} · {record.department || 'No dept'}</Text>
                                <div style={{ marginTop: 6 }}>
                                    <Tag color="orange" style={{ borderRadius: 20, fontSize: 11, border: 'none' }}>UNDER REVIEW</Tag>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <Table
                        columns={columns}
                        dataSource={filteredData.filter(item => activeTab === 'public' ? !item.isConfidential : item.isConfidential)}
                        loading={loading}
                        scroll={{ x: 900 }}
                        pagination={{ defaultPageSize: 10, showSizeChanger: true, pageSizeOptions: ['10', '25', '50'], showTotal: (total) => <Text type="secondary">{total} theses</Text>, style: { padding: '16px 24px' } }}
                        rowClassName={(record, index) => {
                            let className = index % 2 === 0 ? 'table-row-light' : 'table-row-dark';
                            if (previewThesis && previewThesis.key === record.key) className += ' table-row-selected';
                            return className;
                        }}
                        onRow={(record) => ({
                            onClick: () => setPreviewThesis(record),
                            style: { cursor: 'pointer' }
                        })}
                    />
                )}
            </Card>

            <Modal
                title={null}
                open={reviewModal.open}
                onCancel={() => setReviewModal({ open: false, thesis: null, action: null })}
                footer={null}
                centered
                width={500}
                style={{ maxWidth: 'calc(100vw - 32px)' }}
                destroyOnHidden
            >
                <div style={{ padding: '24px 0' }}>
                    <div style={{ textAlign: 'center', marginBottom: 20 }}>
                        <div style={{ width: 56, height: 56, borderRadius: '50%', background: reviewModal.action === 'accept' ? '#f6ffed' : '#fff1f0', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px', border: `2px solid ${reviewModal.action === 'accept' ? '#b7eb8f' : '#ffccc7'}` }}>
                            {reviewModal.action === 'accept'
                                ? <CheckCircle size={28} color={token.colorSuccess} />
                                : <CloseOutlined style={{ fontSize: 24, color: token.colorError }} />
                            }
                        </div>
                        <Title level={4} style={{ margin: 0 }}>
                            {reviewModal.action === 'accept' ? 'Accept Thesis' : 'Reject Thesis'}
                        </Title>
                        <Text type="secondary">
                            {reviewModal.thesis?.title}
                        </Text>
                    </div>

                    <Form form={form} layout="vertical" onFinish={handleReviewSubmit} size="large">
                        {reviewModal.action === 'accept' && (
                            <>
                                <Form.Item 
                                    name="review_checklist" 
                                    label="Review Checklist" 
                                    rules={[{ type: 'array', len: 3, message: 'Please complete all checklist requirements before accepting.' }]}
                                >
                                    <Checkbox.Group style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                        <Checkbox value="formatting">Formatting and structure verified</Checkbox>
                                        <Checkbox value="plagiarism">Plagiarism / Originality verified</Checkbox>
                                        <Checkbox value="references">References and Citations checked</Checkbox>
                                    </Checkbox.Group>
                                </Form.Item>

                                <Form.Item
                                    name="e_signature"
                                    label="E-Signature Authorization"
                                    rules={[{ required: true, message: 'Please provide an e-signature to proceed.' }]}
                                >
                                    <SignaturePad />
                                </Form.Item>

                                <Row gutter={16}>
                                    <Col xs={24} md={12}>
                                        <Form.Item name="recommended_by" label="Recommended By" rules={[{ required: true, message: 'Please specify the recommender.' }]}>
                                            <Input placeholder="Enter recommender's name" />
                                        </Form.Item>
                                    </Col>
                                    <Col xs={24} md={12}>
                                        <Form.Item name="archived_by" label="Archived By" rules={[{ required: true, message: 'Please specify the archiver.' }]}>
                                            <Input placeholder="Enter archiver's name" />
                                        </Form.Item>
                                    </Col>
                                </Row>
                            </>
                        )}
                        <Form.Item name="remarks" label="Remarks / Notes (optional)">
                            <TextArea rows={3} placeholder={reviewModal.action === 'accept' ? 'Add any notes for the author...' : 'Provide a reason for rejection...'} />
                        </Form.Item>

                        <Divider style={{ margin: '16px 0' }} />

                        <Form.Item style={{ marginBottom: 0, textAlign: 'right' }}>
                            <Space>
                                <Button onClick={() => setReviewModal({ open: false, thesis: null, action: null })} size="large">Cancel</Button>
                                <Button
                                    type="primary"
                                    htmlType="submit"
                                    loading={submitLoading}
                                    size="large"
                                    danger={reviewModal.action === 'reject'}
                                    icon={reviewModal.action === 'accept' ? <CheckOutlined /> : <CloseOutlined />}
                                >
                                    {reviewModal.action === 'accept' ? 'Confirm Accept' : 'Confirm Reject'}
                                </Button>
                            </Space>
                        </Form.Item>
                    </Form>
                </div>
            </Modal>

            <Drawer
                title={
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', paddingRight: isMobile ? 12 : 40 }}>
                        <Space align="start">
                            <FilePdfOutlined style={{ color: '#ff4d4f', fontSize: 20, marginTop: 4 }} />
                            <div style={{ flex: 1 }}>
                                <Text strong style={{ fontSize: 16, display: 'block', lineHeight: 1.2, wordBreak: 'break-word', whiteSpace: 'normal' }}>Thesis Examination</Text>
                                <Text type="secondary" style={{ fontSize: 12, fontWeight: 400, wordBreak: 'break-word', whiteSpace: 'normal', display: 'block', marginTop: 2 }}>Reviewing research quality and compliance</Text>
                            </div>
                        </Space>
                    </div>
                }
                placement="right"
                onClose={() => {
                    setIsDetailOpen(false);
                    setSelectedThesis(null);
                    drawerForm.resetFields();
                }}
                open={isDetailOpen}
                size="large"
                styles={{
                    wrapper: { width: screens.md ? 720 : '100%' },
                    header: { borderBottom: `1px solid ${token.colorBorderSecondary}`, padding: '16px 24px' },
                    body: { padding: 0 }
                }}
                extra={
                    !isMobile && (
                        <Space>
                            <Button 
                                type="primary" 
                                danger
                                onClick={() => {
                                    setIsDetailOpen(false);
                                    openReviewModal(selectedThesis, 'reject');
                                }}
                                icon={<CloseOutlined />}
                                style={{ borderRadius: 6 }}
                            >
                                Reject
                            </Button>
                            <Button 
                                type="primary" 
                                onClick={() => {
                                    drawerForm.submit();
                                }}
                                loading={submitLoading}
                                icon={<CheckOutlined />}
                                style={{ borderRadius: 6 }}
                            >
                                Accept
                            </Button>
                        </Space>
                    )
                }
                footer={
                    isMobile && (
                        <div style={{ display: 'flex', gap: 12, padding: '4px 0' }}>
                            <Button 
                                type="primary" 
                                danger
                                onClick={() => {
                                    setIsDetailOpen(false);
                                    openReviewModal(selectedThesis, 'reject');
                                }}
                                icon={<CloseOutlined />}
                                style={{ flex: 1, borderRadius: 6 }}
                                size="large"
                            >
                                Reject
                            </Button>
                            <Button 
                                type="primary" 
                                onClick={() => {
                                    drawerForm.submit();
                                }}
                                loading={submitLoading}
                                icon={<CheckOutlined />}
                                style={{ flex: 1, borderRadius: 6 }}
                                size="large"
                            >
                                Accept
                            </Button>
                        </div>
                    )
                }
            >
                {selectedThesis ? (
                    <Tabs
                        defaultActiveKey="1"
                        style={{ height: '100%' }}
                        tabBarStyle={{ padding: '0 24px', margin: 0, background: token.colorBgContainer }}
                        items={[
                            {
                                key: '1',
                                label: 'Overview',
                                children: (
                                    <Form form={drawerForm} layout="vertical" onFinish={handleDrawerAcceptSubmit}>
                                        <div style={{ padding: 24, overflowY: 'auto', height: 'calc(100vh - 110px)' }}>
                                            <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
                                            <Col xs={24} lg={12}>
                                                <Card size="small" variant="borderless" style={{ background: token.colorFillAlter, borderRadius: 12, height: '100%' }}>
                                                    <Descriptions title={<Space><FileTextOutlined style={{ fontSize: 16 }} /> <Text strong>Submission Details</Text></Space>} column={1} size="small" styles={{ label: { color: token.colorTextSecondary } }} layout={isMobile ? 'vertical' : 'horizontal'}>
                                                        <Descriptions.Item label="Reference ID"><Text code>{selectedThesis.key.split('-')[0].toUpperCase()}</Text></Descriptions.Item>
                                                        <Descriptions.Item label="Submission Date">
                                                            <Space size={4}>
                                                                <Calendar size={14} />
                                                                <Text>{selectedThesis.submissionDate ? new Date(selectedThesis.submissionDate).toLocaleDateString() : 'N/A'}</Text>
                                                            </Space>
                                                        </Descriptions.Item>
                                                        <Descriptions.Item label="DOI"><Text>{selectedThesis.doi || 'N/A'}</Text></Descriptions.Item>
                                                        <Descriptions.Item label="Visibility">
                                                            <Badge status={selectedThesis.isConfidential ? "warning" : "success"} text={selectedThesis.isConfidential ? "Confidential" : "Public"} />
                                                        </Descriptions.Item>
                                                        <Descriptions.Item label="Degree Type"><Tag color="blue" variant="filled">{selectedThesis.degreeType || 'N/A'}</Tag></Descriptions.Item>
                                                    </Descriptions>
                                                </Card>
                                            </Col>
                                            <Col xs={24} lg={12}>
                                                <Card size="small" variant="borderless" style={{ background: token.colorFillAlter, borderRadius: 12, height: '100%' }}>
                                                    <Descriptions title={<Space><BookOpen size={16} /> <Text strong>Author & Affiliation</Text></Space>} column={1} size="small" styles={{ label: { color: token.colorTextSecondary } }} layout={isMobile ? 'vertical' : 'horizontal'}>
                                                        <Descriptions.Item label="Main Author"><Text strong>{selectedThesis.author}</Text></Descriptions.Item>
                                                        <Descriptions.Item label="Program">
                                                            <Text>{selectedThesis.discipline || 'N/A'}</Text>
                                                        </Descriptions.Item>
                                                        <Descriptions.Item label="Department">
                                                            <Text type="secondary">{selectedThesis.department || 'N/A'}</Text>
                                                        </Descriptions.Item>
                                                        <Descriptions.Item label="Co-Author(s)"><Text>{selectedThesis.co_author || 'N/A'}</Text></Descriptions.Item>
                                                        <Descriptions.Item label="Panelists"><Text>{selectedThesis.panelists || 'N/A'}</Text></Descriptions.Item>
                                                    </Descriptions>
                                                </Card>
                                            </Col>
                                        </Row>

                                        <div style={{ marginBottom: 24 }}>
                                            <Title level={5} style={{ marginBottom: 12 }}>Research Title</Title>
                                            <Text strong style={{ fontSize: 18, color: primaryColor, display: 'block', lineHeight: 1.4 }}>
                                                {selectedThesis.title}
                                            </Text>
                                        </div>

                                        <div style={{ marginBottom: 24 }}>
                                            <Title level={5} style={{ marginBottom: 12 }}>Abstract</Title>
                                            <div style={{ padding: 16, background: '#fff', border: `1px solid ${token.colorBorderSecondary}`, borderRadius: 8, minHeight: 120 }}>
                                                <Text type="secondary" style={{ whiteSpace: 'pre-wrap', lineHeight: 1.6 }}>
                                                    {selectedThesis.abstract || 'No abstract provided for this thesis.'}
                                                </Text>
                                            </div>
                                        </div>

                                        <div>
                                            <Title level={5} style={{ marginBottom: 12 }}>Index Keywords</Title>
                                            <Space wrap>
                                                {selectedThesis.keywords && selectedThesis.keywords.length > 0 ? (
                                                    selectedThesis.keywords.map(kw => (
                                                        <Tag key={kw} style={{ borderRadius: 4, padding: '2px 10px', margin: '4px 0' }}>{kw}</Tag>
                                                    ))
                                                ) : <Text type="secondary" italic>No keywords defined</Text>}
                                            </Space>
                                        </div>

                                        <Divider style={{ margin: '32px 0' }} />

                                        <div>
                                            <Title level={5} style={{ marginBottom: 12 }}>Acceptance Requirements</Title>
                                            <Text type="secondary" style={{ display: 'block', marginBottom: 20 }}>Please complete the following checklist and details before accepting this research document.</Text>
                                            
                                            <div style={{ background: token.colorFillAlter, padding: '20px', borderRadius: 12, border: `1px solid ${token.colorBorderSecondary}`, marginBottom: 24 }}>
                                                <Form.Item 
                                                    name="review_checklist" 
                                                    rules={[{ type: 'array', len: 3, message: 'Please complete all checklist requirements before accepting.' }]}
                                                    style={{ marginBottom: 16 }}
                                                >
                                                    <Checkbox.Group style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                                        <Checkbox value="formatting">Formatting and structure verified</Checkbox>
                                                        <Checkbox value="plagiarism">Plagiarism / Originality checked and verified</Checkbox>
                                                        <Checkbox value="references">References and Citations reviewed</Checkbox>
                                                    </Checkbox.Group>
                                                </Form.Item>

                                                <Divider style={{ margin: '16px 0' }} />

                                                <Text type="secondary" strong style={{ display: 'block', marginBottom: 8 }}>E-Signature Authorization</Text>
                                                <Form.Item
                                                    name="e_signature"
                                                    rules={[{ required: true, message: 'Please provide an e-signature to proceed.' }]}
                                                    style={{ marginBottom: 0 }}
                                                >
                                                    <SignaturePad />
                                                </Form.Item>
                                            </div>

                                            <Row gutter={16}>
                                                <Col xs={24} md={12}>
                                                    <Form.Item name="recommended_by" label={<Text type="secondary" strong>Recommended By</Text>} rules={[{ required: true, message: 'Please specify the recommender.' }]}>
                                                        <Input placeholder="Enter recommender's name" size="large" />
                                                    </Form.Item>
                                                </Col>
                                                <Col xs={24} md={12}>
                                                    <Form.Item name="archived_by" label={<Text type="secondary" strong>Archived By / Archive Handler</Text>} rules={[{ required: true, message: 'Please specify who is archiving this.' }]}>
                                                        <Input placeholder="Enter archiver's name" size="large" />
                                                    </Form.Item>
                                                </Col>
                                            </Row>
                                        </div>
                                    </div>
                                    </Form>
                                )
                            },
                            {
                                key: '2',
                                label: 'Full Document (PDF)',
                                children: (
                                    <div style={{ height: 'calc(100vh - 110px)', position: 'relative' }}>
                                        {selectedThesis.hasPdf ? (
                                            <div style={{ height: '100%', position: 'relative' }}>
                                                <div style={{ position: 'absolute', top: 12, right: 24, zIndex: 10 }}>
                                                    <Button 
                                                        icon={<LinkOutlined />} 
                                                        size="small" 
                                                        href={selectedThesis.pdfUrl} 
                                                        target="_blank"
                                                        type="text"
                                                        style={{ background: 'rgba(255,255,255,0.8)', border: '1px solid #ddd' }}
                                                    >
                                                        Open Full
                                                    </Button>
                                                </div>
                                                <iframe 
                                                    src={selectedThesis.pdfUrl} 
                                                    width="100%" 
                                                    height="100%" 
                                                    style={{ border: 'none' }}
                                                    title="PDF Preview"
                                                />
                                            </div>
                                        ) : (
                                            <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                <Empty 
                                                    image={Empty.PRESENTED_IMAGE_SIMPLE} 
                                                    description={
                                                        <Space direction="vertical" align="center">
                                                            <Text type="secondary">No PDF document attached to this thesis.</Text>
                                                            <Button type="primary" ghost size="small">Request Document</Button>
                                                        </Space>
                                                    } 
                                                />
                                            </div>
                                        )}
                                    </div>
                                )
                            }
                        ]}
                    />
                ) : (
                    <div style={{ padding: 40, textAlign: 'center' }}>
                        <Skeleton active />
                    </div>
                )}
            </Drawer>
        </div>
    );
}
