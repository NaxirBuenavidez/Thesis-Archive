import React from 'react';
import { Modal, Typography, Row, Col, Card, Tag, Divider, Button, Grid } from 'antd';
import { FileProtectOutlined, FileTextOutlined, LockOutlined, GlobalOutlined, UserOutlined, CalendarOutlined, LinkOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import dayjs from 'dayjs';

const { Title, Text, Paragraph } = Typography;
const { useBreakpoint } = Grid;

const modalThesis = ({ thesis, onClose }) => {
    const screens = useBreakpoint();
    const isMobile = !screens.md;

    if (!thesis) return null;

    return (
        <Modal
            title={
                <div style={{ display: 'flex', alignItems: 'center', gap: isMobile ? 8 : 12 }}>
                    <div style={{ background: '#f1f5f9', padding: isMobile ? '6px 10px' : '8px 12px', borderRadius: 8, border: '1px solid #e2e8f0', flexShrink: 0 }}>
                        <FileProtectOutlined style={{ color: '#475569', fontSize: isMobile ? 20 : 24 }} />
                    </div>
                    <span style={{ color: '#1e293b', fontSize: 'clamp(1rem, 4vw, 1.4rem)', fontWeight: 800, lineHeight: 1.2 }}>
                        {isMobile ? 'Record Details' : 'Record Metadata Overview'}
                    </span>
                </div>
            }
            open={!!thesis}
            onCancel={onClose}
            footer={[
                <Button key="close" type="primary" onClick={onClose} style={{ background: '#334155', borderRadius: 6, width: isMobile ? '100%' : 'auto' }}>
                    Close Record
                </Button>
            ]}
            width={isMobile ? '95%' : 800}
            centered
            bodyStyle={{ padding: isMobile ? '12px 16px' : '20px 24px', maxHeight: '75vh', overflowY: 'auto' }}
        >
            <div style={{ paddingTop: isMobile ? 8 : 16 }}>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 20 }}>
                    <Tag color="blue" style={{ margin: 0 }}>{thesis.department || 'Category Unspecified'}</Tag>
                    {thesis.degree_type && <Tag color="cyan" style={{ margin: 0 }}>{thesis.degree_type}</Tag>}
                    <Tag color="green" style={{ margin: 0, whiteSpace: 'normal', height: 'auto', display: 'inline-flex', alignItems: 'center', maxWidth: '100%' }}>
                        ID: <span style={{ wordBreak: 'break-all' }}>{thesis.id}</span>
                    </Tag>
                </div>
                
                <Title level={3} style={{ 
                    marginTop: 0, 
                    marginBottom: 24, 
                    lineHeight: 1.3, 
                    fontSize: 'clamp(1.15rem, 5vw, 1.75rem)',
                    color: '#0f172a'
                }}>
                    {thesis.title}
                </Title>
                
                <Row gutter={[20, 24]}>
                    <Col span={24}>
                        <Card 
                            size="small" 
                            title={
                                <Text strong style={{ color: '#1e293b', fontSize: 15 }}>
                                    <FileTextOutlined style={{ marginRight: 8 }}/> Abstract Overview
                                </Text>
                            } 
                            variant="borderless" 
                            style={{ 
                                background: '#f8fafc', 
                                borderLeft: `4px solid #cbd5e1`, 
                                borderRadius: '0 8px 8px 0',
                                boxShadow: '0 1px 2px rgba(0,0,0,0.03)'
                            }}
                        >
                            <Paragraph style={{ 
                                fontSize: isMobile ? 14 : 15, 
                                lineHeight: 1.8, 
                                marginBottom: 0, 
                                whiteSpace: 'pre-wrap', 
                                color: '#334155' 
                            }}>
                                {thesis.abstract || 'No abstract is publicly available for this document.'}
                            </Paragraph>
                        </Card>
                    </Col>
                    
                    <Col xs={24} sm={12}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                            <Text style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: 1, color: '#64748b', fontWeight: 700 }}>
                                <UserOutlined style={{ marginRight: 4 }} /> Primary Author
                            </Text>
                            <Text strong style={{ fontSize: isMobile ? 16 : 18, color: '#1e293b' }}>
                                {thesis.author}
                            </Text>
                        </div>
                    </Col>

                    {thesis.co_author && (
                        <Col xs={24} sm={12}>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                                <Text style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: 1, color: '#64748b', fontWeight: 700 }}>
                                    <UserOutlined style={{ marginRight: 4 }} /> Co-Authors
                                </Text>
                                <Text strong style={{ fontSize: isMobile ? 16 : 18, color: '#1e293b' }}>
                                    {thesis.co_author}
                                </Text>
                            </div>
                        </Col>
                    )}

                    <Col xs={24} sm={12}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                            <Text style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: 1, color: '#64748b', fontWeight: 700 }}>
                                <GlobalOutlined style={{ marginRight: 4 }} /> Institution & Year
                            </Text>
                            <Text strong style={{ fontSize: isMobile ? 16 : 18, color: '#1e293b' }}>
                                {thesis.institution || 'Institutional Record'} 
                                <span style={{ opacity: 0.3, margin: '0 8px' }}>•</span> 
                                <CalendarOutlined style={{ marginRight: 4, fontSize: 14, verticalAlign: 'middle' }} />
                                {dayjs(thesis.submission_date || thesis.created_at).format('YYYY')}
                            </Text>
                        </div>
                    </Col>
                    
                    {thesis.doi && (
                        <Col xs={24} sm={12}>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                                <Text style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: 1, color: '#64748b', fontWeight: 700 }}>
                                    <LinkOutlined style={{ marginRight: 4 }} /> DOI Reference
                                </Text>
                                <Text strong style={{ fontSize: isMobile ? 16 : 18, color: '#1e293b', wordBreak: 'break-all' }}>
                                    {thesis.doi}
                                </Text>
                            </div>
                        </Col>
                    )}

                    <Col span={24}>
                        <Text style={{ display: 'block', fontSize: 11, textTransform: 'uppercase', letterSpacing: 1, color: '#64748b', fontWeight: 700, marginBottom: 12 }}>
                            Indexed Keywords
                        </Text>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                            {(thesis.keywords || []).map(k => (
                                <Tag key={k} color="#e2e8f0" style={{ 
                                    fontSize: 12, 
                                    padding: '2px 10px', 
                                    borderRadius: 4, 
                                    fontWeight: 600, 
                                    color: '#475569',
                                    border: 'none',
                                    margin: 0
                                }}>
                                    {k}
                                </Tag>
                            ))}
                            {(!thesis.keywords || thesis.keywords.length === 0) && <Text type="secondary" style={{ fontSize: 14 }}>N/A</Text>}
                        </div>
                    </Col>
                </Row>

                <Divider style={{ margin: '24px 0' }} />
                
                <div style={{ 
                    textAlign: 'center', 
                    padding: isMobile ? '24px 16px' : '32px 24px', 
                    background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)', 
                    borderRadius: 16, 
                    border: '1px solid #e2e8f0' 
                }}>
                    <LockOutlined style={{ fontSize: isMobile ? 32 : 40, color: '#64748b', marginBottom: 16 }} />
                    <Title level={4} style={{ color: '#0f172a', margin: '0 0 8px 0', fontWeight: 800, fontSize: isMobile ? 18 : 20 }}>
                        Confidential Resource
                    </Title>
                    <Text style={{ color: '#475569', fontSize: isMobile ? 13 : 15, display: 'block', marginBottom: 24, maxWidth: 600, margin: '0 auto 24px auto', lineHeight: 1.6 }}>
                        The full manuscript, raw methodology, and dataset results are strictly shielded for internal use. Access is restricted to authorized clients securely connected to the Intranet Portal.
                    </Text>
                    <Link to="/login" style={{ display: isMobile ? 'block' : 'inline-block', width: '100%' }}>
                        <Button type="primary" size="large" style={{ 
                            background: '#334155', 
                            borderRadius: 8, 
                            fontWeight: 800, 
                            padding: '0 32px', 
                            height: 48, 
                            fontSize: 15,
                            width: isMobile ? '100%' : 'auto'
                        }}>
                            See more... Login to Portal
                        </Button>
                    </Link>
                </div>
            </div>
        </Modal>
    );
};

export default modalThesis;
