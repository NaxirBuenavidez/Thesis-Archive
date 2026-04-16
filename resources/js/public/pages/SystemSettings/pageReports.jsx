import React, { useState, useEffect, useCallback } from 'react';
import { Typography, Card, Row, Col, Space, Button, Table, Select, DatePicker, Tag, App, Grid, Skeleton } from 'antd';
import { ArrowDownload24Filled, DocumentData24Filled, Filter24Filled } from '@fluentui/react-icons';
import { useSystemConfig } from '../../../context/SystemConfigContext';

const { Title, Text } = Typography;
const { RangePicker } = DatePicker;
const { useBreakpoint } = Grid;

export default function Reports() {
    const { message } = App.useApp();
    const screens = useBreakpoint();
    const isMobile = !screens.md;
    const { primary_color_dark } = useSystemConfig();
    const sidebarColor = primary_color_dark || '#1A2CA3';

    // Filters
    const [department, setDepartment] = useState('all');
    const [status, setStatus] = useState('all');
    const [dateRange, setDateRange] = useState(null);
    const [departments, setDepartments] = useState([]);

    // Data states
    const [data, setData] = useState([]);
    const [metrics, setMetrics] = useState({ total: 0, published: 0, pending: 0 });
    const [loading, setLoading] = useState(false);
    const [pagination, setPagination] = useState({ current: 1, pageSize: 10, total: 0 });
    const [exportLoading, setExportLoading] = useState(false);

    const fetchDepartments = async () => {
        try {
            const resp = await window.axios.get('/api/departments', { silent: true });
            setDepartments(resp.data?.data || resp.data || []);
        } catch (e) {
            console.error('Failed to load departments', e);
        }
    };

    const fetchPreview = useCallback(async (page = 1) => {
        setLoading(true);
        try {
            const params = {
                page,
                status: status !== 'all' ? status : undefined,
                department: department !== 'all' ? department : undefined,
                start_date: dateRange ? dateRange[0].format('YYYY-MM-DD') : undefined,
                end_date: dateRange ? dateRange[1].format('YYYY-MM-DD') : undefined,
            };

            const resp = await window.axios.get('/api/reports/preview', { params, silent: true });
            
            if (resp.data) {
                setData(resp.data.data.data);
                setMetrics(resp.data.metrics);
                setPagination({
                    current: resp.data.data.current_page,
                    pageSize: resp.data.data.per_page,
                    total: resp.data.data.total
                });
            }
        } catch (error) {
            console.error("Failed to fetch reports preview", error);
            message.error("Unable to load preview data");
        } finally {
            setLoading(false);
        }
    }, [status, department, dateRange, message]);

    useEffect(() => {
        fetchDepartments();
    }, []);

    useEffect(() => {
        fetchPreview(1);
    }, [fetchPreview]);

    const handleExport = () => {
        setExportLoading(true);
        try {
            const params = new URLSearchParams();
            if (status !== 'all') params.append('status', status);
            if (department !== 'all') params.append('department', department);
            if (dateRange) {
                params.append('start_date', dateRange[0].format('YYYY-MM-DD'));
                params.append('end_date', dateRange[1].format('YYYY-MM-DD'));
            }

            const url = `/api/reports/export?${params.toString()}`;
            
            // Trigger download via hidden anchor
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', '');
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

            message.success('Report download initiated successfully!');
        } catch (e) {
            message.error('Failed to export report');
        } finally {
            setExportLoading(false);
        }
    };

    const statusTagColor = (stat) => {
        const map = {
            published: 'green', accepted: 'blue', under_review: 'gold',
            submitted: 'cyan', draft: 'default', rejected: 'red'
        };
        return map[stat] || 'default';
    };

    const columns = [
        { title: 'Thesis Title', dataIndex: 'title', key: 'title', ellipsis: true, render: t => <Text strong>{t}</Text> },
        { title: 'Main Author', dataIndex: 'author', key: 'author', responsive: ['md'] },
        { title: 'Department', dataIndex: 'department', key: 'department', responsive: ['lg'] },
        { 
            title: 'Status', 
            dataIndex: 'status', 
            key: 'status', 
            render: (s) => (
                <Tag color={statusTagColor(s)} style={{ borderRadius: 20, border: 'none', fontWeight: 600 }}>
                    {(s || '').replace('_', ' ').toUpperCase()}
                </Tag>
            ) 
        },
        { 
            title: 'Submitted on', 
            dataIndex: 'submission_date', 
            key: 'submission_date', 
            responsive: ['md'],
            render: (d) => d ? new Date(d).toLocaleDateString() : '—'
        },
    ];

    return (
        <div style={{ paddingBottom: '40px' }}>
            <div style={{ marginBottom: 20 }}>
                <Title level={isMobile ? 3 : 2} style={{ margin: 0, fontWeight: 700 }}>Reports & Analytics</Title>
                <Text type="secondary">Generate configured CSV exports for system archiving usage.</Text>
            </div>

            {/* Premium Header Banner */}
            <div style={{
                borderRadius: 16,
                background: `linear-gradient(135deg, ${sidebarColor} 0%, ${sidebarColor}cc 60%, #10b981 100%)`,
                padding: isMobile ? '20px' : '32px 42px',
                marginBottom: 24,
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                overflow: 'hidden',
                position: 'relative',
                color: '#fff'
            }}>
                <div style={{ position: 'absolute', top: -30, right: -20, width: 140, height: 140, borderRadius: '50%', background: 'rgba(255,255,255,0.06)', pointerEvents: 'none' }} />
                
                <div style={{ position: 'relative', zIndex: 1 }}>
                    <Text style={{ fontSize: 12, color: 'rgba(255,255,255,0.7)', textTransform: 'uppercase', letterSpacing: '1px', display: 'block', marginBottom: 6 }}>
                        Current Active Query
                    </Text>
                    <Title level={isMobile ? 3 : 2} style={{ color: '#fff', margin: 0, fontWeight: 800 }}>
                        {metrics.total.toLocaleString()}
                    </Title>
                    <Text style={{ fontSize: 13, color: 'rgba(255,255,255,0.85)' }}>Total Matching Records Ready For Export</Text>
                </div>
                
                {!isMobile && (
                    <div style={{ position: 'relative', zIndex: 1, textAlign: 'right', display: 'flex', gap: 32 }}>
                        <div>
                            <Text style={{ fontSize: 24, fontWeight: 700, display: 'block' }}>{metrics.published.toLocaleString()}</Text>
                            <Text style={{ fontSize: 12, color: 'rgba(255,255,255,0.7)' }}>Published</Text>
                        </div>
                        <div>
                            <Text style={{ fontSize: 24, fontWeight: 700, display: 'block' }}>{metrics.pending.toLocaleString()}</Text>
                            <Text style={{ fontSize: 12, color: 'rgba(255,255,255,0.7)' }}>Pending Review</Text>
                        </div>
                    </div>
                )}
            </div>

            <Row gutter={[20, 20]}>
                {/* Filters Section */}
                <Col xs={24} lg={8} xl={6}>
                    <Card 
                        title={<Space><Filter24Filled /> <Text strong>Report Parameters</Text></Space>} 
                        variant="borderless" 
                        style={{ borderRadius: 16, boxShadow: '0 4px 20px rgba(0,0,0,0.04)' }}
                    >
                        <Space direction="vertical" size="large" style={{ width: '100%' }}>
                            <div>
                                <Text strong style={{ display: 'block', marginBottom: 8 }}>Department Filter</Text>
                                <Select
                                    size="large"
                                    style={{ width: '100%' }}
                                    value={department}
                                    onChange={setDepartment}
                                    options={[
                                        { value: 'all', label: 'All Departments' },
                                        ...departments.map(d => ({ value: d.name, label: d.name }))
                                    ]}
                                />
                            </div>

                            <div>
                                <Text strong style={{ display: 'block', marginBottom: 8 }}>Approval Status</Text>
                                <Select
                                    size="large"
                                    style={{ width: '100%' }}
                                    value={status}
                                    onChange={setStatus}
                                    options={[
                                        { value: 'all', label: 'All Statuses' },
                                        { value: 'published', label: 'Published' },
                                        { value: 'accepted', label: 'Accepted' },
                                        { value: 'under_review', label: 'Under Review' },
                                        { value: 'submitted', label: 'Submitted' },
                                        { value: 'draft', label: 'Draft' },
                                        { value: 'rejected', label: 'Rejected' },
                                    ]}
                                />
                            </div>

                            <div>
                                <Text strong style={{ display: 'block', marginBottom: 8 }}>Submission Date Range</Text>
                                <RangePicker 
                                    size="large"
                                    style={{ width: '100%' }} 
                                    value={dateRange}
                                    onChange={setDateRange}
                                />
                            </div>

                            <Button 
                                type="primary" 
                                size="large" 
                                block 
                                icon={<ArrowDownload24Filled />} 
                                loading={exportLoading}
                                onClick={handleExport}
                                style={{ marginTop: 8, height: 48, borderRadius: 10, fontWeight: 600 }}
                            >
                                Export to CSV
                            </Button>
                        </Space>
                    </Card>
                </Col>

                {/* Live Preview Table */}
                <Col xs={24} lg={16} xl={18}>
                    <Card 
                        title={<Space><DocumentData24Filled /> <Text strong>Live Data Preview</Text></Space>} 
                        variant="borderless" 
                        style={{ borderRadius: 16, boxShadow: '0 4px 20px rgba(0,0,0,0.04)', height: '100%' }}
                        styles={{ body: { padding: isMobile ? 12 : 24 } }}
                    >
                        {loading ? (
                            <Skeleton active paragraph={{ rows: 8 }} />
                        ) : (
                            <Table 
                                dataSource={data}
                                columns={columns}
                                rowKey="id"
                                scroll={{ x: 600 }}
                                size="middle"
                                pagination={{
                                    current: pagination.current,
                                    pageSize: pagination.pageSize,
                                    total: pagination.total,
                                    onChange: (page) => fetchPreview(page),
                                    showTotal: (total) => <Text type="secondary">{total} records</Text>,
                                }}
                            />
                        )}
                    </Card>
                </Col>
            </Row>

        </div>
    );
}
