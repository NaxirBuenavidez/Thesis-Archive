import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Typography, Table, Tag, Space, Button, Card, Input, Tooltip, Avatar, Grid, App, Divider, Row, Col, Drawer, Descriptions, Badge, Tabs, Skeleton, Empty, Select, theme, Checkbox, Radio, Pagination, Modal } from 'antd';
import {
    SearchOutlined,
    ReloadOutlined,
    EyeOutlined,
    FilePdfOutlined,
    LinkOutlined,
    FileTextOutlined,
    UploadOutlined,
    LockOutlined,
    UnlockOutlined,
    CheckCircleOutlined,
    FilterOutlined,
    SortAscendingOutlined,
    CloseOutlined,
    CloudDownloadOutlined,
    UserOutlined
} from '@ant-design/icons';
import { BookOpen, Clock, Calendar, Globe, Lock } from 'lucide-react';
import { Earth20Filled, LockClosed20Filled } from '@fluentui/react-icons';
import { useAuth } from '../../context/AuthContext';
import { Spin } from 'antd';
import thesesApi from '../../api/thesesApi';

const { Title, Text, Paragraph } = Typography;
const { useBreakpoint } = Grid;

export default function Repository() {
    const { user } = useAuth();
    const screens = useBreakpoint();
    const { token } = theme ? theme.useToken() : { token: { colorPrimary: '#2845D6' } };
    const primaryColor = token?.colorPrimary || '#2845D6';

    const { message, modal } = App.useApp();

    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [submitLoading, setSubmitLoading] = useState(false);
    const [isDetailOpen, setIsDetailOpen] = useState(false);
    const [selectedThesis, setSelectedThesis] = useState(null);
    const [searchParams, setSearchParams] = useSearchParams();
    
    // URL state sync
    const activeTab = searchParams.get('tab') || 'public';
    const setActiveTab = (key) => setSearchParams({ tab: key }, { replace: true });

    // Filter states
    const [statusFilters, setStatusFilters] = useState(['accepted', 'published']); 
    const [departmentFilters, setDepartmentFilters] = useState([]);
    const [sortOrder, setSortOrder] = useState('newest');
    const [searchText, setSearchText] = useState('');

    // Pagination state
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(12);

    // Mobile specific: Drawer for filters
    const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

    // Download Authorization State
    const [isDownloadModalOpen, setIsDownloadModalOpen] = useState(false);
    const [downloadThesis, setDownloadThesis] = useState(null);
    const [downloadPassword, setDownloadPassword] = useState('');
    const [downloadFormat, setDownloadFormat] = useState('pdf');

    const fetchTheses = async () => {
        setLoading(true);
        try {
            const response = await thesesApi.getAll({ silent: true });
            if (response) {
                const theses = response
                    .filter(t => t.status === 'accepted' || t.status === 'published')
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
                        pdfUrl: thesis.pdf_url || (thesis.pdf_path ? `/storage/${thesis.pdf_path}` : null),
                        author: thesis.author || (thesis.owner ? thesis.owner.name : 'Unknown'),
                        authorAvatar: thesis.owner?.profile?.avatar ? (thesis.owner.profile.avatar.startsWith('http') || thesis.owner.profile.avatar.startsWith('data:image') ? thesis.owner.profile.avatar : `/storage/${thesis.owner.profile.avatar}`) : null,
                        archived_by: thesis.archived_by,
                        recommended_by: thesis.recommended_by,
                        raw: thesis
                    }));
                setData(theses);
            }
        } catch (error) {
            console.error('Failed to fetch theses for repository', error);
            message.error('Failed to load repository');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTheses();
    }, []);

    // Reset page to 1 on filter changes
    useEffect(() => {
        setCurrentPage(1);
    }, [activeTab, statusFilters, departmentFilters, sortOrder, searchText]);

    const openDetailDrawer = (thesis) => {
        setSelectedThesis(thesis);
        setIsDetailOpen(true);
    };

    const handlePublish = async (thesis) => {
        modal.confirm({
            title: 'Publish Thesis?',
            content: `Are you sure you want to publish "${thesis.title}"?`,
            okText: 'Yes, Publish',
            cancelText: 'Cancel',
            centered: true,
            onOk: async () => {
                try {
                    setSubmitLoading(true);
                    await window.axios.patch(`/api/theses/${thesis.key}/publish`);
                    message.success('Thesis has been published successfully.');
                    
                    if (selectedThesis && selectedThesis.key === thesis.key) {
                        setSelectedThesis({ ...selectedThesis, status: 'published' });
                    }
                    fetchTheses();
                } catch (error) {
                    message.error(error.response?.data?.message || 'Failed to publish thesis.');
                } finally {
                    setSubmitLoading(false);
                }
            }
        });
    };

    const handleToggleConfidential = async (thesis) => {
        const actionText = thesis.isConfidential ? 'make public' : 'make confidential';
        modal.confirm({
            title: `Toggle Confidentiality`,
            content: `Are you sure you want to ${actionText} "${thesis.title}"?`,
            okText: 'Yes, Proceed',
            cancelText: 'Cancel',
            centered: true,
            onOk: async () => {
                try {
                    setSubmitLoading(true);
                    await window.axios.patch(`/api/theses/${thesis.key}/toggle-confidential`);
                    message.success(`Thesis is now ${thesis.isConfidential ? 'public' : 'confidential'}.`);
                    
                    if (selectedThesis && selectedThesis.key === thesis.key) {
                        setSelectedThesis({ ...selectedThesis, isConfidential: !thesis.isConfidential });
                    }
                    fetchTheses();
                } catch (error) {
                    message.error(error.response?.data?.message || 'Failed to update confidentiality.');
                } finally {
                    setSubmitLoading(false);
                }
            }
        });
    };

    const handleDownloadSubmit = async () => {
        if (!downloadPassword) {
            message.warning('Please enter your admin password to authorize the download.');
            return;
        }

        setSubmitLoading(true);
        try {
            const response = await window.axios.post(`/api/theses/${downloadThesis.key}/download`, {
                password: downloadPassword,
                format: downloadFormat
            }, {
                responseType: 'blob'
            });
            
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            
            let fileName = `${downloadThesis.key}-${downloadFormat.toUpperCase()}-Document.${downloadFormat}`;
            const contentDisposition = response.headers['content-disposition'];
            if (contentDisposition) {
                const fileNameMatch = contentDisposition.match(/filename="?([^"]+)"?/);
                if (fileNameMatch && fileNameMatch.length === 2) {
                    fileName = fileNameMatch[1];
                }
            }
            
            link.setAttribute('download', fileName);
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(url);
            
            message.success(`${downloadFormat.toUpperCase()} document securely downloaded.`);
            setIsDownloadModalOpen(false);
            setDownloadPassword('');
        } catch (error) {
            if (error.response && error.response.data instanceof Blob) {
                const reader = new FileReader();
                reader.onload = () => {
                    try {
                        const errData = JSON.parse(reader.result);
                        message.error(errData.message || 'Failed to authorize download.');
                    } catch (e) {
                        message.error('Failed to authorize download. Ensure DOCX exists.');
                    }
                };
                reader.readAsText(error.response.data);
            } else {
                message.error('Failed to process secure download request.');
            }
        } finally {
            setSubmitLoading(false);
        }
    };

    const uniqueDepartments = [...new Set(data.map(item => item.department).filter(Boolean))];

    let filteredData = data.filter(item => {
        const matchesTab = activeTab === 'public' ? !item.isConfidential : item.isConfidential;
        const matchesStatus = statusFilters.length === 0 ? true : statusFilters.includes(item.status);
        const matchesDept = departmentFilters.length === 0 ? true : departmentFilters.includes(item.department);
        
        let matchesSearch = true;
        if (searchText) {
            const lowerQuery = searchText.toLowerCase();
            matchesSearch = 
                item.title?.toLowerCase().includes(lowerQuery) || 
                item.author?.toLowerCase().includes(lowerQuery) ||
                item.abstract?.toLowerCase().includes(lowerQuery) ||
                item.keywords?.some(kw => kw.toLowerCase().includes(lowerQuery));
        }

        return matchesTab && matchesStatus && matchesDept && matchesSearch;
    });

    if (sortOrder === 'newest') {
        filteredData.sort((a, b) => new Date(b.submissionDate || 0) - new Date(a.submissionDate || 0));
    } else if (sortOrder === 'oldest') {
        filteredData.sort((a, b) => new Date(a.submissionDate || 0) - new Date(b.submissionDate || 0));
    } else if (sortOrder === 'title-asc') {
        filteredData.sort((a, b) => a.title.localeCompare(b.title));
    } else if (sortOrder === 'title-desc') {
        filteredData.sort((a, b) => b.title.localeCompare(a.title));
    }

    const paginatedData = filteredData.slice((currentPage - 1) * pageSize, currentPage * pageSize);

    const FilterContent = () => (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
            <div>
                <Text strong style={{ fontSize: 14, display: 'block', marginBottom: 12, color: token?.colorText }}><SortAscendingOutlined /> Sort By</Text>
                <Radio.Group 
                    value={sortOrder} 
                    onChange={e => setSortOrder(e.target.value)}
                    style={{ display: 'flex', flexDirection: 'column', gap: 8 }}
                >
                    <Radio value="newest">Newest First</Radio>
                    <Radio value="oldest">Oldest First</Radio>
                    <Radio value="title-asc">Title (A-Z)</Radio>
                    <Radio value="title-desc">Title (Z-A)</Radio>
                </Radio.Group>
            </div>
            <Divider style={{ margin: 0 }} />
            <div>
                <Text strong style={{ fontSize: 14, display: 'block', marginBottom: 12, color: token?.colorText }}>Document Status</Text>
                <Checkbox.Group 
                    value={statusFilters} 
                    onChange={setStatusFilters}
                    style={{ display: 'flex', flexDirection: 'column', gap: 8 }}
                >
                    <Checkbox value="accepted">Accepted</Checkbox>
                    <Checkbox value="published">Published</Checkbox>
                </Checkbox.Group>
            </div>
            <Divider style={{ margin: 0 }} />
            <div>
                <Text strong style={{ fontSize: 14, display: 'block', marginBottom: 12, color: token?.colorText }}>Department</Text>
                {uniqueDepartments.length > 0 ? (
                    <Checkbox.Group 
                        value={departmentFilters} 
                        onChange={setDepartmentFilters}
                        style={{ display: 'flex', flexDirection: 'column', gap: 8, maxHeight: 200, overflowY: 'auto' }}
                    >
                        {uniqueDepartments.map(dept => (
                            <Checkbox key={dept} value={dept}>{dept}</Checkbox>
                        ))}
                    </Checkbox.Group>
                ) : (
                    <Text type="secondary" italic>No departments available</Text>
                )}
            </div>
            <Divider style={{ margin: 0 }} />
            <Button type="dashed" block onClick={() => {
                setStatusFilters(['accepted', 'published']);
                setDepartmentFilters([]);
                setSortOrder('newest');
                setIsMobileFilterOpen(false);
            }} style={{ color: token?.colorTextSecondary }}>
                Reset Filters
            </Button>
        </div>
    );

    const renderEmpty = () => (
        <Empty 
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            description={<span>No matching documents found.</span>}
        />
    );

    const isMobile = !screens.lg;

    return (
        <div style={{ paddingBottom: '40px', minHeight: '100vh' }}>
            <div style={{ marginBottom: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
                <div>
                    <Title level={isMobile ? 3 : 2} style={{ margin: 0, fontWeight: 700 }}>Library Repository</Title>
                    <Text type="secondary">Explore published and accepted thesis documents</Text>
                </div>
                <Space wrap style={{ width: isMobile ? '100%' : 'auto' }}>
                    <Input
                        placeholder="Search..."
                        prefix={<SearchOutlined style={{ color: token?.colorTextDescription }} />}
                        style={{ width: isMobile ? 'calc(100vw - 120px)' : 350, borderRadius: '8px' }}
                        allowClear
                        value={searchText}
                        onChange={(e) => setSearchText(e.target.value)}
                        size="large"
                    />
                    {isMobile && (
                        <Button 
                            icon={<FilterOutlined />} 
                            size="large" 
                            type="primary" 
                            ghost 
                            onClick={() => setIsMobileFilterOpen(true)}
                        />
                    )}
                    {!isMobile && (
                        <Tooltip title="Refresh List">
                            <Button icon={<ReloadOutlined />} size="large" onClick={() => { setSearchText(''); fetchTheses(); }} />
                        </Tooltip>
                    )}
                </Space>
            </div>

            {/* Mobile Filter Drawer */}
            <Drawer
                title="Filter & Sort"
                placement="right"
                onClose={() => setIsMobileFilterOpen(false)}
                open={isMobileFilterOpen}
                size="default"
                styles={{ body: { padding: '24px 16px' } }}
            >
                <FilterContent />
            </Drawer>

            <Row gutter={[24, 24]}>
                {/* DESKTOP FILTER PANEL */}
                {!isMobile && (
                    <Col lg={6} xl={5}>
                        <Card 
                            title={<Space><FilterOutlined /> <Text strong>Filters & Sorting</Text></Space>}
                            size="small"
                            style={{ borderRadius: 12, position: 'sticky', top: 24 }}
                            styles={{ body: { padding: '20px 16px' } }}
                        >
                            <FilterContent />
                        </Card>
                    </Col>
                )}

                {/* MAIN CONTENT / CARDS */}
                <Col xs={24} lg={18} xl={19}>
                    <Card
                        variant="borderless"
                        style={{ borderRadius: '16px', boxShadow: '0 5px 20px rgba(0, 0, 0, 0.05)', background: token?.colorBgContainer, minHeight: 600 }}
                        styles={{ body: { padding: 0 } }}
                    >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 24px 0 24px', borderBottom: `1px solid ${token?.colorBorderSecondary}`, overflowX: 'auto' }}>
                            <Tabs 
                                activeKey={activeTab} 
                                onChange={setActiveTab} 
                                style={{ marginBottom: '-1px' }}
                                items={[
                                    { key: 'public', label: <Space><Earth20Filled style={{ fontSize: 16, color: activeTab === 'public' ? primaryColor : undefined }} /> Public</Space> },
                                    { key: 'private', label: <Space><LockClosed20Filled style={{ fontSize: 16, color: activeTab === 'private' ? primaryColor : undefined }} /> Confidential</Space> }
                                ]}
                            />
                            {!isMobile && (
                                <Text type="secondary" style={{ fontSize: 13, paddingBottom: 16 }}>{filteredData.length} documents</Text>
                            )}
                        </div>

                        <div style={{ padding: isMobile ? '16px' : '24px' }}>
                            {!loading && filteredData.length === 0 ? (
                                renderEmpty()
                            ) : !loading && (
                                <>
                                    <Row gutter={[24, 24]}>
                                        {paginatedData.map(thesis => (
                                            <Col xs={24} sm={12} md={12} lg={12} xl={8} xxl={6} key={thesis.key} style={{ display: 'flex' }}>
                                                <Card
                                                    hoverable
                                                    cover={
                                                        <div style={{ height: 160, backgroundColor: '#f0f2f5', position: 'relative', overflow: 'hidden', borderBottom: `1px solid ${token?.colorBorderSecondary}` }}>
                                                            {thesis.hasPdf ? (
                                                                <div style={{ width: '100%', height: '100%', overflow: 'hidden', position: 'relative' }}>
                                                                    <iframe 
                                                                        src={`${thesis.pdfUrl}#page=1&view=FitH&toolbar=0&navpanes=0&scrollbar=0`}
                                                                        style={{ width: 'calc(100% + 24px)', height: 'calc(100% + 24px)', border: 'none', pointerEvents: 'none', transform: 'scale(1.02)' }}
                                                                        title={`PDF Preview ${thesis.key}`}
                                                                        scrolling="no"
                                                                        tabIndex={-1}
                                                                        loading="lazy"
                                                                    />
                                                                </div>
                                                            ) : (
                                                                <div style={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                                                                    <FilePdfOutlined style={{ fontSize: 48, color: '#d9d9d9' }} />
                                                                    <Text type="secondary" style={{ marginTop: 8, fontSize: 12 }}>No Document Attached</Text>
                                                                </div>
                                                            )}
                                                            {thesis.isConfidential && (
                                                                <div style={{ position: 'absolute', top: 8, right: 8, background: 'rgba(250, 140, 22, 0.9)', color: '#fff', padding: '4px 8px', borderRadius: 4, fontSize: 11, display: 'flex', alignItems: 'center', gap: 4 }}>
                                                                    <LockOutlined /> Restricted
                                                                </div>
                                                            )}
                                                        </div>
                                                    }
                                                    style={{ borderRadius: 12, width: '100%', display: 'flex', flexDirection: 'column', overflow: 'hidden', border: `1px solid ${token?.colorBorderSecondary}` }}
                                                    styles={{ body: { display: 'flex', flexDirection: 'column', flex: 1, padding: '16px' } }}
                                                    onClick={() => openDetailDrawer(thesis)}
                                                    actions={[
                                                        <Tooltip title="View Details" key="view">
                                                            <Button type="text" icon={<EyeOutlined />} style={{ color: token?.colorTextSecondary }} onClick={(e) => { e.stopPropagation(); openDetailDrawer(thesis); }} />
                                                        </Tooltip>,
                                                        <Tooltip title="Secure Download" key="download">
                                                            <Button type="text" icon={<CloudDownloadOutlined />} style={{ color: token?.colorTextSecondary }} onClick={(e) => { e.stopPropagation(); setDownloadThesis(thesis); setIsDownloadModalOpen(true); }} />
                                                        </Tooltip>,
                                                        thesis.status === 'accepted' ? (
                                                            <Tooltip title="Publish Thesis" key="publish">
                                                                <Button type="text" icon={<UploadOutlined />} style={{ color: token?.colorTextSecondary }} onClick={(e) => { e.stopPropagation(); handlePublish(thesis); }} />
                                                            </Tooltip>
                                                        ) : <span key="published-ph" />,
                                                        <Tooltip title={thesis.isConfidential ? "Make Public" : "Make Confidential"} key="lock">
                                                            <Button 
                                                                type="text" 
                                                                icon={thesis.isConfidential ? <UnlockOutlined /> : <LockOutlined />} 
                                                                style={{ color: thesis.isConfidential ? token?.colorWarning : token?.colorTextSecondary }}
                                                                onClick={(e) => { e.stopPropagation(); handleToggleConfidential(thesis); }} 
                                                            />
                                                        </Tooltip>
                                                    ]}
                                                >
                                                    <div style={{ marginBottom: 12, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                                        <Space wrap size={[4, 8]}>
                                                            <Tag color={thesis.status === 'published' ? 'success' : 'processing'} style={{ borderRadius: 20, margin: 0, fontSize: 10, border: 'none', fontWeight: 600, color: thesis.status === 'published' ? token?.colorSuccessText : token?.colorPrimaryText }}>
                                                                {thesis.status === 'published' ? <CheckCircleOutlined style={{ marginRight: 4 }} /> : <Clock size={10} style={{ marginRight: 4, verticalAlign: 'middle' }} />}
                                                                {thesis.status.toUpperCase()}
                                                            </Tag>
                                                        </Space>
                                                    </div>

                                                    <div style={{ flex: 1 }}>
                                                        <Tooltip title={thesis.title} placement="topLeft" mouseEnterDelay={0.5}>
                                                            <Title level={5} style={{ margin: '0 0 6px 0', fontSize: 15, lineHeight: 1.3 }} ellipsis={{ rows: 2 }}>
                                                                {thesis.title}
                                                            </Title>
                                                        </Tooltip>
                                                        
                                                        <Paragraph type="secondary" style={{ fontSize: 12, marginBottom: 12, lineHeight: 1.5 }} ellipsis={{ rows: 2 }}>
                                                            {thesis.abstract || 'No abstract content found.'}
                                                        </Paragraph>
                                                    </div>

                                                    <div style={{ marginTop: 'auto', paddingTop: 12, borderTop: `1px dashed ${token?.colorBorderSecondary}` }}>
                                                        <Space align="center" style={{ width: '100%', justifyContent: 'space-between' }}>
                                                            <Space size={8}>
                                                                <Avatar size={24} style={{ backgroundColor: primaryColor, fontSize: 12 }} src={thesis.authorAvatar} icon={<UserOutlined />} />
                                                                <div style={{ maxWidth: 100 }}>
                                                                    <Text strong style={{ fontSize: 12, display: 'block', lineHeight: 1 }} ellipsis={{ tooltip: thesis.author }}>{thesis.author}</Text>
                                                                    <Text type="secondary" style={{ fontSize: 10 }} ellipsis>{thesis.department || 'N/A'}</Text>
                                                                </div>
                                                            </Space>
                                                            <div style={{ textAlign: 'right' }}>
                                                                <Space size={4} style={{ color: token?.colorTextSecondary }}>
                                                                    <Calendar size={11} />
                                                                    <Text type="secondary" style={{ fontSize: 10 }}>
                                                                        {thesis.submissionDate ? new Date(thesis.submissionDate).toLocaleDateString(undefined, { month: 'short', year: 'numeric' }) : 'N/A'}
                                                                    </Text>
                                                                </Space>
                                                            </div>
                                                        </Space>
                                                    </div>
                                                </Card>
                                            </Col>
                                        ))}
                                    </Row>
                                    <div style={{ textAlign: 'center', marginTop: 32 }}>
                                        <Pagination 
                                            current={currentPage} 
                                            pageSize={pageSize} 
                                            total={filteredData.length} 
                                            onChange={(page, size) => { setCurrentPage(page); setPageSize(size); }} 
                                            showSizeChanger 
                                            pageSizeOptions={['12', '24', '48']} 
                                            showTotal={(total) => <Text type="secondary">{total} total documents</Text>}
                                        />
                                    </div>
                                </>
                            )}
                        </div>
                    </Card>
                </Col>
            </Row>

            {/* Same Drawer as before for Details */}
            <Drawer
                title={
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', paddingRight: 40 }}>
                        <Space>
                            <BookOpen style={{ color: primaryColor, fontSize: 20 }} />
                            <div>
                                <Text strong style={{ fontSize: 16, display: 'block', lineHeight: 1.2 }}>Thesis Document Details</Text>
                                <Text type="secondary" style={{ fontSize: 12, fontWeight: 400 }}>Repository preview</Text>
                            </div>
                        </Space>
                    </div>
                }
                placement={isMobile ? "bottom" : "right"}
                size="large"
                onClose={() => {
                    setIsDetailOpen(false);
                    setSelectedThesis(null);
                }}
                open={isDetailOpen}
                styles={{
                    header: { borderBottom: `1px solid ${token?.colorBorderSecondary || '#f0f0f0'}`, padding: '16px 24px' },
                    body: { padding: 0 }
                }}
                extra={
                    !isMobile && (
                        <Space>
                            <Button 
                                icon={<CloudDownloadOutlined />} 
                                onClick={() => { setDownloadThesis(selectedThesis); setIsDownloadModalOpen(true); }}
                            >
                                Secure Download
                            </Button>
                            {selectedThesis?.status === 'accepted' && (
                                <Button type="primary" icon={<UploadOutlined />} onClick={() => handlePublish(selectedThesis)} loading={submitLoading}>
                                    Publish
                                </Button>
                            )}
                            {selectedThesis && (
                                <Button 
                                    icon={selectedThesis.isConfidential ? <UnlockOutlined /> : <LockOutlined />} 
                                    onClick={() => handleToggleConfidential(selectedThesis)} 
                                    danger={!selectedThesis.isConfidential}
                                    loading={submitLoading}
                                >
                                    {selectedThesis.isConfidential ? 'Make Public' : 'Make Confidential'}
                                </Button>
                            )}
                        </Space>
                    )
                }
            >
                {selectedThesis ? (
                    <Tabs
                        defaultActiveKey="1"
                        style={{ height: '100%' }}
                        tabBarStyle={{ padding: '0 24px', margin: 0, background: token?.colorBgContainer }}
                        items={[
                            {
                                key: '1',
                                label: 'Overview',
                                children: (
                                    <div style={{ padding: isMobile ? 16 : 24, overflowY: 'auto', height: isMobile ? 'calc(90vh - 120px)' : 'calc(100vh - 110px)' }}>
                                        {isMobile && (
                                            <Card size="small" style={{ marginBottom: 24, borderRadius: 12, borderColor: token?.colorBorderSecondary }}>
                                                <div style={{ display: 'flex', gap: 8, flexDirection: 'column' }}>
                                                    <Button block icon={<CloudDownloadOutlined />} onClick={() => { setDownloadThesis(selectedThesis); setIsDownloadModalOpen(true); }}>
                                                        Secure Download
                                                    </Button>
                                                    {selectedThesis?.status === 'accepted' && (
                                                        <Button type="primary" block icon={<UploadOutlined />} onClick={() => handlePublish(selectedThesis)} loading={submitLoading}>
                                                            Publish
                                                        </Button>
                                                    )}
                                                    <Button 
                                                        block
                                                        icon={selectedThesis.isConfidential ? <UnlockOutlined /> : <LockOutlined />} 
                                                        onClick={() => handleToggleConfidential(selectedThesis)} 
                                                        danger={!selectedThesis.isConfidential}
                                                        loading={submitLoading}
                                                    >
                                                        {selectedThesis.isConfidential ? 'Make Public' : 'Make Confidential'}
                                                    </Button>
                                                </div>
                                            </Card>
                                        )}

                                        <div style={{ marginBottom: 24, padding: '0 8px' }}>
                                            <Title level={5} style={{ marginBottom: 8, color: token?.colorTextSecondary, fontWeight: 500, textTransform: 'uppercase', letterSpacing: 1, fontSize: 12 }}>Research Title</Title>
                                            <Text strong style={{ fontSize: 22, color: primaryColor, display: 'block', lineHeight: 1.4 }}>
                                                {selectedThesis.title}
                                            </Text>
                                        </div>

                                        <Descriptions 
                                            bordered 
                                            column={{ xxl: 2, xl: 2, lg: 2, md: 1, sm: 1, xs: 1 }}
                                            size="small"
                                            styles={{ 
                                                label: { background: token?.colorFillAlter || '#fafafa', width: isMobile ? '120px' : '180px', fontWeight: 600, color: token?.colorTextSecondary },
                                                content: { background: '#ffffff' }
                                            }}
                                            style={{ borderRadius: 8, overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.04)', marginBottom: 24 }}
                                        >
                                            <Descriptions.Item label="Reference ID"><Text code>{selectedThesis.key.split('-')[0].toUpperCase()}</Text></Descriptions.Item>
                                            <Descriptions.Item label="Submission Date">{selectedThesis.submissionDate ? new Date(selectedThesis.submissionDate).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' }) : 'N/A'}</Descriptions.Item>
                                            
                                            <Descriptions.Item label="Status">
                                                <Tag color={selectedThesis.status === 'published' ? 'success' : 'processing'} style={{ borderRadius: 12, margin: 0 }}>
                                                    {selectedThesis.status.toUpperCase()}
                                                </Tag>
                                            </Descriptions.Item>
                                            <Descriptions.Item label="Visibility">
                                                <Badge status={selectedThesis.isConfidential ? "warning" : "success"} text={selectedThesis.isConfidential ? "Confidential Document" : "Public Archive"} />
                                            </Descriptions.Item>

                                            <Descriptions.Item label="Main Author"><Text strong>{selectedThesis.author}</Text></Descriptions.Item>
                                            <Descriptions.Item label="Co-Author(s)"><Text>{selectedThesis.co_author || 'None'}</Text></Descriptions.Item>

                                            <Descriptions.Item label="Program"><Text>{selectedThesis.discipline || 'N/A'}</Text></Descriptions.Item>
                                            <Descriptions.Item label="Department"><Text>{selectedThesis.department || 'N/A'}</Text></Descriptions.Item>

                                            <Descriptions.Item label="Degree Type"><Tag color="blue" variant="filled" style={{ margin: 0 }}>{selectedThesis.degreeType || 'N/A'}</Tag></Descriptions.Item>
                                            <Descriptions.Item label="Panelists"><Text>{selectedThesis.panelists || 'N/A'}</Text></Descriptions.Item>

                                            <Descriptions.Item label="DOI" span={3}><Text>{selectedThesis.doi || 'Not assigned'}</Text></Descriptions.Item>

                                            <Descriptions.Item label="Abstract" span={3}>
                                                <div style={{ whiteSpace: 'pre-wrap', lineHeight: 1.6, color: token?.colorText, padding: '8px 0', maxHeight: 300, overflowY: 'auto' }}>
                                                    {selectedThesis.abstract || <Text type="secondary" italic>No abstract provided for this thesis.</Text>}
                                                </div>
                                            </Descriptions.Item>

                                            <Descriptions.Item label="Keywords" span={3}>
                                                <Space wrap>
                                                    {selectedThesis.keywords && selectedThesis.keywords.length > 0 ? (
                                                        selectedThesis.keywords.map(kw => (
                                                            <Tag key={kw} style={{ borderRadius: 4, margin: '2px 0' }}>{kw}</Tag>
                                                        ))
                                                    ) : <Text type="secondary" italic>No keywords defined</Text>}
                                                </Space>
                                            </Descriptions.Item>

                                            <Descriptions.Item label="Recommended By"><Text>{selectedThesis.recommended_by || 'N/A'}</Text></Descriptions.Item>
                                            <Descriptions.Item label="Archived By"><Text>{selectedThesis.archived_by || 'N/A'}</Text></Descriptions.Item>
                                        </Descriptions>
                                    </div>
                                )
                            },
                            {
                                key: '2',
                                label: 'Full Document (PDF)',
                                children: (
                                    <div style={{ height: isMobile ? 'calc(90vh - 120px)' : 'calc(100vh - 110px)', position: 'relative' }}>
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
                                                    title="PDF Viewer"
                                                />
                                            </div>
                                        ) : (
                                            <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                <Empty 
                                                    image={Empty.PRESENTED_IMAGE_SIMPLE} 
                                                    description={<Text type="secondary">No Document Attached</Text>} 
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

            <Modal
                title={
                    <Space>
                        <LockOutlined style={{ color: token?.colorWarning }} />
                        <Text strong>Secure Document Download</Text>
                    </Space>
                }
                open={isDownloadModalOpen}
                onCancel={() => { setIsDownloadModalOpen(false); setDownloadPassword(''); }}
                onOk={handleDownloadSubmit}
                okText="Authorize & Download"
                cancelText="Cancel"
                confirmLoading={submitLoading}
                centered
                destroyOnHidden
            >
                <div style={{ marginBottom: 16 }}>
                    <Text type="secondary" style={{ display: 'block', marginBottom: 12 }}>
                        You are about to download the document for <Text strong>"{downloadThesis?.title}"</Text>.
                    </Text>
                    <Text strong style={{ display: 'block', marginBottom: 8 }}>Select Format:</Text>
                    <Radio.Group value={downloadFormat} onChange={(e) => setDownloadFormat(e.target.value)} buttonStyle="solid">
                        <Radio.Button value="pdf"><FilePdfOutlined /> PDF</Radio.Button>
                        <Radio.Button value="docx"><FileTextOutlined /> DOCX</Radio.Button>
                    </Radio.Group>
                </div>
                <div>
                    <Text strong style={{ display: 'block', marginBottom: 8 }}>Enter Admin Password:</Text>
                    <Input.Password
                        placeholder="Current password"
                        value={downloadPassword}
                        onChange={(e) => setDownloadPassword(e.target.value)}
                        onPressEnter={handleDownloadSubmit}
                    />
                </div>
            </Modal>
        </div>
    );
}
